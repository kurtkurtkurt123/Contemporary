import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import NavBar from '../../../components/public/NavBar';
import { useAuth } from '../../../context/AuthContext';
import supabase from '../../../../config/supabaseClient';
import toast from 'react-hot-toast';

export default function ActivityCards() {
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [file, setFile] = useState(null);
    const [comments, setComments] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);

    // Fetch activities for the user
    useEffect(() => {
        const fetchActivities = async () => {
            if (!user?.user_id) {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(`http://localhost:5000/api/activity/get?student_id=${user.user_id}`);
                const result = await res.json();
                if (result.success) setActivities(result.data);
                else toast.error(result.message || "Failed to fetch activities.");
            } catch (err) {
                console.error(err);
                toast.error("Error fetching activities.");
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, [user]);

    // Filter activities based on search, status, date range
    const filteredActivities = activities
        .filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' ? true : a.status === statusFilter;
            const postedDate = a.postedDate ? new Date(a.postedDate) : null;
            const matchesStartDate = startDate ? postedDate >= new Date(startDate) : true;
            const matchesEndDate = endDate ? postedDate <= new Date(endDate) : true;
            return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
        })
        .map(a => {
            const now = new Date();
            const deadline = a.dueDate ? new Date(a.dueDate) : null;

            let status = "Pending";
            let statusColor = "text-yellow-400";

            if (!a.submittedFile) {
                if (deadline && now > deadline) {
                    status = "Empty (Missed)";
                    statusColor = "text-red-400";
                }
            } else {
                const submittedDate = a.submittedDate ? new Date(a.submittedDate) : null;

                if (deadline && submittedDate && submittedDate > deadline) {
                    if (a.is_accept) {
                        status = "Submitted Late";
                        statusColor = "text-orange-400";
                    } else {
                        status = "Submitted";
                        statusColor = "text-green-400";
                    }
                } else {
                    status = "Submitted";
                    statusColor = "text-green-400";
                }
            }

            // Determine if the user can submit a task
            // Disabled if past deadline and late submissions not accepted
            const canSubmit = !deadline || now <= deadline || a.is_accept;

            return { ...a, status, statusColor, canSubmit };
        });


    const handleCardClick = (material) => {
        setSelectedMaterial(material);
        setModalOpen(true);
    };

    // Submit task
    const handleSubmit = async () => {
        if (!file) return toast.error("Please select a file.");

        setSubmitLoading(true);

        try {
            // Generate a unique file path in Supabase "materials" bucket
            const fileExt = file.name.split(".").pop();
            const filePath = `tasks/${selectedMaterial.id}_${user.user_id}_${Date.now()}.${fileExt}`;

            // Upload file to Supabase
            const { error: uploadError } = await supabase.storage
                .from("materials")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // POST to backend using material_id
            const res = await fetch("http://localhost:5000/api/activity/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    material_id: selectedMaterial.id,  // matches backend
                    user_id: user.user_id,
                    task_name: selectedMaterial.title,
                    task_desc: selectedMaterial.description,
                    task_file: filePath,
                    remarks: comments
                })
            });

            const text = await res.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                throw new Error(`Invalid JSON response: ${text}`);
            }

            if (result.success) {
                toast.success(`Task submitted! Code: ${result.task_code}, Status: ${result.status}`);
                setModalOpen(false);
                setFile(null);
                setComments('');
            } else {
                toast.error(result.message || "Submission failed.");
            }

        } catch (err) {
            console.error(err);
            toast.error("Server error during submission.");
        } finally {
            setSubmitLoading(false);
        }
    };



    if (!user) {
        return <div className="text-center mt-32 text-white text-xl">You must be logged in to view this page.</div>;
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 font-sans">
                <NavBar user={user} onLogout={logout} />

                {/* Header + Filters/Search */}
                <header className="bg-[#3C467B] text-white pt-32 pb-12 px-4 md:px-6 fixed w-full z-40 shadow-md">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-2xl font-semibold tracking-wide">
                            Welcome, {user?.user_fn} {user?.user_ln}
                        </h1>

                        <div className="relative w-full md:w-auto">
                            <button
                                onClick={() => setFiltersOpen(!filtersOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium md:hidden"
                            >
                                <Filter size={16} />
                                Filters & Search
                                {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {/* Desktop Filters + Search */}
                            <div className="hidden md:flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        onClick={() => setFiltersOpen(!filtersOpen)}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium"
                                    >
                                        <Filter size={16} /> Filters {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>

                                    {filtersOpen && (
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <label className="text-gray-700 text-sm font-medium">Status:</label>
                                                <select
                                                    value={statusFilter}
                                                    onChange={e => setStatusFilter(e.target.value)}
                                                    className="px-2 py-1 rounded-lg text-sm text-gray-700 flex-grow"
                                                >
                                                    <option value="All">All</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Submitted">Submitted</option>
                                                    <option value="Submitted Late">Submitted Late</option>
                                                    <option value="Empty (Missed)">Empty</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center gap-2 mb-2">
                                                <label className="text-gray-700 text-sm font-medium">From:</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={e => setStartDate(e.target.value)}
                                                    className="px-2 py-1 rounded-lg text-sm text-gray-700 flex-grow"
                                                />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <label className="text-gray-700 text-sm font-medium">To:</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={e => setEndDate(e.target.value)}
                                                    className="px-2 py-1 rounded-lg text-sm text-gray-700 flex-grow"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex bg-white rounded-lg overflow-hidden w-full md:w-80">
                                    <input
                                        type="text"
                                        placeholder="Search Activity"
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="flex-grow px-4 py-2 text-gray-700 focus:outline-none text-sm"
                                    />
                                    <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 flex items-center justify-center">
                                        <Search size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Dropdown Filters/Search */}
                            {filtersOpen && (
                                <div className="flex flex-col gap-2 md:hidden mt-2 bg-white p-4 rounded-lg shadow-lg">
                                    <div className="flex items-center gap-2">
                                        <label className="text-gray-700 text-sm font-medium">Status:</label>
                                        <select
                                            value={statusFilter}
                                            onChange={e => setStatusFilter(e.target.value)}
                                            className="px-2 py-1 rounded-lg text-sm text-gray-700 flex-grow"
                                        >
                                            <option value="All">All</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Submitted">Submitted</option>
                                            <option value="Submitted Late">Submitted Late</option>
                                            <option value="Empty (Missed)">Empty</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="text-gray-700 text-sm font-medium">From:</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={e => setStartDate(e.target.value)}
                                            className="px-2 py-1 rounded-lg text-sm text-gray-700 flex-grow"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <label className="text-gray-700 text-sm font-medium">To:</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            className="px-2 py-1 rounded-lg text-sm text-gray-700 flex-grow"
                                        />
                                    </div>

                                    <div className="flex bg-gray-100 rounded-lg overflow-hidden mt-2">
                                        <input
                                            type="text"
                                            placeholder="Search Activity"
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="flex-grow px-4 py-2 text-gray-700 focus:outline-none text-sm"
                                        />
                                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 flex items-center justify-center">
                                            <Search size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Activity Cards */}
                <main className="max-w-7xl mx-auto p-4 md:p-6 md:pt-64 pt-72 overflow-y-auto">
                    {loading ? (
                        <div className="text-center text-gray-500 py-10">Loading activities...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredActivities.length === 0 ? (
                                <div className="col-span-full text-center text-gray-500 py-10">
                                    No activities found.
                                </div>
                            ) : filteredActivities.map(activity => (
                                <div
                                    key={activity.id}
                                    onClick={() => handleCardClick(activity)}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition cursor-pointer"
                                >
                                    <div className="h-200 relative bg-gray-200 overflow-hidden rounded-lg">
                                        {activity.fileUrl ? (
                                            <iframe
                                                src={activity.fileUrl}
                                                title={activity.title}
                                                className="w-full h-full pointer-events-none"
                                                frameBorder="0"
                                                allowFullScreen
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                No Preview
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-[#50589C] p-5 text-white flex-grow flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold mb-3">{activity.title}</h3>
                                            <div className="space-y-1 text-xs text-indigo-100 opacity-90">
                                                {activity.dueDate && (
                                                    <div className="flex">
                                                        <span className="w-20 font-medium opacity-70">Due:</span>
                                                        <span>{activity.dueDate}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {activity.dueDate && activity.status && (
                                            <div className={`mt-4 text-xs font-bold uppercase tracking-wide ${activity.statusColor}`}>
                                                {activity.status}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Task Submission Modal */}
            {modalOpen && selectedMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
                        <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                            <X size={20} />
                        </button>

                        <h2 className="text-lg font-semibold mb-2">{selectedMaterial.title}</h2>
                        <p className="text-sm mb-4">{selectedMaterial.description}</p>

                        {selectedMaterial.fileUrl && (
                            <div className="mb-4 h-48">
                                <iframe
                                    src={selectedMaterial.fileUrl}
                                    title={selectedMaterial.title}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        )}

                        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
                        {file && <div className="mb-2 text-sm text-gray-700">Selected file: {file.name}</div>}

                        <textarea
                            placeholder="Add comments (optional)"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className="border px-3 py-2 rounded-md text-sm w-full mb-4"
                        />
                       
                        <button
                            onClick={handleSubmit}
                            disabled={submitLoading}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md w-full"
                        >
                            {submitLoading ? "Submitting..." : "Submit Task"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
