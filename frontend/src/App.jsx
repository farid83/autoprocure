import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Register from './pages/Register';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import DemandeModal from "./components/DemandeModal";
import Materiels from "./pages/Materiels";


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
        {/* Futurs routes protégées ici */}
        <Route path="/materials" element={<Materiels />} />
        <Route path="/categories" element={<div className="p-6">Page Catégories (En cours)</div>} />
        <Route path="/requests" element={<div className="p-6">Page Demandes (En cours)</div>} />
        <Route path="/validations" element={<div className="p-6">Page Validations (En cours)</div>} />
        <Route path="/users" element={<div className="p-6">Page Utilisateurs (En cours)</div>} />
        <Route 
          path="/requests/new" 
          element={
            <DemandeModal 
              open={true} 
              onClose={() => navigate('/dashboard')} 
            />
          } 
        />
      </Route>

      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600">Page non trouvée</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;