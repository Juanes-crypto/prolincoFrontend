// frontend/src/pages/OperationalToolsPage.jsx (VERSIÓN ARQUITECTÓNICA PREMIUM)

import React, { useState } from 'react';
import useOperationalData from '../hooks/useOperationalData';
import ClientePage from './ClientePage';
import TalentoHumanoPage from './TalentoHumanoPage';
import AdministracionPage from './AdministracionPage';

// 🆕 DEFINICIÓN MEJORADA DE SECCIONES CON ICONOS Y DESCRIPCIONES
const sections = [
    { 
        key: 'servicio', 
        name: 'Servicio al Cliente', 
        number: '01',
        description: 'Gestión del ciclo completo de ventas y atención al cliente',
        icon: '👥',
        color: 'from-blue-500 to-cyan-500'
    },
    { 
        key: 'talento', 
        name: 'Talento Humano', 
        number: '02',
        description: 'Herramientas de recursos humanos y desarrollo organizacional',
        icon: '💼',
        color: 'from-green-500 to-emerald-500'
    },
    { 
        key: 'admin', 
        name: 'Administración', 
        number: '03',
        description: 'Gestión estratégica y configuración organizacional',
        icon: '🏢',
        color: 'from-purple-500 to-indigo-500'
    },
];

const OperationalToolsPage = () => {
    const [activeSection, setActiveSection] = useState(sections[0].key);
    
    // Carga REAL de datos con el hook
    const { data, loading, error, refetch } = useOperationalData();

    // 🆕 FUNCIÓN MEJORADA PARA RENDERIZAR SECCIÓN
    const renderSection = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-prolinco-primary mx-auto mb-4"></div>
                        <p className="text-lg text-prolinco-dark font-medium">Cargando contenido estratégico...</p>
                        <p className="text-gray-500 text-sm mt-2">Preparando las herramientas operacionales</p>
                    </div>
                </div>
            );
        }
        
        if (error || !data) {
            return (
                <div className="text-center py-20">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-red-600 mb-2">Error al cargar datos</h3>
                    <p className="text-gray-600">{error || "No se pudieron cargar los datos estratégicos."}</p>
                    <button 
                        onClick={refetch}
                        className="mt-4 bg-prolinco-primary text-prolinco-dark font-semibold px-6 py-2 rounded-lg hover:bg-prolinco-primary/90 transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        // Seleccionar los datos específicos para la sección activa
        const sectionData = data[activeSection] || {};

        switch (activeSection) {
            case 'servicio':
                return <ClientePage data={sectionData} refetch={refetch} />;
            case 'talento':
                return <TalentoHumanoPage data={sectionData} refetch={refetch} />;
            case 'admin':
                return <AdministracionPage data={sectionData} refetch={refetch} />;
            default:
                return (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-prolinco-dark mb-2">Seleccione una sección</h3>
                        <p className="text-gray-600">Elija un módulo del menú lateral para comenzar</p>
                    </div>
                );
        }
    };

    // 🆕 COMPONENTE MEJORADO PARA ITEMS DE NAVEGACIÓN
    const NavItem = ({ section }) => {
        const isActive = activeSection === section.key;
        
        return (
            <button
                onClick={() => setActiveSection(section.key)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-500 border-l-4 mb-3 group ${
                    isActive
                        ? 'bg-white shadow-2xl border-prolinco-primary transform translate-x-2'
                        : 'bg-gray-50 border-transparent hover:bg-white hover:shadow-lg hover:border-gray-300'
                }`}
            >
                <div className="flex items-start space-x-4">
                    {/* 🆕 NÚMERO Y ICONO */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                            ? 'bg-prolinco-primary text-white shadow-lg'
                            : 'bg-white text-gray-600 shadow-sm group-hover:bg-prolinco-primary group-hover:text-white'
                    }`}>
                        <span className="text-lg font-bold">{section.number}</span>
                    </div>
                    
                    {/* 🆕 CONTENIDO */}
                    <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-lg mb-1 transition-colors duration-300 ${
                            isActive ? 'text-prolinco-dark' : 'text-gray-700 group-hover:text-prolinco-dark'
                        }`}>
                            {section.name}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${
                            isActive ? 'text-prolinco-primary' : 'text-gray-500 group-hover:text-prolinco-secondary'
                        }`}>
                            {section.description}
                        </p>
                    </div>
                    
                    {/* 🆕 INDICADOR ACTIVO */}
                    {isActive && (
                        <div className="flex-shrink-0 w-2 h-2 bg-prolinco-primary rounded-full mt-2"></div>
                    )}
                </div>
                
                {/* 🆕 EFECTO DE GRADIENTE SUTIL */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${section.color}`}></div>
            </button>
        );
    };

    return (
        // 🆕 DISEÑO PRINCIPAL ARQUITECTÓNICO
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white">
            
            {/* 🆕 SIDEBAR MEJORADO */}
            <aside className="w-80 bg-white p-6 shadow-xl border-r border-gray-200">
                {/* 🆕 HEADER PREMIUM */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-prolinco-primary rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-lg">⚡</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-prolinco-dark leading-tight">
                                Plataforma Estratégica
                            </h2>
                            <p className="text-xs text-gray-500 font-medium">
                                Herramientas operacionales
                            </p>
                        </div>
                    </div>
                    
                    {/* 🆕 INDICADOR DE ESTADO */}
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-green-700">Sistema Operacional</span>
                        </div>
                    </div>
                </div>

                {/* 🆕 NAVEGACIÓN MEJORADA */}
                <nav>
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 px-2">
                            <div className="w-4 h-0.5 bg-prolinco-primary rounded-full"></div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Módulos Estratégicos
                            </span>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                        {sections.map((section) => (
                            <NavItem key={section.key} section={section} />
                        ))}
                    </div>
                </nav>
                
                {/* 🆕 FOOTER INFORMATIVO */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <p className="text-xs text-gray-500">
                            {sections.find(s => s.key === activeSection)?.name || 'Seleccione un módulo'}
                        </p>
                        <div className="flex justify-center space-x-1 mt-2">
                            {sections.map((section, index) => (
                                <div 
                                    key={section.key}
                                    className={`w-1 h-1 rounded-full transition-all duration-300 ${
                                        activeSection === section.key ? 'bg-prolinco-primary' : 'bg-gray-300'
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* 🆕 ÁREA DE CONTENIDO PRINCIPAL MEJORADA */}
            <main className="flex-1 p-8 overflow-auto">
                {/* 🆕 HEADER DINÁMICO */}
                <header className="mb-8">
                    {sections.find(s => s.key === activeSection) && (
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-prolinco-primary to-prolinco-secondary rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                                {sections.find(s => s.key === activeSection)?.icon}
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-prolinco-dark mb-1">
                                    {sections.find(s => s.key === activeSection)?.name}
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    {sections.find(s => s.key === activeSection)?.description}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    {/* 🆕 BARRA DE ESTADO */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Conectado</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{data ? 'Datos cargados' : 'Cargando...'}</span>
                        </div>
                    </div>
                </header>

                {/* 🆕 CONTENIDO PRINCIPAL CON MEJOR ESTRUCTURA */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {renderSection()}
                </div>
                
                {/* 🆕 FOOTER DE CONTEXTO */}
                <footer className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-4 text-sm text-gray-500">
                        <span>Plataforma Estratégica Prolinco</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>Versión 2.0</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>2024</span>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default OperationalToolsPage;