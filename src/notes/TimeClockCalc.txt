import React, { useState } from "react";

const TimeClockCalculator = () => {
  const [od, setOd] = useState(""); // Pipe Outer Diameter
  const [distance, setDistance] = useState(""); // Distance from TDC
  const [clockPosition, setClockPosition] = useState(""); // Calculated Clock Time

  const calculateClockPosition = () => {
    const odValue = parseFloat(od) || 0;
    const distanceValue = parseFloat(distance) || 0;

    if (odValue <= 0) {
      setClockPosition("Invalid OD");
      return;
    }

    // Step 1: Calculate Circumference (in inches)
    const circumference = Math.PI * odValue;

    // Step 2: Convert distance into a clock face representation
    const clockFraction = (distanceValue / circumference) * 12; // Convert to 12-hour scale
    const hours = Math.floor(clockFraction);
    const minutes = Math.round((clockFraction % 1) * 60);

    // Ensure we wrap around at 12:00
    const finalHours = hours % 12 || 12; // Ensure 12-hour format
    const formattedTime = `${finalHours}:${minutes.toString().padStart(2, "0")}`;

    setClockPosition(formattedTime);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 rounded shadow">
      <h1 className="text-xl font-bold mb-4">TDC Clock Position Calculator</h1>

      {/* Pipe OD Input */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Pipe OD (inches):</label>
        <input
          type="number"
          value={od}
          onChange={(e) => setOd(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter Pipe Outer Diameter"
        />
      </div>

      {/* Distance from TDC Input */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Distance from TDC (inches):</label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter Distance from TDC"
        />
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateClockPosition}
        className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600"
      >
        Calculate
      </button>

      {/* Display Calculated Clock Position */}
      {clockPosition && (
        <div className="mt-4 text-lg font-semibold">
          Clock Position: <span className="text-blue-600">{clockPosition}</span>
        </div>
      )}
    </div>
  );
};

export default TimeClockCalculator;
