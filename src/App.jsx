// frontend/src/App.jsx (VERSIÓN ACTUALIZADA)

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

// 🌟 PÁGINAS DE LA PLATAFORMA ESTRATÉGICA
import OperationalToolsPage from './pages/OperationalToolsPage';
import ClientePage from './pages/ClientePage';
import TalentoHumanoPage from './pages/TalentoHumanoPage';
import AdministracionPage from './pages/AdministracionPage';

// 🌟 COMPONENTES
import Sidebar from "./components/Sidebar"; 
import AuthGuard from "./components/AuthGuard";
import WhatsAppFloat from "./components/WhatsAppFloat"; // 🌟 NUEVO

// ✅ NUEVO: import hooks de sesión
import { useSessionTimeout, useTabCloseListener } from './hooks/useSessionTimeout';

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
    // Sistema de seguridad: tiempo de inactividad y detectar cierre de pestaña
    useSessionTimeout(10); // 10 minutos de inactividad
    useTabCloseListener();
    
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
                    
                    {/* 🌟 PLATAFORMA ESTRATÉGICA */}
                    <Route path="plataforma" element={<OperationalToolsPage />} />
                    
                    {/* 🌟 RUTAS INDIVIDUALES (alternativas) */}
                    <Route path="servicio" element={<ClientePage />} />
                    <Route path="talento-humano" element={<TalentoHumanoPage />} />
                    <Route path="administracion" element={<AdministracionPage />} />
                    
                    {/* Rutas de Administración */}
                    <Route path="usuarios" element={<UserManagement />} />
                    <Route path="archivos" element={<FilesPage />} /> 
                    <Route path="auditoria" element={<AuditPage />} />
                </Route>
                
                {/* Redirección 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* 🌟 WHATSAPP FLOTANTE EN TODA LA APLICACIÓN */}
            <WhatsAppFloat />
        </Router>
    );
}

export default App;