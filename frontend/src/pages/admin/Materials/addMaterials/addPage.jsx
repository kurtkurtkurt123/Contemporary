// frontend/src/pages/admin/Materials/addMaterials/addPage.jsx

import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import supabase from "../../../../../config/supabaseClient";

// IDAGDAG ITO: API URL
const API_URL = import.meta.env.VITE_API_BASE_URL;
const getToken = () => localStorage.getItem('token'); 

const AddMaterial = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [score, setScore] = useState("");
  const [noScore, setNoScore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMinDateTime = () => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a PDF file");
    const token = getToken(); // Kumuha ng token
    if (!token) return toast.error("Login session expired.");

    setIsSubmitting(true);

    try {
      const fileExt = file.name.split(".").pop();
      const itemCode = `MAT-${Date.now()}`;
      const filePath = `${itemCode}/${crypto.randomUUID()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("materials")
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("materials")
        .getPublicUrl(filePath);

      const fileUrl = publicData.publicUrl;

      // I-UPDATE ANG FETCH URL at IDAGDAG ANG HEADER
      const res = await fetch(`${API_URL}/api/material/create`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}` // IDAGDAG ANG HEADER
        },
        body: JSON.stringify({
          name,
          description,
          deadline,
          score: noScore ? 0 : Number(score),
          noScore,
          fileUrl,
        }),
      });

      const result = await res.json();

      if (!result.success) throw new Error(result.message || "Failed to save material");

      toast.success("Material added successfully!");
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setFile(null);
    setDeadline("");
    setScore("");
    setNoScore(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-indigo-600 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Add Material</h2>
          <XMarkIcon
            className="h-6 w-6 text-white cursor-pointer hover:text-gray-200"
            onClick={onClose}
          />
        </div>

        {/* Form */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter material name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Enter description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload PDF</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full"
              required
            />

            {/* Preview button */}
            {file && (
              <button
                type="button"
                onClick={() => {
                  const url = URL.createObjectURL(file);
                  window.open(url, "_blank");
                }}
                className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Preview PDF
              </button>
            )}
          </div>


          {/* Deadline & Score */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="datetime-local"
                value={deadline}
                min={getMinDateTime()}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Score</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                disabled={noScore}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* No Score Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={noScore}
              onChange={(e) => setNoScore(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">No Score</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Uploading..." : "Save Material"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMaterial;