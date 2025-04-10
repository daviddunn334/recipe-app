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

  // Helper function to get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'badge badge-success';
      case 'in_progress':
        return 'badge badge-warning';
      default:
        return 'badge badge-info';
    }
  };

  // Helper function to get formatted status text
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Planned';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-content mb-1">Saved Digs</h1>
              <p className="text-primary-content/80">View and manage your excavation reports</p>
            </div>
            <Link 
              to="/reporting/new" 
              className="mt-4 md:mt-0 btn btn-primary btn-outline bg-base-100"
            >
              <FaPlus className="mr-2" /> New Dig
            </Link>
          </div>
        </div>

        <div className="p-6 border-b border-base-300">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-base-content/50" />
              </div>
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="Search by project name, location or dig number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center w-full md:w-auto">
              <div className="flex items-center mr-4">
                <FaFilter className="mr-2 text-base-content/50" />
                <span className="text-base-content">Filter:</span>
              </div>
              <select
                className="select select-bordered w-full"
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

        <div className="card-body">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredDigs.length === 0 ? (
            <div className="text-center py-12">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-base-content/40" />
              <h3 className="mt-2 text-lg font-medium">No digs found</h3>
              <p className="mt-1 text-base-content/70">
                {digs.length === 0 
                  ? "No digs are available. Create your first dig to get started."
                  : "No digs match your current search or filter criteria."}
              </p>
              {digs.length === 0 && (
                <div className="mt-6">
                  <Link
                    to="/reporting/new"
                    className="btn btn-primary"
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
                  className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="card-title">
                          {dig.project_name}
                        </h2>
                        <p className="text-primary font-medium">Dig #{dig.dig_number}</p>
                      </div>
                      {dig.status && (
                        <span className={getStatusBadge(dig.status)}>
                          {getStatusText(dig.status)}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 space-y-2">
                      {dig.location && (
                        <div className="flex items-start">
                          <span className="text-base-content/70 mr-2">Location:</span>
                          <span>{dig.location}</span>
                        </div>
                      )}
                      <div className="flex items-start">
                        <span className="text-base-content/70 mr-2">Date:</span>
                        <span>
                          {new Date(dig.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {dig.notes && (
                        <div className="flex items-start">
                          <span className="text-base-content/70 mr-2">Notes:</span>
                          <span className="line-clamp-2">{dig.notes}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <Link
                        to={`/reporting/edit/${dig.id}`}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        <FaEdit className="mr-2" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteDig(dig.id)}
                        className="btn btn-sm btn-outline btn-error"
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
            <div className="mt-6 text-sm text-base-content/70 text-right">
              Showing {filteredDigs.length} of {digs.length} digs
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reporting;