import React, { useState } from "react";

const PitDepthCalculator = () => {
  const [nominalThickness, setNominalThickness] = useState(""); // Wall thickness of the pipe
  const [pitDepth, setPitDepth] = useState(""); // Depth of corrosion/pit
  const [remainingThickness, setRemainingThickness] = useState(""); // Remaining wall thickness
  const [percentageLoss, setPercentageLoss] = useState(""); // % of material loss

  const calculateFromPitDepth = () => {
    const nominal = parseFloat(nominalThickness) || 0;
    const pit = parseFloat(pitDepth) || 0;

    if (nominal <= 0 || pit < 0) {
      setRemainingThickness("Invalid input");
      setPercentageLoss("Invalid input");
      return;
    }

    const remaining = nominal - pit;
    const loss = ((pit / nominal) * 100).toFixed(2);

    setRemainingThickness(remaining.toFixed(3)); // Display 3 decimal places
    setPercentageLoss(`${loss}%`);
  };

  const calculateFromRemainingThickness = () => {
    const nominal = parseFloat(nominalThickness) || 0;
    const remaining = parseFloat(remainingThickness) || 0;

    if (nominal <= 0 || remaining < 0) {
      setPitDepth("Invalid input");
      setPercentageLoss("Invalid input");
      return;
    }

    const pit = nominal - remaining;
    const loss = ((pit / nominal) * 100).toFixed(2);

    setPitDepth(pit.toFixed(3));
    setPercentageLoss(`${loss}%`);
  };

  const calculate = () => {
    if (pitDepth && !remainingThickness) {
      calculateFromPitDepth();
    } else if (remainingThickness && !pitDepth) {
      calculateFromRemainingThickness();
    } else if (pitDepth && remainingThickness) {
      // If both are filled, prioritize pit depth calculation
      calculateFromPitDepth();
    }
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
          <div className="bg-pink-100 p-2 rounded-md mr-3">
            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold">Pit Depth Calculator</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Measure and calculate excavation depths for accurate project planning.
        </p>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Nominal Wall Thickness (inches):</label>
          <input
            type="number"
            value={nominalThickness}
            onChange={(e) => setNominalThickness(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter wall thickness"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Pit Depth (inches):</label>
          <input
            type="number"
            value={pitDepth}
            onChange={(e) => setPitDepth(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter pit depth"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Remaining Wall Thickness (inches):</label>
          <input
            type="number"
            value={remainingThickness}
            onChange={(e) => setRemainingThickness(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter remaining thickness"
          />
        </div>
        
        {percentageLoss && (
          <div className="bg-pink-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Pit Depth:</span>
              <span className="text-pink-700 font-bold">{pitDepth} inches</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">Remaining Thickness:</span>
              <span className="text-pink-700 font-bold">{remainingThickness} inches</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Material Loss:</span>
              <span className="text-pink-700 font-bold">{percentageLoss}</span>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-md">
            MEASUREMENT
          </span>
        </div>
        
        <button 
          onClick={calculate}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Calculate
        </button>
      </div>
    </div>
  );
};

export default PitDepthCalculator;