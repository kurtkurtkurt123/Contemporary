import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // ✅ Import ang App.jsx
import './index.css'; // Optional: Kung may global CSS ka

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* ✅ Render ang App component */}
  </React.StrictMode>,
);