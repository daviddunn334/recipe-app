import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaUser, 
  FaProjectDiagram, 
  FaFileAlt, 
  FaCalculator, 
  FaBoxes, 
  FaClock, 
  FaIdBadge,
  FaTimes
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Menu items configuration
  const menuItems = [
    { icon: <FaHome size={20} />, label: "Home", path: "/" },
    { icon: <FaUser size={20} />, label: "Profile", path: "/profile" },
    { icon: <FaProjectDiagram size={20} />, label: "Projects / Digs", path: "/projectsanddigs" },
    { icon: <FaFileAlt size={20} />, label: "Reporting", path: "/reporting" },
    { icon: <FaCalculator size={20} />, label: "Calculations / Analysis", path: "/calculations" },
    { icon: <FaBoxes size={20} />, label: "Inventory", path: "/inventory" },
    { icon: <FaClock size={20} />, label: "Timesheets / Billing", path: "/timesheets" },
    { icon: <FaIdBadge size={20} />, label: "Company Directory", path: "/companydirectory" },
  ];

  // Check if the current path matches the item path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen bg-white border-r border-gray-200 flex-shrink-0">
      {/* Sidebar Container */}
      <div className={`flex flex-col h-full transition-all duration-300 ${isOpen ? "w-64" : "w-20"}`}>
        {/* Toggle Button */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100"
          >
            <FaTimes size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col px-4 py-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center px-2 py-3 rounded-md mb-1 transition-colors duration-200 ${
                isActive(item.path) 
                  ? "bg-blue-100 text-blue-600" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">{item.icon}</span>
                {isOpen && <span className="text-sm font-medium">{item.label}</span>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;