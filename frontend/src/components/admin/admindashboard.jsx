import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Ito ang main dashboard container ng Admin
const AdminDashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      
      {/* ADMIN SIDEBAR */}
      <nav style={{ width: '200px', background: '#333', color: 'white', height: '100vh' }}>
        <h2>Admin Panel</h2>
        <ul>
           <li><Link to="/admin/dashboard">Overview</Link></li>
           <li><Link to="/admin/users">Manage Users</Link></li>
           <li><Link to="/admin/settings">Settings</Link></li>
        </ul>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Welcome Admin!</h1>
        
        {/* Nested Routes sa loob ng Admin Dashboard */}
        <Routes>
            <Route path="dashboard" element={<div>Stats and Charts here</div>} />
            <Route path="users" element={<div>List of all users here</div>} />
            <Route path="settings" element={<div>System Configuration</div>} />
        </Routes>
      </div>

    </div>
  );
};

export default AdminDashboard;