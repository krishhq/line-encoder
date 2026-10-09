import { useState } from "react";
import Graph from "./Graph.jsx";
import Input from "./Input.jsx";

import { data, clock, time, sampleSizeArr } from "../logic/input.js";

import { encode, prepSignal } from "../logic/output.js";

import { addAWGN } from "../logic/noise.js";

function Hero() {
  const [info, setInfo] = useState({
    databits: "",
    encoding: "",
    noiseLevel: 0.2,
  });

  const [graphData, setGraphData] = useState({
    bits: [],
    clock: [],
    time: [],
    signal: [],
    graphSignal: [],
    noisySignal: [],
  });

  const updateInfo = (newInfo) => {
    const k = Number(newInfo.databits);
    const noiseLevel = Number(newInfo.noiseLevel);

    if (!Number.isInteger(k) || k < 1) {
      console.error("Enter a valid positive number of bits.");
      return;
    }

    const sampleInfo = sampleSizeArr.find(
      (item) => item.type === newInfo.encoding,
    );

    if (!sampleInfo) {
      console.error("Sample size not found for encoding:", newInfo.encoding);
      return;
    }

    const bits = data(k);
    const clockArr = clock(k);
    const timeArr = time(k);

    const signal = encode(bits, newInfo.encoding);

    const graphSignal = prepSignal(signal, sampleInfo.sample);

    const noisySignal = addAWGN(graphSignal, noiseLevel);

    setInfo(newInfo);

    console.table({
      encoding: newInfo.encoding,
      inputBits: bits.length,
      clockLength: clockArr.length,
      timeLength: timeArr.length,
      cleanSignalLength: graphSignal.length,
      noisySignalLength: noisySignal.length,
      timeMatchesClock: timeArr.length === clockArr.length,
      timeMatchesClean: timeArr.length === graphSignal.length,
      timeMatchesNoisy: timeArr.length === noisySignal.length,
    });

    setGraphData({
      bits,
      clock: clockArr,
      time: timeArr,
      signal,
      graphSignal,
      noisySignal,
    });
  };

  return (
    <div>
      <div className="container">
        <h1>Line Encoder & Noise Simulator</h1>
      </div>

      <div className="container">
        <Input updateInfo={updateInfo} />

        <Graph info={info} graphData={graphData} />
      </div>
    </div>
  );
}

export default Hero;
