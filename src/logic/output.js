import {
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
} from "./encoding_algos";

const encode=(bits, encoding)=> {
  let signalData=[];
  switch (encoding) {
    case "unipolar_NRZ": {
      console.log("unipolar_NRZ");
      signalData = unipolar_NRZ(bits);
      break;
    }
    case "unipolar_RZ": {
      console.log("unipolar_RZ");
      signalData = unipolar_RZ(bits);
      break;
    }
    case "polar_NRZ_L": {
      console.log("polar_NRZ_L");
      signalData = polar_NRZ_L(bits);
      break;
    }
    case "polar_NRZ_I": {
      console.log("polar_NRZ_I");
      signalData = polar_NRZ_I(bits);
      break;
    }
    case "polar_RZ": {
      console.log("polar_RZ");
      signalData = polar_RZ(bits);
      break;
    }
    case "manchester": {
      console.log("manchester");
      signalData = manchester(bits);
      break;
    }
    case "differential_manchester": {
      console.log("differential_manchester");
      signalData = differential_manchester(bits);
      break;
    }
    case "ami": {
      console.log("ami");
      signalData = ami(bits);
      break;
    }
    case "pseudoternary": {
      console.log("pseudoternary");
      signalData = pseudoternary(bits);
      break;
    }
    case "mlt_3": {
      console.log("mlt_3");
      signalData = mlt_3(bits);
      break;
    }
    case "b8zs": {
      console.log("B8ZS Scrambler");
      signalData = b8zs(bits);
      break;
    }
    case "hdb3": {
      console.log("HDB3 Scrambler");
      signalData = hdb3(bits);
      break;
    }
    default:{
      console.log("Unknown Encoding!", encoding);
    }
  }
  return signalData;
}
