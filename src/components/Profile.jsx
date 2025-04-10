import { useState, useRef } from "react";
import { FaUser, FaFileUpload, FaTrash, FaFileAlt } from "react-icons/fa";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    age: 32,
    title: "NDT Level II Technician",
    email: "john.doe@ndtcompany.com",
    phone: "(555) 123-4567",
    profileImage: null,
    certifications: [
      { id: 1, name: "UT Level II", expiration: "2026-05-15", document: null },
      { id: 2, name: "PT Level II", expiration: "2025-08-22", document: null },
    ],
  });

  const profileImageRef = useRef();
  const certDocRef = useRef();
  const [newCert, setNewCert] = useState({ name: "", expiration: "" });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile((prev) => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertDocUpload = (e, certId) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        certifications: prev.certifications.map((cert) =>
          cert.id === certId ? { ...cert, document: file.name } : cert
        ),
      }));
    }
  };

  const addCertification = () => {
    if (newCert.name && newCert.expiration) {
      const newId = Math.max(0, ...profile.certifications.map((c) => c.id)) + 1;
      setProfile((prev) => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          { id: newId, name: newCert.name, expiration: newCert.expiration, document: null },
        ],
      }));
      setNewCert({ name: "", expiration: "" });
    }
  };

  const removeCertification = (id) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  const viewDocument = (certId) => {
    alert(`Viewing document for certification ID: ${certId}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-6">Employee Profile</h1>

      {/* Profile Card */}
      <div className="card bg-base-100 shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="avatar">
              <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-base-300">
                    <FaUser className="text-neutral-content text-6xl" />
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => profileImageRef.current.click()}
              className="btn btn-primary mt-4"
            >
              <FaFileUpload /> Upload Photo
            </button>
            <input
              type="file"
              ref={profileImageRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* Personal Info Section */}
          <div className="w-full md:w-2/3">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "age", "title", "phone", "email"].map((field, index) => (
                <div key={index}>
                  <label className="label text-base-content">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === "age" ? "number" : "text"}
                    name={field}
                    value={profile[field]}
                    onChange={handleProfileChange}
                    className="input input-bordered w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div className="card bg-base-100 shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Certifications</h2>

        {/* Existing Certifications */}
        {profile.certifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Certification</th>
                  <th>Expiration Date</th>
                  <th>Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {profile.certifications.map((cert) => (
                  <tr key={cert.id}>
                    <td>🏆 {cert.name}</td>
                    <td>{new Date(cert.expiration).toLocaleDateString()}</td>
                    <td>
                      {cert.document ? (
                        <button onClick={() => viewDocument(cert.id)} className="btn btn-sm btn-primary">
                          <FaFileAlt /> {cert.document}
                        </button>
                      ) : (
                        <button
                          onClick={() => document.getElementById(`cert-doc-${cert.id}`).click()}
                          className="btn btn-sm btn-secondary"
                        >
                          <FaFileUpload /> Upload PDF
                        </button>
                      )}
                      <input
                        type="file"
                        id={`cert-doc-${cert.id}`}
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => handleCertDocUpload(e, cert.id)}
                      />
                    </td>
                    <td>
                      <button onClick={() => removeCertification(cert.id)} className="btn btn-sm btn-error">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No certifications added yet.</p>
        )}

        {/* Add New Certification */}
        <div className="border-t pt-4 mt-4">
          <h3 className="font-medium mb-3">Add New Certification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Certification Name"
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
              className="input input-bordered"
            />
            <input
              type="date"
              value={newCert.expiration}
              onChange={(e) => setNewCert({ ...newCert, expiration: e.target.value })}
              className="input input-bordered"
            />
            <button onClick={addCertification} className="btn btn-success w-full">
              Add Certification
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button className="btn btn-primary">Save Profile</button>
      </div>
    </div>
  );
};

export default ProfilePage;
