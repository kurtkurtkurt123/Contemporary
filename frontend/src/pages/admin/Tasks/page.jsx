import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon as SearchIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import NavBar from '../../../components/public/NavBar';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const TaskSubmissionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ task: 'All', section: 'All', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useAuth();
  const itemsPerPage = 12;

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/task/get');
      const result = await res.json();
      if (result.success) {
        setTasks(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching tasks from server');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Unique filter values
  const uniqueSections = useMemo(() => ['All', ...new Set(tasks.map(item => item.courseSection))], [tasks]);
  const uniqueTasks = useMemo(() => ['All', ...new Set(tasks.map(item => item.taskSubmitted))], [tasks]);

  // Filter tasks
  const filteredData = useMemo(() => tasks.filter(row => {
    const searchMatch = Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!searchMatch) return false;
    if (filters.section !== 'All' && row.courseSection !== filters.section) return false;
    if (filters.task !== 'All' && row.taskSubmitted !== filters.task) return false;
    if (filters.date && !row.dateSubmitted?.includes(filters.date)) return false;
    return true;
  }), [tasks, searchTerm, filters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Status styling
  const getStatusStyle = status => {
    if (!status) return { text: 'N/A', className: 'text-gray-600' };

    const normalized = status.toLowerCase();

    switch (normalized) {
      case 'ontime':
        return { text: 'On Time', className: 'text-green-600 font-semibold' };
      case 'late':
        return { text: 'Late', className: 'text-amber-500 font-semibold' };
      case 'no task':
        return { text: 'No Task', className: 'text-red-500 font-semibold' };
      default:
        return { text: status, className: 'text-gray-600' };
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleExportList = () => {
    if (!filteredData.length) return alert('No data to export.');
    const tableHeaders = ['Task Code', 'Student Name', 'Course and Section', 'Task Submitted', 'Date Submitted', 'Status', 'Remarks'];
    const tableContent = filteredData.map(row => `<tr>
      <td>${row.taskCode}</td>
      <td>${row.studentName}</td>
      <td>${row.courseSection}</td>
      <td>${row.taskSubmitted}</td>
      <td>${row.dateSubmitted}</td>
      <td>${row.status}</td>
      <td>${row.remarks || ''}</td>
    </tr>`).join('');
    const htmlContent = `<html><head><title>Exported List</title><style>
      body{font-family:'Poppins', sans-serif;padding:20px;} 
      h1{color:#3C467B;} table{width:100%;border-collapse:collapse;} 
      th, td{border:1px solid #ddd;padding:10px;text-align:left;} 
      th{background:#f2f2f2;color:#3C467B;}
    </style></head><body>
      <h1>Filtered Task Submission Report (${new Date().toLocaleDateString()})</h1>
      <p>Filters: Task=${filters.task}, Section=${filters.section}, Search='${searchTerm}'</p>
      <table><thead><tr>${tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${tableContent}</tbody></table>
    </body></html>`;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.onload = () => { newWindow.focus(); newWindow.print(); }
  };

  return (
    <>
      {user && <NavBar user={user} onLogout={logout} />}
      <div className="p-6 pt-32 font-poppins bg-[#636CCB] font-instrument relative min-h-screen">
        <div className="bg-[#3C467B] text-white p-8 rounded-xl shadow-xl mb-6">
          <h1 className="text-3xl font-semibold">Student Tasks</h1>
          <p className="text-sm opacity-80 mt-1">List of all Student Activities</p>

          <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search Student Name or ID"
                  value={searchTerm}
                  onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 pl-10 bg-white text-black rounded-lg text-sm outline-none shadow"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5" />
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="bg-[#3C467B] hover:bg-[#3C467B]/80 border px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm transition"
                >
                  <FunnelIcon className="h-5" /> Filters
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#3C467B] text-white rounded-lg shadow-lg p-4 z-50">
                    <label className="block mb-2 text-sm font-semibold">Section</label>
                    <select
                      value={filters.section}
                      onChange={e => handleFilterChange('section', e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#3C467B] text-white outline-none mb-4"
                    >
                      {uniqueSections.map(section => <option key={section} value={section}>{section}</option>)}
                    </select>

                    <label className="block mb-2 text-sm font-semibold">Task</label>
                    <select
                      value={filters.task}
                      onChange={e => handleFilterChange('task', e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#3C467B] text-white outline-none"
                    >
                      {uniqueTasks.map(task => <option key={task} value={task}>{task}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              <input
                type="date"
                value={filters.date}
                onChange={e => handleFilterChange('date', e.target.value)}
                className="bg-white text-black p-2 rounded-lg text-sm shadow outline-none"
              />
              <button
                onClick={handleExportList}
                className="bg-[#3C467B] hover:bg-[#3C467B]/80 border px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm transition"
              >
                <ArrowDownTrayIcon className="h-5" /> Export List ({filteredData.length})
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 font-instrument">
              <thead className="bg-[#3C467B] text-white">
                <tr>
                  {['Task Code', 'Student Name', 'Course and Section', 'Task Submitted', 'Date Submitted', 'Status', 'Remarks', ''].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500 text-base">No results match the current search or filters.</td>
                  </tr>
                ) : paginatedData.map(row => (
                  <tr key={row.taskCode} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 text-sm font-medium">{row.taskCode}</td>
                    <td className="px-6 py-4 text-sm">{row.studentName}</td>
                    <td className="px-6 py-4 text-sm">{row.courseSection}</td>
                    <td className="px-6 py-4 text-sm">{row.taskSubmitted}</td>
                    <td className="px-6 py-4 text-sm">{new Date(row.dateSubmitted).toLocaleString()}</td>
                    <td className={`px-6 py-4 text-sm ${getStatusStyle(row.status).className}`}>
                      {getStatusStyle(row.status).text}
                    </td>

                    <td className="px-6 py-4 text-sm">{row.remarks || ''}</td>
                    <td className="px-6 py-4 text-right">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 hover:text-[#3C467B] cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 bg-[#3C467B] p-3 rounded-lg">
              <button className="text-white px-2 hover:opacity-80 transition" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt;</button>
              {pagesArray.map(num => (
                <button key={num} onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-sm transition ${num === currentPage ? 'bg-white text-[#3C467B]' : 'text-white hover:bg-[#4A56A3]'}`}>
                  {num}
                </button>
              ))}
              <button className="text-white px-2 hover:opacity-80 transition" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskSubmissionList;
