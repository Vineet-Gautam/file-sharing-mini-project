// src/components/CodeInput.js
import React, { useState } from "react";

const CodeInput = ({ onAccept }) => {
  const [code, setCode] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    // Ensure only 4-digit numbers are accepted
    if (/^\d{0,4}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length === 4) {
      onAccept(code); // Pass the code to the parent component
      setCode(""); // Clear the input field after submission
    } else {
      alert("Please enter a 4-digit code.");
    }



  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <label htmlFor="codeInput" className="mt-4 mb-2 text-lg font-medium">
        Enter 4-digit Code:
      </label>
      <input
        id="codeInput"
        type="text"
        maxLength={4}
        value={code}
        onChange={handleChange}
        className="border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
      >
        Download 
      </button>
    </form>
  );
};

export default CodeInput;
