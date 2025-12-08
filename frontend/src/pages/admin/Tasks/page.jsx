import React, { useState, useMemo } from 'react';
import { ArrowDownTrayIcon, FunnelIcon, MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';

// --- MOCK DATA (Using the previous table data) ---
const SUBMISSION_DATA = [
    { id: '23-1351', name: 'Rodel Pangilinan', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 | 8:00pm', status: 'On Time' },
    { id: '23-3732', name: 'Kian Galope', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 | 1:00pm', status: 'On Time' },
    { id: '23-5750', name: 'Janice Intras', course: 'SBIT-3T', task: 'Week 3 Quiz', date: '10 - 26 | 10:00am', status: 'Late' },
    { id: '23-2783', name: 'Carlo Jamonte', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '------', status: 'No Submission' },
    { id: '23-6001', name: 'Samantha Cruz', course: 'SBIT-3A', task: 'Week 4 Project', date: '10 - 28 | 7:00pm', status: 'On Time' },
    { id: '23-1122', name: 'Mark Bautista', course: 'BSIT-3C', task: 'Week 3 Quiz', date: '10 - 26 | 9:00am', status: 'On Time' },
    { id: '23-3344', name: 'Ella Mae', course: 'BSIT-3C', task: 'Week 4 Project', date: '10 - 29 | 1:00pm', status: 'Late' },
];

const TaskSubmissionList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ task: 'All', status: 'All', date: '' });
    
    // Extract unique filter options from data
    const uniqueTasks = useMemo(() => ['All', ...new Set(SUBMISSION_DATA.map(item => item.task))], []);
    const uniqueStatuses = useMemo(() => ['All', ...new Set(SUBMISSION_DATA.map(item => item.status))], []);

    // Function to handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    // Filtered data calculation using useMemo for performance
    const filteredData = useMemo(() => {
        return SUBMISSION_DATA.filter(row => {
            // 1. Search Filter (applies to all string fields)
            const searchMatch = Object.values(row).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (!searchMatch) return false;

            // 2. Dropdown Filters
            if (filters.task !== 'All' && row.task !== filters.task) return false;
            if (filters.status !== 'All' && row.status !== filters.status) return false;
            
            // NOTE: Date filtering is complex without full date objects, 
            // so this mock implementation skips date filtering for simplicity.

            return true;
        });
    }, [searchTerm, filters]);

    // Function to determine status styling
    const getStatusStyle = (status) => {
        switch (status) {
            case 'On Time': return 'text-green-600 font-semibold';
            case 'Late': return 'text-amber-500 font-semibold';
            case 'No Submission': return 'text-red-500 font-semibold';
            default: return 'text-gray-600';
        }
    };
    
    // Function for mock data download
    const handleDownload = () => {
        const dataString = JSON.stringify(filteredData, null, 2);
        const blob = new Blob([dataString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'task_submissions_filtered.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(`Downloaded ${filteredData.length} records to task_submissions_filtered.json`);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FunnelIcon className="h-6 w-6 mr-2 text-gray-600" />
                Filtered Task Submission List
            </h3>

            {/* --- CONTROLS SECTION --- */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6 border-b pb-4">
                
                {/* 1. Filters (Dropdowns and Date) */}
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    
                    {/* Task Dropdown */}
                    <select
                        value={filters.task}
                        onChange={(e) => handleFilterChange('task', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                        {uniqueTasks.map(task => (
                            <option key={task} value={task}>{task}</option>
                        ))}
                    </select>

                    {/* Status Dropdown */}
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm"
                    >
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    {/* Date Select (Mock) */}
                    <input
                        type="date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg text-sm"
                        aria-label="Filter by submission date"
                    />
                </div>

                {/* 2. Search Bar and Download Button */}
                <div className="flex gap-3 w-full lg:w-auto">
                    
                    {/* Search Bar */}
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search Student/Task"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={handleDownload}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                        title="Download Filtered List"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
                        Download ({filteredData.length})
                    </button>
                </div>
            </div>
            {/* --- END CONTROLS SECTION --- */}


            {/* --- TABLE CONTENT --- */}
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
                                <td colSpan="6" className="text-center py-8 text-gray-500 text-base">
                                    No submissions match the current filters.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row) => (
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
    );
};

export default TaskSubmissionList;