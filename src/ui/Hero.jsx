// import { useEffect, useState } from "react";
// import Graph from "./Graph.jsx";
// import Input from "../ui/Input.jsx";
// import {
//   encodings,
//   unipolar_NRZ,
//   unipolar_RZ,
//   polar_NRZ_L,
//   polar_NRZ_I,
//   polar_RZ,
//   manchester,
//   differential_manchester,
//   ami,
//   pseudoternary,
//   mlt_3,
//   b8zs,
//   hdb3,
// } from "../logic/encoding_algos.js";

// function Hero() {
//   let [info, setInfo] = useState({
//     databits: "",
//     encoding: "",
//   });
//   let updateInfo = (newInfo) => {
//     setInfo(newInfo);
//   };
//   console.log("hero section", info);
//   return (
//     <div>
//       <div className="container">
//         <h1>Line Encoder</h1>
//       </div>
//       <div className="container">
//         <Input updateInfo={updateInfo} />
//         <Graph info={info} />
//       </div>
//     </div>
//   );
// }

// export default Hero;
import { useState } from "react";
import Graph from "./Graph.jsx";
import Input from "../ui/Input.jsx";
import { data, clock, time, sampleSizeArr } from "../logic/input.js";
import { encode, prepSignal } from "../logic/output.js";

function Hero() {
  const [info, setInfo] = useState({
    databits: "",
    encoding: "",
  });

  const [graphData, setGraphData] = useState({
    bits: [],
    clock: [],
    time: [],
    signal: [],
    graphSignal: [],
  });

  const updateInfo = (newInfo) => {
    setInfo(newInfo);

    const sampleInfo = sampleSizeArr.find(
      (item) => item.type === newInfo.encoding,
    );

    const k = Number(newInfo.databits);

    const bits = data(k);
    const clockArr = clock(k);
    const timeArr = time(k);

    const signal = encode(bits, newInfo.encoding);

    const graphSignal = prepSignal(signal, sampleInfo.sample);

    setGraphData({
      bits,
      clock: clockArr,
      time: timeArr,
      signal,
      graphSignal,
    });
  };

  console.log("hero section", info);
  console.log("graph data", graphData);

  return (
    <div>
      <div className="container">
        <h1>Line Encoder</h1>
      </div>

      <div className="container">
        <Input updateInfo={updateInfo} />
        <Graph info={info} graphData={graphData} />
      </div>
    </div>
  );
}

export default Hero;
