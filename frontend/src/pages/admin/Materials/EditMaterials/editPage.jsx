import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const EditMaterial = ({ isOpen, onClose, id }) => {
  const [formData, setFormData] = useState({
    name: "",
<<<<<<< HEAD
    type: "Link",
=======
>>>>>>> test/supabase-migration
    description: "",
    deadline: "",
    score: "",
    acceptResponse: false,
<<<<<<< HEAD
    link: "",
  });

  // Fetch SINGLE material
=======
    fileUrl: "",
    newFile: null,
  });

  const [previewFile, setPreviewFile] = useState(""); // New: preview URL

  // Fetch single material
>>>>>>> test/supabase-migration
  useEffect(() => {
    if (!isOpen || !id) return;

    const fetchMaterial = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/material/${id}`);
        const result = await res.json();
<<<<<<< HEAD
=======

>>>>>>> test/supabase-migration
        if (!result.success) {
          toast.error("Failed to load material");
          return;
        }
<<<<<<< HEAD
=======

>>>>>>> test/supabase-migration
        const mat = result.data;

        setFormData({
          name: mat.item_name || "",
<<<<<<< HEAD
          type: mat.item_type || "Link",
=======
>>>>>>> test/supabase-migration
          description: mat.item_description || "",
          deadline: mat.date_deadline
            ? new Date(mat.date_deadline).toISOString().slice(0, 16)
            : "",
          score: mat.item_grade || "",
          acceptResponse: mat.is_accept || false,
<<<<<<< HEAD
          link: mat.item_link || "",
        });
=======
          fileUrl: mat.fileUrl || "",
          newFile: null,
        });
        setPreviewFile(mat.fileUrl || "");
>>>>>>> test/supabase-migration
      } catch (err) {
        console.error(err);
        toast.error("Server error");
      }
    };
<<<<<<< HEAD
=======

>>>>>>> test/supabase-migration
    fetchMaterial();
  }, [isOpen, id]);

  if (!isOpen) return null;

<<<<<<< HEAD
=======
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
>>>>>>> test/supabase-migration
  const handleSubmit = async () => {
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
<<<<<<< HEAD
      payload.append("type", formData.type);
      payload.append("description", formData.description);
      payload.append("deadline", formData.deadline);
      payload.append("grade", formData.score);
      payload.append("accept", formData.acceptResponse ? 1 : 0);
      payload.append("link", formData.link || "");
=======
      payload.append("description", formData.description);
      payload.append("deadline", formData.deadline || "");
      payload.append("grade", formData.score || 0);
      payload.append("accept", formData.acceptResponse ? 1 : 0);

      if (formData.newFile) payload.append("file", formData.newFile);
>>>>>>> test/supabase-migration

      const res = await fetch(`http://localhost:5000/api/material/${id}`, {
        method: "PUT",
        body: payload,
      });
<<<<<<< HEAD
      const result = await res.json();
=======

      const result = await res.json();

>>>>>>> test/supabase-migration
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

<<<<<<< HEAD
=======
  // Delete material
>>>>>>> test/supabase-migration
  const handleDelete = async () => {
    if (!confirm("Delete this material?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/material/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
<<<<<<< HEAD
=======

>>>>>>> test/supabase-migration
      if (result.success) {
        toast.success("Deleted successfully");
        onClose();
      } else {
<<<<<<< HEAD
        toast.error("Failed to delete");
=======
        toast.error("Failed to delete material");
>>>>>>> test/supabase-migration
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

<<<<<<< HEAD
  const openPreview = () => {
    if (!formData.link) return;
    window.open(formData.link, "_blank");
  };

  const downloadLink = () => {
    if (!formData.link) return;
    const linkEl = document.createElement("a");
    linkEl.href = formData.link;
    linkEl.target = "_blank";
    linkEl.download = ""; // Let browser handle name
    linkEl.click();
=======
  // Open PDF in new tab (public URL)
  // Open PDF in new tab (prioritize newly uploaded file)
  const viewFile = () => {
    const fileToOpen = formData.newFile ? previewFile : formData.fileUrl;

    if (!fileToOpen) {
      toast.error("No PDF file found");
      return;
    }

    window.open(fileToOpen, "_blank"); // opens in new tab
>>>>>>> test/supabase-migration
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
<<<<<<< HEAD
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] ">
        {/* HEADER */}
        <div className="bg-indigo-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Material</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-indigo-600 rounded p-1"
          >
=======
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-auto">
        {/* Header */}
        <div className="bg-indigo-500 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Material</h2>
          <button onClick={onClose} className="text-white hover:bg-indigo-600 rounded p-1">
>>>>>>> test/supabase-migration
            <X size={24} />
          </button>
        </div>

<<<<<<< HEAD
        <div className="p-6 space-y-6 overflow-y-auto h-[80vh]">
          {/* NAME */}
=======
        <div className="p-6 space-y-6 overflow-y-auto h-[70vh]">
          {/* Name */}
>>>>>>> test/supabase-migration
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
<<<<<<< HEAD
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
=======
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
>>>>>>> test/supabase-migration
              className="w-full px-3 py-2 border rounded"
            />
          </div>

<<<<<<< HEAD
          {/* TYPE */}
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-3 py-2 border rounded bg-white"
            >
              <option value="Link">Link</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
=======
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
>>>>>>> test/supabase-migration
              className="w-full px-3 py-2 border rounded"
            />
          </div>

<<<<<<< HEAD
          {/* LINK */}
          <div>
            <label className="block text-sm font-medium mb-2">Link</label>
            <input
              type="text"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {/* PREVIEW + DOWNLOAD */}
          {formData.link && (
            <div className="mt-4 border rounded overflow-hidden relative h-48">
              <iframe
                src={formData.link.replace("/edit", "/preview")}
                title="Preview"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
              <div className="absolute top-2 right-2 space-x-2">
                <button
                  onClick={openPreview}
                  className="bg-indigo-600 text-white text-xs px-2 py-1 rounded hover:bg-indigo-700"
                >
                  Open
                </button>
                <button
                  onClick={downloadLink}
                  className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {/* DEADLINE */}
=======
          {/* Deadline */}
>>>>>>> test/supabase-migration
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="datetime-local"
              value={formData.deadline}
<<<<<<< HEAD
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
=======
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
>>>>>>> test/supabase-migration
              className="w-full px-3 py-2 border rounded"
            />
          </div>

<<<<<<< HEAD
          {/* ACCEPT + SCORE */}
=======
          {/* Score & Accept */}
>>>>>>> test/supabase-migration
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.acceptResponse}
<<<<<<< HEAD
                onChange={(e) =>
                  setFormData({ ...formData, acceptResponse: e.target.checked })
                }
=======
                onChange={(e) => setFormData({ ...formData, acceptResponse: e.target.checked })}
>>>>>>> test/supabase-migration
                className="w-4 h-4"
              />
              <span className="ml-2">Accept Response</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Score</label>
              <input
                type="number"
                value={formData.score}
<<<<<<< HEAD
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
=======
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
>>>>>>> test/supabase-migration
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

<<<<<<< HEAD
          {/* ACTIONS */}
=======
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
>>>>>>> test/supabase-migration
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handleDelete}
              className="px-6 py-2.5 bg-red-700 text-white rounded hover:bg-red-800"
            >
              Delete
            </button>
<<<<<<< HEAD
=======

>>>>>>> test/supabase-migration
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
