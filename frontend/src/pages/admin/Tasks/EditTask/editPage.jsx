import React, { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentTaskModal({ taskId, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState(null);
  const [score, setScore] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchTask = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/task/${taskId}`);
      const data = await res.json();
      if (data.success) {
        setTask(data.data);
        setScore(data.data.remarks || ''); // Use remarks field as score
      } else {
        toast.error(data.message || "Failed to fetch task");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTask();
    else {
      setTask(null);
      setScore('');
    }
  }, [isOpen, taskId]);

  const handleCopyLink = (link) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast.success('Link copied!');
  };

  const handlePreview = (link) => {
    if (!link) return;
    setPreviewUrl(link);
    setShowPreview(true);
  };

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
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Preview Modal */}
      {showPreview && (
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
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-500 px-6 py-4 flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">Student Task</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
              <X size={24} />
            </button>
          </div>

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
            )}
          </div>
        </div>
      </div>
    </>
  );
}
