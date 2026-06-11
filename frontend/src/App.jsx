import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import DemandeModal from "./components/DemandeModal";
import Materiels from "./pages/Materiels";
import Demandes from "./pages/Demandes";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<Demandes />} />
        <Route path="/requests/new" element={<DemandeModal open={true} onClose={() => navigate('/dashboard')} />} />

        {/* ROLE_COMPTABLE_MATIERE et ROLE_ADMIN */}
        <Route path="/materials" element={
          <ProtectedRoute allowedRoles={['ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN']}>
            <Materiels />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute allowedRoles={['ROLE_COMPTABLE_MATIERE', 'ROLE_ADMIN']}>
            <div className="p-6">Page Catégories (En cours)</div>
          </ProtectedRoute>
        } />

        {/* ROLE_ADMIN uniquement */}
        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <div className="p-6">Page Utilisateurs (En cours)</div>
          </ProtectedRoute>
        } />
        <Route path="/validations" element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <div className="p-6">Page Validations (En cours)</div>
          </ProtectedRoute>
        } />
      </Route>

      <Route path="/forbidden" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
            <p className="text-gray-600">Vous n'avez pas accès à cette page.</p>
          </div>
        </div>
      } />

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                404
              </h1>
              <p className="text-gray-600">Page non trouvée</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
