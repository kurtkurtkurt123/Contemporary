import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
<<<<<<< HEAD
import toast from 'react-hot-toast';

const AddMaterial = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [deadline, setDeadline] = useState("");
    const [score, setScore] = useState("");
    const [noScore, setNoScore] = useState(false);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

    const getMinDateTime = () => {
        const now = new Date();
        const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16);
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setLink("");
        setDeadline("");
        setScore("");
        setNoScore(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!link) return toast.error("Please enter a link");

        const data = {
            name,
            type: "Link",
            description,
            deadline,
            score: noScore ? 0 : score === "" ? 0 : Number(score),
            noScore: noScore ? 1 : 0,
            link,
        };

        console.log("Sending JSON data:", data);

        try {
            const res = await fetch("http://localhost:5000/api/material/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Material added successfully!");
                resetForm();
                onClose();
            } else toast.error(result.message || "Failed to save material");
        } catch (error) {
            console.error("Error submitting material:", error);
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    if (!isOpen) return null;

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleClose}
        >
            <div
                className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-lg font-semibold text-gray-800">Add Material</h2>
                    <XMarkIcon
                        className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={handleClose}
                    />
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Week 2 Activity 1"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="About your material (optional)"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={3}
                            maxLength={255}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                        <input
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            placeholder="Attach your file link here"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    {/* Small preview */}
                    {link && (
                        <div className="mt-2 border rounded overflow-hidden relative h-48">
                            <iframe
                                src={link.replace("/edit", "/preview")}
                                title="Preview"
                                className="w-full h-full"
                                sandbox="allow-scripts allow-same-origin allow-popups"
                            />
                            <button
                                type="button"
                                onClick={() => setPreviewModalOpen(true)}
                                className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded hover:bg-indigo-700"
                            >
                                Preview More
                            </button>
                        </div>
                    )}

                    {/* Modal for large preview */}
                    {previewModalOpen && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                            onClick={() => setPreviewModalOpen(false)}
                        >
                            <div
                                className="bg-white w-full max-w-4xl h-[80vh] rounded-xl shadow-lg p-4 relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                                    onClick={() => setPreviewModalOpen(false)}
                                >
                                    Close
                                </button>
                                <iframe
                                    src={link.replace("/edit", "/preview")}
                                    title="Large Preview"
                                    className="w-full h-full border-none"
                                    sandbox="allow-scripts allow-same-origin allow-popups"
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                        <input
                            type="datetime-local"
                            value={deadline}
                            min={getMinDateTime()}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={noScore}
                                onChange={(e) => setNoScore(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Set material as no score</span>
                        </label>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Set Score</label>
                            <input
                                type="number"
                                value={score}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    if (value === "") setScore("");
                                    else if (value > 300) setScore("300");
                                    else if (value < 0) setScore("0");
                                    else setScore(String(value));
                                }}
                                min={0}
                                max={300}
                                disabled={noScore}
                                className="w-24 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Save Material
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
=======
import toast from "react-hot-toast";
import supabase from "../../../../../config/supabaseClient";

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

      const res = await fetch("http://localhost:5000/api/material/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
>>>>>>> test/supabase-migration
};

export default AddMaterial;
