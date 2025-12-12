// frontend/src/pages/admin/Students/page.jsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  MagnifyingGlassIcon as SearchIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../context/AuthContext';
import NavBar from '../../../components/public/NavBar';
import StudentInfoModal from './EditStudents/editPage';
import toast from 'react-hot-toast';
import * as XLSX from "xlsx";

// IDAGDAG ITO: API URL
const API_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem('token'); 

export default function StudentListTable() {
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ section: 'All', role: 'All' });
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const itemsPerPage = 10;

  // Fetch students and normalize data
  const fetchStudents = async () => {
    const token = getToken();
    if (!token) return toast.error("Login session expired.");

    try {
      // I-UPDATE ANG FETCH URL at IDAGDAG ANG HEADER
      const res = await fetch(`${API_URL}/api/student/get`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();

      if (result.success) {
        const mappedStudents = result.data.map(s => ({
          id: s.user_code || "", // Gamitin ang user_code
          name: s.name || "",
          email: s.email || "",
          course: s.course || "",
          registeredDate: s.registeredDate || "",
          role: s.role || "Student",
        }));
        setStudents(mappedStudents);
      } else {
        toast.error(result.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching students from server');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Dropdown options
  const uniqueSections = useMemo(() => ["All", ...new Set(students.map(s => s.course))], [students]);
  const uniqueRoles = useMemo(() => ["All", ...new Set(students.map(s => s.role))], [students]);

  // Filtered & paginated students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.id.includes(searchQuery);

      const matchesSection = filters.section === "All" || s.course === filters.section;
      const matchesRole = filters.role === "All" || s.role === filters.role;

      return matchesSearch && matchesSection && matchesRole;
    });
  }, [searchQuery, filters, students]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleEllipsisClick = (studentCode) => { // Gumamit ng user_code (id)
    const student = students.find(s => s.id === studentCode);
    if (!student) return toast.error('Student not found');

    setSelectedStudent(student);
    setIsModalOpen(true);
  };

const exportToExcel = () => {
  try {
    if (filteredStudents.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      filteredStudents.map(s => ({
        "Student ID": s.id,
        "Name": s.name,
        "Course": s.course,
        "Email": s.email,
        "Registered Date": s.registeredDate
          ? new Date(s.registeredDate).toLocaleDateString()
          : "",
        "Role": s.role,
      }))
    );

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    // Download
    XLSX.writeFile(workbook, "Student_List.xlsx");

    toast.success("Excel exported successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to export Excel file");
  }
};


  if (!user) return (
    <div className="text-center mt-32 text-white text-xl">
      You must be logged in to view this page.
    </div>
  );

  return (
    <>
      <NavBar user={user} onLogout={logout} />

      <div className="p-6 pt-32 font-poppins bg-[#636CCB] min-h-screen">
        <div className="bg-[#3C467B] text-white p-8 rounded-xl shadow-xl mb-6">
          <h1 className="text-3xl font-semibold">List of Students</h1>
          <p className="text-sm opacity-80 mt-1">
            List of all registered students
          </p>

          {/* Search + Filters */}
          <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search Students"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 pl-10 bg-[#4A56A3] text-white rounded-lg text-sm outline-none shadow"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5" />
              </div>

              {/* Section Filter */}
              <select
                value={filters.section}
                onChange={(e) => { setFilters(prev => ({ ...prev, section: e.target.value })); setCurrentPage(1); }}
                className="bg-[#4A56A3] text-white p-2 rounded-lg text-sm shadow outline-none cursor-pointer"
              >
                {uniqueSections.map(section => <option key={section}>{section}</option>)}
              </select>

              {/* Role Filter */}
              <select
                value={filters.role}
                onChange={(e) => { setFilters(prev => ({ ...prev, role: e.target.value })); setCurrentPage(1); }}
                className="bg-[#4A56A3] text-white p-2 rounded-lg text-sm shadow outline-none cursor-pointer"
              >
                {uniqueRoles.map(role => <option key={role}>{role}</option>)}
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button
                onClick={exportToExcel} // Changed to use exportToExcel
                className="bg-[#4A56A3] hover:bg-[#5a64b8] px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
              >
                <ArrowDownTrayIcon className="h-5" /> Export List
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-xl p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3C467B] text-white">
              <tr>
                {["Student ID", "Name", "Course", "Email", "Registered Date", "Role", ""].map(header => (
                  <th key={header} className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${header === "" ? "text-right" : ""}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500 text-base">
                    No results found.
                  </td>
                </tr>
              ) : paginatedStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">{student.id}</td>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.course}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.registeredDate ? new Date(student.registeredDate).toLocaleDateString() : "---"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${student.role === "Student" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                      {student.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEllipsisClick(student.id)}>
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 hover:text-[#3C467B]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2 bg-[#3C467B] p-3 rounded-lg">
              <button className="text-white px-2 hover:opacity-80" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {pagesArray.map(num => (
                <button key={num} onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-sm transition ${num === currentPage ? "bg-white text-[#3C467B]" : "text-white hover:bg-[#4A56A3]"}`}>
                  {num}
                </button>
              ))}

              <button className="text-white px-2 hover:opacity-80" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedStudent && (
        <StudentInfoModal
          isOpen={isModalOpen}
          onClose={() => {setIsModalOpen(false); setSelectedStudent(null)}}
          student={selectedStudent}
          onUpdate={fetchStudents} // refresh table after edits
        />
      )}
    </>
  );
}