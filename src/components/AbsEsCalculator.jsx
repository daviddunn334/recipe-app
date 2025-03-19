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
          <div className="bg-blue-100 p-2 rounded-md mr-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">ABS + ES Calculator</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Calculate RGW+ additions to both ABS and ES values for precise measurements.
        </p>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">ABS Value:</label>
          <input
            type="number"
            value={abs}
            onChange={(e) => setAbs(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter ABS value"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">ES Value:</label>
          <input
            type="number"
            value={es}
            onChange={(e) => setEs(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter ES value"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">RGW+ Value:</label>
          <input
            type="number"
            value={rgw}
            onChange={(e) => setRgw(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter RGW value"
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">New ABS:</span>
            <span className="text-blue-700 font-bold">{newAbs.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">New ES:</span>
            <span className="text-blue-700 font-bold">{newEs.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
            MEASUREMENT
          </span>
        </div>
        
        <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors">
          Calculate
        </button>
      </div>
    </div>
  );
};

export default AbsEsCalculator;