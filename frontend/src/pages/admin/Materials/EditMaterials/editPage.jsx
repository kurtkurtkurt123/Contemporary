import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

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

  // Fetch single material
  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchMaterial = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/material/${id}`);
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
      return;
    }
    setFormData({ ...formData, newFile: file });
  };

  // Submit update
  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("deadline", formData.deadline || "");
      payload.append("grade", formData.score || 0);
      payload.append("accept", formData.acceptResponse ? 1 : 0);

      if (formData.newFile) payload.append("file", formData.newFile);

      const res = await fetch(`http://localhost:5000/api/material/${id}`, {
        method: "PUT",
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

    try {
      const res = await fetch(`http://localhost:5000/api/material/${id}`, {
        method: "DELETE",
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
  const openMaterial = () => {
    if (!formData.fileUrl) {
      toast.error("No PDF file found");
      return;
    }
    window.open(formData.fileUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh]">
        {/* Header */}
        <div className="bg-indigo-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Material</h2>
          <button onClick={onClose} className="text-white hover:bg-indigo-600 rounded p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto h-[80vh]">
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

          {/* File */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Upload New PDF</label>
            <input type="file" onChange={handleFileChange} className="w-full" />

            <button
              onClick={openMaterial}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Open PDF in New Tab
            </button>
          </div>

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
