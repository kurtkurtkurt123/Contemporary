// frontend/src/pages/StudentDashboard.jsx
import React from 'react';
// FIX: Corrected path to go up to src/ and then down to components/dashboard/
import NavBar from '../components/public/NavBar';
import StudentContent from '../components/contents/StudentContent'; 

const StudentDashboard = () => {
    return (
        <div className="min-h-screen bg-teal-50 text-gray-800">
            <NavBar /> {/* <-- ADDED NAVBAR RENDER */}
            
            <div className="pt-32 px-4 max-w-7xl mx-auto">
                
                {/* Dashboard Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-7 mb-10 border border-gray-200">
                    <h1 className="text-3xl font-extrabold text-[#3C467B] mb-2">
                        📊 My Dashboard
                    </h1>
                    <p className="text-gray-500">
                        Quick view of your courses, progress, and upcoming submissions.
                    </p>
                </div>

                {/* Render the core student dashboard content */}
                <StudentContent />
            </div>
        </div>
    );
};

export default StudentDashboard;
