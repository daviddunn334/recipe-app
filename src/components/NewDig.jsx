import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa";

const isDevelopment = import.meta.env.MODE === "development";

const NewDig = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    client_id: "",
    project_name: "",
    dig_number: "",
    location: "",
    gps_latitude: "",
    gps_longitude: "",
    gps_accuracy: "",
    section_township_range: "",
    fid: "",
    joint_number: "",
    wall_thickness: "",
    od: "",
    anomaly_type: "",
    rgw_plus: "",
    length: "",
    width: "",
    depth: "",
    abs_esn: "",
    depth_percentage: "",
    repair_type: "",
    repair_start: "",
    repair_end: "",
    repair_date: "",
    material_verification: false,
    carbon_equivalency: false,
    prci_4c_method: false,
    frontics: false,
    start_excavation: "",
    start_coating: "",
    end_coating: "",
    end_excavation: "",
  });

  // Fetch authenticated user and client list on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch user
        if (isDevelopment) {
          setUserId(null);
        } else {
          const { data: userData, error: userError } = await supabase.auth.getUser();
          if (userError) throw userError;
          setUserId(userData.user?.id);
        }

        // Fetch clients for dropdown
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("id, name")
          .order("name");
        
        if (clientsError) throw clientsError;
        setClients(clientsData || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === "checkbox" 
      ? checked 
      : ["wall_thickness", "od", "rgw_plus", "length", "width", "depth", "abs_esn", 
         "depth_percentage", "repair_start", "repair_end", "gps_latitude", 
         "gps_longitude", "gps_accuracy"].includes(name) && value !== "" 
        ? parseFloat(value) 
        : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  // Try to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            gps_latitude: position.coords.latitude,
            gps_longitude: position.coords.longitude,
            gps_accuracy: position.coords.accuracy ? position.coords.accuracy : null
          }));
          setSuccess("GPS location acquired");
          
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(""), 3000);
        },
        (err) => {
          console.error("Error getting location:", err);
          setError("Could not get your location. Please enter manually.");
          
          // Clear error message after 5 seconds
          setTimeout(() => setError(""), 5000);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  // Form validation
  const validateForm = () => {
    // Required fields
    if (!formData.project_name || !formData.dig_number) {
      setError("Project Name and Dig Number are required.");
      return false;
    }

    // Number validations
    const numberFields = ["wall_thickness", "od", "rgw_plus", "length", "width", "depth", 
                          "abs_esn", "depth_percentage", "repair_start", "repair_end"];
    
    for (const field of numberFields) {
      if (formData[field] && isNaN(parseFloat(formData[field]))) {
        setError(`${field.replace('_', ' ')} must be a valid number.`);
        return false;
      }
    }

    // Validate GPS coordinates if provided
    if ((formData.gps_latitude && !formData.gps_longitude) || 
        (!formData.gps_latitude && formData.gps_longitude)) {
      setError("Both latitude and longitude must be provided together.");
      return false;
    }

    if (formData.gps_latitude && 
        (formData.gps_latitude < -90 || formData.gps_latitude > 90)) {
      setError("Latitude must be between -90 and 90 degrees.");
      return false;
    }

    if (formData.gps_longitude && 
        (formData.gps_longitude < -180 || formData.gps_longitude > 180)) {
      setError("Longitude must be between -180 and 180 degrees.");
      return false;
    }

    return true;
  };

  // Save new dig to Supabase
  const handleCreateDig = async () => {
    // Clear previous error
    setError("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for insertion
      const insertData = {
        ...formData,
        created_by_user: userId,
      };

      // Remove empty strings to allow for NULL values in database
      Object.keys(insertData).forEach(key => {
        if (insertData[key] === "") {
          insertData[key] = null;
        }
      });

      // Insert data
      const { error: insertError } = await supabase.from("digs").insert([insertData]);

      if (insertError) throw insertError;

      // Success - navigate to reporting page
      navigate("/reporting");
    } catch (err) {
      console.error("Error creating dig:", err);
      setError(`Failed to save dig: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Cancel and go back
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create New Dig</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Project Name*</label>
              <input
                type="text"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter project name"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Dig Number*</label>
              <input
                type="text"
                name="dig_number"
                value={formData.dig_number}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter dig number"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Client</label>
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">FID</label>
              <input
                type="text"
                name="fid"
                value={formData.fid}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter FID"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Location Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Location Description</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Describe the location"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Section/Township/Range</label>
              <input
                type="text"
                name="section_township_range"
                value={formData.section_township_range}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter STR information"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block mb-1 font-medium">GPS Latitude</label>
                <input
                  type="number"
                  name="gps_latitude"
                  value={formData.gps_latitude}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Decimal degrees"
                  step="any"
                />
              </div>
              
              <div className="flex-1">
                <label className="block mb-1 font-medium">GPS Longitude</label>
                <input
                  type="number"
                  name="gps_longitude"
                  value={formData.gps_longitude}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Decimal degrees"
                  step="any"
                />
              </div>
              
              <div className="self-end mb-[2px]">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="h-10 px-3 bg-blue-500 text-white rounded hover:bg-blue-600"
                  title="Get Current Location"
                >
                  <FaMapMarkerAlt />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block mb-1 font-medium">GPS Accuracy (meters)</label>
              <input
                type="number"
                name="gps_accuracy"
                value={formData.gps_accuracy}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Accuracy in meters"
                step="any"
              />
            </div>
          </div>
        </div>

        {/* Pipe & Anomaly Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Pipe & Anomaly Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium">Joint Number</label>
              <input
                type="text"
                name="joint_number"
                value={formData.joint_number}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter joint number"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Wall Thickness (in)</label>
              <input
                type="number"
                name="wall_thickness"
                value={formData.wall_thickness}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter wall thickness"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Outside Diameter (in)</label>
              <input
                type="number"
                name="od"
                value={formData.od}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter OD"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Anomaly Type</label>
              <select
                name="anomaly_type"
                value={formData.anomaly_type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select anomaly type</option>
                <option value="Metal Loss">Metal Loss</option>
                <option value="Dent">Dent</option>
                <option value="Crack">Crack</option>
                <option value="Gouge">Gouge</option>
                <option value="Wrinkle">Wrinkle</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">RGW+ (in)</label>
              <input
                type="number"
                name="rgw_plus"
                value={formData.rgw_plus}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter RGW+"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Length (in)</label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter length"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Width (in)</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter width"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Depth (in)</label>
              <input
                type="number"
                name="depth"
                value={formData.depth}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter depth"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">ABS ESN</label>
              <input
                type="number"
                name="abs_esn"
                value={formData.abs_esn}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter ABS ESN"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Depth Percentage (%)</label>
              <input
                type="number"
                name="depth_percentage"
                value={formData.depth_percentage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter depth percentage"
                step="any"
              />
            </div>
          </div>
        </div>

        {/* Repair Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Repair Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Repair Type</label>
              <select
                name="repair_type"
                value={formData.repair_type}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select repair type</option>
                <option value="Sleeve">Sleeve</option>
                <option value="Cut Out">Cut Out</option>
                <option value="Composite">Composite</option>
                <option value="Grind">Grind</option>
                <option value="Weld">Weld</option>
                <option value="None">None</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Repair Date</label>
              <input
                type="date"
                name="repair_date"
                value={formData.repair_date}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Repair Start (o'clock)</label>
              <input
                type="number"
                name="repair_start"
                value={formData.repair_start}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter repair start position"
                step="any"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Repair End (o'clock)</label>
              <input
                type="number"
                name="repair_end"
                value={formData.repair_end}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Enter repair end position"
                step="any"
              />
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Testing Methods</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="material_verification"
                    checked={formData.material_verification}
                    onChange={handleChange}
                    className="rounded text-blue-600"
                  />
                  <span>Material Verification</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="carbon_equivalency"
                    checked={formData.carbon_equivalency}
                    onChange={handleChange}
                    className="rounded text-blue-600"
                  />
                  <span>Carbon Equivalency</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="prci_4c_method"
                    checked={formData.prci_4c_method}
                    onChange={handleChange}
                    className="rounded text-blue-600"
                  />
                  <span>PRCI 4C Method</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="frontics"
                    checked={formData.frontics}
                    onChange={handleChange}
                    className="rounded text-blue-600"
                  />
                  <span>Frontics</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Timeline</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm">Start Excavation</label>
                  <input
                    type="datetime-local"
                    name="start_excavation"
                    value={formData.start_excavation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm">Start Coating</label>
                  <input
                    type="datetime-local"
                    name="start_coating"
                    value={formData.start_coating}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm">End Coating</label>
                  <input
                    type="datetime-local"
                    name="end_coating"
                    value={formData.end_coating}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm">End Excavation</label>
                  <input
                    type="datetime-local"
                    name="end_excavation"
                    value={formData.end_excavation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-2"
          >
            <FaTimes /> Cancel
          </button>
          
          <button
            type="button"
            onClick={handleCreateDig}
            disabled={loading}
            className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <FaSave /> {loading ? "Saving..." : "Save Dig"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewDig;

