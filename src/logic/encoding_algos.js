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
let bits = [];

const unipolar_NRZ = (bits) => {
  return bits.map((b) => (b === 1 ? 1 : 0));
};

const unipolar_RZ = (bits) => {
  const signal = [];
  bits.forEach((b) => signal.push(b === 0 ? 0 : 1, 0));
  return signal;
};

const polar_NRZ_L = (bits) => {
  const signal = [];
  bits.forEach((b) => signal.push(b === 1 ? 1 : -1, 0));
  return signal;
};

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

const ami = (bits) => {
  let curr = 1;
  bits.map((b) => {
    b === 1 ? curr : 0;
    curr = -curr;
  });
};

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
  mlt_3,
  b8zs,
  hdb3,
};
