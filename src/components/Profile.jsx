import React from 'react';
import { Link } from 'react-router-dom';

const Profiles = ({ profiles = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profiles</h1>
      {profiles.length === 0 ? (
        <p className="text-gray-600">No profiles available.</p>
      ) : (
        <ul className="space-y-4">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="p-4 bg-white shadow rounded flex items-center"
            >
              <img
                src={profile.avatarUrl || 'https://via.placeholder.com/100'}
                alt={`${profile.name}'s avatar`}
                className="w-16 h-16 rounded-full mr-4 object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-gray-600">{profile.role}</p>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              <Link
                to={`/profiles/${profile.id}`}
                className="text-blue-500 hover:underline"
              >
                View Profile
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profiles;
