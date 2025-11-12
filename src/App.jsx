// frontend/src/App.jsx - VERSIÓN CORREGIDA

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