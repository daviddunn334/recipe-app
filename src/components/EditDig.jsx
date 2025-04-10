import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabase";
import { FaSave, FaTimes, FaTrash } from "react-icons/fa";

const EditDig = () => {
  const { id } = useParams(); // Get dig ID from URL
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch dig details and client list
  useEffect(() => {
    const fetchDigData = async () => {
      setLoading(true);
      try {
        // Fetch dig data
        const { data: digData, error: digError } = await supabase
          .from("digs")
          .select("*")
          .eq("id", id)
          .single();

        if (digError) throw digError;
        setFormData(digData);

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

        // Fetch client list
        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("id, name")
          .order("name");

        if (clientsError) throw clientsError;
        setClients(clientsData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dig data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDigData();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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

  // Update dig in Supabase
  const handleUpdate = async () => {
    setError("");
    setSuccess("");

    // Validate required fields
    if (!formData.project_name || !formData.dig_number) {
      setError("Project Name and Dig Number are required.");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...formData,
        photos: photos.map((photo) => photo.path),
      };

      const { error } = await supabase
        .from("digs")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setSuccess("Dig updated successfully!");
      setTimeout(() => navigate("/reporting"), 1500);
    } catch (err) {
      console.error("Error updating dig:", err);
      setError(`Failed to update dig: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-lg rounded">
      <h1 className="text-2xl font-bold text-primary mb-4">Edit Dig</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Project Name"
              required
            />
            <input
              type="text"
              name="dig_number"
              value={formData.dig_number}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Dig Number"
              required
            />
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="input input-bordered w-full"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Location Information</h2>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Location Description"
          />
          <input
            type="text"
            name="section_township_range"
            value={formData.section_township_range}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Section/Township/Range"
          />
        </div>

        {/* Pipe & Repair Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">
            Pipe & Repair Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="fid"
              value={formData.fid}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="FID"
            />
            <input
              type="text"
              name="joint_number"
              value={formData.joint_number}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Joint Number"
            />
            <input
              type="text"
              name="repair_type"
              value={formData.repair_type}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Repair Type"
            />
          </div>
        </div>

        {/* Repair Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="datetime-local"
            name="start_excavation"
            value={formData.start_excavation}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          <input
            type="datetime-local"
            name="end_excavation"
            value={formData.end_excavation}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
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
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/reporting")}
            className="btn btn-secondary"
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={loading}
            className="btn btn-primary"
          >
            <FaSave /> {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDig;
