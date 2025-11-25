// frontend/src/App.jsx - VERSIÓN CORREGIDA

import React, { useState } from 'react';
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

// 🌟 PÁGINAS INDIVIDUALES
import ClientePage from './pages/ClientePage';
import TalentoHumanoPage from './pages/TalentoHumanoPage';
import AdministracionPage from './pages/AdministracionPage';

// 🌟 COMPONENTES
import Sidebar from "./components/Sidebar";
import AuthGuard from "./components/AuthGuard";
import WhatsAppFloat from "./components/WhatsAppFloat";

// 🌟 HOOK DE DATOS
import useOperationalData from './hooks/useOperationalData';

// ✅ NUEVO: import hooks de sesión
import { useSessionTimeout, useTabCloseListener } from './hooks/useSessionTimeout';


// 🛠️ CORRECCIÓN: El estado ahora vive DENTRO del componente
const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // 👈 AGREGAR ESTADO AQUÍ

    return (
        <div className="flex min-h-screen bg-prolinco-light">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
                <div className="relative flex w-80 flex-col">
                    {/* Pasamos la función para cerrar al Sidebar si tiene botón de cerrar */}
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Hamburger Menu */}
                <div className="lg:hidden p-4 bg-white border-b border-gray-200">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

// 🌟 NUEVO: Componente wrapper para páginas con datos
const PageWithData = ({ Component }) => {
    const { data, loading, error, refetch } = useOperationalData();
    
    if (loading) return <div className="text-center p-10">Cargando datos...</div>;
    if (error) return <div className="text-red-600 text-center p-10">Error: {error}</div>;
    
    return <Component data={data} refetch={refetch} />;
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
                    
                    {/* 🌟 RUTAS INDIVIDUALES CON DATOS */}
                    <Route path="servicio" element={<PageWithData Component={ClientePage} />} />
                    <Route path="talento-humano" element={<PageWithData Component={TalentoHumanoPage} />} />
                    <Route path="administracion" element={<PageWithData Component={AdministracionPage} />} />
                    
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