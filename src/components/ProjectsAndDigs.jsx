import React from "react";
import { Link } from "react-router-dom";

const pipelineCompanies = [
  { name: "Williams", id: "williams" },
  { name: "NWP", id: "nwp" },
  { name: "Southern Star", id: "southernstar" },
  { name: "Dyno", id: "dyno" },
  { name: "Boardwalk", id: "boardwalk" },
  { name: "Mountain West Pipe", id: "mountainwestpipe" },
];

const ProjectsAndDigs = () => {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-primary text-primary-content p-6 rounded-t-lg">
        <h1 className="text-2xl font-bold">Projects / Digs</h1>
        <p className="mt-1">Select a pipeline company to view projects</p>
      </div>

      {/* Search Bar Section */}
      <div className="bg-base-100 p-4 border-b border-base-300">
        <div className="join w-full">
          <div className="join-item btn btn-neutral">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input 
            type="text" 
            className="input input-bordered join-item w-full" 
            placeholder="Search companies..."
          />
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="p-6 bg-base-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pipelineCompanies.map((company) => (
            <Link
              key={company.id}
              to={`/projects/${company.id}`}
              className="card bg-base-100 hover:shadow-lg transition-all"
            >
              <div className="card-body">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-md mr-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold">{company.name}</h2>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm opacity-70">Pipeline Operator</span>
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Create New Dig Button */}
      <div className="bg-base-100 p-6 flex justify-center border-t border-base-300">
        <Link to="/newdig">
          <button className="btn btn-primary">
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