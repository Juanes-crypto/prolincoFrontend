// frontend/src/components/Sidebar.jsx (VERSIÓN PREMIUM ARQUITECTÓNICA)

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    TruckIcon,
    UsersIcon,
    HomeIcon,
    DocumentTextIcon,
    ClockIcon,
    ArrowLeftOnRectangleIcon,
    ChartBarIcon,
    CubeIcon,
    BuildingStorefrontIcon,
    UserGroupIcon,
    FolderIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/solid';

// *** UNIFIED AUTH IMPORT ***
import { useAuth } from '../context/AuthProvider';

// 🆕 DEFINICIÓN DE NAVEGACIÓN MEJORADA CON ICONOS ESPECÍFICOS
const navItems = [
    {
        name: 'Dashboard',
        path: '/',
        icon: HomeIcon,
        role: ['admin', 'talento', 'servicio', 'basico', 'invitado'],
        description: 'Panel principal'
    },
    {
        name: 'Servicio al Cliente',
        path: '/servicio',
        icon: TruckIcon,
        role: ['admin', 'servicio', 'basico', 'talento'],
        description: 'Servicio al cliente'
    },
    {
        name: 'Talento Humano',
        path: '/talento-humano',
        icon: UserGroupIcon,
        role: ['admin', 'servicio', 'basico', 'talento'],
        description: 'Gestión de personal'
    },
    { 
        name: 'Administración', 
        path: '/administracion', 
        icon: BuildingStorefrontIcon, 
        role: ['admin'],
        description: 'Configuración estratégica'
    },
    {
        name: 'Archivistica',
        path: '/archivos',
        icon: FolderIcon,
        role: ['admin', 'talento', 'servicio'],
        description: 'Documentos y recursos'
    },
    { 
        name: 'Gestión de Usuarios', 
        path: '/usuarios', 
        icon: ShieldCheckIcon, 
        role: ['admin'],
        description: 'Control de acceso'
    },
    { 
        name: 'Auditoría / Historial', 
        path: '/auditoria', 
        icon: ClockIcon, 
        role: ['admin'],
        description: 'Registros del sistema'
    },
];

const Sidebar = () => {
    // *** UNIFIED AUTH USAGE ***
    const { user, logout } = useAuth();
    const location = useLocation();
    const userRole = user?.role || 'invitado';

    const handleLogout = () => {
        logout();
    };

    // 🆕 FUNCIÓN PARA OBTENER ITEMS FILTRADOS POR ROL
    const filteredNavItems = navItems.filter(item => item.role.includes(userRole));

    // 🆕 COMPONENTE NAVITEM MEJORADO
    const NavItem = ({ item }) => {
        const isActive = location.pathname === item.path || 
                        (item.path !== '/' && location.pathname.startsWith(item.path));
        
        return (
            <NavLink
                to={item.path}
                {...(item.path === '/' ? { end: true } : {})}
                className={`group relative flex items-center p-4 rounded-xl transition-all duration-300 border-l-4 ${
                    isActive 
                        ? 'bg-white shadow-lg border-prolinco-primary text-prolinco-dark transform translate-x-2' 
                        : 'border-transparent text-gray-600 hover:bg-white/80 hover:shadow-md hover:border-prolinco-secondary/50 hover:text-prolinco-dark'
                }`}
            >
                {/* 🆕 INDICADOR ACTIVO */}
                {isActive && (
                    <div className="absolute -left-1 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-8 bg-prolinco-primary rounded-full"></div>
                    </div>
                )}
                
                {/* 🆕 ICONO CON ESTADOS MEJORADOS */}
                <div className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                        ? 'bg-prolinco-primary/10 text-prolinco-primary' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-prolinco-secondary/10 group-hover:text-prolinco-secondary'
                }`}>
                    <item.icon className="h-5 w-5" />
                </div>
                
                {/* 🆕 TEXTO CON DESCRIPCIÓN */}
                <div className="ml-3 flex-1 min-w-0">
                    <span className={`text-sm font-semibold block transition-colors duration-300 ${
                        isActive ? 'text-prolinco-dark' : 'text-gray-700 group-hover:text-prolinco-dark'
                    }`}>
                        {item.name}
                    </span>
                    <span className={`text-xs transition-colors duration-300 ${
                        isActive ? 'text-prolinco-primary' : 'text-gray-400 group-hover:text-prolinco-secondary'
                    }`}>
                        {item.description}
                    </span>
                </div>
                
                {/* 🆕 INDICADOR DE HOVER */}
                <div className={`opacity-0 transform translate-x-1 transition-all duration-300 ${
                    !isActive && 'group-hover:opacity-100 group-hover:translate-x-0'
                }`}>
                    <div className="w-1 h-1 bg-prolinco-primary rounded-full"></div>
                </div>
            </NavLink>
        );
    };

    return (
        // 🆕 DISEÑO ARQUITECTÓNICO COHERENTE CON DASHBOARD
        <div className="w-80 bg-white border-r border-gray-200 shadow-sm flex flex-col h-full z-10">
            
            {/* 🆕 HEADER PREMIUM */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="h-12 w-12 bg-prolinco-primary rounded-xl flex items-center justify-center shadow-lg">
                        <CubeIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-prolinco-dark leading-tight">
                            PROLINCO
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">
                            Plataforma Estratégica
                        </p>
                    </div>
                </div>
                
                {/* 🆕 INFO USUARIO */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-prolinco-dark capitalize">
                                {userRole}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.documentNumber || 'Usuario'}
                            </p>
                        </div>
                        <div className="h-8 w-8 bg-prolinco-secondary rounded-full flex items-center justify-center">
                            <UsersIcon className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 🆕 NAVEGACIÓN PRINCIPAL */}
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="space-y-2 px-4">
                    {/* 🆕 SECCIÓN PRINCIPAL */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4 px-2">
                            <div className="h-1 w-4 bg-prolinco-primary rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Navegación Principal
                            </span>
                        </div>
                        <div className="space-y-2">
                            {filteredNavItems
                                .filter(item => ['/'].includes(item.path))
                                .map((item) => (
                                    <NavItem key={item.name} item={item} />
                                ))}
                        </div>
                    </div>

                    {/* 🆕 SECCIÓN MÓDULOS */}
                    <div className="mb-6">
                        <div className="flex items-center space-x-2 mb-4 px-2">
                            <div className="h-1 w-4 bg-prolinco-secondary rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Módulos
                            </span>
                        </div>
                        <div className="space-y-2">
                            {filteredNavItems
                                .filter(item => ['/talento-humano', '/servicio', '/archivos', '/administracion'].includes(item.path))
                                .map((item) => (
                                    <NavItem key={item.name} item={item} />
                                ))}
                        </div>
                    </div>

                    {/* 🆕 SECCIÓN ADMINISTRACIÓN */}
                    {userRole === 'admin' && (
                        <div>
                            <div className="flex items-center space-x-2 mb-4 px-2">
                                <div className="h-1 w-4 bg-green-500 rounded-full"></div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Administración
                                </span>
                            </div>
                            <div className="space-y-2">
                                {filteredNavItems
                                    .filter(item => ['/usuarios', '/auditoria'].includes(item.path))
                                    .map((item) => (
                                        <NavItem key={item.name} item={item} />
                                    ))}
                            </div>
                        </div>
                    )}
                </nav>
            </div>

            {/* 🆕 FOOTER MEJORADO */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50 hover:text-red-600 group"
                >
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-500 transition-colors duration-300">
                            <ArrowLeftOnRectangleIcon className="h-4 w-4 text-red-500 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div className="ml-3 text-left">
                            <span className="text-sm font-semibold block">Cerrar Sesión</span>
                            <span className="text-xs text-gray-500 group-hover:text-red-400">
                                Salir del sistema
                            </span>
                        </div>
                    </div>
                    <div className="text-red-400 group-hover:text-red-600">
                        <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                    </div>
                </button>
                
                {/* 🆕 VERSIÓN DEL SISTEMA */}
                <div className="mt-3 text-center">
                    <span className="text-xs text-gray-400">
                        v2.0 • {new Date().getFullYear()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;