// frontend/src/pages/TalentoHumanoPage.jsx (VERSIÓN ARQUITECTÓNICA PREMIUM)

import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import { 
    UsersIcon, 
    LinkIcon, 
    DocumentTextIcon, 
    PencilIcon,
    BuildingOfficeIcon,
    MapIcon,
    UserCircleIcon,
    BookOpenIcon,
    AcademicCapIcon,
    ChartBarIcon,
    ArrowTopRightOnSquareIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';
import EditableField from '../components/EditableField';
import ToolUrlModal from '../components/ToolUrlModal';

// 🆕 ESTRUCTURA MEJORADA CON DESCRIPCIONES Y CATEGORÍAS
const TOOL_STRUCTURE = [
    { 
        name: 'Organigrama', 
        key: 'Organigrama', 
        icon: BuildingOfficeIcon,
        description: 'Estructura organizacional y relaciones jerárquicas',
        category: 'Estructura',
        color: 'from-blue-500 to-cyan-500'
    },
    { 
        name: 'Mapa de Procesos', 
        key: 'Mapa de Procesos', 
        icon: MapIcon,
        description: 'Flujos de trabajo y procedimientos operativos',
        category: 'Procesos',
        color: 'from-green-500 to-emerald-500'
    },
    { 
        name: 'Perfil del Empleado', 
        key: 'Perfil del Empleado', 
        icon: UserCircleIcon,
        description: 'Competencias y responsabilidades por cargo',
        category: 'Gestión',
        color: 'from-purple-500 to-indigo-500'
    },
    { 
        name: 'Manual del Empleado', 
        key: 'Manual del Empleado', 
        icon: BookOpenIcon,
        description: 'Políticas, normas y cultura organizacional',
        category: 'Documentación',
        color: 'from-orange-500 to-amber-500'
    },
    { 
        name: 'Proceso de Inducción', 
        key: 'Proceso de Inducción', 
        icon: AcademicCapIcon,
        description: 'Onboarding y adaptación de nuevo personal',
        category: 'Desarrollo',
        color: 'from-teal-500 to-blue-500'
    },
    { 
        name: 'Proceso de Capacitación', 
        key: 'Proceso de Capacitación', 
        icon: ChartBarIcon,
        description: 'Plan de formación y desarrollo de competencias',
        category: 'Desarrollo',
        color: 'from-pink-500 to-rose-500'
    },
];

// 🆕 CONFIGURACIÓN DE CATEGORÍAS
const CATEGORIES_CONFIG = {
    'Estructura': {
        icon: BuildingOfficeIcon,
        color: 'border-blue-200 bg-blue-50',
        accent: 'text-blue-700'
    },
    'Procesos': {
        icon: MapIcon,
        color: 'border-green-200 bg-green-50',
        accent: 'text-green-700'
    },
    'Gestión': {
        icon: UserCircleIcon,
        color: 'border-purple-200 bg-purple-50',
        accent: 'text-purple-700'
    },
    'Documentación': {
        icon: BookOpenIcon,
        color: 'border-orange-200 bg-orange-50',
        accent: 'text-orange-700'
    },
    'Desarrollo': {
        icon: AcademicCapIcon,
        color: 'border-teal-200 bg-teal-50',
        accent: 'text-teal-700'
    }
};

// Función auxiliar
const mapToolsWithData = (tools, data) => tools.map(tool => ({
    ...tool,
    url: data[tool.key] || '#',
    isConfigured: data[tool.key] && data[tool.key] !== '#'
}));

const TalentoHumanoPage = ({ data = {}, refetch }) => {
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const diagnostic = data.diagnostic || '';
    const specificObjective = data.specificObjective || '';

    const [editingTool, setEditingTool] = useState(null);
    const [talentTools, setTalentTools] = useState([]);

    // 🆕 AGRUPAR HERRAMIENTAS POR CATEGORÍA
    const toolsByCategory = talentTools.reduce((acc, tool) => {
        const category = tool.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(tool);
        return acc;
    }, {});

    // Sincronizar herramientas con datos
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setTalentTools(mapToolsWithData(TOOL_STRUCTURE, data));
        }
    }, [data]);

    const startToolUrlEdit = useCallback((tool) => {
        setEditingTool(tool);
    }, []);

    const handleToolUrlUpdate = useCallback(() => {
        if (refetch) {
            refetch();
        }
        setEditingTool(null);
    }, [refetch]);

    // 🆕 RENDERIZADO MEJORADO DE HERRAMIENTA
    const renderToolCard = useCallback((tool) => {
        const CategoryIcon = CATEGORIES_CONFIG[tool.category]?.icon || DocumentTextIcon;
        
        return (
            <Card
                key={tool.key}
                title={tool.name}
                icon={tool.icon}
                padding="p-5"
                className="group relative overflow-hidden h-full flex flex-col"
            >
                {/* 🆕 BACKGROUND GRADIENT SUTIL */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="flex-1 flex flex-col">
                    {/* 🆕 CATEGORÍA Y DESCRIPCIÓN */}
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <CategoryIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {tool.category}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {tool.description}
                        </p>
                    </div>

                    {/* 🆕 ESTADO DE CONFIGURACIÓN */}
                    <div className="mb-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                            tool.isConfigured 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                            {tool.isConfigured ? (
                                <>
                                    <CheckCircleIcon className="h-3 w-3" />
                                    <span>URL Configurada</span>
                                </>
                            ) : (
                                <>
                                    <ExclamationCircleIcon className="h-3 w-3" />
                                    <span>URL Pendiente</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 🆕 BOTONES MEJORADOS */}
                    <div className="mt-auto space-y-3">
                        <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full inline-flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${
                                tool.isConfigured
                                    ? 'bg-prolinco-secondary text-white border-prolinco-secondary hover:bg-prolinco-primary hover:border-prolinco-primary hover:shadow-lg hover:scale-[1.02]'
                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            }`}
                            onClick={!tool.isConfigured ? (e) => e.preventDefault() : undefined}
                        >
                            <div className="flex items-center space-x-2">
                                <LinkIcon className="h-4 w-4" />
                                <span className="font-semibold text-sm">
                                    {tool.isConfigured ? 'Abrir Documento' : 'No Configurado'}
                                </span>
                            </div>
                            {tool.isConfigured && (
                                <ArrowTopRightOnSquareIcon className="h-4 w-4 opacity-80" />
                            )}
                        </a>
                        
                        {isAdmin && (
                            <button
                                onClick={() => startToolUrlEdit(tool)}
                                className="w-full inline-flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-prolinco-primary font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 group"
                            >
                                <PencilIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                {tool.isConfigured ? 'Cambiar URL' : 'Configurar URL'}
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        );
    }, [isAdmin, startToolUrlEdit]);

    // 🆕 COMPONENTE DE CATEGORÍA
    const CategorySection = ({ category, tools }) => {
        const categoryConfig = CATEGORIES_CONFIG[category];
        const CategoryIcon = categoryConfig?.icon || DocumentTextIcon;
        
        return (
            <section key={category} className="mb-10">
                {/* 🆕 HEADER DE CATEGORÍA */}
                <div className={`rounded-2xl border-2 ${categoryConfig.color} p-6 mb-6`}>
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${categoryConfig.accent} bg-white shadow-sm`}>
                            <CategoryIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-gray-800">
                                {category}
                            </h3>
                            <p className="text-gray-600">
                                {tools.length} herramienta{tools.length !== 1 ? 's' : ''} de {category.toLowerCase()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${categoryConfig.accent}`}>
                                {tools.filter(t => t.isConfigured).length}/{tools.length}
                            </div>
                            <div className="text-sm text-gray-500">Configuradas</div>
                        </div>
                    </div>
                </div>

                {/* 🆕 GRID DE HERRAMIENTAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map(renderToolCard)}
                </div>
            </section>
        );
    };

    return (
        <div className="animate-fadeIn relative">
            {/* MODAL */}
            {editingTool && (
                <ToolUrlModal
                    tool={editingTool}
                    section="talento"
                    onComplete={handleToolUrlUpdate}
                    onClose={() => setEditingTool(null)}
                />
            )}

            {/* 🆕 HEADER DE PÁGINA MEJORADO */}
            <header className="mb-10">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-prolinco-primary/10 rounded-xl">
                        <UsersIcon className="h-8 w-8 text-prolinco-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-prolinco-dark">
                            Talento Humano
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Gestión integral de recursos humanos y desarrollo organizacional
                        </p>
                    </div>
                </div>

                {/* 🆕 INDICADORES DE ESTADO */}
                <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Sistema activo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">{talentTools.length} herramientas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-600">
                            {talentTools.filter(t => t.isConfigured).length} configuradas
                        </span>
                    </div>
                    {isAdmin && (
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-prolinco-primary rounded-full"></div>
                            <span className="text-gray-600">Modo administrador</span>
                        </div>
                    )}
                </div>
            </header>

            {/* 🆕 DIAGNÓSTICO Y OBJETIVO MEJORADO */}
            <section className="mb-12">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-2 h-8 bg-prolinco-primary rounded-full"></div>
                            <h3 className="text-xl font-bold text-prolinco-dark">Diagnóstico Actual</h3>
                        </div>
                        <EditableField
                            initialContent={diagnostic}
                            section="Talento Humano"
                            subsection="Diagnóstico"
                            onUpdate={refetch}
                        />
                    </div>
                    
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-2 h-8 bg-prolinco-secondary rounded-full"></div>
                            <h3 className="text-xl font-bold text-prolinco-dark">Objetivo Específico</h3>
                        </div>
                        <EditableField
                            initialContent={specificObjective}
                            section="Talento Humano"
                            subsection="Objetivo Específico"
                            onUpdate={refetch}
                        />
                    </div>
                </div>
            </section>

            {/* 🆕 SECCIÓN DE HERRAMIENTAS MEJORADA */}
            <section>
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-1 h-12 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-2xl font-black text-prolinco-dark">
                            Documentos y Herramientas Operativas
                        </h2>
                        <p className="text-gray-600">
                            Recursos organizados por categorías para la gestión del talento humano
                        </p>
                    </div>
                </div>

                {/* 🆕 PROGRESS BAR GLOBAL */}
                <div className="mb-10">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-prolinco-dark">
                                Progreso de Configuración
                            </h3>
                            <span className="text-sm font-medium text-prolinco-primary">
                                {talentTools.filter(t => t.isConfigured).length}/{talentTools.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="bg-gradient-to-r from-prolinco-primary to-prolinco-secondary h-3 rounded-full transition-all duration-1000"
                                style={{ 
                                    width: `${(talentTools.filter(t => t.isConfigured).length / talentTools.length) * 100}%` 
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>Por configurar</span>
                            <span>Completado</span>
                        </div>
                    </div>
                </div>

                {/* 🆕 RENDERIZADO POR CATEGORÍAS */}
                {Object.keys(toolsByCategory).map(category => (
                    <CategorySection 
                        key={category}
                        category={category}
                        tools={toolsByCategory[category]}
                    />
                ))}
            </section>
        </div>
    );
};

export default TalentoHumanoPage;