import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../supabase";
import {
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
  FaCamera,
  FaTrash,
} from "react-icons/fa";

const isDevelopment = import.meta.env.MODE === "development";

const NewDig = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the dig ID from URL if editing
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

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
          const { data: userData, error: userError } =
            await supabase.auth.getUser();
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

  // Fetch dig data if editing
  useEffect(() => {
    const fetchDigData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const { data: digData, error: digError } = await supabase
          .from("digs")
          .select("*")
          .eq("id", id)
          .single();

        if (digError) throw digError;

        // Set form data
        setFormData(digData);
        setIsEditing(true);

        // Load existing photos
        if (digData.photos && digData.photos.length > 0) {
          const photoUrls = await Promise.all(
            digData.photos.map(async (photoPath) => {
              const {
                data: { publicUrl },
              } = supabase.storage.from("dig-photos").getPublicUrl(photoPath);
              return {
                url: publicUrl,
                path: photoPath,
              };
            })
          );
          setPhotos(photoUrls);
        }
      } catch (err) {
        console.error("Error fetching dig data:", err);
        setError("Failed to load dig data");
      } finally {
        setLoading(false);
      }
    };

    fetchDigData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const newValue =
      type === "checkbox"
        ? checked
        : [
            "wall_thickness",
            "od",
            "rgw_plus",
            "length",
            "width",
            "depth",
            "abs_esn",
            "depth_percentage",
            "repair_start",
            "repair_end",
            "gps_latitude",
            "gps_longitude",
            "gps_accuracy",
          ].includes(name) && value !== ""
        ? parseFloat(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Try to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            gps_latitude: position.coords.latitude,
            gps_longitude: position.coords.longitude,
            gps_accuracy: position.coords.accuracy
              ? position.coords.accuracy
              : null,
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
    const numberFields = [
      "wall_thickness",
      "od",
      "rgw_plus",
      "length",
      "width",
      "depth",
      "abs_esn",
      "depth_percentage",
      "repair_start",
      "repair_end",
    ];

    for (const field of numberFields) {
      if (formData[field] && isNaN(parseFloat(formData[field]))) {
        setError(`${field.replace("_", " ")} must be a valid number.`);
        return false;
      }
    }

    // Validate GPS coordinates if provided
    if (
      (formData.gps_latitude && !formData.gps_longitude) ||
      (!formData.gps_latitude && formData.gps_longitude)
    ) {
      setError("Both latitude and longitude must be provided together.");
      return false;
    }

    if (
      formData.gps_latitude &&
      (formData.gps_latitude < -90 || formData.gps_latitude > 90)
    ) {
      setError("Latitude must be between -90 and 90 degrees.");
      return false;
    }

    if (
      formData.gps_longitude &&
      (formData.gps_longitude < -180 || formData.gps_longitude > 180)
    ) {
      setError("Longitude must be between -180 and 180 degrees.");
      return false;
    }

    return true;
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${formData.dig_number}/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("dig-photos")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("dig-photos").getPublicUrl(filePath);

        setPhotos((prev) => [
          ...prev,
          {
            url: publicUrl,
            path: filePath,
          },
        ]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload photos");
    } finally {
      setUploading(false);
    }
  };

  // Handle photo deletion
  const handleDeletePhoto = async (photoPath) => {
    try {
      const { error } = await supabase.storage
        .from("dig-photos")
        .remove([photoPath]);

      if (error) throw error;

      setPhotos((prev) => prev.filter((photo) => photo.path !== photoPath));
    } catch (error) {
      console.error("Error deleting photo:", error);
      setError("Failed to delete photo");
    }
  };

  // Modify handleCreateDig to handle both create and update
  const handleCreateDig = async () => {
    setError("");
    if (!validateForm()) return;

    setLoading(true);

    try {
      const insertData = {
        ...formData,
        created_by_user: userId,
        photos: photos.map((photo) => photo.path),
      };

      // Remove empty strings to allow for NULL values in database
      Object.keys(insertData).forEach((key) => {
        if (insertData[key] === "") {
          insertData[key] = null;
        }
      });

      let error;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("digs")
          .update(insertData)
          .eq("id", id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("digs")
          .insert([insertData]);
        error = insertError;
      }

      if (error) throw error;

      navigate("/reporting");
    } catch (err) {
      console.error("Error saving dig:", err);
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
    <div className="card card-compact w-full max-w-4xl mx-auto shadow-xl bg-base-100">
      <div className="card-body">
        <h1 className="card-title text-2xl">Create New Dig</h1>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        )}

        <form className="space-y-6">
          {/* Basic Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Project Name*
                    </span>
                  </label>
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Dig Number*</span>
                  </label>
                  <input
                    type="text"
                    name="dig_number"
                    value={formData.dig_number}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter dig number"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Client</span>
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">FID</span>
                  </label>
                  <input
                    type="text"
                    name="fid"
                    value={formData.fid}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter FID"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Location Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Location Description
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Describe the location"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Section/Township/Range
                    </span>
                  </label>
                  <input
                    type="text"
                    name="section_township_range"
                    value={formData.section_township_range}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter STR information"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text font-medium">
                        GPS Latitude
                      </span>
                    </label>
                    <input
                      type="number"
                      name="gps_latitude"
                      value={formData.gps_latitude}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Decimal degrees"
                      step="any"
                    />
                  </div>

                  <div className="form-control flex-1">
                    <label className="label">
                      <span className="label-text font-medium">
                        GPS Longitude
                      </span>
                    </label>
                    <input
                      type="number"
                      name="gps_longitude"
                      value={formData.gps_longitude}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Decimal degrees"
                      step="any"
                    />
                  </div>

                  <div className="self-end mb-2">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="btn btn-primary h-12"
                      title="Get Current Location"
                    >
                      <FaMapMarkerAlt />
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      GPS Accuracy (meters)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="gps_accuracy"
                    value={formData.gps_accuracy}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Accuracy in meters"
                    step="any"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pipe & Anomaly Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Pipe & Anomaly Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Joint Number</span>
                  </label>
                  <input
                    type="text"
                    name="joint_number"
                    value={formData.joint_number}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter joint number"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Wall Thickness (in)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="wall_thickness"
                    value={formData.wall_thickness}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter wall thickness"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Outside Diameter (in)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="od"
                    value={formData.od}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter OD"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Anomaly Type</span>
                  </label>
                  <select
                    name="anomaly_type"
                    value={formData.anomaly_type}
                    onChange={handleChange}
                    className="select select-bordered w-full"
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">RGW+ (in)</span>
                  </label>
                  <input
                    type="number"
                    name="rgw_plus"
                    value={formData.rgw_plus}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter RGW+"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Length (in)</span>
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter length"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Width (in)</span>
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter width"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Depth (in)</span>
                  </label>
                  <input
                    type="number"
                    name="depth"
                    value={formData.depth}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter depth"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">ABS ESN</span>
                  </label>
                  <input
                    type="number"
                    name="abs_esn"
                    value={formData.abs_esn}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter ABS ESN"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Depth Percentage (%)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="depth_percentage"
                    value={formData.depth_percentage}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter depth percentage"
                    step="any"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Repair Information */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Repair Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Repair Type</span>
                  </label>
                  <select
                    name="repair_type"
                    value={formData.repair_type}
                    onChange={handleChange}
                    className="select select-bordered w-full"
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Repair Date</span>
                  </label>
                  <input
                    type="date"
                    name="repair_date"
                    value={formData.repair_date}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Repair Start (o'clock)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="repair_start"
                    value={formData.repair_start}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter repair start position"
                    step="any"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Repair End (o'clock)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="repair_end"
                    value={formData.repair_end}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    placeholder="Enter repair end position"
                    step="any"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Testing Methods</h3>
                  <div className="space-y-2">
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input
                          type="checkbox"
                          name="material_verification"
                          checked={formData.material_verification}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text">
                          Material Verification
                        </span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input
                          type="checkbox"
                          name="carbon_equivalency"
                          checked={formData.carbon_equivalency}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Carbon Equivalency</span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input
                          type="checkbox"
                          name="prci_4c_method"
                          checked={formData.prci_4c_method}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text">PRCI 4C Method</span>
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer justify-start gap-2">
                        <input
                          type="checkbox"
                          name="frontics"
                          checked={formData.frontics}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                        />
                        <span className="label-text">Frontics</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Timeline</h3>
                  <div className="space-y-3">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Start Excavation</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="start_excavation"
                        value={formData.start_excavation}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Start Coating</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="start_coating"
                        value={formData.start_coating}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">End Coating</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="end_coating"
                        value={formData.end_coating}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">End Excavation</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="end_excavation"
                        value={formData.end_excavation}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-lg">Photos</h2>

              {/* Photo Upload Button */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Upload Photos</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered w-full"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="mt-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="ml-2">Uploading...</span>
                  </div>
                )}
              </div>

              {/* Photo Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.url}
                      alt={`Dig photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.path)}
                      className="absolute top-2 right-2 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateDig}
              disabled={loading}
              className={`btn btn-primary ${loading ? "loading" : ""}`}
            >
              <FaSave className="mr-2" /> {loading ? "Saving..." : "Save Dig"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDig;
