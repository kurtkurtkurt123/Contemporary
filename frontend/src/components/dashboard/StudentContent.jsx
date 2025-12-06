import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // ✅ CORRECT PATH: Akyat dalawang folder
import toast from 'react-hot-toast';
import { BookOpen, BarChart3, CheckCircle } from "lucide-react";

const StudentContent = () => {
    const { user, token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            if (!user?.UserID || !token) return;

            try {
                // --- SIMULATED BACKEND CALL (I-replace mo ito ng totoong fetch) ---
                // Fetch enrollments and progress using user.UserID
                const response = await fetch(`http://localhost:5000/api/student/enrollments/${user.UserID}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // Dito mo ilalagay ang actual fetch logic.
                
                // Temporary Mock Data for UI display:
                const mockData = [
                    { CourseID: 1, Name: 'Introduction to Globalization', Progress: 70, AssignmentDue: 'Quiz 3' },
                    { CourseID: 2, Name: 'Global Economic System', Progress: 35, AssignmentDue: 'Term Paper' }
                ];

                setCourses(mockData);
                // --- END SIMULATED BACKEND CALL ---

            } catch (error) {
                toast.error("Failed to load student data.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [user, token]);

    if (loading) return <h1 className="text-center p-10 text-gray-500">Loading your courses...</h1>;

    return (
        <div className="grid md:grid-cols-3 gap-6">

            {/* LESSONS / COURSES */}
            <div className="md:col-span-2 space-y-6">

                <h2 className="text-xl font-bold mb-2">Your Enrolled Courses</h2>

                {courses.map(course => (
                    <div key={course.CourseID} className="bg-white p-6 rounded-xl shadow-md border flex items-center gap-5 hover:shadow-xl transition">
                        <div className="bg-gray-200 p-4 rounded-full"><BookOpen /></div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">{course.Name}</h3>
                            <p className="text-gray-500 text-sm">Next Due: {course.AssignmentDue}</p>

                            <div className="w-full bg-gray-200 h-2 mt-2 rounded-full">
                                <div className="bg-black h-2 rounded-full" style={{ width: `${course.Progress}%` }}></div>
                            </div>
                            <p className="text-xs mt-1 text-gray-400">{course.Progress}% Completed</p>
                        </div>
                        <button className="bg-black text-white p-3 rounded-full hover:bg-gray-800">
                            <BookOpen size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* PERFORMANCE / GRADES */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Performance Summary</h2>

                <div className="bg-white p-6 rounded-xl shadow-md border text-center">
                    <h3 className="text-gray-500 text-sm mb-2">Average Grade</h3>
                    <h1 className="text-5xl font-bold text-green-600">92</h1>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border space-y-3">
                    <div className="flex justify-between">
                        <span className="flex gap-2 items-center text-sm"><CheckCircle size={16} className="text-green-500" />Quiz 1</span>
                        <span className="font-bold">18/20</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="flex gap-2 items-center text-sm"><CheckCircle size={16} className="text-yellow-500" />Activity</span>
                        <span className="font-bold text-orange-500">Pending</span>
                    </div>

                    <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 p-2 rounded-lg font-semibold">
                        View Full Report
                    </button>
                </div>
            </div>

        </div>
    );
};

export default StudentContent;