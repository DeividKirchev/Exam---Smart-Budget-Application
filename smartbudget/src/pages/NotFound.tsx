import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page Not Found</p>
      <Link
        to="/"
        className="text-blue-600 hover:text-blue-700 underline font-medium"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
