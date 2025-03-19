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

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Pit Depth Calculator</h1>

      {/* Nominal Wall Thickness Input */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Nominal Wall Thickness (inches):</label>
        <input
          type="number"
          value={nominalThickness}
          onChange={(e) => setNominalThickness(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter wall thickness"
        />
      </div>

      {/* Pit Depth Input */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Pit Depth (inches):</label>
        <input
          type="number"
          value={pitDepth}
          onChange={(e) => setPitDepth(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter pit depth"
        />
        <button
          onClick={calculateFromPitDepth}
          className="w-full bg-blue-500 text-white py-2 rounded mt-2 hover:bg-blue-600"
        >
          Calculate Remaining Thickness
        </button>
      </div>

      {/* Remaining Wall Thickness Input */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Remaining Wall Thickness (inches):</label>
        <input
          type="number"
          value={remainingThickness}
          onChange={(e) => setRemainingThickness(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter remaining thickness"
        />
        <button
          onClick={calculateFromRemainingThickness}
          className="w-full bg-green-500 text-white py-2 rounded mt-2 hover:bg-green-600"
        >
          Calculate Pit Depth
        </button>
      </div>

      {/* Results */}
      {percentageLoss && (
        <div className="mt-4 text-lg font-semibold">
          Percentage Loss: <span className="text-red-600">{percentageLoss}</span>
        </div>
      )}
    </div>
  );
};

export default PitDepthCalculator;
