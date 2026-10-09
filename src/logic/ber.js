// src/logic/ber.js

const calculateBER = (transmittedBits, recoveredBits) => {
  if (!Array.isArray(transmittedBits) || !Array.isArray(recoveredBits)) {
    throw new Error("Both inputs must be arrays.");
  }

  if (transmittedBits.length !== recoveredBits.length) {
    throw new Error(
      "Transmitted and recovered bit sequences must have equal lengths.",
    );
  }

  if (transmittedBits.length === 0) {
    return {
      totalBits: 0,
      bitErrors: 0,
      ber: null,
      accuracy: null,
    };
  }

  let bitErrors = 0;

  for (let i = 0; i < transmittedBits.length; i++) {
    if (transmittedBits[i] !== recoveredBits[i]) {
      bitErrors++;
    }
  }

  const totalBits = transmittedBits.length;
  const ber = bitErrors / totalBits;
  const accuracy = (1 - ber) * 100;

  return {
    totalBits,
    bitErrors,
    ber,
    accuracy,
  };
};

export { calculateBER };
