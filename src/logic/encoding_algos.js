import { data, clock, time, sampleSizeArr } from "./input";

const encodings = {
  1: "unipolar_NRZ",
  2: "unipolar_RZ",
  3: "polar_NRZ_L",
  4: "polar_NRZ_I",
  5: "polar_RZ",
  6: "manchester",
  7: "differential_manchester",
  8: "ami",
  9: "pseudoternary",
  10: "mlt_3",
  11: "b8zs",
  12: "hdb3",
};

const dataArr = data(5);
let bits = dataArr;

/**
 * unipolar NRZ
 * 1 = +1
 * 0 = 0
 */
const unipolar_NRZ = (bits) => {
  return bits.map((b) => (b === 1 ? 1 : 0));
};

/**
 * unipolar RZ
 * 1 = +1,0
 * 0 = -1,0
 */
const unipolar_RZ = (bits) => {
  const signal = [];
  bits.forEach((b) => signal.push(b === 0 ? 0 : 1, 0));
  return signal;
};

/**
 * polar NRZ L
 * 1 = +1
 * 0 = -1
 */
const polar_NRZ_L = (bits) => {
  return bits.map((b) => (b === 1 ? 1 : -1));
};

/**
 * polar NRZ I
 * 1= inversion
 * 0= no inversion
 */
const polar_NRZ_I = (bits) => {
  const signal = [];
  let curr = 1;
  bits.forEach((b) => {
    if (b === 1) {
      curr = -curr;
    }
    signal.push(curr);
  });
  return signal;
};

/**
 * poalr RZ
 * 1=+1,0
 * 0=-1,0
 */

const polar_RZ = (bits) => {
  const signal = [];
  bits.forEach((b) => {
    if (b === 1) {
      signal.push(1, 0);
    } else {
      signal.push(-1, 0);
    }
  });
  return signal;
};

//IEEE 802.3
/**
 * 0=high to low +1,-1
 * 1=low to high -1,+1
 */
const manchester = (bits) => {
  const signal = [];
  bits.forEach((b) => {
    if (b === 1) {
      signal.push(-1, +1);
    } else {
      signal.push(+1, -1);
    }
  });
  return signal;
};

/**
 * differential_manchester
 * midbit always has a transition
 * 0=transition at start
 * 1=no transition
 */
const differential_manchester = (bits) => {
  const signal = [];
  let curr = 1;
  bits.forEach((b) => {
    if (b === 0) {
      curr = -curr;
    }
    signal.push(curr, -curr);
    curr = -curr;
  });
  return signal;
};

/**
 * AMI
 * 0=0
 * 1=alternate +1 & -1
 */
const ami = (bits) => {
  let curr = 1;
  return bits.map((b) => {
    if (b === 1) {
      curr = -curr;
      return curr;
    }
    return 0;
  });
};

/**
 * pseudoternary (opposite of AMI)
 * 1=0
 * 0=alternate +1 & -1
 */
const pseudoternary = (bits) => {
  let curr = 1;
  return bits.map((b) => {
    if (b === 0) {
      curr = -curr;
      return curr;
    }
    return 0;
  });
};

/**
 * Multi level transmit 3
 * cycles [0,1,0,-1] only on 1, maintains level on 0
 */
const mlt_3 = (bits) => {
  const signal = [];
  const cycle = [0, 1, 0, -1];
  let state = 0;
  bits.forEach((b) => {
    if (b === 1) {
      state = (state + 1) % 4;
    }
    signal.push(cycle[state]);
  });
  return signal;
};

const b8zs = (bits) => {
  const signal = [];
  let lastPulse = -1;

  for (let i = 0; i < bits.length; ) {
    // Check for 8 consecutive zeros
    if (
      bits[i] === 0 &&
      bits[i + 1] === 0 &&
      bits[i + 2] === 0 &&
      bits[i + 3] === 0 &&
      bits[i + 4] === 0 &&
      bits[i + 5] === 0 &&
      bits[i + 6] === 0 &&
      bits[i + 7] === 0
    ) {
      const B = -lastPulse;
      const V = lastPulse;

      signal.push(0, 0, 0, V, B, 0, B, V);

      lastPulse = V;
      i += 8;
      continue;
    }

    if (bits[i] === 1) {
      lastPulse = -lastPulse;
      signal.push(lastPulse);
    } else {
      signal.push(0);
    }

    i++;
  }

  return signal;
};

/**
 * HDB3 (High-Density Bipolar 3 Zeros)
 *
 * Normal AMI:
 *   1 = alternating +1 / -1
 *   0 = 0
 *
 * Four consecutive zeros are replaced by:
 *   000V when the number of nonzero pulses
 *        since the previous violation is odd.
 *
 *   B00V when that number is even.
 *
 * B = balancing pulse with normal AMI polarity.
 * V = violation pulse with the same polarity as B
 *     in B00V, or the preceding pulse in 000V.
 */
const hdb3 = (bits) => {
  const signal = [];

  let lastPulse = -1;
  let pulseCount = 0;

  for (let i = 0; i < bits.length; ) {
    const fourZeros =
      bits[i] === 0 &&
      bits[i + 1] === 0 &&
      bits[i + 2] === 0 &&
      bits[i + 3] === 0;

    if (fourZeros) {
      if (pulseCount % 2 === 0) {
        // B00V: B and V have the same polarity.
        const B = -lastPulse;
        const V = B;

        signal.push(B, 0, 0, V);
        lastPulse = V;
      } else {
        // 000V: V has the same polarity as the
        // preceding nonzero pulse.
        const V = lastPulse;

        signal.push(0, 0, 0, V);
        lastPulse = V;
      }

      // Start counting from this substitution.
      pulseCount = 0;
      i += 4;
      continue;
    }

    if (bits[i] === 1) {
      lastPulse = -lastPulse;
      signal.push(lastPulse);
      pulseCount++;
    } else {
      signal.push(0);
    }

    i++;
  }

  return signal;
};

export {
  encodings,
  unipolar_NRZ,
  unipolar_RZ,
  polar_NRZ_L,
  polar_NRZ_I,
  polar_RZ,
  manchester,
  differential_manchester,
  ami,
  pseudoternary,
  mlt_3,
  b8zs,
  hdb3,
};
