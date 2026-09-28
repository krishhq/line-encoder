import { useState, useEffect } from "react";

function Input({ updateInfo }) {
  let [formData, setFormData] = useState({
    databits: "",
    encoding: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    updateInfo(formData);
  };
  const handleInputChange = (e) => {
    setFormData((currData) => {
      return { ...currData, [e.target.name]: e.target.value };
    });
  };
  return (
    <div className="container" style={{border:"2px solid black"}}>
      <h1>Input</h1>
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="databits">Number of databits:</label>
        <input
          id="databits"
          name="databits"
          type="number"
          placeholder="number of bits"
          value={formData.databits}
          onChange={handleInputChange}
          required
        />
        <br />
        <label htmlFor="encoding">Select encoding:</label>
        <select
          name="encoding"
          id="encoding"
          value={formData.encoding}
          onChange={handleInputChange}
          required
        >
          <option value="unipolar_NRZ">Unipolar NRZ</option>
          <option value="unipolar_RZ">Unipolar RZ</option>
          <option value="polar_NRZ_L">Polar NRZ-L</option>
          <option value="polar_NRZ_I">Polar NRZ-I</option>
          <option value="polar_RZ">Polar RZ</option>
          <option value="manchester">Manchester</option>
          <option value="differential_manchester">
            Differential Manchester
          </option>
          <option value="ami">AMI</option>
          <option value="mlt_3">MLT-3</option>
          <option value="pseudoternary">Pseudoternary</option>
        </select>
        <br />
        <button type="submit" className="btn btn-outline-info">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Input;
