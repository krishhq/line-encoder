import { useState } from "react";

function Input({ updateInfo }) {
  const [formData, setFormData] = useState({
    databits: "8",
    encoding: "unipolar_NRZ",
    noiseLevel: "0.2",
  });

  const handleInputChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateInfo(formData);
  };

  return (
    <div
      className="container"
      style={{ border: "2px solid black", padding: "16px" }}
    >
      <h2>Input</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="databits">Number of data bits:</label>

        <input
          id="databits"
          name="databits"
          type="number"
          min="1"
          max="128"
          value={formData.databits}
          onChange={handleInputChange}
          required
        />

        <br />
        <br />

        <label htmlFor="encoding">Select encoding:</label>

        <select
          id="encoding"
          name="encoding"
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
          <option value="pseudoternary">Pseudoternary</option>
          <option value="mlt_3">MLT-3</option>
          <option value="b8zs">B8ZS</option>
          <option value="hdb3">HDB3</option>
        </select>

        <br />
        <br />

        <label htmlFor="noiseLevel">
          Noise Level: {Number(formData.noiseLevel).toFixed(2)}
        </label>

        <input
          id="noiseLevel"
          name="noiseLevel"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={formData.noiseLevel}
          onChange={handleInputChange}
        />

        <br />

        <small>0 = clean signal, 1 = high noise</small>

        <br />
        <br />

        <button type="submit" className="btn btn-outline-info">
          Generate Signal
        </button>
      </form>
    </div>
  );
}

export default Input;
