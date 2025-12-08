import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import NavBar from '../../../components/public/NavBar';
import toast from 'react-hot-toast';
import AddMaterial from './addMaterials/addPage';
import EditMaterial from './EditMaterials/editPage';
import { MagnifyingGlassIcon as SearchIcon, ArrowDownTrayIcon, EllipsisVerticalIcon, PlusIcon } from '@heroicons/react/24/outline';

const MaterialsTable = () => {
  const { user, logout } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: 'All' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState(null); // track which material to edit
  const itemsPerPage = 12;

  // Fetch materials from API
  const fetchMaterials = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/material/get');
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
      const matchesSearch = Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!matchesSearch) return false;
      if (filters.type !== 'All' && item.item_type !== filters.type) return false;
      return true;
    });
  }, [materials, searchTerm, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleAddMaterial = () => setIsAddModalOpen(true);
  const handleCloseAddMaterial = () => {
    setIsAddModalOpen(false);
    fetchMaterials();
  };

  // Open edit modal for a specific material
  const handleOpenEditMaterial = (id) => {
    setEditMaterialId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditMaterial = () => {
    setIsEditModalOpen(false);
    setEditMaterialId(null);
    fetchMaterials();
  };

  const handleExport = () => {
    alert('Export List clicked!');
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
                  onChange={(e) => { setFilters({ type: e.target.value }); setCurrentPage(1); }}
                  className="bg-[#4A56A3] text-white p-2 rounded-lg text-sm shadow outline-none cursor-pointer"
                >
                  {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
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
                onClick={handleExport}
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
                {['Item Code', 'Item Name', 'Date Uploaded', 'Item Type', 'Deadline', 'Item Score', ''].map(header => (
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
                  <td colSpan={7} className="text-center py-10 text-gray-500 text-base">
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
                    <td className="px-6 py-4 text-left text-md">{new Date(item.date_uploaded).toLocaleString()}</td>
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
