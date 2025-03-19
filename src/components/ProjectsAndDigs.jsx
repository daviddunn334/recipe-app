import React from "react";
import { Link } from "react-router-dom";

const pipelineCompanies = [
  { name: "Williams", id: "williams" },
  { name: "Transco", id: "transco" },
  { name: "Kinder Morgan", id: "kinder-morgan" },
  { name: "Enbridge", id: "enbridge" },
  { name: "TC Energy", id: "tc-energy" },
  { name: "Enterprise", id: "enterprise" },
];

const ProjectsAndDigs = () => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-indigo-600 text-white p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold">Projects / Digs</h1>
        <p className="mt-1">Select a pipeline company to view projects</p>
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
            placeholder="Search companies..."
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineCompanies.map((company) => (
            <Link
              key={company.id}
              to={`/projects/${company.id}`}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-md mr-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">{company.name}</h2>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Pipeline Operator</span>
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Create New Dig Button */}
      <div className="bg-white p-6 flex justify-center border-t">
        <Link to="/newdig">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md transition-colors flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Dig
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProjectsAndDigs;