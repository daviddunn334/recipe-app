import React, { useState, useEffect } from 'react';

const TimesheetMileageTracker = () => {
  // States for timesheet entries
  const [timesheetEntries, setTimesheetEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for current form data
  const [formData, setFormData] = useState({
    id: null,
    employee_id: '',
    work_date: new Date().toISOString().split('T')[0],
    start_time: '',
    end_time: '',
    break_duration: 0,
    job_number: '',
    location: '',
    description: '',
    miles_driven: 0,
    vehicle_id: '',
    start_mileage: 0,
    end_mileage: 0,
    reimbursement_rate: 0.655, // Default IRS rate as of 2024
  });
  
  // States for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // States for filtering and view options
  const [currentView, setCurrentView] = useState('timesheet'); // 'timesheet' or 'mileage'
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterDateRange, setFilterDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  // Mock function to fetch timesheet entries
  const fetchTimesheetEntries = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - replace with actual Supabase query
      const mockData = [
        {
          id: 1,
          employee_id: 1,
          employee_name: 'John Doe',
          work_date: '2025-03-15',
          start_time: '08:00',
          end_time: '17:00',
          break_duration: 60,
          job_number: 'JOB-2025-001',
          location: 'Client Site A',
          description: 'Ultrasonic testing of pressure vessels',
          miles_driven: 45,
          vehicle_id: 1,
          vehicle_name: 'Ford F-150 (Company)',
          start_mileage: 12350,
          end_mileage: 12395,
          reimbursement_rate: 0.655,
          created_at: '2025-03-15T18:30:00Z'
        },
        {
          id: 2,
          employee_id: 1,
          employee_name: 'John Doe',
          work_date: '2025-03-16',
          start_time: '08:30',
          end_time: '16:30',
          break_duration: 45,
          job_number: 'JOB-2025-001',
          location: 'Client Site A',
          description: 'Complete inspection documentation',
          miles_driven: 45,
          vehicle_id: 1,
          vehicle_name: 'Ford F-150 (Company)',
          start_mileage: 12395,
          end_mileage: 12440,
          reimbursement_rate: 0.655,
          created_at: '2025-03-16T17:00:00Z'
        },
        {
          id: 3,
          employee_id: 2,
          employee_name: 'Jane Smith',
          work_date: '2025-03-17',
          start_time: '07:30',
          end_time: '18:00',
          break_duration: 30,
          job_number: 'JOB-2025-002',
          location: 'Refinery B',
          description: 'Radiographic testing',
          miles_driven: 72,
          vehicle_id: 2,
          vehicle_name: 'Personal Vehicle',
          start_mileage: 34560,
          end_mileage: 34632,
          reimbursement_rate: 0.655,
          created_at: '2025-03-17T18:30:00Z'
        }
      ];
      
      setTimesheetEntries(mockData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch timesheet entries');
      setLoading(false);
    }
  };
  
  // Mock function to fetch employees
  const fetchEmployees = async () => {
    // Replace with actual Supabase query
    const mockEmployees = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
      { id: 3, name: 'Mike Johnson' }
    ];
    setEmployees(mockEmployees);
  };
  
  // Mock function to fetch vehicles
  const fetchVehicles = async () => {
    // Replace with actual Supabase query
    const mockVehicles = [
      { id: 1, name: 'Ford F-150 (Company)' },
      { id: 2, name: 'Personal Vehicle' },
      { id: 3, name: 'Ford Transit (Company)' }
    ];
    setVehicles(mockVehicles);
  };
  
  // Mock function to save timesheet entry
  const saveTimesheetEntry = async (data) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isEditing) {
        // Update existing entry
        const updatedEntries = timesheetEntries.map(entry => 
          entry.id === data.id ? {
            ...data,
            employee_name: employees.find(emp => emp.id === parseInt(data.employee_id))?.name || 'Unknown',
            vehicle_name: vehicles.find(veh => veh.id === parseInt(data.vehicle_id))?.name || 'Unknown'
          } : entry
        );
        setTimesheetEntries(updatedEntries);
      } else {
        // Add new entry
        const newEntry = {
          id: Math.max(0, ...timesheetEntries.map(e => e.id)) + 1,
          ...data,
          employee_name: employees.find(emp => emp.id === parseInt(data.employee_id))?.name || 'Unknown',
          vehicle_name: vehicles.find(veh => veh.id === parseInt(data.vehicle_id))?.name || 'Unknown',
          created_at: new Date().toISOString()
        };
        setTimesheetEntries([...timesheetEntries, newEntry]);
      }
      
      return true;
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'save'} timesheet entry`);
      return false;
    }
  };
  
  // Mock function to delete timesheet entry
  const deleteTimesheetEntry = async (id) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setTimesheetEntries(timesheetEntries.filter(entry => entry.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete entry');
      return false;
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    fetchTimesheetEntries();
    fetchEmployees();
    fetchVehicles();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Calculate total hours worked (accounting for breaks)
  const calculateHoursWorked = (start, end, breakMins) => {
    if (!start || !end) return 0;
    
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    
    let diffMs = endTime - startTime;
    diffMs -= breakMins * 60 * 1000; // Subtract break time in ms
    
    return Math.max(0, diffMs / (1000 * 60 * 60)); // Convert to hours
  };
  
  // Calculate mileage reimbursement
  const calculateReimbursement = (miles, rate) => {
    return parseFloat(miles) * parseFloat(rate);
  };
  
  // Update mileage automatically when end/start mileage changes
  useEffect(() => {
    if (formData.start_mileage && formData.end_mileage) {
      const milesDriven = Math.max(0, formData.end_mileage - formData.start_mileage);
      setFormData(prev => ({ ...prev, miles_driven: milesDriven }));
    }
  }, [formData.start_mileage, formData.end_mileage]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await saveTimesheetEntry(formData);
    if (success) {
      resetForm();
      setIsModalOpen(false);
    }
  };
  
  // Open modal for adding new entry
  const openAddModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  // Open modal for editing entry
  const openEditModal = (entry) => {
    setFormData({
      ...entry,
      employee_id: entry.employee_id.toString(),
      vehicle_id: entry.vehicle_id.toString()
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  // Reset form state
  const resetForm = () => {
    setFormData({
      id: null,
      employee_id: '',
      work_date: new Date().toISOString().split('T')[0],
      start_time: '',
      end_time: '',
      break_duration: 0,
      job_number: '',
      location: '',
      description: '',
      miles_driven: 0,
      vehicle_id: '',
      start_mileage: 0,
      end_mileage: 0,
      reimbursement_rate: 0.655,
    });
  };
  
  // Handle deletion confirmation
  const confirmDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteTimesheetEntry(id);
    }
  };
  
  // Filter entries based on current filters
  const filteredEntries = timesheetEntries.filter(entry => {
    const matchesEmployee = !filterEmployee || entry.employee_id.toString() === filterEmployee;
    const entryDate = new Date(entry.work_date);
    const startDate = new Date(filterDateRange.start);
    const endDate = new Date(filterDateRange.end);
    const withinDateRange = entryDate >= startDate && entryDate <= endDate;
    
    return matchesEmployee && withinDateRange;
  });
  
  // Calculate totals for summary
  const totalHours = filteredEntries.reduce((sum, entry) => {
    return sum + calculateHoursWorked(entry.start_time, entry.end_time, entry.break_duration);
  }, 0);
  
  const totalMiles = filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.miles_driven), 0);
  
  const totalReimbursement = filteredEntries.reduce((sum, entry) => {
    return sum + calculateReimbursement(entry.miles_driven, entry.reimbursement_rate);
  }, 0);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Timesheet & Mileage Tracker</h1>
        
        <div className="tabs tabs-boxed">
          <a 
            className={`tab ${currentView === 'timesheet' ? 'tab-active' : ''}`}
            onClick={() => setCurrentView('timesheet')}
          >
            Timesheet View
          </a>
          <a 
            className={`tab ${currentView === 'mileage' ? 'tab-active' : ''}`}
            onClick={() => setCurrentView('mileage')}
          >
            Mileage View
          </a>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={openAddModal}
        >
          Add New Entry
        </button>
      </div>
      
      {/* Filters */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <h2 className="font-bold mb-4">Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Employee</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">Start Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filterDateRange.start}
              onChange={(e) => setFilterDateRange({...filterDateRange, start: e.target.value})}
            />
          </div>
          
          <div className="form-control flex-1">
            <label className="label">
              <span className="label-text">End Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              value={filterDateRange.end}
              onChange={(e) => setFilterDateRange({...filterDateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Total Hours</div>
          <div className="stat-value">{totalHours.toFixed(2)}</div>
          <div className="stat-desc">For selected period</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Total Miles</div>
          <div className="stat-value">{totalMiles.toFixed(0)}</div>
          <div className="stat-desc">For selected period</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Reimbursement</div>
          <div className="stat-value">${totalReimbursement.toFixed(2)}</div>
          <div className="stat-desc">At current rates</div>
        </div>
      </div>
      
      {error && <div className="alert alert-error mb-4">{error}</div>}
      
      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                {currentView === 'timesheet' && (
                  <>
                    <th>Job Number</th>
                    <th>Start/End</th>
                    <th>Hours</th>
                    <th>Location</th>
                  </>
                )}
                {currentView === 'mileage' && (
                  <>
                    <th>Vehicle</th>
                    <th>Start/End</th>
                    <th>Miles</th>
                    <th>Reimbursement</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">No entries found</td>
                </tr>
              ) : (
                filteredEntries.map(entry => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.work_date).toLocaleDateString()}</td>
                    <td>{entry.employee_name}</td>
                    
                    {currentView === 'timesheet' && (
                      <>
                        <td>{entry.job_number}</td>
                        <td>
                          {entry.start_time} - {entry.end_time}
                          <br />
                          <span className="text-xs text-opacity-70">
                            ({entry.break_duration} min break)
                          </span>
                        </td>
                        <td>
                          {calculateHoursWorked(
                            entry.start_time, 
                            entry.end_time, 
                            entry.break_duration
                          ).toFixed(2)}
                        </td>
                        <td>{entry.location}</td>
                      </>
                    )}
                    
                    {currentView === 'mileage' && (
                      <>
                        <td>{entry.vehicle_name}</td>
                        <td>
                          {entry.start_mileage} - {entry.end_mileage}
                        </td>
                        <td>{entry.miles_driven}</td>
                        <td>
                          ${calculateReimbursement(
                            entry.miles_driven, 
                            entry.reimbursement_rate
                          ).toFixed(2)}
                        </td>
                      </>
                    )}
                    
                    <td className="flex gap-2">
                      <button 
                        className="btn btn-sm btn-info" 
                        onClick={() => openEditModal(entry)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-error" 
                        onClick={() => confirmDelete(entry.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box max-w-2xl relative">
            <h3 className="font-bold text-lg mb-4">
              {isEditing ? 'Edit Entry' : 'Add New Entry'}
            </h3>
            <button 
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <form onSubmit={handleSubmit}>
              <div className="divider">Employee & Date Information</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Employee</span>
                  </label>
                  <select
                    name="employee_id"
                    className="select select-bordered w-full"
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Work Date</span>
                  </label>
                  <input
                    type="date"
                    name="work_date"
                    className="input input-bordered w-full"
                    value={formData.work_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="divider">Timesheet Details</div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Time</span>
                  </label>
                  <input
                    type="time"
                    name="start_time"
                    className="input input-bordered w-full"
                    value={formData.start_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Time</span>
                  </label>
                  <input
                    type="time"
                    name="end_time"
                    className="input input-bordered w-full"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Break (minutes)</span>
                  </label>
                  <input
                    type="number"
                    name="break_duration"
                    className="input input-bordered w-full"
                    value={formData.break_duration}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Job Number</span>
                  </label>
                  <input
                    type="text"
                    name="job_number"
                    className="input input-bordered w-full"
                    value={formData.job_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="input input-bordered w-full"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="2"
                ></textarea>
              </div>
              
              <div className="divider">Mileage Information</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Vehicle</span>
                  </label>
                  <select
                    name="vehicle_id"
                    className="select select-bordered w-full"
                    value={formData.vehicle_id}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Reimbursement Rate ($/mile)</span>
                  </label>
                  <input
                    type="number"
                    name="reimbursement_rate"
                    className="input input-bordered w-full"
                    value={formData.reimbursement_rate}
                    onChange={handleInputChange}
                    step="0.001"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Mileage</span>
                  </label>
                  <input
                    type="number"
                    name="start_mileage"
                    className="input input-bordered w-full"
                    value={formData.start_mileage}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Mileage</span>
                  </label>
                  <input
                    type="number"
                    name="end_mileage"
                    className="input input-bordered w-full"
                    value={formData.end_mileage}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Miles Driven</span>
                  </label>
                  <input
                    type="number"
                    name="miles_driven"
                    className="input input-bordered w-full"
                    value={formData.miles_driven}
                    onChange={handleInputChange}
                    min="0"
                    readOnly={formData.start_mileage && formData.end_mileage}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <div className="alert alert-info">
                  <span>
                    {formData.start_time && formData.end_time ? (
                      <>
                        Hours worked: <strong>{calculateHoursWorked(
                          formData.start_time, 
                          formData.end_time, 
                          formData.break_duration
                        ).toFixed(2)}</strong>
                      </>
                    ) : 'Enter start and end times to calculate hours worked.'}
                    <br />
                    {formData.miles_driven > 0 ? (
                      <>
                        Reimbursement amount: <strong>${calculateReimbursement(
                          formData.miles_driven, 
                          formData.reimbursement_rate
                        ).toFixed(2)}</strong>
                      </>
                    ) : 'Enter miles driven to calculate reimbursement.'}
                  </span>
                </div>
              </div>
              
              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn btn-ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimesheetMileageTracker;