import React, { useState, useEffect } from "react";
import { X, Save, FileText, BookOpen, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function StudentTaskModal({ taskId, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [maxScore, setMaxScore] = useState(null);
  const [remarksError, setRemarksError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/task/${taskId}`);
      const { success, data, message } = await res.json();

      if (!success) return toast.error(message || "Failed to fetch task");
      console.log(data);
      setTask(data);
      setRemarks(data.remarks ?? "");
      setMaxScore(data.maxScore ?? null);
    } catch {
      toast.error("Error fetching task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTask();
    else {
      setTask(null);
      setRemarks("");
      setRemarksError("");
      setMaxScore(null);
    }
  }, [isOpen, taskId]);

  const handlePreview = (link) => {
    if (!link) return;
    setPreviewUrl(link);
    setShowPreview(true);
  };

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
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4">
          <div className="w-full h-full max-w-6xl bg-white rounded-lg overflow-hidden">
            <div className="bg-indigo-700 px-4 py-3 flex justify-between items-center">
              <span className="text-white text-lg">File Preview</span>
              <button onClick={() => setShowPreview(false)} className="text-white">
                <X size={22} />
              </button>
            </div>
            <iframe src={previewUrl} className="w-full h-full" title="Preview" />
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center min-h-screen justify-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white text-xl">Student Task Information</h2>
            <button onClick={onClose} className="text-white">
              <X size={24} />
            </button>
          </div>

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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
