const sampleSizeArr = [
  { type: "NRZ_L", sample: 1 },
  { type: "NRZ_I", sample: 1 },
  { type: "Manchester", sample: 2 },
  { type: "Differential Manchester", sample: 2 },
  { type: "RZ", sample: 2 },
];

const data = (k) => {
  let d = [];
  if (k > 0) {
    for (let i = 0; i < k; i++) {
      d[i] = Math.round(Math.random());
      console.log(d[i]);
    }
  }
  return d; //call karne ke baad check kar lena ki arr empty hai ya nhi
};

const clock = (k, /**sampleSize*/) => {
  // let totalSamples = k * sampleSize;
  let clockCycle = 2;
  let totalClockCycles = k * clockCycle;
  let clk = [];
  if (k > 0) {
    let bool = true;
    for (let i = 0; i < totalClockCycles; i++) {
      if (bool) {
        clk.push(1);
      } else {
        clk.push(0);
      }
      bool = !bool;
    }
  }
  return clk;
};

const time = (k, /**sampleSize*/) => {
  // let totalSamples = k * sampleSize;
  let timeCycle=2;
  let totalTimeCycles=k*timeCycle;
  let t = [];
  if (k > 0) {
    for (let i = 0; i < totalTimeCycles; i++) {
      t[i] = i;
    }
  }
  return t;
};

export { data, clock, time, sampleSizeArr };
