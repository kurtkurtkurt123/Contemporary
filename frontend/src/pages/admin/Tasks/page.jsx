import React, { useState, useMemo } from 'react';
import {
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon as SearchIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import NavBar from '../../../components/public/NavBar';
import { useAuth } from '../../../context/AuthContext';

// --- MOCK DATA ---
const SUBMISSION_DATA = [
  { id: '23-1251', name: 'Rodel Pangilinan', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 - 25 8:00pm', status: 'On Time', remarks: '100/100' },
  { id: '23-3732', name: 'Kian Galope', course: 'SBIT-3Z', task: 'Week 2 Activity 1', date: '10 - 25 - 25 11:00pm', status: 'On Time', remarks: '95/100' },
  { id: '23-5750', name: 'Janice Intras', course: 'SBIT-3T', task: 'Week 3 Quiz', date: '10 - 26 - 25 1:00am', status: 'Late', remarks: '70/100' },
  { id: '23-2783', name: 'Carlo Jamonte', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '----', status: 'No Task', remarks: '0/100' },
  { id: '23-0101', name: 'Mia Santos', course: 'SBIT-3Z', task: 'Week 3 Quiz', date: '10 - 26 - 25 2:00pm', status: 'On Time', remarks: '88/100' },
  { id: '23-0202', name: 'Alex Cruz', course: 'SBIT-3T', task: 'Week 4 Project', date: '10 - 27 - 25 9:00am', status: 'On Time', remarks: '90/100' },
  { id: '23-3344', name: 'Lara Velasco', course: 'SBIT-3A', task: 'Week 4 Project', date: '10 - 27 - 25 10:00am', status: 'On Time', remarks: '85/100' },
  { id: '23-4455', name: 'Miguel Santos', course: 'SBIT-3Z', task: 'Week 3 Quiz', date: '10 - 26 - 25 3:00pm', status: 'Late', remarks: '60/100' },
  { id: '23-5566', name: 'Ella Reyes', course: 'SBIT-3T', task: 'Week 2 Activity 1', date: '10 - 25 - 25 9:00pm', status: 'On Time', remarks: '92/100' },
  { id: '23-6677', name: 'Mark Dela Cruz', course: 'SBIT-3A', task: 'Week 3 Quiz', date: '10 - 26 - 25 4:00pm', status: 'On Time', remarks: '89/100' },
  { id: '23-7788', name: 'Angela Tan', course: 'SBIT-3Z', task: 'Week 4 Project', date: '10 - 27 - 25 11:00am', status: 'On Time', remarks: '94/100' },
  { id: '23-8899', name: 'John Paul Santos', course: 'SBIT-3T', task: 'Week 3 Quiz', date: '10 - 26 - 25 5:00pm', status: 'Late', remarks: '72/100' },
  { id: '23-9900', name: 'Kimberly Cruz', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 - 25 10:00pm', status: 'On Time', remarks: '95/100' },
  { id: '23-1010', name: 'James Navarro', course: 'SBIT-3Z', task: 'Week 4 Project', date: '10 - 27 - 25 1:00pm', status: 'On Time', remarks: '88/100' },
  { id: '23-1111', name: 'Sophia Lim', course: 'SBIT-3T', task: 'Week 2 Activity 1', date: '10 - 25 - 25 11:30pm', status: 'On Time', remarks: '90/100' },
  { id: '23-1212', name: 'Daniel Gomez', course: 'SBIT-3A', task: 'Week 3 Quiz', date: '10 - 26 - 25 6:00pm', status: 'Late', remarks: '65/100' },
  { id: '23-1313', name: 'Olivia Cruz', course: 'SBIT-3Z', task: 'Week 3 Quiz', date: '10 - 26 - 25 7:00pm', status: 'On Time', remarks: '87/100' },
  { id: '23-1414', name: 'Nathaniel Reyes', course: 'SBIT-3T', task: 'Week 4 Project', date: '10 - 27 - 25 2:30pm', status: 'On Time', remarks: '91/100' },
  { id: '23-1515', name: 'Isabella Santos', course: 'SBIT-3A', task: 'Week 2 Activity 1', date: '10 - 25 - 25 11:50pm', status: 'On Time', remarks: '98/100' },
  { id: '23-1616', name: 'Gabriel Tan', course: 'SBIT-3Z', task: 'Week 4 Project', date: '10 - 27 - 25 3:30pm', status: 'On Time', remarks: '93/100' },
  { id: '23-1717', name: 'Ella Mae Cruz', course: 'SBIT-3T', task: 'Week 3 Quiz', date: '10 - 26 - 25 8:00pm', status: 'Late', remarks: '75/100' },
  { id: '23-1818', name: 'Leo Villanueva', course: 'SBIT-3A', task: 'Week 4 Project', date: '10 - 27 - 25 4:00pm', status: 'On Time', remarks: '89/100' },
  { id: '23-1919', name: 'Chloe Garcia', course: 'SBIT-3Z', task: 'Week 3 Quiz', date: '10 - 26 - 25 9:00pm', status: 'On Time', remarks: '92/100' },
  { id: '23-2020', name: 'Ryan Mendoza', course: 'SBIT-3T', task: 'Week 2 Activity 1', date: '10 - 25 - 25 11:59pm', status: 'On Time', remarks: '96/100' },
];

const TaskSubmissionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ task: 'All', section: 'All', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { user, logout } = useAuth();
  const itemsPerPage = 12;

  const uniqueSections = useMemo(() => ['All', ...new Set(SUBMISSION_DATA.map(item => item.course))], []);
  const uniqueTasks = useMemo(() => ['All', ...new Set(SUBMISSION_DATA.map(item => item.task))], []);

  const filteredData = useMemo(() => SUBMISSION_DATA.filter(row => {
    const searchMatch = Object.values(row).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()));
    if (!searchMatch) return false;
    if (filters.section !== 'All' && row.course !== filters.section) return false;
    if (filters.task !== 'All' && row.task !== filters.task) return false;
    if (filters.date && !row.date.includes(filters.date)) return false;
    return true;
  }), [searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getStatusStyle = status => {
    switch (status) {
      case 'On Time': return 'text-green-600 font-semibold';
      case 'Late': return 'text-amber-500 font-semibold';
      case 'No Task': return 'text-red-500 font-semibold';
      default: return 'text-gray-600';
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
      <td>${row.id}</td><td>${row.name}</td><td>${row.course}</td>
      <td>${row.task}</td><td>${row.date}</td><td>${row.status}</td><td>${row.remarks}</td>
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
      <div className="p-6 pt-32 font-poppins font-instrument bg-[#636CCB]">
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

              {/* Filters dropdown button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="bg-[#3C467B] hover:bg-[#3C467B]/80 border  px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm transition"
                >
                  <FunnelIcon className="h-5" /> Filters
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-[#3C467B] text-white rounded-lg shadow-lg p-4 z-50">
                    <label className="block mb-2 text-sm font-semibold">Section</label>
                    <select
                      value={filters.section}
                      onChange={e => handleFilterChange('section', e.target.value)}
                      className="w-full p-2 rounded-lg  bg-[#3C467B]  text-white outline-none mb-4"
                    >
                      {uniqueSections.map(section => <option key={section} value={section}>{section}</option>)}
                    </select>

                    <label className="block mb-2 text-sm font-semibold">Task</label>
                    <select
                      value={filters.task}
                      onChange={e => handleFilterChange('task', e.target.value)}
                      className="w-full p-2 rounded-lg  bg-[#3C467B]  text-white outline-none"
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
                className="bg-[#3C467B] hover: bg-[#3C467B] border px-4 py-2 rounded-lg flex items-center gap-2 text-white text-sm transition"
              >
                <ArrowDownTrayIcon className="h-5" /> Export List ({filteredData.length})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
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
                  <tr key={row.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 text-sm font-medium">{row.id}</td>
                    <td className="px-6 py-4 text-sm">{row.name}</td>
                    <td className="px-6 py-4 text-sm">{row.course}</td>
                    <td className="px-6 py-4 text-sm">{row.task}</td>
                    <td className="px-6 py-4 text-sm">{row.date}</td>
                    <td className={`px-6 py-4 text-sm ${getStatusStyle(row.status)}`}>{row.status}</td>
                    <td className="px-6 py-4 text-sm">{row.remarks}</td>
                    <td className="px-6 py-4 text-right">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 hover:text-[#3C467B] cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
