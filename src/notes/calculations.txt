import React from "react";
import { Link } from "react-router-dom";
import { 
  FaCalculator, 
  FaClock, 
  FaRuler, 
  FaChartLine, 
  FaWater,
  FaBalanceScale,
  FaExchangeAlt,
  FaSearch
} from "react-icons/fa";

const Calculations = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  
  const calculators = [
    {
      title: "ABS + ES Calculator",
      description: "Calculate RGW+ additions to both ABS and ES values for precise measurements.",
      route: "/calculations/abs-es",
      icon: <FaCalculator className="text-blue-400" />,
      category: "measurement"
    },
    {
      title: "Time Clock Calculator",
      description: "Track work hours, breaks, and calculate overtime for precise time management.",
      route: "/calculations/timeclockcalculator",
      icon: <FaClock className="text-indigo-400" />,
      category: "time"
    },
    {
      title: "Pit Depth Calculator",
      description: "Measure and calculate excavation depths for accurate project planning.",
      route: "/calculations/pitdepthcalculator",
      icon: <FaRuler className="text-purple-400" />,
      category: "measurement"
    },
    {
      title: "Volume Calculator",
      description: "Calculate volume of various shapes for material estimation.",
      route: "/calculations/calc4",
      icon: <FaWater className="text-teal-400" />,
      category: "measurement"
    },
    {
      title: "Conversion Tool",
      description: "Convert between different units of measurement for project specifications.",
      route: "/calculations/calc5",
      icon: <FaExchangeAlt className="text-green-400" />,
      category: "conversion"
    },
    {
      title: "Load Calculator",
      description: "Calculate weight distribution and load capacity for equipment.",
      route: "/calculations/calc6",
      icon: <FaBalanceScale className="text-amber-400" />,
      category: "engineering"
    },
    {
      title: "Project Estimator",
      description: "Estimate project costs based on materials, time, and resources.",
      route: "/calculations/calc7",
      icon: <FaChartLine className="text-red-400" />,
      category: "business"
    },
  ];

  // Filter calculators based on search term
  const filteredCalculators = calculators.filter(calc => 
    calc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    calc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-3xl font-bold text-white">Calculation Tools</h1>
          <p className="text-blue-100 mt-2">Access specialized calculators for your project needs</p>
        </div>
        
        {/* Search bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Calculator grid */}
        <div className="p-6 bg-gray-50">
          {filteredCalculators.length === 0 ? (
            <div className="text-center py-10">
              <FaCalculator className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No calculators found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCalculators.map((calc, index) => (
                <div 
                  key={index} 
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                  <div className="p-5 flex-grow">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 mr-3">
                        {calc.icon}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{calc.title}</h2>
                    </div>
                    <p className="text-gray-600 mb-4">{calc.description}</p>
                    <div className="mt-auto">
                      <span className="text-xs font-medium inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full uppercase tracking-wide">
                        {calc.category}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <Link 
                      to={calc.route} 
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Open Calculator
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculations;