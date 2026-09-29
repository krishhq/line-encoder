// import {useState, useEffect} from "react";
// // import Chart from "chart.js";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import {sampleSizeArr} from "../logic/input";

// ChartJS.register(ArcElement, Tooltip, Legend);

// function Graph({info, graphData}){
//     console.log("info: ", info);
//     console.log("graphData: ", graphData);

//     return(
//         <div className="container">
//             <h1>Graph</h1>
//         </div>
//     );
// }

// export default Graph;

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
  const { time, graphSignal, clock } = graphData;

  const [visiblePoints, setVisiblePoints] = useState(0);

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
    }, 300);

    return () => clearInterval(interval);
  }, [time, graphSignal]);

  const visibleTime = time.slice(0, visiblePoints);
  const visibleSignal = graphSignal.slice(0, visiblePoints);
  const visibleClock = clock.slice(0, visiblePoints);

  const chartData = {
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

      {
        label: "Clock",
        data: visibleClock,

        stepped: true,
        pointRadius: 0,
        borderWidth: 2,
        borderColor: "red",
        backgroundColor: "red",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,

    animation: {
      duration: 500,
    },

    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },

      y: {
        title: {
          display: true,
          text: "Amplitude",
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
  };

  return (
    <div className="container">
      <h1>Graph</h1>

      {visiblePoints > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Generate data to display the waveform.</p>
      )}
    </div>
  );
}

export default Graph;
