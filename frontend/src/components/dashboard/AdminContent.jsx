import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // ✅ CORRECT PATH
import toast from 'react-hot-toast';
import { Users, LayoutDashboard, Settings, DollarSign } from "lucide-react";

const AdminContent = () => {
    const { user, token } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, newToday: 0 });

    useEffect(() => {
        const fetchAdminStats = async () => {
            if (!user?.UserID || !token) return;

            try {
                // --- SIMULATED BACKEND CALL ---
                // This call is protected by authMiddleware.js on the backend.
                // const response = await fetch(`http://localhost:5000/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
                
                const mockStats = { totalUsers: 1250, totalCourses: 45, newToday: 5 };
                setStats(mockStats);
                // --- END SIMULATED BACKEND CALL ---

            } catch (error) {
                toast.error("Error fetching system stats. Check middleware.");
            }
        };
        fetchAdminStats();
    }, [user, token]);

    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-3 space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-blue-700">System Oversight & Maintenance</h2>
                
                {/* System Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-lg border flex items-center gap-4">
                        <Users size={30} className="text-blue-600"/>
                        <div><h3 className="text-sm text-gray-500">Total Users</h3><p className="text-3xl font-bold">{stats.totalUsers}</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border flex items-center gap-4">
                        <LayoutDashboard size={30} className="text-green-600"/>
                        <div><h3 className="text-sm text-gray-500">Total Courses</h3><p className="text-3xl font-bold">{stats.totalCourses}</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border flex items-center gap-4">
                        <DollarSign size={30} className="text-yellow-600"/>
                        <div><h3 className="text-sm text-gray-500">New Registers (Today)</h3><p className="text-3xl font-bold text-green-600">{stats.newToday}</p></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border flex items-center gap-4">
                        <Settings size={30} className="text-gray-600"/>
                        <div><h3 className="text-sm text-gray-500">System Status</h3><p className="text-xl font-bold text-green-500">Operational</p></div>
                    </div>
                </div>

                {/* Management Tabs */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h3 className="text-xl font-bold mb-4">Quick Management</h3>
                    <div className="flex gap-4">
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Manage Users</button>
                        <button className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600">Audit Logs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContent;