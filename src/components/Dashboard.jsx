import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaCalendarAlt, FaChartBar, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  // Sample data for the dashboard
  const recentProjects = [
    { id: 1, name: 'Downtown Pipeline Excavation', status: 'In Progress', completion: 65 },
    { id: 2, name: 'Westside Utility Inspection', status: 'Completed', completion: 100 },
    { id: 3, name: 'North County Sewer Line', status: 'Planning', completion: 15 },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Site Survey: Eastwood Project', due: 'Mar 21, 2025', priority: 'High' },
    { id: 2, title: 'Equipment Maintenance', due: 'Mar 25, 2025', priority: 'Medium' },
    { id: 3, title: 'Team Safety Training', due: 'Mar 28, 2025', priority: 'High' },
  ];

  // Helper function to get badge classes based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge badge-success';
      case 'In Progress': return 'badge badge-info';
      default: return 'badge badge-warning';
    }
  };

  // Helper function to get priority badge classes
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge badge-error';
      case 'Medium': return 'badge badge-warning';
      default: return 'badge badge-success';
    }
  };

  return (
    <div className="p-6 bg-base-200 min-h-screen">
      {/* Welcome Section */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Welcome, Integrity Specialists</h1>
            <p className="text-base-content/70">Tuesday, March 18, 2025</p>
          </div>
          <Link to="/newdig">
            <button className="btn btn-primary">
              <FaUser className="mr-2" /> Create New Dig
            </button>
          </Link>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <div className="bg-primary/20 p-3 rounded-full mr-4">
                <FaClipboardList className="text-primary text-xl" />
              </div>
              <div>
                <h3 className="text-base-content/70 text-sm font-medium">Active Projects</h3>
                <p className="text-2xl font-semibold">7</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-success">↑ 2 from last month</span>
              <Link to="/projects" className="text-sm text-primary">View all</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <div className="bg-success/20 p-3 rounded-full mr-4">
                <FaUser className="text-success text-xl" />
              </div>
              <div>
                <h3 className="text-base-content/70 text-sm font-medium">Field Teams</h3>
                <p className="text-2xl font-semibold">4</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-success">All teams deployed</span>
              <Link to="/teams" className="text-sm text-primary">View teams</Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center mb-4">
              <div className="bg-secondary/20 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-secondary text-xl" />
              </div>
              <div>
                <h3 className="text-base-content/70 text-sm font-medium">Scheduled Digs</h3>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/70">Next: March 22</span>
              <Link to="/schedule" className="text-sm text-primary">View schedule</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="border-b border-base-300 p-4">
          <h2 className="text-lg font-medium">Recent Projects</h2>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Completion</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-medium">{project.name}</td>
                    <td>
                      <span className={getStatusBadgeClass(project.status)}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <progress 
                        className="progress progress-primary w-full" 
                        value={project.completion} 
                        max="100"
                      ></progress>
                      <span className="text-xs">{project.completion}%</span>
                    </td>
                    <td className="text-right">
                      <Link to={`/project/${project.id}`} className="btn btn-ghost btn-xs">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-4">
            <Link to="/projects" className="link link-primary">
              View all projects →
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks and Upcoming Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="card bg-base-100 shadow-xl">
          <div className="border-b border-base-300 p-4">
            <h2 className="text-lg font-medium">Upcoming Tasks</h2>
          </div>
          <div className="card-body">
            <ul className="divide-y divide-base-300">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="py-4">
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <input type="checkbox" className="checkbox checkbox-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-base-content/70">Due: {task.due}</p>
                      </div>
                    </div>
                    <span className={getPriorityBadgeClass(task.priority)}>
                      {task.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-right mt-4">
              <Link to="/tasks" className="link link-primary">
                View all tasks →
              </Link>
            </div>
          </div>
        </div>

        {/* Calculation Tools */}
        <div className="card bg-base-100 shadow-xl">
          <div className="border-b border-base-300 p-4">
            <h2 className="text-lg font-medium">Calculation Tools</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/calculations/abs-es" className="card bg-primary/10 hover:bg-primary/20 transition-colors">
                <div className="card-body items-center text-center p-4">
                  <FaChartBar className="text-primary text-xl mb-2" />
                  <h3 className="font-medium">ABS + ES Calculator</h3>
                  <p className="text-xs text-base-content/70">Calculate RGW+ additions</p>
                </div>
              </Link>
              <Link to="/calculations/time-clock" className="card bg-secondary/10 hover:bg-secondary/20 transition-colors">
                <div className="card-body items-center text-center p-4">
                  <FaCalendarAlt className="text-secondary text-xl mb-2" />
                  <h3 className="font-medium">Time Clock</h3>
                  <p className="text-xs text-base-content/70">Track hours and breaks</p>
                </div>
              </Link>
              <Link to="/calculations/pit-depth" className="card bg-success/10 hover:bg-success/20 transition-colors">
                <div className="card-body items-center text-center p-4">
                  <FaUser className="text-success text-xl mb-2" />
                  <h3 className="font-medium">Pit Depth</h3>
                  <p className="text-xs text-base-content/70">Calculate excavation depths</p>
                </div>
              </Link>
              <Link to="/calculations" className="card bg-base-200 hover:bg-base-300 transition-colors">
                <div className="card-body items-center text-center p-4">
                  <div className="text-base-content/50 text-xl mb-2">+</div>
                  <h3 className="font-medium">More Tools</h3>
                  <p className="text-xs text-base-content/70">View all calculators</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;