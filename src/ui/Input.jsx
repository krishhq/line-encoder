import { useState, useEffect } from "react";

function Input({updateInfo}) {
    let [formData, setFormData]=useState({
        databits:"",
        encoding:""
    });
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(formData);
        updateInfo(formData);
    };
    const handleInputChange=(e)=>{
        setFormData((currData)=>{
            return {...currData, [e.target.name]:e.target.value};
        });
    }
  return (
    <div className="container">
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
        />
        <label htmlFor="encoding">Select encoding:</label>
        <select name="encoding" id="encoding" value={formData.encoding} onChange={handleInputChange}>
          <option value="unipolar NRZ">Unipolar NRZ</option>
          <option value="unipolar RZ">Unipolar RZ</option>
          <option value="polar NRZ-L">Polar NRZ-L</option>
          <option value="polar NRZ-I">Polar NRZ-I</option>
          <option value="polar RZ">Polar RZ</option>
          <option value="manchester">Manchester</option>
          <option value="differential manchester">
            Differential Manchester
          </option>
          <option value="ami">AMI</option>
          <option value="mlt-3">MLT-3</option>
          <option value="pseudoternary">Pseudoternary</option>
        </select>
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
  );
}

export default Input;