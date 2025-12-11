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
import StudentTaskModal from './EditTask/editPage';
import * as XLSX from "xlsx";


const TaskSubmissionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ task: 'All', section: 'All', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const uniqueSections = useMemo(
    () => ['All', ...new Set(tasks.map(item => item.stud_course))],
    [tasks]
  );

  const uniqueTasks = useMemo(
    () => ['All', ...new Set(tasks.map(item => item.taskSubmitted))],
    [tasks]
  );

  const handleExportXLSX = () => {
  try {
    const exportData = filteredData.map(row => ({
      "Task Code": row.taskCode,
      "Student Name": row.studentName,
      "Course & Section": row.courseSection,
      "Date Submitted": row.dateSubmitted
        ? new Date(row.dateSubmitted).toLocaleString()
        : "-",
      "Status": row.status,
      "Remarks": row.remarks || ""
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Submissions");

    XLSX.writeFile(workbook, "task_submissions.xlsx");
    toast.success("XLSX Exported Successfully!");
  } catch (error) {
    console.error(error);
    toast.error("Failed to export XLSX.");
  }
};


  const filteredData = useMemo(() => {
    return tasks.filter(row => {
      const searchMatch = Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!searchMatch) return false;

      if (filters.section !== 'All' && row.stud_course !== filters.section) return false;
      if (filters.task !== 'All' && row.taskSubmitted !== filters.task) return false;
      if (filters.date && !row.dateSubmitted?.includes(filters.date)) return false;

      return true;
    });
  }, [tasks, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

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

  const handleEllipsisClick = taskId => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  return (
    <>
      {user && <NavBar user={user} onLogout={logout} />}

      <div className="p-6 pt-32 font-poppins bg-[#636CCB] relative min-h-screen">
        {/* Header + Filters */}
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
        onChange={e => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
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
            {uniqueSections.map(section => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>

          <label className="block mb-2 text-sm font-semibold">Task</label>
          <select
            value={filters.task}
            onChange={e => handleFilterChange('task', e.target.value)}
            className="w-full p-2 rounded-lg bg-[#3C467B] text-white outline-none"
          >
            {uniqueTasks.map(task => (
              <option key={task} value={task}>
                {task}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  </div>

  {/* Export XLSX Button */}
  <button
    onClick={handleExportXLSX}
    className="bg-white text-[#3C467B] hover:bg-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition"
  >
    <ArrowDownTrayIcon className="h-5" /> Export XLSX
  </button>
</div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-xl p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 font-instrument">
            <thead className="bg-[#3C467B] text-white">
              <tr>
                {['Task Code', 'Student Name', 'Course and Section', 'Date Submitted', 'Status', 'Remarks', ''].map(header => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-gray-500 text-base">
                    No results match the current search or filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map(row => (
                  <tr key={row.taskCode} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 text-sm font-medium">{row.taskCode}</td>
                    <td className="px-6 py-4 text-sm">{row.studentName}</td>
                    <td className="px-6 py-4 text-sm">{row.courseSection}</td>

                    <td className="px-6 py-4 text-sm">
                      {new Date(row.dateSubmitted).toLocaleString()}
                    </td>

                    <td className={`px-6 py-4 text-sm ${getStatusStyle(row.status).className}`}>
                      {getStatusStyle(row.status).text}
                    </td>

                    <td className="px-6 py-4 text-sm">{row.remarks || ''}</td>

                    <td className="px-6 py-4 text-right">
                      <EllipsisVerticalIcon
                        className="h-5 w-5 text-gray-600 hover:text-[#3C467B] cursor-pointer"
                        onClick={() => handleEllipsisClick(row.taskId)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 bg-[#3C467B] p-3 rounded-lg">
              <button
                className="text-white px-2 hover:opacity-80 transition"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                &lt;
              </button>

              {pagesArray.map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-sm transition ${
                    num === currentPage
                      ? 'bg-white text-[#3C467B]'
                      : 'text-white hover:bg-[#4A56A3]'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                className="text-white px-2 hover:opacity-80 transition"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Task Modal */}
      {selectedTaskId && (
        <StudentTaskModal
          taskId={selectedTaskId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTaskId(null);
          }}
        />
      )}
    </>
  );
};

export default TaskSubmissionList;
