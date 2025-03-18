import React from 'react';
import { Link } from 'react-router-dom';

const Reporting = ({ reports = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reporting</h1>
      {reports.length === 0 ? (
        <p className="text-gray-600">No reports available.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{report.title}</h2>
                <p className="text-gray-600">Date: {report.date}</p>
                <p className="text-gray-600">Status: {report.status}</p>
              </div>
              <Link to={`/reports/${report.id}`} className="text-blue-500 hover:underline">
                View Report
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reporting;
