import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPlusCircle, FaUser, FaProjectDiagram, FaFileAlt, FaCalculator, FaBoxes, FaClock, } from "react-icons/fa";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Start with the sidebar open

  return (
    <div className="flex font-Roboto">
      {/* Sidebar Container */}
      <div
        className={`bg-base-200 p-4 h-screen transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-square btn-outline m-2"
        >
          {isOpen ? "✖" : "☰"}
        </button>

        {/* add to sidebar below */}
        
       
        <ul className="menu p-2 rounded-box">
          <li>
            <Link to="/" className="flex items-center">
              <FaHome className="w-6 h-6" />
              {isOpen && <span className="ml-3">Home</span>}
            </Link>
          </li>
          <li>
            <Link to="/profile" className="flex items-center">
              <FaUser className="w-6 h-6" />
              {isOpen && <span className="ml-3">Profile</span>}
            </Link>
            </li>
          <li>
            <Link to="/projectsanddigs" className="flex items-center">
              <FaProjectDiagram className="w-6 h-6" />
              {isOpen && <span className="ml-3">Projects / Digs</span>}
            </Link>
            </li>
            <li>
            <Link to="/reporting" className="flex items-center">
              <FaFileAlt className="w-6 h-6" />
              {isOpen && <span className="ml-3">Reporting</span>}
            </Link>
            </li>
            <li>
            <Link to="/calculations" className="flex items-center">
              <FaCalculator className="w-6 h-6" />
              {isOpen && <span className="ml-3">Calculations / Analysis</span>}
            </Link>
            </li>
            <li>
            <Link to="/inventory" className="flex items-center">
              <FaBoxes className="w-6 h-6" />
              {isOpen && <span className="ml-3">Inventory</span>}
            </Link>
            </li>
            <li>
            <Link to="/timesheets" className="flex items-center">
              <FaClock className="w-6 h-6" />
              {isOpen && <span className="ml-3">Timesheets / Billing</span>}
            </Link>
            </li>
           
         
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
