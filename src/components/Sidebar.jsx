import { useState, useEffect } from "react";
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
  FaChevronLeft,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Menu items configuration
  const menuItems = [
    { icon: <FaHome size={20} />, label: "Home", path: "/" },
    { icon: <FaUser size={20} />, label: "Profile", path: "/profile" },
    {
      icon: <FaProjectDiagram size={20} />,
      label: "Projects / Digs",
      path: "/projectsanddigs",
    },
    { icon: <FaFileAlt size={20} />, label: "Reporting", path: "/reporting" },
    {
      icon: <FaCalculator size={20} />,
      label: "Calculations / Analysis",
      path: "/calculations",
    },
    { icon: <FaBoxes size={20} />, label: "Inventory", path: "/inventory" },
    {
      icon: <FaClock size={20} />,
      label: "Timesheets / Billing",
      path: "/timesheets",
    },
    {
      icon: <FaIdBadge size={20} />,
      label: "Company Directory",
      path: "/companydirectory",
    },
  ];

  // Check if the current path matches the item path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
        >
          <FaBars size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen bg-base-100 border-r border-base-300 flex-shrink-0 transition-all duration-300 ${
          isMobile
            ? `fixed top-0 left-0 z-40 transform ${
                isOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "relative"
        }`}
      >
        <div className={`flex flex-col h-full ${isOpen ? "w-64" : "w-20"}`}>
          {/* Desktop Toggle Button */}
          {!isMobile && (
            <div className="flex justify-center mb-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-sm btn-circle btn-ghost bg-base-100 border border-base-300 hover:bg-base-200"
              >
                {isOpen ? (
                  <FaChevronLeft size={12} />
                ) : (
                  <FaChevronRight size={12} />
                )}
              </button>
            </div>
          )}

          {/* Sidebar Links */}
          <div className="flex flex-col px-2 py-2 overflow-y-auto">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => isMobile && setIsOpen(false)}
                className={`flex items-center px-2 py-3 rounded-md mb-1 transition-colors duration-200 ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-base-content hover:bg-base-200"
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{item.icon}</span>
                  {isOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
