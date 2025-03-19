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
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold">Calculation Tools</h1>
        <p className="mt-1">Access specialized calculators for your project needs</p>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            className="w-full pl-10 p-2 border rounded-md bg-gray-50" 
            placeholder="Search calculators..."
          />
        </div>
      </div>

      {/* Calculator Card */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-4 border border-gray-200">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-2 rounded-md mr-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Time Clock Calculator</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Track work hours, breaks, and calculate overtime for precise time management.
        </p>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Pipe OD (inches):</label>
          <input
            type="number"
            value={od}
            onChange={(e) => setOd(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter Pipe Outer Diameter"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Distance from TDC (inches):</label>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter Distance from TDC"
          />
        </div>
        
        {clockPosition && (
          <div className="bg-purple-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Clock Position:</span>
              <span className="text-purple-700 font-bold">{clockPosition}</span>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md">
            TIME
          </span>
        </div>
        
        <button 
          onClick={calculateClockPosition}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default TimeClockCalculator;