import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageAbout from "./pages/ManageAbout";
import ManageSkills from "./pages/ManageSkills";
import ManageProjects from "./pages/ManageProjects";
import ManageResume from "./pages/ManageResume";
import ManageCertifications from "./pages/ManageCertifications";
import ManageContact from "./pages/ManageContact";
import Settings from "./pages/Settings";
import ViewMessages from "./pages/ViewMessages";

function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 ml-[260px]">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><Layout><ManageAbout /></Layout></ProtectedRoute>} />
      <Route path="/skills" element={<ProtectedRoute><Layout><ManageSkills /></Layout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Layout><ManageProjects /></Layout></ProtectedRoute>} />
      <Route path="/resume" element={<ProtectedRoute><Layout><ManageResume /></Layout></ProtectedRoute>} />
      <Route path="/certifications" element={<ProtectedRoute><Layout><ManageCertifications /></Layout></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Layout><ManageContact /></Layout></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Layout><ViewMessages /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
    </Routes>
  );
}
