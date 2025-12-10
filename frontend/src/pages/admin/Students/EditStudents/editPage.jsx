import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentInfoModal({ isOpen, onClose, student, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    courseSection: '',
    dateRegistered: '',
    role: 'Student',
  });

  useEffect(() => {
    if (!isOpen || !student) return;

    setLoading(true);
    const { id, name, email, course, registeredDate, role } = student;

    setIsStaff(role?.toLowerCase() === 'staff');
    setFormData({
      studentId: id,
      name,
      email,
      courseSection: course,
      dateRegistered: registeredDate,
      role
    });


    setLoading(false);
  }, [isOpen, student]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/student/assign/${formData.studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newRole: isStaff ? 'staff' : 'student' }),
      });
      if (!res.ok) throw new Error('Failed to update student role');

      toast.success('Student role updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error updating student role');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/student/delete/${formData.studentId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete student');

      toast.success('Student deleted successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error deleting student');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-10">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Student Information</h2>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[90vh] overflow-y-auto">
          {loading ? (
            <div className="text-center text-gray-700">Loading student data...</div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-6xl font-bold text-white">
                    {formData.name?.split(' ')[0]?.[0]}{formData.name?.split(' ')[1]?.[0]}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Student ID', value: formData.studentId },
                  { label: 'Name', value: formData.name },
                  { label: 'Email', value: formData.email },
                  { label: 'Course & Section', value: formData.courseSection },
                  { label: 'Date Registered', value: formData.dateRegistered },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-gray-700 font-semibold mb-2">{f.label}</label>
                    <input
                      type="text"
                      value={f.value}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <label className="text-gray-700 font-semibold">Assign this student as staff</label>
                <input
                  type="checkbox"
                  checked={isStaff}
                  onChange={e => setIsStaff(e.target.checked)}
                  className="w-5 h-5 accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="mt-6">
                <label className="block text-gray-700 font-semibold mb-2">Role</label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-indigo-600 font-medium">
                  {isStaff ? 'Staff' : 'Student'}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow-md"
                  disabled={loading}
                >
                  Delete
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg shadow-md"
                  disabled={loading}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
