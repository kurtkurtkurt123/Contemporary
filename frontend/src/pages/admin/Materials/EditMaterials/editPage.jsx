// frontend/src/pages/admin/Materials/EditMaterials/editPage.jsx

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

// IDAGDAG ITO: API URL
const API_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem('token'); 

const EditMaterial = ({ isOpen, onClose, id }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    deadline: "",
    score: "",
    acceptResponse: false,
    fileUrl: "",
    newFile: null,
  });

  const [previewFile, setPreviewFile] = useState(""); 

  // Fetch single material
  useEffect(() => {
    if (!isOpen || !id) return;
    const token = getToken();
    if (!token) return toast.error("Login session expired.");

    const fetchMaterial = async () => {
      try {
        // I-UPDATE ANG FETCH URL at IDAGDAG ANG HEADER
        const res = await fetch(`${API_URL}/api/material/${id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (!result.success) {
          toast.error("Failed to load material");
          return;
        }
        const mat = result.data;

        setFormData({
          name: mat.item_name || "",
          description: mat.item_description || "",
          deadline: mat.date_deadline
            ? new Date(mat.date_deadline).toISOString().slice(0, 16)
            : "",
          score: mat.item_grade || "",
          acceptResponse: mat.is_accept || false,
          fileUrl: mat.fileUrl || "",
          newFile: null,
        });
        setPreviewFile(mat.fileUrl || "");
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      }
    };
    fetchMaterial();
  }, [isOpen, id]);

  if (!isOpen) return null;

  // Handle new PDF upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      e.target.value = null;
      return;
    }
    setFormData({ ...formData, newFile: file });
    if (file) setPreviewFile(URL.createObjectURL(file)); // Update preview
  };

  // Submit update
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) return toast.error("Login session expired.");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("deadline", formData.deadline || "");
      payload.append("grade", formData.score || 0);
      payload.append("accept", formData.acceptResponse ? 1 : 0);

      if (formData.newFile) payload.append("file", formData.newFile);

      // I-UPDATE ANG FETCH URL at IDAGDAG ANG HEADER
      const res = await fetch(`${API_URL}/api/material/${id}`, {
        method: "PUT",
        headers: { 'Authorization': `Bearer ${token}` }, // IDAGDAG ANG HEADER
        body: payload,
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Saved successfully");
        onClose();
      } else {
        toast.error(result.message || "Failed to save material");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Delete material
  const handleDelete = async () => {
    if (!confirm("Delete this material?")) return;
    const token = getToken();
    if (!token) return toast.error("Login session expired.");

    try {
      // I-UPDATE ANG FETCH URL at IDAGDAG ANG HEADER
      const res = await fetch(`${API_URL}/api/material/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` } // IDAGDAG ANG HEADER
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Deleted successfully");
        onClose();
      } else {
        toast.error("Failed to delete material");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Open PDF in new tab (public URL)
  // Open PDF in new tab (prioritize newly uploaded file)
  const viewFile = () => {
    const fileToOpen = formData.newFile ? previewFile : formData.fileUrl;

    if (!fileToOpen) {
      toast.error("No PDF file found");
      return;
    }

    window.open(fileToOpen, "_blank"); // opens in new tab
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-auto">
        {/* Header */}
        <div className="bg-indigo-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Material</h2>
          <button onClick={onClose} className="text-white hover:bg-indigo-600 rounded p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto h-[70vh]">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* Score & Accept */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acceptResponse}
                onChange={(e) => setFormData({ ...formData, acceptResponse: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="ml-2">Accept Response</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Score</label>
              <input
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* File Upload & View */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Upload New PDF</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            <button
              onClick={viewFile}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              View File
            </button>
          </div>

          {/* Preview (small for newly uploaded file only) */}
          {formData.newFile && previewFile && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Preview of New File:</p>
              <iframe
                src={previewFile}
                title="PDF Preview"
                className="w-48 h-48 border rounded"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handleDelete}
              className="px-6 py-2.5 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Delete
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial;