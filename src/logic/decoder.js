// src/logic/decoder.js

const quantizeLevel = (value) => {
  if (value > 0.5) return 1;
  if (value < -0.5) return -1;
  return 0;
};

const getLogicalSamples = (receivedSignal, sampleSize, bitCount) => {
  if (!Array.isArray(receivedSignal)) {
    throw new Error("Received signal must be an array.");
  }

  if (receivedSignal.length !== bitCount * 2) {
    throw new Error(
      `Expected ${bitCount * 2} graph samples, received ${receivedSignal.length}.`,
    );
  }

  if (sampleSize === 1) {
    const samples = [];

    for (let i = 0; i < receivedSignal.length; i += 2) {
      samples.push(
        quantizeLevel((receivedSignal[i] + receivedSignal[i + 1]) / 2),
      );
    }

    return samples;
  }

  if (sampleSize === 2) {
    return receivedSignal.map(quantizeLevel);
  }

  throw new Error(`Unsupported sample size: ${sampleSize}`);
};

const decode = (receivedSignal, encoding, sampleSize, bitCount) => {
  const samples = getLogicalSamples(receivedSignal, sampleSize, bitCount);

  const bits = [];

  switch (encoding) {
    case "unipolar_NRZ":
      samples.forEach((level) => bits.push(level > 0 ? 1 : 0));
      break;

    case "unipolar_RZ":
      for (let i = 0; i < samples.length; i += 2) {
        bits.push(samples[i] > 0 ? 1 : 0);
      }
      break;

    case "polar_NRZ_L":
      samples.forEach((level) => bits.push(level > 0 ? 1 : 0));
      break;

    case "polar_NRZ_I": {
      let previousLevel = 1;

      samples.forEach((level) => {
        bits.push(level !== previousLevel ? 1 : 0);
        previousLevel = level;
      });

      break;
    }

    case "polar_RZ":
      for (let i = 0; i < samples.length; i += 2) {
        bits.push(samples[i] > 0 ? 1 : 0);
      }
      break;

    case "manchester":
      for (let i = 0; i < samples.length; i += 2) {
        bits.push(samples[i] < samples[i + 1] ? 1 : 0);
      }
      break;

    case "differential_manchester": {
      let previousLevel = 1;

      for (let i = 0; i < samples.length; i += 2) {
        bits.push(samples[i] !== previousLevel ? 0 : 1);
        previousLevel = samples[i + 1];
      }

      break;
    }

    case "ami":
      samples.forEach((level) => bits.push(level === 0 ? 0 : 1));
      break;

    case "pseudoternary":
      samples.forEach((level) => bits.push(level === 0 ? 1 : 0));
      break;

    case "mlt_3": {
      let previousLevel = 0;

      samples.forEach((level) => {
        bits.push(level !== previousLevel ? 1 : 0);
        previousLevel = level;
      });

      break;
    }

    case "b8zs": {
      let lastPulse = -1;

      for (let i = 0; i < samples.length; ) {
        const isSubstitution =
          i + 7 < samples.length &&
          samples[i] === 0 &&
          samples[i + 1] === 0 &&
          samples[i + 2] === 0 &&
          samples[i + 3] === lastPulse &&
          samples[i + 4] === -lastPulse &&
          samples[i + 5] === 0 &&
          samples[i + 6] === -lastPulse &&
          samples[i + 7] === lastPulse;

        if (isSubstitution) {
          bits.push(0, 0, 0, 0, 0, 0, 0, 0);
          lastPulse = samples[i + 7];
          i += 8;
          continue;
        }

        const level = samples[i];

        if (level !== 0) {
          lastPulse = level;
          bits.push(1);
        } else {
          bits.push(0);
        }

        i++;
      }

      break;
    }

    case "hdb3": {
      let lastPulse = -1;

      for (let i = 0; i < samples.length; ) {
        const is000V =
          i + 3 < samples.length &&
          samples[i] === 0 &&
          samples[i + 1] === 0 &&
          samples[i + 2] === 0 &&
          samples[i + 3] !== 0 &&
          samples[i + 3] === lastPulse;

        if (is000V) {
          bits.push(0, 0, 0, 0);
          lastPulse = samples[i + 3];
          i += 4;
          continue;
        }

        const isB00V =
          i + 3 < samples.length &&
          samples[i] !== 0 &&
          samples[i] === -lastPulse &&
          samples[i + 1] === 0 &&
          samples[i + 2] === 0 &&
          samples[i + 3] === samples[i];

        if (isB00V) {
          bits.push(0, 0, 0, 0);
          lastPulse = samples[i + 3];
          i += 4;
          continue;
        }

        const level = samples[i];

        if (level !== 0) {
          bits.push(1);
          lastPulse = level;
        } else {
          bits.push(0);
        }

        i++;
      }

      break;
    }

    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }

  if (bits.length !== bitCount) {
    throw new Error(
      `${encoding} decoder produced ${bits.length} bits; expected ${bitCount}.`,
    );
  }

  return bits;
};

export { decode };
