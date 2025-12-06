import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // ✅ CORRECT PATH
import toast from 'react-hot-toast';
import { BookOpen, Users, AlertCircle } from "lucide-react";

const InstructorContent = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState({ courses: 0, pending: 0 });

    useEffect(() => {
        const fetchInstructorData = async () => {
            if (!user?.UserID || !token) return;

            try {
                // --- SIMULATED BACKEND CALL ---
                // Fetch courses taught and pending submissions using user.UserID
                // const response = await fetch(`http://localhost:5000/api/instructor/stats/${user.UserID}`, { headers: { 'Authorization': `Bearer ${token}` } });
                
                const mockStats = { courses: 4, pending: 18 };

                setStats(mockStats);
                // --- END SIMULATED BACKEND CALL ---

            } catch (error) {
                toast.error("Failed to load instructor data.");
            }
        };
        fetchInstructorData();
    }, [user, token]);

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-purple-700">Grading & Class Management</h2>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-md border flex items-center gap-4">
                        <Users size={30} className="text-purple-600"/>
                        <div><h3 className="text-sm text-gray-500">Courses Taught</h3><p className="text-3xl font-bold">{stats.courses}</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border flex items-center gap-4">
                        <AlertCircle size={30} className="text-red-500"/>
                        <div><h3 className="text-sm text-gray-500">Pending Grades</h3><p className="text-3xl font-bold text-red-500">{stats.pending}</p></div>
                    </div>
                </div>

                {/* Submission Queue List */}
                <h3 className="text-xl font-bold mt-6">Submission Queue</h3>
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <p className="text-sm text-gray-800">Assignment 3 - Globalization (18 Submissions Waiting)</p>
                    <p className="text-sm text-gray-800 mt-1">Quiz 2 - Economic Systems (5 Retakes Waiting)</p>
                    <button className="mt-4 bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 w-full">Go to Grading</button>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                <button className="w-full bg-gray-200 p-3 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"><BookOpen size={20}/> View My Courses</button>
                <button className="w-full bg-gray-200 p-3 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"><Users size={20}/> Manage Attendance</button>
            </div>
        </div>
    );
};

export default InstructorContent;