// src/ui/Graph.jsx

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

function Graph({ info, graphData }) {
  const {
    bits = [],
    time = [],
    clock = [],
    graphSignal = [],
    noisySignal = [],
    recoveredBits = [],
    metrics = null,
    decodeError = null,
  } = graphData;

  const [visiblePoints, setVisiblePoints] = useState(0);

  useEffect(() => {
    if (time.length === 0) {
      setVisiblePoints(0);
      return;
    }

    setVisiblePoints(0);

    let currentPoint = 0;

    const interval = setInterval(() => {
      currentPoint += 1;
      setVisiblePoints(currentPoint);

      if (currentPoint >= time.length) {
        clearInterval(interval);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [time, graphSignal, noisySignal]);

  const visibleTime = time.slice(0, visiblePoints);
  const visibleClock = clock.slice(0, visiblePoints);
  const visibleSignal = graphSignal.slice(0, visiblePoints);
  const visibleNoisySignal = noisySignal.slice(0, visiblePoints);

  const visibleBitCount = Math.ceil(visiblePoints / 2);
  const visibleBits = bits.slice(0, visibleBitCount);
  const visibleRecoveredBits = recoveredBits.slice(0, visibleBitCount);

  const createChartData = (label, values, color) => ({
    labels: visibleTime,
    datasets: [
      {
        label,
        data: values,
        stepped: true,
        pointRadius: 0,
        borderWidth: 2,
        borderColor: color,
        backgroundColor: color,
        fill: false,
      },
    ],
  });

  const createOptions = (yTitle, fixedClock = false) => ({
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        ...(fixedClock ? { min: 0, max: 1 } : {}),
        title: {
          display: true,
          text: yTitle,
        },
        ...(fixedClock ? { ticks: { stepSize: 1 } } : {}),
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  });

  const bitStyle = {
    display: "inline-block",
    padding: "6px 10px",
    border: "1px solid #888",
    borderRadius: "5px",
    minWidth: "18px",
    textAlign: "center",
    fontWeight: "bold",
  };

  const bitRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "24px",
  };

  if (time.length === 0) {
    return (
      <div className="container">
        <h2>Visualization</h2>
        <p>Enter the number of bits and select an encoding.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Generated Data</h2>

      <p>Transmitted bits</p>
      <div style={bitRowStyle}>
        {visibleBits.map((bit, index) => (
          <span key={index} style={bitStyle}>
            {bit}
          </span>
        ))}
      </div>

      <h2>Clock Signal</h2>
      <Line
        data={createChartData("Clock", visibleClock, "red")}
        options={createOptions("Clock", true)}
      />

      <h2>Clean Encoded Signal: {info.encoding}</h2>
      <Line
        data={createChartData("Clean Signal", visibleSignal, "#087f8c")}
        options={createOptions("Amplitude")}
      />

      <h2>Noisy Received Signal (AWGN)</h2>
      <Line
        data={createChartData("Noisy Signal", visibleNoisySignal, "#d97706")}
        options={createOptions("Amplitude")}
      />

      <h2>Receiver Output</h2>

      {decodeError ? (
        <p style={{ color: "red" }}>Decoder error: {decodeError}</p>
      ) : (
        <>
          <p>Recovered bits</p>
          <div style={bitRowStyle}>
            {visibleRecoveredBits.map((bit, index) => {
              const matches = bits[index] === bit;

              return (
                <span
                  key={index}
                  title={matches ? "Matches transmitted bit" : "Bit error"}
                  style={{
                    ...bitStyle,
                    borderColor: matches ? "#16803c" : "#dc2626",
                    color: matches ? "#16803c" : "#dc2626",
                  }}
                >
                  {bit}
                </span>
              );
            })}
          </div>

          {metrics && (
            <>
              <h2>Transmission Accuracy</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ border: "1px solid #888", padding: "12px" }}>
                  <p>Total Bits</p>
                  <strong>{metrics.totalBits}</strong>
                </div>

                <div style={{ border: "1px solid #888", padding: "12px" }}>
                  <p>Bit Errors</p>
                  <strong>{metrics.bitErrors}</strong>
                </div>

                <div style={{ border: "1px solid #888", padding: "12px" }}>
                  <p>BER</p>
                  <strong>
                    {metrics.ber === null ? "N/A" : metrics.ber.toFixed(4)}
                  </strong>
                </div>

                <div style={{ border: "1px solid #888", padding: "12px" }}>
                  <p>Accuracy</p>
                  <strong>
                    {metrics.accuracy === null
                      ? "N/A"
                      : `${metrics.accuracy.toFixed(2)}%`}
                  </strong>
                </div>
              </div>

              <p>Noise level: {Number(info.noiseLevel).toFixed(2)}</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Graph;
