import React from "react";
import { Link } from "react-router-dom";

const Calculations = () => {
  const calculators = [
    {
      title: "ABS + ES Calculator",
      description: "Use this to add RGW+ to both ABS and ES values.",
      route: "/calculations/abs-es",
    },
    {
      title: "Time Clock Calculator",
      description: "Placeholder for Time Clock Calculator.",
      route: "/calculations/timeclockcalculator",
    },
    {
      title: "Pit Depth Calculator",
      description: "Placeholder for Calculator 3.",
      route: "/calculations/pitdepthcalculator",
    },
    {
      title: "Calculator 4",
      description: "Placeholder for Calculator 4.",
      route: "/calculations/calc4",
    },
    {
      title: "Calculator 5",
      description: "Placeholder for Calculator 5.",
      route: "/calculations/calc5",
    },
    {
      title: "Calculator 6",
      description: "Placeholder for Calculator 6.",
      route: "/calculations/calc6",
    },
    {
      title: "Calculator 7",
      description: "Placeholder for Calculator 7.",
      route: "/calculations/calc7",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculations</h1>
      {/* Responsive grid: 1 column on small, 2 on medium, 3 on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calc, index) => (
          <div key={index} className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title">{calc.title}</h2>
              <p>{calc.description}</p>
              <div className="card-actions justify-end">
                <Link to={calc.route} className="btn">
                  Open Calculator
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculations;
