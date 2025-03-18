import React from 'react';
import { Link } from 'react-router-dom';

const Inventory = ({ items = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">No inventory items available.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                {item.description && (
                  <p className="text-gray-500">{item.description}</p>
                )}
              </div>
              <Link
                to={`/inventory/${item.id}`}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inventory;
