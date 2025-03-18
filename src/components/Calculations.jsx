import React from 'react';
import { Link } from 'react-router-dom';

const Calculations = ({ calculations = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculations</h1>
      {calculations.length === 0 ? (
        <p className="text-gray-600">No calculations available.</p>
      ) : (
        <ul className="space-y-4">
          {calculations.map((calc) => (
            <li
              key={calc.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{calc.title}</h2>
                <p className="text-gray-600">Result: {calc.result}</p>
              </div>
              <Link
                to={`/calculations/${calc.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Calculations;
