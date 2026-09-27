const sample=1; //1 bit per sample

const data = (k) => {
  let d = [];
  if (k > 5) {
    for (let i = 0; i < k; i++) {
      d[i] = Math.round(Math.random());
      console.log(d[i]);
    }
  }
  return d; //call karne ke baad check kar lena ki arr empty hai ya nhi
};

const clock = (k) => {
  let clk = [];
  if (k > 5) {
    let bool = true;
    for (let i = 0; i < k; i++) {
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

const time = (k) => {
  let t = [];
  if (k > 5) {
    for (let i = 0; i < k; i++) {
      t[i] = i;
    }
  }
  return t;
};

export default { data, clock, time };
