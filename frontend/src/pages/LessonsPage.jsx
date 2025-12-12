// frontend/src/pages/LessonsPage.jsx
import React from 'react';
import NavBar from '../components/public/NavBar'; // <-- ADDED IMPORT

const LessonsPage = () => {
  return (
    <div className="min-h-screen bg-teal-50 text-gray-800">
        <NavBar /> {/* <-- ADDED NAVBAR RENDER */}
        
        <div className="pt-32 px-4 max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl p-7 mb-10 border border-gray-200">
                <h1 className="text-3xl font-extrabold text-[#3C467B] mb-2">
                    📚 Course Materials & Lessons
                </h1>
                <p className="text-gray-500">
                    Access all the modules and educational resources for your enrolled courses here.
                </p>
            </div>

            {/* Content Placeholder */}
            <div className="grid md:grid-cols-1 gap-6 bg-white p-6 rounded-xl shadow-md border">
                <h2 className="text-xl font-bold">List of Available Modules</h2>
                <p className="text-gray-600">
                    [Placeholder for dynamic lesson list, videos, and reading materials.]
                </p>
                <div className="p-4 bg-gray-100 rounded">
                    <p className="font-semibold">Module 1: The Structures of Globalization</p>
                    <p className="text-sm text-gray-500">Status: Completed</p>
                </div>
                <div className="p-4 bg-gray-100 rounded">
                    <p className="font-semibold">Module 2: Global Economic Systems</p>
                    <p className="text-sm text-gray-500">Status: In Progress</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default LessonsPage;