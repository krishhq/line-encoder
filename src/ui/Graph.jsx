// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// function Graph({ info, graphData }) {
//   const { time, graphSignal, clock } = graphData;

//   const data = {
//     labels: time,

//     datasets: [
//       {
//         label: `${info.encoding} Signal`,
//         data: graphSignal,
//         stepped: true,
//         pointRadius: 0,
//         borderWidth: 2,
//       },
//       {
//         label: "Clock",
//         data: clock,
//         stepped: true,
//         pointRadius: 1,
//         borderWidth: 2,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,

//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Time",
//         },
//       },

//       y: {
//         title: {
//           display: true,
//           text: "Amplitude",
//         },
//         ticks: {
//           stepSize: 1,
//         },
//       },
//     },

//     plugins: {
//       legend: {
//         display: true,
//       },
//     },
//   };

//   return (
//     <div className="container">
//       <h1>Graph</h1>

//       {time.length > 0 && graphSignal.length > 0 ? (
//         <Line data={data} options={options} />
//       ) : (
//         <p>Generate data to display the waveform.</p>
//       )}
//     </div>
//   );
// }

// export default Graph;

// import { useEffect, useState } from "react";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// );

// function Graph({ info, graphData }) {
//   const { time, graphSignal, clock } = graphData;

//   const [visiblePoints, setVisiblePoints] = useState(0);

//   useEffect(() => {
//     if (!time.length) {
//       setVisiblePoints(0);
//       return;
//     }

//     setVisiblePoints(0);

//     let currentPoint = 0;

//     const interval = setInterval(() => {
//       currentPoint++;

//       setVisiblePoints(currentPoint);

//       if (currentPoint >= time.length) {
//         clearInterval(interval);
//       }
//     }, 300);

//     return () => clearInterval(interval);
//   }, [time, graphSignal]);

//   const visibleTime = time.slice(0, visiblePoints);
//   const visibleSignal = graphSignal.slice(0, visiblePoints);
//   const visibleClock = clock.slice(0, visiblePoints);

//   const chartData = {
//     labels: visibleTime,

//     datasets: [
//       {
//         label: `${info.encoding} Signal`,
//         data: visibleSignal,

//         stepped: true,
//         pointRadius: 0,
//         borderWidth: 3,
//         borderColor: "black",
//         backgroundColor: "black",
//         fill: false,
//       },

//       {
//         label: "Clock",
//         data: visibleClock,

//         stepped: true,
//         pointRadius: 0,
//         borderWidth: 2,
//         borderColor: "red",
//         backgroundColor: "red",
//         fill: false,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,

//     animation: {
//       duration: 50,
//     },

//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Time",
//         },
//       },

//       y: {
//         title: {
//           display: true,
//           text: "Amplitude",
//         },

//         ticks: {
//           stepSize: 1,
//         },
//       },
//     },

//     plugins: {
//       legend: {
//         display: true,
//       },
//     },
//   };

//   return (
//     <div className="container">
//       <h1>Graph</h1>

//       {visiblePoints > 0 ? (
//         <Line data={chartData} options={options} />
//       ) : (
//         <p>Generate data to display the waveform.</p>
//       )}
//     </div>
//   );
// }

// export default Graph;

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
  Legend
);

function Graph({ info, graphData }) {
  const { bits, time, graphSignal, clock } = graphData;

  const [visiblePoints, setVisiblePoints] = useState(0);

  // Animate waveform from left to right
  useEffect(() => {
    if (!time.length) {
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
  }, [time, graphSignal]);

  // Visible data according to animation
  const visibleTime = time.slice(0, visiblePoints);
  const visibleSignal = graphSignal.slice(0, visiblePoints);
  const visibleClock = clock.slice(0, visiblePoints);

  /*
   * Each bit occupies 2 graph positions.
   * Therefore:
   *
   * point 0,1 → bit 0
   * point 2,3 → bit 1
   * point 4,5 → bit 2
   * ...
   */

  const visibleBits = bits.slice(
    0,
    Math.ceil(visiblePoints / 2)
  );

  // -----------------------------
  // CLOCK GRAPH
  // -----------------------------

  const clockData = {
    labels: visibleTime,

    datasets: [
      {
        label: "Clock",
        data: visibleClock,

        stepped: true,

        pointRadius: 0,
        borderWidth: 3,

        borderColor: "red",
        backgroundColor: "red",

        fill: false,
      },
    ],
  };

  const clockOptions = {
    responsive: true,

    animation: false,

    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },

      y: {
        min: 0,
        max: 1,

        ticks: {
          stepSize: 1,
        },

        title: {
          display: true,
          text: "Clock",
        },
      },
    },

    plugins: {
      legend: {
        display: true,
      },

      tooltip: {
        enabled: true,
      },
    },
  };

  // -----------------------------
  // ENCODED SIGNAL GRAPH
  // -----------------------------

  const signalData = {
    labels: visibleTime,

    datasets: [
      {
        label: `${info.encoding} Signal`,
        data: visibleSignal,

        stepped: true,

        pointRadius: 0,
        borderWidth: 3,

        borderColor: "black",
        backgroundColor: "black",

        fill: false,
      },
    ],
  };

  const signalOptions = {
    responsive: true,

    animation: false,

    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },

      y: {
        ticks: {
          stepSize: 1,
        },

        title: {
          display: true,
          text: "Amplitude",
        },
      },
    },

    plugins: {
      legend: {
        display: true,
      },

      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className="container">
      <h1>Graph</h1>

      {visiblePoints > 0 ? (
        <>
          {/* DATA BITS */}

          <div>
            <h2>Data</h2>

            <div
              style={{
                display: "flex",
                gap: "12px",
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              {visibleBits.map((bit, index) => (
                <span key={index}>
                  {bit}
                </span>
              ))}
            </div>
          </div>

          {/* CLOCK */}

          <div>
            <h2>Clock</h2>

            <Line
              data={clockData}
              options={clockOptions}
            />
          </div>

          <br />

          {/* ENCODED SIGNAL */}

          <div>
            <h2>{info.encoding} Signal</h2>

            <Line
              data={signalData}
              options={signalOptions}
            />
          </div>
        </>
      ) : (
        <p>Generate data to display the waveform.</p>
      )}
    </div>
  );
}

export default Graph;