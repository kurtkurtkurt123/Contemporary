import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Home from "./pages/Home.jsx";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard.jsx";
import TaskSubmissionList from "./pages/admin/Tasks/page.jsx";
import MaterialsTable from "./pages/admin/Materials/page.jsx";
import StudentListTable from "./pages/admin/Students/page.jsx";
import ActivityCards from "./pages/student/activity/activityPage.jsx";

<<<<<<< HEAD
// Imports ng Pages - KELANGAN TUMUGMA SA FILE NAME (CASE-SENSITIVE!)
import Login from "./pages/login.jsx";       
import Register from "./pages/register.jsx"; 
import Unauthorized from "./pages/Unauthorized.jsx"; 
import Home from "./pages/Home.jsx"; 
// REMOVED: import AboutPage from "./pages/AboutPage.jsx"; 
import LessonPage from "./pages/LessonsPage.jsx"; 
import ActivitiesPage from "./pages/ActivitiesPage.jsx"; 
import StudentDashboard from "./pages/StudentDashboard.jsx"; 

// Placeholder Components
const AdminDashboard = () => <h1>Admin Dashboard Placeholder</h1>;
const InstructorDashboard = () => <h1>InstructorDashboard Placeholder</h1>;
// REMOVED: AboutPage placeholder definition
=======

>>>>>>> test/supabase-migration


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

// Wrapper for auth initialization
function AppContent() {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold">
          Loading Application and Checking Credentials...
        </h1>
      </div>
    );
  }

<<<<<<< HEAD
    return (
        <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            {/* REMOVED: <Route path="/about" element={<AboutPage />} /> */} 
=======
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    
>>>>>>> test/supabase-migration

      {/* PROTECTED GENERAL ROUTE */}
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff", "uo_staff", "student"]} >
            <Home />
          </ProtectedRoute>
        }
      />

<<<<<<< HEAD
            {/* --- PROTECTED SPECIFIC ROUTES (STUDENT) --- */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/lessons" element={<ProtectedRoute allowedRoles={['Student']}><LessonPage /></ProtectedRoute>} />
            <Route path="/activities" element={<ProtectedRoute allowedRoles={['Student']}><ActivitiesPage /></ProtectedRoute>} />
=======
      {/* ADMIN ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]} >
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/tasks"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff"]} >
            <TaskSubmissionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/materials"
        element={
          <ProtectedRoute allowedRoles={["admin"]} >
            <MaterialsTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["admin"]} >
            <StudentListTable />
          </ProtectedRoute>
        }
      />
>>>>>>> test/supabase-migration

      {/* STUDENT ROUTES */}
      <Route
        path="/activities"
        element={
          <ProtectedRoute allowedRoles={["student"]} >
            <ActivityCards />
          </ProtectedRoute>
        }
      />


      {/* 404 */}
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
