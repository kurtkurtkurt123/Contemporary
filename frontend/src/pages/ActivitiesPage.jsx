// frontend/src/pages/ActivitiesPage.jsx
import React from 'react';
import NavBar from '../components/public/NavBar'; // <-- ADDED IMPORT

const ActivitiesPage = () => {
  return (
    <div className="min-h-screen bg-teal-50 text-gray-800">
        <NavBar /> {/* <-- ADDED NAVBAR RENDER */}
        
        <div className="pt-32 px-4 max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-xl p-7 mb-10 border border-gray-200">
                <h1 className="text-3xl font-extrabold text-[#3C467B] mb-2">
                    📝 Quizzes and Assignments
                </h1>
                <p className="text-gray-500">
                    View all pending and completed activities for your courses. Don't miss any deadlines!
                </p>
            </div>

            {/* Content Placeholder */}
            <div className="grid md:grid-cols-2 gap-6">
                
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold mb-3">Upcoming Assignments</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="p-3 bg-red-50 rounded border border-red-200 flex justify-between items-center">
                            <span>Essay: Global Migration (Due Today!)</span>
                            <span className="text-red-600 font-semibold">URGENT</span>
                        </li>
                        <li className="p-3 bg-yellow-50 rounded border border-yellow-200 flex justify-between items-center">
                            <span>Quiz 3: Modern Global Governance</span>
                            <span className="text-yellow-700">Due in 3 days</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-xl font-bold mb-3">Completed Work</h2>
                    <ul className="space-y-3 text-sm">
                        <li className="p-3 bg-green-50 rounded border border-green-200 flex justify-between items-center">
                            <span>Quiz 2: The World of Market</span>
                            <span className="text-green-600 font-semibold">Grade: 95</span>
                        </li>
                        <li className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <span>Attendance Check (Week 4)</span>
                            <span className="text-gray-700">Submitted</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ActivitiesPage;