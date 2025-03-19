import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { FaArrowLeft } from "react-icons/fa";

const DigDetails = () => {
  const { id } = useParams(); // Get the dig ID from the URL
  const [dig, setDig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDigDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("digs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setError("Dig not found.");
        } else {
          setDig(data);
        }
      } catch (err) {
        console.error("Error fetching dig details:", err);
        setError("Failed to load dig details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDigDetails();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!dig) {
    return <div className="p-4">Dig not found.</div>;
  }

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button
        onClick={goBack}
        className="flex items-center gap-2 mb-4 text-blue-500 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        {dig.project_name} - Dig #{dig.dig_number}
      </h1>

      <div className="space-y-4">
        {/* Display all dig details here */}
        <p><strong>Location:</strong> {dig.location || "N/A"}</p>
        <p><strong>Date:</strong> {new Date(dig.created_at).toLocaleDateString()}</p>
        <p><strong>Client ID:</strong> {dig.client_id || "N/A"}</p>
        <p><strong>FID:</strong> {dig.fid || "N/A"}</p>
        <p><strong>Section/Township/Range:</strong> {dig.section_township_range || "N/A"}</p>
        <p><strong>GPS Latitude:</strong> {dig.gps_latitude || "N/A"}</p>
        <p><strong>GPS Longitude:</strong> {dig.gps_longitude || "N/A"}</p>
        <p><strong>GPS Accuracy:</strong> {dig.gps_accuracy || "N/A"}</p>
        <p><strong>Joint Number:</strong> {dig.joint_number || "N/A"}</p>
        <p><strong>Wall Thickness:</strong> {dig.wall_thickness || "N/A"}</p>
        <p><strong>Outside Diameter:</strong> {dig.od || "N/A"}</p>
        <p><strong>Anomaly Type:</strong> {dig.anomaly_type || "N/A"}</p>
        <p><strong>RGW+:</strong> {dig.rgw_plus || "N/A"}</p>
        <p><strong>Length:</strong> {dig.length || "N/A"}</p>
        <p><strong>Width:</strong> {dig.width || "N/A"}</p>
        <p><strong>Depth:</strong> {dig.depth || "N/A"}</p>
        <p><strong>ABS ESN:</strong> {dig.abs_esn || "N/A"}</p>
        <p><strong>Depth Percentage:</strong> {dig.depth_percentage || "N/A"}</p>
        <p><strong>Repair Type:</strong> {dig.repair_type || "N/A"}</p>
        <p><strong>Repair Date:</strong> {dig.repair_date || "N/A"}</p>
        <p><strong>Repair Start:</strong> {dig.repair_start || "N/A"}</p>
        <p><strong>Repair End:</strong> {dig.repair_end || "N/A"}</p>
        <p><strong>Material Verification:</strong> {dig.material_verification ? "Yes" : "No"}</p>
        <p><strong>Carbon Equivalency:</strong> {dig.carbon_equivalency ? "Yes" : "No"}</p>
        <p><strong>PRCI 4C Method:</strong> {dig.prci_4c_method ? "Yes" : "No"}</p>
        <p><strong>Frontics:</strong> {dig.frontics ? "Yes" : "No"}</p>
        <p><strong>Start Excavation:</strong> {dig.start_excavation || "N/A"}</p>
        <p><strong>Start Coating:</strong> {dig.start_coating || "N/A"}</p>
        <p><strong>End Coating:</strong> {dig.end_coating || "N/A"}</p>
        <p><strong>End Excavation:</strong> {dig.end_excavation || "N/A"}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default DigDetails;