<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Save } from 'lucide-react';
import toast from 'react-hot-toast';
=======
import React, { useState, useEffect } from "react";
import { X, Save, FileText, BookOpen, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
>>>>>>> test/supabase-migration

export default function StudentTaskModal({ taskId, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
<<<<<<< HEAD
  const [score, setScore] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
=======
  const [remarks, setRemarks] = useState("");
  const [maxScore, setMaxScore] = useState(null);
  const [remarksError, setRemarksError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
>>>>>>> test/supabase-migration

  const fetchTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/task/${taskId}`);
<<<<<<< HEAD
      const data = await res.json();
      if (data.success) {
        setTask(data.data);
        setScore(data.data.remarks || ''); // Use remarks field as score
      } else {
        toast.error(data.message || "Failed to fetch task");
      }
    } catch (error) {
      console.error(error);
=======
      const { success, data, message } = await res.json();

      if (!success) return toast.error(message || "Failed to fetch task");
      console.log(data);
      setTask(data);
      setRemarks(data.remarks ?? "");
      setMaxScore(data.maxScore ?? null);
    } catch {
>>>>>>> test/supabase-migration
      toast.error("Error fetching task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTask();
    else {
      setTask(null);
<<<<<<< HEAD
      setScore('');
    }
  }, [isOpen, taskId]);

  const handleCopyLink = (link) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast.success('Link copied!');
  };

=======
      setRemarks("");
      setRemarksError("");
      setMaxScore(null);
    }
  }, [isOpen, taskId]);

>>>>>>> test/supabase-migration
  const handlePreview = (link) => {
    if (!link) return;
    setPreviewUrl(link);
    setShowPreview(true);
  };

<<<<<<< HEAD
  const handleSave = async () => {
    if (!task) return;

    // Validate score
    if (score && task.item_grade && Number(score) > task.item_grade) {
      toast.error(`Score cannot exceed maximum of ${task.item_grade}`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/task/score/${task.task_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remarks: score }) // Store score in remarks
      });
      const data = await res.json();

      if (data.success) {
        setTask({ ...task, remarks: score });
        toast.success('Score updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update score');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating score');
=======
  const handleRemarksChange = (value) => {
    setRemarks(value);
    if (maxScore !== null && Number(value) > Number(maxScore)) {
      setRemarksError(`Remarks cannot exceed ${maxScore}`);
    } else if (Number(value) < 0) {
      setRemarksError("Remarks cannot be negative");
    } else {
      setRemarksError("");
    }
  };

  const handleSave = async () => {
    if (!task || remarksError) return toast.error("Fix errors before saving.");

    try {
      const res = await fetch(
        `http://localhost:5000/api/task/score/${task.task_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            remarks: Number(remarks),
            comments: task.comments || "",
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        toast.success("Remarks updated.");
        fetchTask();
      } else {
        toast.error(json.message || "Failed to update.");
      }
    } catch {
      toast.error("Error updating remarks");
>>>>>>> test/supabase-migration
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Preview Modal */}
      {showPreview && (
<<<<<<< HEAD
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
              <h3 className="text-white text-lg font-medium">Link Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewUrl}
                className="w-full h-full border-0"
                title="Link Preview"
              />
            </div>
=======
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl bg-white rounded-lg overflow-hidden">
            <div className="bg-indigo-700 px-4 py-3 flex justify-between items-center">
              <span className="text-white text-lg">File Preview</span>
              <button onClick={() => setShowPreview(false)} className="text-white">
                <X size={22} />
              </button>
            </div>
            <iframe src={previewUrl} className="w-full h-full" title="Preview" />
>>>>>>> test/supabase-migration
          </div>
        </div>
      )}

      {/* Main Modal */}
<<<<<<< HEAD
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-500 px-6 py-4 flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">Student Task</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
=======
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center min-h-screen justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl">Student Task Information</h2>
            <button onClick={onClose} className="text-white">
>>>>>>> test/supabase-migration
              <X size={24} />
            </button>
          </div>

<<<<<<< HEAD
          {/* Content */}
          <div className="p-6 space-y-6">
            {loading ? (
              <div className="text-center text-gray-700">Loading task data...</div>
            ) : task ? (
              <>
                {/* Student Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={task.studentName || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={task.studentId || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    value={task.task_desc || ''}
                    readOnly
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed resize-none"
                  />
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Student Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={task.task_link || ''}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <button onClick={() => handleCopyLink(task.task_link)} className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" disabled={!task.task_link}><Copy size={18} /></button>
                      <button onClick={() => handlePreview(task.task_link)} className="px-3 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white" disabled={!task.task_link}><ExternalLink size={18} /></button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Material Link</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={task.item_link || ''}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <button onClick={() => handleCopyLink(task.item_link)} className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300" disabled={!task.item_link}><Copy size={18} /></button>
                      <button onClick={() => handlePreview(task.item_link)} className="px-3 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 text-white" disabled={!task.item_link}><ExternalLink size={18} /></button>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Score {task.item_grade && `/ ${task.item_grade}`}
                  </label>
                  <input
                    type="number"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    min="0"
                    max={task.item_grade || undefined}
                    placeholder="Enter score"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg mt-2 flex items-center gap-2"
                >
                  <Save size={18} /> Save
                </button>

                {/* Date Submitted & Status */}
                <div className="flex justify-between mt-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Date Submitted</label>
                    <div className="text-gray-600">
                      {task.date_submitted ? new Date(task.date_submitted).toLocaleString('en-US', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      }) : '---'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Status</label>
                    <div className={`text-center py-2 px-4 rounded-lg font-medium ${task.status === 'ontime' ? 'bg-green-600 text-white' :
                      task.status === 'late' ? 'bg-orange-500 text-white' :
                        'bg-red-700 text-white'
                      }`}>
                      {task.status === 'ontime' ? 'On time' : task.status === 'late' ? 'Late' : 'No task'}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-700">No task data found.</div>
=======
          <div className="p-7 space-y-8">
            {loading ? (
              <div className="text-center text-gray-600">Loading...</div>
            ) : task ? (
              <>
                {/* Student Info */}
                <div className="bg-gray-50 border rounded-lg p-5">
                  <h3 className="text-gray-800 text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen size={20} /> Student Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input value={task.studentName} readOnly className="px-4 py-2 border rounded bg-gray-100" />
                    <input value={task.studentId} readOnly className="px-4 py-2 border rounded bg-gray-100" />
                    <input value={task.course} readOnly className="px-4 py-2 border rounded bg-gray-100" />
                  </div>
                </div>

                {/* Material File */}
                {task.materialFileUrl && (
                  <div className="bg-gray-50 border rounded-lg p-5">
                    <label className="block text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={18} /> Material File
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={task.materialFileName || "No Name"}
                        readOnly
                        className="px-4 py-2 border rounded bg-gray-100 flex-1"
                      />
                      <button
                        onClick={() => handlePreview(task.materialFileUrl)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                )}

                {/* Submitted File */}
                {task.submittedFile && (
                  <div className="bg-gray-50 border rounded-lg p-5">
                    <label className="block text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={18} /> Submitted File
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={task.submittedFile}
                        readOnly
                        className="px-4 py-2 border rounded bg-gray-100 flex-1"
                      />
                      <button
                        onClick={() => handlePreview(task.submittedFile)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                )}

                {/* Remarks */}
                <div className="bg-gray-50 border rounded-lg p-5">
                  <label className="block text-gray-700 mb-2">
                    Remarks / Score {maxScore ? `/ ${maxScore}` : ""}
                  </label>
                  <input
                    type="number"
                    value={remarks}
                    onChange={(e) => handleRemarksChange(e.target.value)}
                    className={`px-4 py-2 border rounded w-full ${remarksError ? "border-red-500 bg-red-50" : ""}`}
                  />
                  {remarksError && (
                    <div className="flex items-center gap-2 text-red-600 mt-2">
                      <AlertTriangle size={18} /> {remarksError}
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={!!remarksError || remarks === ""}
                  className={`px-5 py-3 rounded-lg flex items-center gap-2 ml-auto ${
                    remarksError || remarks === ""
                      ? "bg-gray-400 text-gray-200"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  <Save size={18} /> Save Remarks
                </button>
              </>
            ) : (
              <div className="text-center text-gray-600">Task not found.</div>
>>>>>>> test/supabase-migration
            )}
          </div>
        </div>
      </div>
    </>
  );
}
