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
      <div className="card-body p-2 sm:p-4">
        <h1 className="card-title text-xl sm:text-2xl mb-2 sm:mb-4">
          Create New Dig
        </h1>

        {error && (
          <div className="alert alert-error text-sm sm:text-base">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success text-sm sm:text-base">
            <span>{success}</span>
          </div>
        )}

        <form className="space-y-3 sm:space-y-6">
          {/* Basic Information */}
          <div className="card bg-base-200">
            <div className="card-body p-2 sm:p-4">
              <h2 className="card-title text-base sm:text-lg mb-2">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm sm:text-base">
                      Project Name*
                    </span>
                  </label>
                  <input
                    type="text"
                    name="project_name"
                    value={formData.project_name}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm sm:text-base"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm sm:text-base">
                      Dig Number*
                    </span>
                  </label>
                  <input
                    type="text"
                    name="dig_number"
                    value={formData.dig_number}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm sm:text-base"
                    placeholder="Enter dig number"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm sm:text-base">
                      Client
                    </span>
                  </label>
                  <select
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="select select-bordered w-full text-sm sm:text-base"
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
                  <label className="label py-1">
                    <span className="label-text text-sm sm:text-base">FID</span>
                  </label>
                  <input
                    type="text"
                    name="fid"
                    value={formData.fid}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm sm:text-base"
                    placeholder="Enter FID"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="card bg-base-200">
            <div className="card-body p-2 sm:p-4">
              <h2 className="card-title text-base sm:text-lg mb-2">
                Location Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm sm:text-base">
                      Location Description
                    </span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm sm:text-base"
                    placeholder="Describe the location"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-sm sm:text-base">
                      Section/Township/Range
                    </span>
                  </label>
                  <input
                    type="text"
                    name="section_township_range"
                    value={formData.section_township_range}
                    onChange={handleChange}
                    className="input input-bordered w-full text-sm sm:text-base"
                    placeholder="Enter STR information"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="form-control flex-1">
                      <label className="label py-1">
                        <span className="label-text text-sm sm:text-base">
                          GPS Latitude
                        </span>
                      </label>
                      <input
                        type="number"
                        name="gps_latitude"
                        value={formData.gps_latitude}
                        onChange={handleChange}
                        className="input input-bordered w-full text-sm sm:text-base"
                        placeholder="Decimal degrees"
                        step="any"
                      />
                    </div>

                    <div className="form-control flex-1">
                      <label className="label py-1">
                        <span className="label-text text-sm sm:text-base">
                          GPS Longitude
                        </span>
                      </label>
                      <input
                        type="number"
                        name="gps_longitude"
                        value={formData.gps_longitude}
                        onChange={handleChange}
                        className="input input-bordered w-full text-sm sm:text-base"
                        placeholder="Decimal degrees"
                        step="any"
                      />
                    </div>

                    <div className="self-end mb-2">
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="btn btn-primary h-12 w-12 sm:w-auto"
                        title="Get Current Location"
                      >
                        <FaMapMarkerAlt className="text-lg" />
                        <span className="hidden sm:inline ml-2">
                          Get Location
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="card bg-base-200">
            <div className="card-body p-2 sm:p-4">
              <h2 className="card-title text-base sm:text-lg mb-2">Photos</h2>

              {/* Photo Upload Button */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-sm sm:text-base">
                    Upload Photos
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="file-input file-input-bordered w-full text-sm sm:text-base"
                  disabled={uploading}
                />
                {uploading && (
                  <div className="mt-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="ml-2 text-sm sm:text-base">
                      Uploading...
                    </span>
                  </div>
                )}
              </div>

              {/* Photo Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 mt-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo.url}
                      alt={`Dig photo ${index + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.path)}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 btn btn-sm btn-circle btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-xs sm:text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline w-full sm:w-auto"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>

            <button
              type="button"
              onClick={handleCreateDig}
              disabled={loading}
              className={`btn btn-primary w-full sm:w-auto ${
                loading ? "loading" : ""
              }`}
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
