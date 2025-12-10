import React, { useState, useEffect } from 'react';
import { AcademicCapIcon, BookOpenIcon, CheckIcon, ArrowRightIcon, MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';
import NavBar from "../../components/public/NavBar";
import { useAuth } from "../../context/AuthContext";

const KPI_DATA = [
    { title: "Students", count: 30, icon: AcademicCapIcon, color: "bg-amber-500", iconBg: "bg-amber-600" },
    { title: "Materials", count: 20, icon: BookOpenIcon, color: "bg-purple-600", iconBg: "bg-purple-700" },
    { title: "Task Submitted", count: 20, icon: CheckIcon, color: "bg-teal-600", iconBg: "bg-teal-700", note: "As of this week" },
];

const TABLE_DATA = [
    { id: '23-1351', name: 'Rodel Pangilinan', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 | 8:00pm', status: 'On Time' },
    { id: '23-3732', name: 'Kian Galope', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 | 1:00pm', status: 'On Time' },
    { id: '23-5750', name: 'Janice Intras', course: 'SBIT-3T', task: 'Week 2 Activity 1', date: '10 - 25 | 1:00am', status: 'Late' },
    { id: '23-2783', name: 'Carlo Jamonte', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '------', status: 'No Task' },
    { id: '23-6001', name: 'Samantha Cruz', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 | 7:00pm', status: 'On Time' },
];

// ===============================
// DONUT CHART
// ===============================
const DonutChart = () => {
  // Track animation progress
  const [progress, setProgress] = useState(0);

  // Target percentages
  const target = { onTime: 60, late: 20, noSubmission: 20 }; // sum must be 100

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start <= 100) setProgress(start);
      else clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  // Calculate current segment percentages
  const onTimePercent = Math.min(progress, target.onTime);
  const latePercent = Math.min(Math.max(progress - target.onTime, 0), target.late);
  const noSubPercent = Math.min(Math.max(progress - target.onTime - target.late, 0), target.noSubmission);

  const complianceStyle = {
    background: `conic-gradient(
      #10B981 0% ${onTimePercent}%,
      #F59E0B ${onTimePercent}% ${onTimePercent + latePercent}%,
      #EF4444 ${onTimePercent + latePercent}% ${onTimePercent + latePercent + noSubPercent}%
    )`,
  };

  return (
    <div className="flex flex-row justify-between gap-12 items-center space-y-6">
      <div className="relative w-64 h-64">
        <div
          className="absolute inset-0 rounded-full transition duration-500 hover:rotate-3"
          style={complianceStyle}
        />
        <div className="absolute inset-0 m-auto w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center text-center text-sm font-semibold">
          <div className="text-green-600">{onTimePercent}% On Time</div>
          <div className="text-amber-500">{latePercent}% Late</div>
          <div className="text-red-500">{noSubPercent}% No Submission</div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
          <span>{onTimePercent}% On Time</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
          <span>{latePercent}% Late</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span>{noSubPercent}% No Submission</span>
        </div>
      </div>
    </div>
  );
};
// ===============================
// KPI CARD (Hover Transition Added)
// ===============================
const KpiCard = ({ title, count, icon: Icon, color, iconBg, note }) => (
    <div className={`p-5 rounded-xl text-white shadow-lg flex justify-between items-center ${color} 
                    transition duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] cursor-pointer`}>
        <div>
            <p className="text-lg font-medium">{title}</p>
            <h2 className="text-4xl font-extrabold mt-1">{count}</h2>
            {note && <p className="text-xs opacity-80 mt-1">{note}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
            <Icon className="h-8 w-8 text-white" />
        </div>
    </div>
);

// ===============================
// MAIN DASHBOARD COMPONENT
// ===============================
const Dashboard = () => {
    const { user, logout } = useAuth();
    const mainBgColor = "bg-[#3C467B]";

    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = TABLE_DATA.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'On Time': return 'text-green-600 font-semibold';
            case 'Late': return 'text-amber-500 font-semibold';
            case 'No Task': return 'text-red-500 font-semibold';
            default: return 'text-gray-600';
        }
    };

    return (
        // Added animate-fade-in to the main container
        <>
            {user && (
                <div className="fixed top-0 left-0 w-full z-50">
                    <NavBar user={user} onLogout={logout} />
                </div>
            )}

            <div className={`min-h-screen pt-32 p-8 ${mainBgColor} font-instrument`}>


                <div className="max-w-7xl mx-auto space-y-8">

                    {/* KPI CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {KPI_DATA.map((kpi, index) => (
                            <KpiCard key={index} {...kpi} />
                        ))}
                    </div>

                    {/* DONUT CHART CARD (Slight hover transition added) */}
                    <div className="bg-white p-8 rounded-xl shadow-xl transition duration-300 hover:shadow-2xl">
                        <h3 className="text-xl font-semibold mb-6 border-b pb-3">Compliance of Assignments</h3>
                        <div className="flex justify-center">
                            <DonutChart />
                        </div>
                        <p className="text-sm text-gray-500 text-center pt-6">
                            These are the status of all students who comply as of this week.
                        </p>
                    </div>

                    {/* TABLE CARD */}
                    <div className="bg-white p-6 rounded-xl shadow-xl">
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">Weekly Task Submission</h3>

                        {/* Search Bar */}
                        <div className="flex justify-end mb-4">
                            <div className="relative w-full max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Search Students"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* TABLE CONTENT */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#3C467B] text-white">
                                    <tr>
                                        {['Student ID', 'Student Name', 'Course & Section', 'Task Submitted', 'Date Submitted', 'Status']
                                            .map((header) => (
                                                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                    {header}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                                                No results found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((row) => (
                                            // Added hover:bg-gray-50 transition for smooth table interaction
                                            <tr key={row.id} className="cursor-pointer transition duration-150 hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.course}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.task}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">{row.date}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStatusStyle(row.status)}`}>
                                                    {row.status}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default Dashboard;