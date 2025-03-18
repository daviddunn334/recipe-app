import React from 'react';
import { Link } from 'react-router-dom';

const ProjectsAndDigs = ({ projects = [] }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Projects and Digs</h1>
      {projects.length === 0 ? (
        <p className="text-gray-600">No projects or digs available.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li
              key={project.id}
              className="p-4 bg-white shadow rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{project.name}</h2>
                <p className="text-gray-600">Client: {project.client}</p>
              </div>
              <Link
                to={`/projects/${project.id}`}
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

export default ProjectsAndDigs;
