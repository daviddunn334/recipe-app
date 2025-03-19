import React, { useState } from "react";

const AbsEsCalculator = () => {
  const [abs, setAbs] = useState("");
  const [es, setEs] = useState("");
  const [rgw, setRgw] = useState("");

  // Convert string inputs to numbers (defaulting to 0 if empty)
  const absNum = parseFloat(abs) || 0;
  const esNum = parseFloat(es) || 0;
  const rgwNum = parseFloat(rgw) || 0;

  // Calculate new values by adding RGW+ to the original ABS and ES
  const newAbs = absNum + rgwNum;
  const newEs = esNum + rgwNum;

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 rounded shadow">
      <h1 className="text-xl font-bold mb-4">ABS + ES Calculator</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">ABS:</label>
        <input
          type="number"
          value={abs}
          onChange={(e) => setAbs(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter ABS value"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">ES:</label>
        <input
          type="number"
          value={es}
          onChange={(e) => setEs(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter ES value"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">RGW+:</label>
        <input
          type="number"
          value={rgw}
          onChange={(e) => setRgw(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter RGW value"
        />
      </div>

      <div className="mb-2 font-semibold">
        New ABS: <span className="text-blue-600">{newAbs}</span>
      </div>
      <div className="font-semibold">
        New ES: <span className="text-blue-600">{newEs}</span>
      </div>
    </div>
  );
};

export default AbsEsCalculator;
