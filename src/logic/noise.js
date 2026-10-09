function addAWGN(signal, noiseLevel = 0.2) {
  if (!Array.isArray(signal) || signal.length === 0) {
    return [];
  }

  return signal.map((sample) => {
    // Box–Muller transform generates standard Gaussian noise.
    let u1 = 0;
    let u2 = 0;

    while (u1 === 0) {
      u1 = Math.random();
    }

    u2 = Math.random();

    const gaussianNoise =
      Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return sample + gaussianNoise * noiseLevel;
  });
}

export { addAWGN };
