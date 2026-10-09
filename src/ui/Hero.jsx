// src/ui/Hero.jsx

import { useState } from "react";
import Graph from "./Graph.jsx";
import Input from "./Input.jsx";

import { runAccuracyExperiment } from "../logic/accuracyExperiment.js";
import { data, clock, time, sampleSizeArr } from "../logic/input.js";

import { encode, prepSignal } from "../logic/output.js";
import { addAWGN } from "../logic/noise.js";
import { decode } from "../logic/decoder.js";
import { calculateBER } from "../logic/ber.js";

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
    recoveredBits: [],
    metrics: null,
    decodeError: null,
  });

  const updateInfo = (newInfo) => {
    const k = Number(newInfo.databits);
    const noiseLevel = Number(newInfo.noiseLevel);

    if (!Number.isInteger(k) || k < 1 || k > 128) {
      console.error("Enter a valid bit count between 1 and 128.");
      return;
    }

    const sampleInfo = sampleSizeArr.find(
      (item) => item.type === newInfo.encoding,
    );

    if (!sampleInfo) {
      console.error("Sample size not found for encoding:", newInfo.encoding);
      return;
    }

    try {
      const bits = data(k);
      const clockArr = clock(k);
      const timeArr = time(k);

      const signal = encode(bits, newInfo.encoding);
      const graphSignal = prepSignal(signal, sampleInfo.sample);

      if (graphSignal.length !== timeArr.length) {
        throw new Error(
          `${newInfo.encoding} generated ${graphSignal.length} graph samples; expected ${timeArr.length}.`,
        );
      }

      // Generate noise once. Both the graph and receiver use this same signal.
      const noisySignal = addAWGN(graphSignal, noiseLevel);

      let recoveredBits = [];
      let metrics = null;
      let decodeError = null;

      try {
        recoveredBits = decode(
          noisySignal,
          newInfo.encoding,
          sampleInfo.sample,
          k,
        );

        metrics = calculateBER(bits, recoveredBits);
      } catch (error) {
        decodeError = error.message;
        console.error("Receiver/decoder error:", error);
      }

      setInfo({
        ...newInfo,
        databits: String(k),
        noiseLevel,
      });

      setGraphData({
        bits,
        clock: clockArr,
        time: timeArr,
        signal,
        graphSignal,
        noisySignal,
        recoveredBits,
        metrics,
        decodeError,
      });

      console.log("Transmission result:", {
        encoding: newInfo.encoding,
        transmittedBits: bits,
        recoveredBits,
        metrics,
        decodeError,
      });
    } catch (error) {
      console.error("Signal generation failed:", error);
    }
  };

  return (
    <div>
      <div className="container">
        <h1>Line Encoder & Noise Simulator</h1>
      </div>

      <div className="container">
        <Input updateInfo={updateInfo} />
        <Graph info={info} graphData={graphData} />
        
<button
  type="button"
  onClick={() => {
    try {
      const result = runAccuracyExperiment({
        seed: 20261010,
        onProgress: ({ completed, total }) => {
          if (completed % 30 === 0 || completed === total) {
            console.log(`Progress: ${completed}/${total}`);
          }
        },
      });

      console.table(result.summaryRows);

      console.log(
        `Finished ${result.totalTrials} trials. Check your Downloads folder for the CSV files.`
      );
    } catch (error) {
      console.error("Accuracy experiment failed:", error);
    }
  }}
>
  Run Accuracy Experiment (600 Trials)
</button>

      </div>
    </div>
  );
}

export default Hero;
