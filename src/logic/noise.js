function addAWGN(signal, noiseLevel = 0.2, random = Math.random) {
  if (!Array.isArray(signal) || signal.length === 0) {
    return [];
  }

  if (!Number.isFinite(noiseLevel) || noiseLevel < 0) {
    throw new Error("Noise level must be a non-negative number.");
  }

  return signal.map((sample) => {
    let u1 = 0;
    let u2 = 0;

    while (u1 === 0) {
      u1 = random();
    }

    u2 = random();

    const gaussianNoise =
      Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return sample + gaussianNoise * noiseLevel;
  });
}

export { addAWGN };
