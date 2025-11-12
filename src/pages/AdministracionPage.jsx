// frontend/src/pages/AdministracionPage.jsx (VERSIÓN CORREGIDA - SECCIONES FIXED)

import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import {
    BuildingLibraryIcon, LinkIcon, ChartBarIcon, DocumentTextIcon, PencilIcon,
    ExclamationTriangleIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon, BuildingOfficeIcon,
    ScaleIcon, CubeIcon, ChartPieIcon, ViewfinderCircleIcon, LightBulbIcon, ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';
import useOperationalData from '../hooks/useOperationalData';
import EditModal from '../components/EditModal';

// ESTRUCTURA DE HERRAMIENTAS
const ADMIN_TOOLS_STRUCTURE = [
    {
        name: 'Marco Legal',
        key: 'Marco Legal',
        icon: ScaleIcon,
        description: 'Documentación legal y normativa de la organización',
        category: 'Legal',
        color: 'from-gray-600 to-gray-700',
        importance: 'high'
    },
    {
        name: 'Matriz DOFA',
        key: 'Matriz DOFA',
        icon: CubeIcon,
        description: 'Análisis de Debilidades, Oportunidades, Fortalezas y Amenazas',
        category: 'Estratégica',
        color: 'from-blue-500 to-cyan-500',
        importance: 'critical'
    },
    {
        name: 'Matriz PESTEL',
        key: 'Matriz PESTEL',
        icon: ChartPieIcon,
        description: 'Análisis de factores Políticos, Económicos, Sociales, Tecnológicos, Ecológicos y Legales',
        category: 'Estratégica',
        color: 'from-green-500 to-emerald-500',
        importance: 'high'
    },
    {
        name: 'Matriz EFI',
        key: 'Matriz EFI',
        icon: ViewfinderCircleIcon,
        description: 'Matriz de Evaluación de Factores Internos',
        category: 'Estratégica',
        color: 'from-purple-500 to-indigo-500',
        importance: 'medium'
    },
    {
        name: 'Matriz EFE',
        key: 'Matriz EFE',
        icon: LightBulbIcon,
        description: 'Matriz de Evaluación de Factores Externos',
        category: 'Estratégica',
        color: 'from-orange-500 to-amber-500',
        importance: 'medium'
    }
];

// CONFIGURACIONES
const CATEGORIES_CONFIG = {
    'Legal': {
        icon: ScaleIcon,
        color: 'border-gray-200 bg-gray-50',
        accent: 'text-gray-700'
    },
    'Estratégica': {
        icon: ChartBarIcon,
        color: 'border-blue-200 bg-blue-50',
        accent: 'text-blue-700'
    }
};

const IMPORTANCE_CONFIG = {
    'critical': { label: 'Crítica', color: 'from-red-500 to-pink-500', badge: 'bg-red-100 text-red-700' },
    'high': { label: 'Alta', color: 'from-orange-500 to-amber-500', badge: 'bg-orange-100 text-orange-700' },
    'medium': { label: 'Media', color: 'from-blue-500 to-cyan-500', badge: 'bg-blue-100 text-blue-700' }
};

const AdministracionPage = () => {
    // 🌟 Usar hook directamente
    const { data, loading, error, refetch } = useOperationalData();

    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    // Extraer datos específicos
    const adminData = useMemo(() => data?.admin || {}, [data]);
    const organizacionalData = useMemo(() => data?.organizacional || {}, [data]);

    // 🆕 ESTADOS CORREGIDOS - SEPARACIÓN CLARA DE SECCIONES
    const [adminContent, setAdminContent] = useState({
        diagnostic: '',
        specificObjective: ''
    });

    const [organizacionalContent, setOrganizacionalContent] = useState({
        mission: '',
        vision: '',
        corporateValues: ''
    });

    const [editingUrl, setEditingUrl] = useState({ 
        toolName: null, 
        toolKey: null, 
        url: '' 
    });

    // 🆕 CORRECCIÓN CRÍTICA: Estado para saber qué sección estamos editando
    const [editingText, setEditingText] = useState({ 
        section: null,  // 'admin' o 'organizacional'
        field: null, 
        value: '' 
    });

    const [adminTools, setAdminTools] = useState([]);

    // Sincronizar contenido cuando cambian los datos
    useEffect(() => {
        if (adminData) {
            setAdminContent({
                diagnostic: adminData.diagnostic || '',
                specificObjective: adminData.specificObjective || ''
            });
        }
        if (organizacionalData) {
            setOrganizacionalContent({
                mission: organizacionalData.mission || '',
                vision: organizacionalData.vision || '',
                corporateValues: Array.isArray(organizacionalData.corporateValues) 
                    ? organizacionalData.corporateValues.join(', ') 
                    : organizacionalData.corporateValues || ''
            });
        }
    }, [adminData, organizacionalData]);

    // Sincronizar herramientas con datos del backend
    const adminDataJson = JSON.stringify(adminData || {});

    useEffect(() => {
        if (adminData && Object.keys(adminData).length > 0) {
            const mappedTools = ADMIN_TOOLS_STRUCTURE.map(tool => {
                if (!adminData.tools) {
                    return {
                        ...tool,
                        url: '#',
                        isConfigured: false
                    };
                }

                const backendTool = adminData.tools.find(backendTool => {
                    const backendName = backendTool.name.toLowerCase().replace(/\s/g, '');
                    const toolName = tool.name.toLowerCase().replace(/\s/g, '');
                    return backendName === toolName;
                });

                return {
                    ...tool,
                    url: backendTool ? backendTool.url || '#' : '#',
                    isConfigured: backendTool && backendTool.url && backendTool.url !== '' && backendTool.url !== '#'
                };
            });

            setAdminTools(mappedTools);
        } else {
            setAdminTools(ADMIN_TOOLS_STRUCTURE.map(tool => ({
                ...tool,
                url: '#',
                isConfigured: false
            })));
        }
    }, [adminDataJson, adminData]);

    // 🆕 CORRECCIÓN CRÍTICA: Funciones mejoradas con sección específica
    const startTextEdit = (section, field, initialValue) => {
        console.log(`🎯 Iniciando edición: section=${section}, field=${field}`);
        setEditingText({ section, field, value: initialValue });
        setEditingUrl({ toolName: null });
    };

    const handleContentUpdate = (updatedPayload) => {
        console.log('📝 handleContentUpdate recibió:', updatedPayload);
        console.log('📝 Sección que se está editando:', editingText.section);
        
        if (updatedPayload && typeof updatedPayload === 'object') {
            const key = Object.keys(updatedPayload)[0];
            const newValue = Object.values(updatedPayload)[0];
            
            // 🆕 CORRECCIÓN: Actualizar estado local según la sección
            if (editingText.section === 'admin') {
                setAdminContent(prev => ({ ...prev, [key]: newValue }));
            } else if (editingText.section === 'organizacional') {
                setOrganizacionalContent(prev => ({ ...prev, [key]: newValue }));
            }
        }

        // Cerrar modal
        setEditingText({ section: null, field: null, value: '' });
        
        // Recargar datos
        setTimeout(() => {
            if (refetch) {
                refetch();
            }
        }, 500);
    };

    // 🆕 FUNCIONES PARA EDICIÓN DE URLs
    const startUrlEdit = (toolName, toolKey, currentUrl) => {
        setEditingUrl({ toolName, toolKey, url: currentUrl });
    };

    const handleUrlUpdate = (updatedData) => {
        if (updatedData && typeof updatedData === 'object') {
            const key = Object.keys(updatedData)[0];
            const newUrl = updatedData[key];

            // Actualizar estado inmediatamente
            setAdminTools(prev =>
                prev.map(tool => {
                    const toolMatches =
                        tool.key === key ||
                        tool.name.toLowerCase().replace(/\s/g, '') === key.toLowerCase().replace(/\s/g, '');

                    if (toolMatches) {
                        return {
                            ...tool,
                            url: newUrl,
                            isConfigured: !!newUrl && newUrl !== '' && newUrl !== '#'
                        };
                    }
                    return tool;
                })
            );
        }

        setEditingUrl({ toolName: null, toolKey: null, url: '' });

        // Recargar datos después de un delay
        setTimeout(() => {
            if (refetch) {
                refetch();
            }
        }, 500);
    };

    const closeModal = () => {
        setEditingUrl({ toolName: null, toolKey: null, url: '' });
        setEditingText({ section: null, field: null, value: '' });
    };

    // 🆕 FUNCIÓN MEJORADA PARA ABRIR DOCUMENTOS
    const openDocument = (url, toolName) => {
        if (url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert(`${toolName} no está configurado. ${isAdmin ? 'Puedes configurarlo haciendo clic en "Configurar URL".' : 'Contacta al administrador.'}`);
        }
    };

    // 🆕 RENDERIZADO MEJORADO - COMPLETAMENTE RESPONSIVO
    const renderToolCard = (tool) => {
        const importanceConfig = IMPORTANCE_CONFIG[tool.importance];
        const CategoryIcon = CATEGORIES_CONFIG[tool.category]?.icon || DocumentTextIcon;

        return (
            <Card
                key={`${tool.key}-${tool.name}`}
                title={tool.name}
                icon={tool.icon}
                padding="p-4 sm:p-5"
                className="group relative overflow-hidden h-full flex flex-col hover:shadow-lg transition-all duration-300"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="flex-1 flex flex-col">
                    {/* CATEGORÍA Y DESCRIPCIÓN */}
                    <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <CategoryIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {tool.category}
                                </span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${importanceConfig.badge}`}>
                                {importanceConfig.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                            {tool.description}
                        </p>
                    </div>

                    {/* ESTADO DE CONFIGURACIÓN */}
                    <div className="mb-3 sm:mb-4">
                        <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${tool.isConfigured
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                            }`}>
                            {tool.isConfigured ? (
                                <>
                                    <CheckCircleIcon className="h-3 w-3" />
                                    <span>Configurado</span>
                                </>
                            ) : (
                                <>
                                    <ExclamationTriangleIcon className="h-3 w-3" />
                                    <span>Por Configurar</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* 🆕 BOTONES MEJORADOS - COMPACTOS Y RESPONSIVOS */}
                    <div className="mt-auto space-y-2">
                        <button
                            onClick={() => openDocument(tool.url, tool.name)}
                            className={`w-full inline-flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-300 border text-sm ${tool.isConfigured
                                ? 'bg-prolinco-secondary text-white border-prolinco-secondary hover:bg-prolinco-primary hover:border-prolinco-primary hover:shadow-md hover:scale-[1.02]'
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="font-semibold">
                                    {tool.isConfigured ? 'Abrir Documento' : 'No Configurado'}
                                </span>
                            </div>
                            {tool.isConfigured && (
                                <ArrowTopRightOnSquareIcon className="h-3 w-3 sm:h-4 sm:w-4 opacity-80" />
                            )}
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => startUrlEdit(tool.name, tool.key, tool.url)}
                                className="w-full inline-flex items-center justify-center px-2 py-2 text-xs sm:text-sm text-gray-600 hover:text-prolinco-primary font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-prolinco-primary focus:ring-offset-1 cursor-pointer"
                            >
                                <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                                {tool.isConfigured ? 'Cambiar URL' : 'Configurar URL'}
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    // 🆕 COMPONENTE DE CATEGORÍA REDISEÑADO
    const CategorySection = ({ category, tools }) => {
        const categoryConfig = CATEGORIES_CONFIG[category];
        const CategoryIcon = categoryConfig?.icon || DocumentTextIcon;

        return (
            <section key={category} className="mb-8 sm:mb-10">
                <div className={`rounded-xl sm:rounded-2xl border-2 ${categoryConfig.color} p-4 sm:p-6 mb-4 sm:mb-6`}>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${categoryConfig.accent} bg-white shadow-sm`}>
                            <CategoryIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg sm:text-2xl font-black text-gray-800">
                                {category}
                            </h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                {tools.length} herramienta{tools.length !== 1 ? 's' : ''} {category.toLowerCase()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className={`text-base sm:text-lg font-bold ${categoryConfig.accent}`}>
                                {tools.filter(t => t.isConfigured).length}/{tools.length}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500">Configuradas</div>
                        </div>
                    </div>
                </div>

                {/* 🆕 GRID COMPLETAMENTE RESPONSIVO */}
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                    {tools.map((tool, index) => (
                        <div key={`${tool.key}-${index}-${category}`} className="h-full">
                            {renderToolCard(tool)}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-prolinco-primary mx-auto mb-4"></div>
                <div className="text-prolinco-secondary font-semibold">Cargando Administración...</div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-600 text-center p-8">
                <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4" />
                <div>Error: {error}</div>
            </div>
        </div>
    );

    // AGRUPAR HERRAMIENTAS POR CATEGORÍA
    const toolsByCategory = adminTools.reduce((acc, tool) => {
        const category = tool.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(tool);
        return acc;
    }, {});

    return (
        <div className="animate-fadeIn min-h-screen">
            {/* MODALES */}
            {/* 🆕 CORRECCIÓN CRÍTICA: El modal usa la sección del estado editingText */}
            <EditModal
                type="text"
                section={editingText.section} // ✅ Sección dinámica
                editingData={editingText}
                onComplete={handleContentUpdate}
                onClose={() => setEditingText({ section: null, field: null, value: '' })}
            />

            <EditModal
                type="url"
                section="admin"
                editingData={{
                    toolName: editingUrl.toolName,
                    toolKey: editingUrl.toolKey,
                    url: editingUrl.url,
                    field: editingUrl.toolKey
                }}
                onComplete={handleUrlUpdate}
                onClose={closeModal}
            />

            {/* 🆕 HEADER COMPACT Y RESPONSIVO */}
            <header className="mb-6 sm:mb-8 lg:mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-2 sm:p-3 bg-prolinco-primary/10 rounded-xl sm:rounded-2xl">
                            <BuildingOfficeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-prolinco-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-prolinco-dark leading-tight">
                                Administración Estratégica
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mt-1 max-w-2xl">
                                Gestión integral de identidad organizacional y herramientas estratégicas
                            </p>
                        </div>
                    </div>

                    {/* 🆕 INDICADORES COMPACTOS */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                        <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-green-700 font-medium">Sistema activo</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-blue-700 font-medium">{adminTools.length} herramientas</span>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center space-x-2 bg-prolinco-primary/10 px-3 py-2 rounded-lg border border-prolinco-primary/20">
                                <div className="w-2 h-2 bg-prolinco-primary rounded-full"></div>
                                <span className="text-prolinco-dark font-medium">Modo admin</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 🆕 SECCIÓN DIAGNÓSTICO - DISEÑO MEJORADO */}
            <section className="mb-8 sm:mb-12 lg:mb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {/* DIAGNÓSTICO */}
                    <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                            <div className="w-2 h-8 sm:h-12 bg-prolinco-primary rounded-full flex-shrink-0"></div>
                            <div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-prolinco-dark">Diagnóstico Administrativo</h3>
                                <p className="text-gray-500 text-sm mt-1">Estado actual del área administrativa</p>
                            </div>
                        </div>
                        <div className="text-gray-700 leading-relaxed">
                            <p className="whitespace-pre-line text-sm sm:text-base">
                                {adminContent.diagnostic || 'Aún no se ha definido el diagnóstico administrativo actual de la organización.'}
                            </p>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => startTextEdit('admin', 'diagnostic', adminContent.diagnostic || '')}
                                className="mt-4 sm:mt-6 inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-50 hover:bg-gray-100 text-prolinco-primary font-semibold rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-prolinco-primary/20"
                            >
                                <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm sm:text-base">Editar Diagnóstico</span>
                            </button>
                        )}
                    </div>

                    {/* OBJETIVO ESPECÍFICO */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                            <div className="w-2 h-8 sm:h-12 bg-prolinco-secondary rounded-full flex-shrink-0"></div>
                            <div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-prolinco-dark">Objetivo Específico</h3>
                                <p className="text-gray-500 text-sm mt-1">Metas del área administrativa</p>
                            </div>
                        </div>
                        <div className="text-gray-700 leading-relaxed">
                            <p className="whitespace-pre-line text-sm sm:text-base">
                                {adminContent.specificObjective || 'Aún no se ha definido el objetivo específico para el área administrativa.'}
                            </p>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => startTextEdit('admin', 'specificObjective', adminContent.specificObjective || '')}
                                className="mt-4 sm:mt-6 inline-flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-50 hover:bg-gray-100 text-prolinco-secondary font-semibold rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-prolinco-secondary/20"
                            >
                                <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                <span className="text-sm sm:text-base">Editar Objetivo</span>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* 🆕 SECCIÓN IDENTIDAD ORGANIZACIONAL - COMPACT Y RESPONSIVO */}
            <section className="mb-8 sm:mb-12 lg:mb-16">
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-prolinco-dark">Identidad Organizacional</h2>
                        <p className="text-gray-600 text-sm sm:text-base">Fundamentos estratégicos de Prolinco</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {[
                        {
                            title: "Misión",
                            icon: ViewfinderCircleIcon,
                            content: organizacionalContent.mission,
                            field: "mission",
                            section: "organizacional",
                            placeholder: "Define el propósito fundamental de la organización...",
                            color: "from-prolinco-primary/10 to-prolinco-primary/5"
                        },
                        {
                            title: "Visión", 
                            icon: LightBulbIcon,
                            content: organizacionalContent.vision,
                            field: "vision",
                            section: "organizacional", 
                            placeholder: "Describe el futuro deseado de la organización...",
                            color: "from-prolinco-secondary/10 to-prolinco-secondary/5"
                        },
                        {
                            title: "Valores Corporativos",
                            icon: ShieldCheckIcon,
                            content: organizacionalContent.corporateValues,
                            field: "corporateValues", 
                            section: "organizacional",
                            placeholder: "Separar valores por comas: Calidad, Servicio, Innovación...",
                            color: "from-gray-100/50 to-gray-200/30",
                            hasTip: true
                        }
                    ].map((item, index) => (
                        <Card
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                            padding="p-4 sm:p-6"
                            className="h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            
                            <div className="relative z-10 flex-1 flex flex-col">
                                <div className="text-gray-700 leading-relaxed flex-1">
                                    <p className="whitespace-pre-line text-sm sm:text-base min-h-[80px]">
                                        {item.content || `Aún no se ha definido la ${item.title.toLowerCase()}.`}
                                    </p>
                                </div>
                                
                                {isAdmin && (
                                    <div className="mt-4 space-y-2">
                                        {/* 🆕 CORRECCIÓN CRÍTICA: Pasamos la sección correcta */}
                                        <button
                                            onClick={() => startTextEdit(item.section, item.field, item.content || '')}
                                            className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-prolinco-primary font-semibold rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-prolinco-primary/20 text-sm"
                                        >
                                            <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                            <span>Editar {item.title}</span>
                                        </button>
                                        
                                        {item.hasTip && (
                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-xs text-blue-700 text-center">
                                                    💡 <strong>Formato:</strong> Separar valores con coma
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>

            {/* 🆕 SECCIÓN HERRAMIENTAS - DISEÑO MEJORADO */}
            <section>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-prolinco-dark">Herramientas Estratégicas</h2>
                        <p className="text-gray-600 text-sm sm:text-base">Marco legal y matrices de análisis estratégico</p>
                    </div>
                </div>

                {/* 🆕 BARRA DE PROGRESO COMPACTA */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h3 className="text-lg sm:text-xl font-bold text-prolinco-dark">Progreso de Configuración</h3>
                        <div className="text-right">
                            <div className="text-2xl sm:text-3xl font-black text-prolinco-primary">
                                {adminTools.filter(t => t.isConfigured).length}
                            </div>
                            <div className="text-sm text-gray-500">de {adminTools.length} herramientas</div>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
                        <div
                            className="bg-gradient-to-r from-prolinco-primary to-prolinco-secondary h-2 sm:h-3 rounded-full transition-all duration-1000"
                            style={{
                                width: `${adminTools.length ? (adminTools.filter(t => t.isConfigured).length / adminTools.length) * 100 : 0}%`
                            }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Por configurar</span>
                        <span>Completado</span>
                    </div>
                </div>

                {/* MENSAJE DE CONFIGURACIÓN PENDIENTE */}
                {!isAdmin && adminTools.every(tool => !tool.isConfigured) && (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
                            <div>
                                <h4 className="text-lg sm:text-xl font-black text-yellow-800 mb-1">
                                    Herramientas en Configuración
                                </h4>
                                <p className="text-yellow-700 text-sm sm:text-base">
                                    Las herramientas estratégicas están siendo configuradas por el administrador.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 🆕 GRID DE CATEGORÍAS - COMPLETAMENTE RESPONSIVO */}
                <div className="space-y-8 sm:space-y-12">
                    {Object.keys(toolsByCategory).map((category, index) => (
                        <div key={category}>
                            <CategorySection
                                category={category}
                                tools={toolsByCategory[category]}
                            />
                        </div>
                    ))}
                </div>

                {/* 🆕 PANEL DE ADMINISTRADOR COMPACTO */}
                {isAdmin && (
                    <div className="bg-gradient-to-r from-prolinco-primary/10 to-prolinco-secondary/10 border-2 border-prolinco-primary/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mt-8 sm:mt-12">
                        <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                            <ShieldCheckIcon className="h-6 w-6 sm:h-8 sm:w-8 text-prolinco-primary" />
                            <h3 className="text-lg sm:text-xl font-black text-prolinco-dark">Panel de Administrador</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-sm">
                            <div className="space-y-3">
                                <h4 className="font-black text-prolinco-dark">Configuración de URLs</h4>
                                <ul className="text-gray-700 space-y-2">
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-prolinco-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span className="text-sm">Haz clic en "Configurar URL" en cada herramienta</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-prolinco-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span className="text-sm">Usa enlaces públicos de Google Drive</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-prolinco-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span className="text-sm">Verifica permisos de visualización pública</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-black text-prolinco-dark">Prioridades Estratégicas</h4>
                                <ul className="text-gray-700 space-y-2">
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span className="text-sm"><strong className="text-red-600">Críticas:</strong> Configurar inmediatamente</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span className="text-sm"><strong className="text-orange-600">Altas:</strong> Configurar esta semana</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <span className="text-sm"><strong className="text-blue-600">Medias:</strong> Configurar cuando sea posible</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdministracionPage;