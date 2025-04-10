import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaCalendarAlt, FaChartBar, FaUser} from 'react-icons/fa';



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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Welcome, Integrity Specialists</h1>
            <p className="text-gray-600 mt-1">Tuesday, March 18, 2025</p>
          </div>
          <Link to="/newdig">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <FaUser className="mr-2" /> Create New Dig
            </button>
          </Link>
        </div>
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaClipboardList className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Active Projects</h3>
              <p className="text-2xl font-semibold text-gray-800">7</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600">↑ 2 from last month</span>
            <Link to="/projects" className="text-sm text-blue-600">View all</Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaUser className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Field Teams</h3>
              <p className="text-2xl font-semibold text-gray-800">4</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-green-600">All teams deployed</span>
            <Link to="/teams" className="text-sm text-blue-600">View teams</Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Scheduled Digs</h3>
              <p className="text-2xl font-semibold text-gray-800">12</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Next: March 22</span>
            <Link to="/schedule" className="text-sm text-blue-600">View schedule</Link>
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-lg font-medium text-gray-800">Recent Projects</h2>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{project.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.completion}%` }}></div>
                      </div>
                      <span className="text-xs mt-1">{project.completion}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/project/${project.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link to="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              View all projects →
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks and Upcoming Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-800">Upcoming Tasks</h2>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200">
              {upcomingTasks.map((task) => (
                <li key={task.id} className="py-4">
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">{task.title}</p>
                        <p className="text-sm text-gray-500">Due: {task.due}</p>
                      </div>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <Link to="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View all tasks →
              </Link>
            </div>
          </div>
        </div>

        {/* Calculation Tools */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-medium text-gray-800">Calculation Tools</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/calculations/abs-es" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <FaChartBar className="text-blue-600 text-xl mb-2" />
                  <h3 className="font-medium text-gray-800">ABS + ES Calculator</h3>
                  <p className="text-xs text-gray-500 mt-1">Calculate RGW+ additions</p>
                </div>
              </Link>
              <Link to="/calculations/time-clock" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <FaCalendarAlt className="text-purple-600 text-xl mb-2" />
                  <h3 className="font-medium text-gray-800">Time Clock</h3>
                  <p className="text-xs text-gray-500 mt-1">Track hours and breaks</p>
                </div>
              </Link>
              <Link to="/calculations/pit-depth" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <FaUser className="text-green-600 text-xl mb-2" />
                  <h3 className="font-medium text-gray-800">Pit Depth</h3>
                  <p className="text-xs text-gray-500 mt-1">Calculate excavation depths</p>
                </div>
              </Link>
              <Link to="/calculations" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center text-center">
                  <div className="text-gray-400 text-xl mb-2">+</div>
                  <h3 className="font-medium text-gray-800">More Tools</h3>
                  <p className="text-xs text-gray-500 mt-1">View all calculators</p>
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