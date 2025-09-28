// frontend/src/App.jsx (COMPLETO Y CORREGIDO)

import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
    Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChangePasswordPage from "./pages/ChangePassword";
import Login from "./pages/Login"; 
import UserManagement from "./pages/UserManagement";
import FilesPage from './pages/FilesPage';
import AuditPage from './pages/AuditPage'; 

// 🌟 Nuevas Páginas de Módulos (Debes crear estos archivos si no existen)
import ServicePage from './pages/Service'; // Asumo que existe
import TalentPage from './pages/Talent';   // Asumo que existe

import Sidebar from "./components/Sidebar"; 
import AuthGuard from "./components/AuthGuard";

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-prolinco-light">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet /> 
            </main>
        </div>
    );
};


function App() {
    return (
        <Router>
            <Routes>
                
                {/* 1. RUTAS PÚBLICAS/ESPECIALES */}
                <Route path="/login" element={<Login />} />
                <Route path="/cambio-contrasena" element={<ChangePasswordPage />} />
                
                {/* 2. RUTAS PROTEGIDAS CON LAYOUT */}
                <Route 
                    path="/" 
                    element={<AuthGuard><MainLayout /></AuthGuard>} 
                >
                    {/* Rutas Hijas (Se renderizan dentro del <Outlet /> del MainLayout) */}
                    
                    {/* Dashboard es la página de inicio */}
                    <Route index element={<Dashboard />} /> 
                    
                    {/* 🌟 CORRECCIÓN CLAVE: Agregar las rutas faltantes 🌟 */}
                    <Route path="servicio" element={<ServicePage />} />      {/* <--- ¡NUEVO! */}
                    <Route path="talento-humano" element={<TalentPage />} /> {/* <--- ¡NUEVO! */}
                    
                    {/* Rutas de Administración */}
                    <Route path="usuarios" element={<UserManagement />} />
                    <Route path="archivos" element={<FilesPage />} /> 
                    <Route path="auditoria" element={<AuditPage />} />
                    
                    {/* Si un admin tiene el rol bien configurado, el AuthGuard se encarga del acceso denegado. */}
                </Route>
                
                {/* Redirección 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;