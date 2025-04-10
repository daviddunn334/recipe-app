import { useEffect, useState } from "react";
import supabase from "../supabase";
import { FaTrash, FaEdit, FaUserPlus, FaSearch, FaSave } from "react-icons/fa";

const CompanyDirectory = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({
    id: null,
    name: "",
    position: "",
    email: "",
    phone: "",
    department: "",
  });

  // Fetch employees from Supabase
  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    const { data, error } = await supabase.from("employees").select("*");
    if (error) console.error("Error fetching employees:", error);
    else setEmployees(data);
    setLoading(false);
  }

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update an employee
  async function handleSubmit(e) {
    e.preventDefault();

    if (form.id) {
      // Update employee
      const { data, error } = await supabase
        .from("employees")
        .update({
          name: form.name,
          position: form.position,
          email: form.email,
          phone: form.phone,
          department: form.department,
        })
        .eq("id", form.id)
        .select();

      if (error) {
        console.error("Error updating employee:", error);
      } else if (data && data.length > 0) {
        setEmployees(
          employees.map((emp) => (emp.id === form.id ? data[0] : emp))
        );
      }
    } else {
      // Add new employee
      const { data, error } = await supabase
        .from("employees")
        .insert([
          {
            name: form.name,
            position: form.position,
            email: form.email,
            phone: form.phone,
            department: form.department,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding employee:", error);
      } else if (data && data.length > 0) {
        setEmployees([...employees, data[0]]);
      }
    }

    resetForm();
    fetchEmployees();
  }

  // Delete an employee
  async function handleDelete(id) {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) console.error("Error deleting employee:", error);
    fetchEmployees();
  }

  // Load employee into form for editing
  function handleEdit(employee) {
    setForm(employee);
    // Scroll to form
    document
      .getElementById("employee-form")
      .scrollIntoView({ behavior: "smooth" });
  }

  // Reset the form
  function resetForm() {
    setForm({
      id: null,
      name: "",
      position: "",
      email: "",
      phone: "",
      department: "",
    });
  }

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body bg-primary text-primary-content">
          <h1 className="card-title text-3xl">Company Directory</h1>
          <p>Manage your organization's employee database</p>
        </div>

        {/* Employee Form */}
        <div id="employee-form" className="card-body border-b border-base-300">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {form.id ? (
              <>
                <FaEdit className="mr-2 text-primary" /> Edit Employee
              </>
            ) : (
              <>
                <FaUserPlus className="mr-2 text-primary" /> Add New Employee
              </>
            )}
          </h2>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Position</span>
                </label>
                <input
                  type="text"
                  name="position"
                  placeholder="Job Title"
                  className="input input-bordered w-full"
                  value={form.position}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@company.com"
                  className="input input-bordered w-full"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="(123) 456-7890"
                  className="input input-bordered w-full"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Department</span>
                </label>
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  className="input input-bordered w-full"
                  value={form.department}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <button type="submit" className="btn btn-primary">
                <FaSave className="mr-2" />
                {form.id ? "Update Employee" : "Add Employee"}
              </button>
              {form.id && (
                <button
                  onClick={resetForm}
                  type="button"
                  className="btn btn-ghost ml-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search and Employee Table */}
        <div className="card-body">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-3 md:mb-0">
              Employee List
            </h2>
            <div className="join w-full md:w-64">
              <div className="join-item btn btn-neutral">
                <FaSearch />
              </div>
              <input
                type="text"
                className="input input-bordered join-item w-full"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td>
                          <div className="font-medium">{emp.name}</div>
                        </td>
                        <td>
                          <div className="text-sm">{emp.position || "N/A"}</div>
                        </td>
                        <td>
                          <div className="text-sm">{emp.email}</div>
                        </td>
                        <td>
                          <div className="text-sm">{emp.phone || "N/A"}</div>
                        </td>
                        <td>
                          <div className="badge badge-primary badge-outline">
                            {emp.department || "N/A"}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(emp)}
                              className="btn btn-sm btn-ghost text-primary"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id)}
                              className="btn btn-sm btn-ghost text-error"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        {employees.length === 0 ? "No employees found. Add your first employee!" : "No matching employees found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-sm text-right">
            Total: {filteredEmployees.length} {filteredEmployees.length === 1 ? "employee" : "employees"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDirectory;
