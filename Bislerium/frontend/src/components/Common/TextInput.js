// src/components/Common/TextInput.js
import React from "react";

const TextInput = ({ name, type, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default TextInput;
