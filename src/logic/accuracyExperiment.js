
import { sampleSizeArr } from "./input.js";
import { encode, prepSignal } from "./output.js";
import { addAWGN } from "./noise.js";
import { decode } from "./decoder.js";
import { calculateBER } from "./ber.js";

const ENCODINGS = [
  "unipolar_NRZ",
  "unipolar_RZ",
  "polar_NRZ_L",
  "polar_NRZ_I",
  "polar_RZ",
  "manchester",
  "differential_manchester",
  "ami",
  "pseudoternary",
  "mlt_3",
  "b8zs",
  "hdb3",
];

const NOISE_LEVELS = [0, 0.2, 0.4, 0.6, 0.8];
const BITS_PER_TRIAL = 100;
const TRIALS_PER_LEVEL = 10;

// Deterministic pseudorandom generator for reproducible experiments.
const createRandom = (seed) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;

    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const generateBits = (count, random) =>
  Array.from({ length: count }, () =>
    random() < 0.5 ? 0 : 1
  );

const csvEscape = (value) => {
  const text = value == null ? "" : String(value);

  return /[",\r\n]/.test(text)
    ? `"${text.replace(/"/g, '""')}"`
    : text;
};

const toCSV = (headers, rows) =>
  [
    headers.map(csvEscape).join(","),
    ...rows.map((row) =>
      headers.map((header) => csvEscape(row[header])).join(",")
    ),
  ].join("\r\n");

const downloadCSV = (filename, content) => {
  const blob = new Blob(["\uFEFF", content], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Revoke after the browser has had time to start the download.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const runAccuracyExperiment = ({
  seed = 20261010,
  onProgress = () => {},
  download = true,
} = {}) => {
  const trialRows = [];
  const summaryRows = [];

  const totalTrials =
    ENCODINGS.length * NOISE_LEVELS.length * TRIALS_PER_LEVEL;

  let completed = 0;

  ENCODINGS.forEach((encoding, encodingIndex) => {
    const sampleInfo = sampleSizeArr.find(
      (item) => item.type === encoding
    );

    if (!sampleInfo) {
      throw new Error(`Missing sample-size entry for ${encoding}`);
    }

    NOISE_LEVELS.forEach((noiseLevel, levelIndex) => {
      let totalBitErrors = 0;
      let totalComparedBits = 0;
      let successfulTrials = 0;
      let failedTrials = 0;

      for (let trial = 1; trial <= TRIALS_PER_LEVEL; trial++) {
        const trialSeed =
          (seed +
            encodingIndex * 100000 +
            levelIndex * 1000 +
            trial) >>> 0;

        const random = createRandom(trialSeed);
        const bits = generateBits(BITS_PER_TRIAL, random);

        let metrics = null;
        let status = "PASS";
        let errorMessage = "";

        try {
          const signal = encode(bits, encoding);
          const graphSignal = prepSignal(
            signal,
            sampleInfo.sample
          );

          if (graphSignal.length !== BITS_PER_TRIAL * 2) {
            throw new Error(
              `Expected 200 graph samples; received ${graphSignal.length}.`
            );
          }

          // Generate noise once; decode the exact same received waveform.
          const noisySignal = addAWGN(
            graphSignal,
            noiseLevel,
            random
          );

          const recoveredBits = decode(
            noisySignal,
            encoding,
            sampleInfo.sample,
            BITS_PER_TRIAL
          );

          metrics = calculateBER(bits, recoveredBits);

          if (
            recoveredBits.length !== BITS_PER_TRIAL ||
            recoveredBits.some((bit) => bit !== 0 && bit !== 1)
          ) {
            throw new Error("Decoder returned invalid recovered bits.");
          }

          totalBitErrors += metrics.bitErrors;
          totalComparedBits += metrics.totalBits;
          successfulTrials++;
        } catch (error) {
          status = "FAIL";
          errorMessage =
            error instanceof Error ? error.message : String(error);

          failedTrials++;
        }

        trialRows.push({
          seed: trialSeed,
          encoding,
          noiseLevel,
          trial,
          bitsTransmitted: BITS_PER_TRIAL,
          bitErrors: metrics ? metrics.bitErrors : "",
          BER: metrics ? metrics.ber : "",
          accuracyPercent: metrics ? metrics.accuracy : "",
          status,
          error: errorMessage,
        });

        completed++;

        onProgress({
          completed,
          total: totalTrials,
          encoding,
          noiseLevel,
          trial,
          status,
        });
      }

      const aggregateBER =
        totalComparedBits > 0
          ? totalBitErrors / totalComparedBits
          : null;

      const zeroNoiseErrors =
        noiseLevel === 0 && totalBitErrors > 0;

      summaryRows.push({
        encoding,
        noiseLevel,
        trialsRequested: TRIALS_PER_LEVEL,
        successfulTrials,
        failedTrials,
        totalBitsCompared: totalComparedBits,
        totalBitErrors,
        BER: aggregateBER == null ? "" : aggregateBER,
        accuracyPercent:
          aggregateBER == null ? "" : (1 - aggregateBER) * 100,
        validation:
          failedTrials > 0
            ? "INCOMPLETE: inspect trial errors"
            : zeroNoiseErrors
              ? "FAIL: zero-noise errors"
              : noiseLevel === 0
                ? "PASS: zero-noise round trip"
                : "PASS: decoder completed",
      });
    });
  });

  const trialCSV = toCSV(
    [
      "seed",
      "encoding",
      "noiseLevel",
      "trial",
      "bitsTransmitted",
      "bitErrors",
      "BER",
      "accuracyPercent",
      "status",
      "error",
    ],
    trialRows
  );

  const summaryCSV = toCSV(
    [
      "encoding",
      "noiseLevel",
      "trialsRequested",
      "successfulTrials",
      "failedTrials",
      "totalBitsCompared",
      "totalBitErrors",
      "BER",
      "accuracyPercent",
      "validation",
    ],
    summaryRows
  );

  if (download) {
    downloadCSV("accuracy_trials.csv", trialCSV);
    downloadCSV("accuracy_summary.csv", summaryCSV);
  }

  return {
    seed,
    totalTrials: completed,
    trialRows,
    summaryRows,
    trialCSV,
    summaryCSV,
  };
};

export { runAccuracyExperiment };
