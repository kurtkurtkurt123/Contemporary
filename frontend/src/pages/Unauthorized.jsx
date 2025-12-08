// src/pages/Unauthorized.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-700 mb-4">403 - ACCESS DENIED</h1>
      <p className="text-gray-600 mb-8">You do not have permission to access this page.</p>
      <Link to="/login" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Go to login
      </Link>
    </div>
  );
};

export default Unauthorized;