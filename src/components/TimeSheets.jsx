import React from 'react';
import { Link } from 'react-router-dom';

const Timesheets = ({ timesheets = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timesheets</h1>
      {timesheets.length === 0 ? (
        <p className="text-gray-600">No timesheets available.</p>
      ) : (
        <ul className="space-y-4">
          {timesheets.map((sheet) => (
            <li
              key={sheet.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">
                  Employee: {sheet.employeeName}
                </h2>
                <p className="text-gray-600">Date: {sheet.date}</p>
                <p className="text-gray-600">
                  Hours Worked: {sheet.hours}
                </p>
              </div>
              <Link
                to={`/timesheets/${sheet.id}`}
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

export default Timesheets;
