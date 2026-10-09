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
  const { bits, time, clock, graphSignal, noisySignal } = graphData;

  const [visiblePoints, setVisiblePoints] = useState(0);

  useEffect(() => {
    if (time.length === 0) {
      setVisiblePoints(0);
      return;
    }

    setVisiblePoints(0);

    let currentPoint = 0;

    const interval = setInterval(() => {
      currentPoint++;

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

  const visibleBits = bits.slice(0, Math.ceil(visiblePoints / 2));

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
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  });

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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "24px",
        }}
      >
        {visibleBits.map((bit, index) => (
          <span
            key={index}
            style={{
              padding: "6px 12px",
              border: "1px solid #888",
              borderRadius: "5px",
            }}
          >
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
    </div>
  );
}

export default Graph;
