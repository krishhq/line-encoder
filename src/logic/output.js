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



switch (info.encoding) {
  case "unipolar_NRZ": {
    console.log("unipolar_NRZ");
    data=unipolar_NRZ();
    break;
  }
  case "unipolar_RZ": {
    console.log("unipolar_RZ");
    data=unipolar_RZ();
    break;
  }
  case "polar_NRZ_L": {
    console.log("polar_NRZ_L");
    data=polar_NRZ_L();
    break;
  }
  case "polar_NRZ_I": {
    console.log("polar_NRZ_I");
    data=polar_NRZ_I();
    break;
  }
  case "polar_RZ": {
    console.log("polar_RZ");
    data=polar_RZ();
    break;
  }
  case "manchester": {
    console.log("manchester");
    data=manchester();
    break;
  }
  case "differential_manchester": {
    console.log("differential_manchester");
    data=differential_manchester();
    break;
  }
  case "ami": {
    console.log("ami");
    data=ami();
    break;
  }
  case "pseudoternary": {
    console.log("pseudoternary");
    data=pseudoternary();
    break;
  }
  case "mlt_3": {
    console.log("mlt_3");
    data=mlt_3();
    break;
  }
  case "b8zs": {
    console.log("B8ZS Scrambler");
    data=b8zs();
    break;
  }
  case "hdb3": {
    console.log("HDB3 Scrambler");
    data=hdb3();
    break;
  }
  default:
    [];
}
