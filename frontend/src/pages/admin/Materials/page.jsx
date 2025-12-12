import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import NavBar from '../../../components/public/NavBar';
import toast from 'react-hot-toast';
import AddMaterial from './addMaterials/addPage';
import EditMaterial from './EditMaterials/editPage';
import jsPDF from "jspdf";
import * as XLSX from "xlsx"; // NEW: XLSX import
import "jspdf-autotable";

import {
  MagnifyingGlassIcon as SearchIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// IDAGDAG ANG LINYA NA ITO (Kukunin ang Render API URL mula sa .env)
const API_URL = import.meta.env.VITE_API_BASE_URL;

const MaterialsTable = () => {
  const { user, logout } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
    type: 'All',
    category: 'All'    // Lesson / Activity filter
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState(null); // track which material to edit
  const itemsPerPage = 12;

  // NEW: Export XLSX
  const handleExportXLSX = () => {
    try {
      // Prepare data for Excel (export filtered results, not only current page)
      const exportData = filteredData.map(item => ({
        "Item Code": item.item_code,
        "Item Name": item.item_name,
        "Item Type": item.item_type,
        "Deadline": item.date_deadline ? new Date(item.date_deadline).toLocaleString() : "-",
        "Item Score": item.item_grade
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Materials");

      XLSX.writeFile(workbook, "materials_list.xlsx");
      toast.success("XLSX Exported Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export XLSX.");
    }
  };

  // Fetch materials from API
  const fetchMaterials = async () => {
    // IDAGDAG ITO: Kunin ang token mula sa local storage
    const token = localStorage.getItem('token'); 
    
    // Kung walang token, huwag mag-fetch
    if (!token) {
        // Maaari mo ring i-toast ang error na kailangan muna mag-login
        console.warn("No token found. Cannot fetch materials.");
        return;
    }

    try {
      // API CALL UPDATED: Idagdag ang Authorization Header
      const res = await fetch(`${API_URL}/api/material/get`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // IDAGDAG ANG LINYA NA ITO
        }
      });
      
      const result = await res.json();
      if (result.success) {
        setMaterials(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch materials');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching materials from server');
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Get unique types for filter dropdown
  const uniqueTypes = useMemo(() => ['All', ...new Set(materials.map(item => item.item_type || 'File'))], [materials]);

  // Filtered data
  const filteredData = useMemo(() => {
    return materials.filter(item => {
      // 1. Search term filter
      const matchesSearch = Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (!matchesSearch) return false;

      // 2. Type filter
      if (filters.type !== "All" && item.item_type !== filters.type) return false;

      // 3. Category filter (Logic combined from the conflicting lines)
      if (filters.category === "Lesson") {
        // Lesson = Item Score is 0
        if (item.item_grade != 0) return false;
      } else if (filters.category === "Activity") {
        // Activity = Item Score is NOT 0 (i.e., has a score)
        if (item.item_grade == 0) return false;
      }

      return true;
    });
  }, [materials, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Handlers
  const handleAddMaterial = () => setIsAddModalOpen(true);
  const handleCloseAddMaterial = () => {
    setIsAddModalOpen(false);
    fetchMaterials();
  };

  const handleOpenEditMaterial = (id) => {
    setEditMaterialId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditMaterial = () => {
    setIsEditModalOpen(false);
    setEditMaterialId(null);
    fetchMaterials();
  };

  // Print
  const handlePrint = () => {
    const printContents = document.getElementById('materialsTable').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <>
      {user && <NavBar user={user} onLogout={logout} />}

      <div className="p-6 pt-32 font-poppins font-instrument bg-[#636CCB] min-h-screen">
        <div className="bg-[#3C467B] text-white p-8 rounded-xl shadow-xl mb-6">
          <h1 className="text-3xl font-semibold">List of Materials</h1>
          <p className="text-sm opacity-80 mt-1">List of all Course Materials</p>

          {/* Search + Filters + Buttons */}
          <div className="mt-6 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search Items"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full p-2 pl-10 bg-[#4A56A3] text-white rounded-lg text-sm outline-none shadow"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5" />
              </div>

              <div className="relative">
                <select
                  value={filters.type}
                  onChange={(e) => { setFilters({ ...filters, type: e.target.value }); setCurrentPage(1); }}
                  className="bg-[#4A56A3] text-white p-2 rounded-lg text-sm shadow outline-none cursor-pointer"
                >
                  {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => { setFilters({ ...filters, category: e.target.value }); setCurrentPage(1); }}
                  className="bg-[#4A56A3] text-white p-2 rounded-lg text-sm shadow outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Lesson">Lesson</option>
                  <option value="Activity">Activity</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              <button
                onClick={handleAddMaterial}
                className="bg-[#4A56A3] hover:bg-[#5a64b8] px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
              >
                <PlusIcon className="h-5" /> Add Material
              </button>

              <button
                onClick={handlePrint}
                className="bg-[#4A56A3] hover:bg-[#5a64b8] px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
              >
                <ArrowDownTrayIcon className="h-5" /> Export PDF
              </button>
              
              <button
                onClick={handleExportXLSX}
                className="bg-[#4A56A3] hover:bg-[#5a64b8] px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition"
              >
                <ArrowDownTrayIcon className="h-5" /> Export XLSX
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div id="materialsTable" className="bg-white rounded-xl shadow-xl p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#3C467B] text-white">
              <tr>
                {['Item Code', 'Item Name', 'Item Type', 'Deadline', 'Item Score', ''].map(header => (
                  <th
                    key={header}
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${header === '' ? 'text-right' : ''}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 text-base">
                    No results match the current search or filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map(item => (
                  <tr key={item.item_code} className="hover:bg-gray-50 transition duration-150 cursor-pointer"
                    onClick={() => handleOpenEditMaterial(item.item_code)}
                  >
                    <td className="px-6 py-4 text-left text-md font-medium">{item.item_code}</td>
                    <td className="px-6 py-4 text-left text-md">{item.item_name}</td>
                    <td className="px-6 py-4 text-left text-md">{item.item_type}</td>
                    <td className="px-6 py-4 text-left text-md">{item.date_deadline ? new Date(item.date_deadline).toLocaleString() : '-'}</td>
                    <td className="px-6 py-4 text-left text-md">{item.item_grade}</td>
                    <td className="px-6 py-4 text-right">
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-600 hover:text-[#3C467B]" />
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
              >&lt;</button>

              {pagesArray.map(num => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`w-8 h-8 rounded-lg text-sm transition ${num === currentPage ? 'bg-white text-[#3C467B]' : 'text-white hover:bg-[#4A56A3]'}`}
                >
                  {num}
                </button>
              ))}

              <button
                className="text-white px-2 hover:opacity-80 transition"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >&gt;</button>
            </div>
          </div>
        </div>
      </div>

      <AddMaterial isOpen={isAddModalOpen} onClose={handleCloseAddMaterial} />
      <EditMaterial isOpen={isEditModalOpen} onClose={handleCloseEditMaterial} id={editMaterialId} />
    </>
  );
};

export default MaterialsTable;