import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../supabase";
import { FaTrash, FaEdit, FaPlus, FaSearch, FaFilter, FaExclamationTriangle } from "react-icons/fa";

const Reporting = () => {
  const [digs, setDigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch all digs from Supabase
  useEffect(() => {
    const fetchDigs = async () => {
      const { data, error } = await supabase
        .from("digs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching digs:", error);
      } else {
        setDigs(data);
      }
      setLoading(false);
    };

    fetchDigs();
  }, []);

  // Delete a dig from Supabase
  const handleDeleteDig = async (id) => {
    if (window.confirm("Are you sure you want to delete this dig?")) {
      setLoading(true);
      const { error } = await supabase.from("digs").delete().eq("id", id);

      if (error) {
        console.error("Error deleting dig:", error);
      } else {
        setDigs(digs.filter((dig) => dig.id !== id));
      }
      setLoading(false);
    }
  };

  // Filter digs based on search term and status filter
  const filteredDigs = digs.filter((dig) => {
    const matchesSearch = 
      dig.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dig.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dig.dig_number?.toString().includes(searchTerm);
    
    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && dig.status === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Saved Digs</h1>
              <p className="text-blue-100">View and manage your excavation reports</p>
            </div>
            <Link 
              to="/reporting/new" 
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="mr-2" /> New Dig
            </Link>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by project name, location or dig number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center w-full md:w-auto">
              <div className="flex items-center mr-4">
                <FaFilter className="mr-2 text-gray-500" />
                <span className="text-gray-700">Filter:</span>
              </div>
              <select
                className="form-select block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="planned">Planned</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredDigs.length === 0 ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No digs found</h3>
              <p className="mt-1 text-gray-500">
                {digs.length === 0 
                  ? "No digs are available. Create your first dig to get started."
                  : "No digs match your current search or filter criteria."}
              </p>
              {digs.length === 0 && (
                <div className="mt-6">
                  <Link
                    to="/reporting/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaPlus className="mr-2" /> Create New Dig
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredDigs.map((dig) => (
                <div
                  key={dig.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {dig.project_name}
                        </h2>
                        <p className="text-indigo-600 font-medium">Dig #{dig.dig_number}</p>
                      </div>
                      {dig.status && (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          dig.status === 'completed' ? 'bg-green-100 text-green-800' :
                          dig.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {dig.status === 'completed' ? 'Completed' :
                            dig.status === 'in_progress' ? 'In Progress' :
                            'Planned'}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      {dig.location && (
                        <div className="flex items-start">
                          <span className="text-gray-500 mr-2">Location:</span>
                          <span className="text-gray-900">{dig.location}</span>
                        </div>
                      )}
                      <div className="flex items-start">
                        <span className="text-gray-500 mr-2">Date:</span>
                        <span className="text-gray-900">
                          {new Date(dig.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {dig.notes && (
                        <div className="flex items-start">
                          <span className="text-gray-500 mr-2">Notes:</span>
                          <span className="text-gray-900 line-clamp-2">{dig.notes}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <Link
                        to={`/reporting/edit/${dig.id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteDig(dig.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        title="Delete Dig"
                      >
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && filteredDigs.length > 0 && (
            <div className="mt-6 text-sm text-gray-500 text-right">
              Showing {filteredDigs.length} of {digs.length} digs
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reporting;