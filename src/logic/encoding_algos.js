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
  const signal = [];
  bits.forEach((b) => signal.push(b === 1 ? 1 : -1));
  return signal;
};

/**
 * polar NRZ I
 * 1= inversion
 * 0= no inversion
 */
const polar_NRZ_I = (bits) => {
  const signal = [];
  let curr = bits[0];
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
  let curr = bits[0];
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
  bits.map((b) => {
    b === 1 ? curr : 0;
    curr = -curr;
  });
};

/**
 * pseudoternary (opposite of AMI)
 * 1=0
 * 0=alternate +1 & -1
 */
const pseudoternary = (bits) => {
  let curr = 1;
  bits.map((b) => {
    b === 1 ? 0 : curr;
    curr = -curr;
  });
};

// const mlt_3 = (bits) => {
//     bits.map((b)=>{

//     });
// };

const b8zs = () => {};

const hdb3 = () => {};

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
  // mlt_3,
  b8zs,
  hdb3,
};
