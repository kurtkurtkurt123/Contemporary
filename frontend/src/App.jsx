import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// --- AUTH/CORE PAGES ---
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import Home from "./pages/Home.jsx";

// --- ADMIN PAGES ---
import Dashboard from "./pages/admin/Dashboard.jsx";
import TaskSubmissionList from "./pages/admin/Tasks/page.jsx";
import MaterialsTable from "./pages/admin/Materials/page.jsx";
import StudentListTable from "./pages/admin/Students/page.jsx";

// --- STUDENT PAGES ---
import StudentDashboard from "./pages/StudentDashboard.jsx"; // Assuming this is used instead of Admin Dashboard for students
import ActivityCards from "./pages/student/activity/activityPage.jsx";
import LessonPage from "./pages/LessonsPage.jsx"; 
import ActivitiesPage from "./pages/ActivitiesPage.jsx"; 


// =========================================================================

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

  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" replace />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      

      {/* --- PROTECTED GENERAL ROUTES --- */}
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["admin", "staff", "uo_staff", "student"]} >
            <Home />
          </ProtectedRoute>
        }
      />

      {/* --- ADMIN ROUTES (Protected by 'admin' role) --- */}
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

      {/* --- STUDENT ROUTES (Protected by 'student' role) --- */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]} >
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities"
        element={
          <ProtectedRoute allowedRoles={["student"]} >
            <ActivityCards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lessons"
        element={
          <ProtectedRoute allowedRoles={["student"]} >
            <LessonPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-activities"
        element={
          <ProtectedRoute allowedRoles={["student"]} >
            <ActivitiesPage />
          </ProtectedRoute>
        }
      />

      {/* --- 404 CATCH-ALL --- */}
      <Route path="*" element={<h1>404 Page Not Found</h1>} />
    </Routes>
  );
}

export default App;