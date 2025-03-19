import { useState, useRef } from "react";
import { FaUser, FaFileUpload, FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";

const ProfilePage = () => {
  // State for user profile data
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
    ]
  });

  // Refs for file inputs
  const profileImageRef = useRef();
  const certDocRef = useRef();

  // State for adding new certification
  const [newCert, setNewCert] = useState({
    name: "",
    expiration: ""
  });

  // Handle profile info changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          profileImage: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle certification document upload
  const handleCertDocUpload = (e, certId) => {
    const file = e.target.files[0];
    if (file) {
      setProfile(prev => ({
        ...prev,
        certifications: prev.certifications.map(cert => 
          cert.id === certId ? { ...cert, document: file.name } : cert
        )
      }));
    }
  };

  // Add new certification
  const addCertification = () => {
    if (newCert.name && newCert.expiration) {
      const newId = Math.max(0, ...profile.certifications.map(c => c.id)) + 1;
      setProfile(prev => ({
        ...prev,
        certifications: [
          ...prev.certifications,
          { id: newId, name: newCert.name, expiration: newCert.expiration, document: null }
        ]
      }));
      setNewCert({ name: "", expiration: "" });
    }
  };

  // Remove certification
  const removeCertification = (id) => {
    setProfile(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  // View document (placeholder function)
  const viewDocument = (certId) => {
    alert(`Viewing document for certification ID: ${certId}`);
    // In real application, this would open the document in a viewer or new tab
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Employee Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Image Section */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden mb-4 flex items-center justify-center">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaUser className="text-gray-400 w-20 h-20" />
              )}
            </div>
            <button 
              onClick={() => profileImageRef.current.click()}
              className="bg-blue-600 text-white py-2 px-4 rounded flex items-center gap-2"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={profile.name} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={profile.age} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={profile.title} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={profile.phone} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={profile.email} 
                  onChange={handleProfileChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Certifications Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Certifications</h2>
        
        {/* Existing Certifications */}
        <div className="mb-6">
          {profile.certifications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Certification</th>
                    <th className="px-4 py-2 text-left">Expiration Date</th>
                    <th className="px-4 py-2 text-left">Document</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.certifications.map(cert => (
                    <tr key={cert.id} className="border-t">
                      <td className="px-4 py-3">{cert.name}</td>
                      <td className="px-4 py-3">{new Date(cert.expiration).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {cert.document ? (
                          <button 
                            onClick={() => viewDocument(cert.id)}
                            className="text-blue-600 flex items-center gap-1"
                          >
                            <FaFileAlt /> {cert.document}
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              certDocRef.current = { certId: cert.id };
                              document.getElementById(`cert-doc-${cert.id}`).click();
                            }}
                            className="bg-gray-200 text-gray-700 py-1 px-2 rounded text-sm flex items-center gap-1"
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
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => removeCertification(cert.id)}
                          className="text-red-600 hover:text-red-800"
                        >
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
        </div>
        
        {/* Add New Certification */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Add New Certification</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <input 
                type="text"
                placeholder="Certification Name" 
                value={newCert.name}
                onChange={(e) => setNewCert({...newCert, name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-1">
              <input 
                type="date"
                value={newCert.expiration}
                onChange={(e) => setNewCert({...newCert, expiration: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-1">
              <button 
                onClick={addCertification}
                className="bg-green-600 text-white py-2 px-4 rounded w-full"
              >
                Add Certification
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button 
          className="bg-blue-600 text-white py-2 px-6 rounded font-medium hover:bg-blue-700"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

