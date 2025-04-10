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
      icon: <FaCalculator className="text-primary" />,
      category: "measurement"
    },
    {
      title: "Time Clock Calculator",
      description: "Track work hours, breaks, and calculate overtime for precise time management.",
      route: "/calculations/timeclockcalculator",
      icon: <FaClock className="text-secondary" />,
      category: "time"
    },
    {
      title: "Pit Depth Calculator",
      description: "Measure and calculate excavation depths for accurate project planning.",
      route: "/calculations/pitdepthcalculator",
      icon: <FaRuler className="text-accent" />,
      category: "measurement"
    },
    {
      title: "Volume Calculator",
      description: "Calculate volume of various shapes for material estimation.",
      route: "/calculations/calc4",
      icon: <FaWater className="text-info" />,
      category: "measurement"
    },
    {
      title: "Conversion Tool",
      description: "Convert between different units of measurement for project specifications.",
      route: "/calculations/calc5",
      icon: <FaExchangeAlt className="text-success" />,
      category: "conversion"
    },
    {
      title: "Load Calculator",
      description: "Calculate weight distribution and load capacity for equipment.",
      route: "/calculations/calc6",
      icon: <FaBalanceScale className="text-warning" />,
      category: "engineering"
    },
    {
      title: "Project Estimator",
      description: "Estimate project costs based on materials, time, and resources.",
      route: "/calculations/calc7",
      icon: <FaChartLine className="text-error" />,
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
      <div className="card bg-base-100 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6">
          <h1 className="text-3xl font-bold text-base-100">Calculation Tools</h1>
          <p className="text-base-100 opacity-80 mt-2">Access specialized calculators for your project needs</p>
        </div>
        
        {/* Search bar */}
        <div className="p-6 border-b border-base-300">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-base-content opacity-50" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10"
              placeholder="Search calculators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Calculator grid */}
        <div className="p-6 bg-base-200">
          {filteredCalculators.length === 0 ? (
            <div className="text-center py-10">
              <FaCalculator className="mx-auto h-12 w-12 text-base-content opacity-50" />
              <h3 className="mt-2 text-lg font-medium text-base-content">No calculators found</h3>
              <p className="mt-1 text-base-content opacity-70">Try adjusting your search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCalculators.map((calc, index) => (
                <div 
                  key={index} 
                  className="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary"></div>
                  <div className="card-body p-5">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-base-200 mr-3">
                        {calc.icon}
                      </div>
                      <h2 className="card-title text-xl">{calc.title}</h2>
                    </div>
                    <p className="text-base-content opacity-70 mb-4">{calc.description}</p>
                    <div className="mt-auto">
                      <span className="badge badge-primary badge-outline text-xs uppercase tracking-wide">
                        {calc.category}
                      </span>
                    </div>
                    <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
                      <Link 
                        to={calc.route} 
                        className="btn btn-primary w-full"
                      >
                        Open Calculator
                      </Link>
                    </div>
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