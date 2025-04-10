import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabase";

const CompanyDetails = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  async function fetchCompanyDetails() {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single();

    if (error) {
      console.error("Error fetching company details:", error);
    } else {
      setCompany(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col w-full max-w-4xl mx-auto">
        <div className="alert alert-error">
          <span>Company not found</span>
        </div>
      </div>
    );
  }

  // Company-specific content based on companyId
  const getCompanySpecificContent = () => {
    switch (companyId) {
      case "williams":
        return {
          logo: "🏢",
          color: "bg-blue-100",
          tabs: ["Overview", "Projects", "Contacts", "Documents"],
          customFields: [
            { label: "Region", value: company.region || "Not provided" },
            {
              label: "Pipeline Type",
              value: company.pipeline_type || "Not provided",
            },
          ],
        };
      case "nwp":
        return {
          logo: "🏭",
          color: "bg-green-100",
          tabs: ["Overview", "Projects", "Safety Records", "Maintenance"],
          customFields: [
            {
              label: "Safety Rating",
              value: company.safety_rating || "Not provided",
            },
            {
              label: "Maintenance Schedule",
              value: company.maintenance_schedule || "Not provided",
            },
          ],
        };
      // Add more cases for other companies
      default:
        return {
          logo: "🏢",
          color: "bg-gray-100",
          tabs: ["Overview", "Projects", "Contacts"],
          customFields: [],
        };
    }
  };

  const companyConfig = getCompanySpecificContent();

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-primary text-primary-content p-6 rounded-t-lg">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{companyConfig.logo}</div>
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="mt-1">{company.description || "Pipeline Operator"}</p>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-base-100 p-4 border-b border-base-300">
        <div className="tabs tabs-boxed">
          {companyConfig.tabs.map((tab) => (
            <button
              key={tab}
              className={`tab ${
                activeTab === tab.toLowerCase() ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 bg-base-200">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Company Information Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {company.address || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {company.phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {company.email || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Website:</span>{" "}
                      {company.website || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {companyConfig.customFields.map((field, index) => (
                      <p key={index}>
                        <span className="font-medium">{field.label}:</span>{" "}
                        {field.value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl">Contact Person</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {company.contact_name || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Position:</span>{" "}
                      {company.contact_position || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {company.contact_phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {company.contact_email || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            {company.notes && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-xl">Notes</h2>
                  <p className="mt-2">{company.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">No projects available</h3>
                  <p>Add projects to see them here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
