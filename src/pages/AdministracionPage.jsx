// frontend/src/pages/AdministracionPage.jsx (VERSIÓN REDISEÑADA - INNOVADORA)

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import {
    BuildingLibraryIcon, LinkIcon, ChartBarIcon, DocumentTextIcon, PencilIcon,
    ExclamationTriangleIcon, ArrowTopRightOnSquareIcon, CheckCircleIcon, BuildingOfficeIcon,
    ScaleIcon, CubeIcon, ChartPieIcon, ViewfinderCircleIcon, LightBulbIcon, ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';
import EditableField from '../components/EditableField';
// Es posible que uses EditModal aquí también, si es el modal genérico.
// Si ToolUrlModal es específico y funciona, lo mantenemos.
import ToolUrlModal from '../components/ToolUrlModal';

// ESTRUCTURA DE HERRAMIENTAS (mantener igual)
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

// CONFIGURACIONES (mantener igual)
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

const AdministracionPage = ({ data = {}, refetch }) => {
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    // Extraer datos
    const diagnostic = data.diagnostic || '';
    const specificObjective = data.specificObjective || '';
    const mission = data.mission || '';
    const vision = data.vision || '';
    const corporateValues = Array.isArray(data.corporateValues) ? data.corporateValues.join(', ') : '';

    // 🆕 ESTADO SIMPLIFICADO COMO SERVICE.JSX
    const [editingUrl, setEditingUrl] = useState({ 
        toolName: null, 
        toolKey: null, 
        url: '' 
    });
    const [adminTools, setAdminTools] = useState([]);

    // AGRUPAR HERRAMIENTAS POR CATEGORÍA
    const toolsByCategory = adminTools.reduce((acc, tool) => {
        const category = tool.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(tool);
        return acc;
    }, {});

    // Sincronizar herramientas con datos del backend
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            const mappedTools = ADMIN_TOOLS_STRUCTURE.map(tool => ({
                ...tool,
                url: data[tool.key] || '#',
                isConfigured: data[tool.key] && data[tool.key] !== '#'
            }));
            setAdminTools(mappedTools);
        } else {
            setAdminTools(ADMIN_TOOLS_STRUCTURE.map(tool => ({
                ...tool,
                url: '#',
                isConfigured: false
            })));
        }
    }, [JSON.stringify(data)]);

    // 🆕 FUNCIONES DIRECTAS COMO SERVICE.JSX
    const startUrlEdit = (toolName, toolKey, currentUrl) => {
        console.log('🎯 Administracion - startUrlEdit llamado:', toolName, toolKey, currentUrl);
        setEditingUrl({ toolName, toolKey, url: currentUrl });
    };

    const handleUrlUpdate = () => {
        console.log('✅ Administracion - handleUrlUpdate llamado');
        if (refetch) {
            refetch();
        }
        setEditingUrl({ toolName: null, toolKey: null, url: '' });
    };

    const closeModal = () => {
        setEditingUrl({ toolName: null, toolKey: null, url: '' });
    };

    // 🆕 FUNCIÓN MEJORADA PARA ABRIR DOCUMENTOS
    const openDocument = (url, toolName) => {
        if (url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            alert(`${toolName} no está configurado. ${isAdmin ? 'Puedes configurarlo haciendo clic en "Configurar URL".' : 'Contacta al administrador.'}`);
        }
    };
    
    // 🆕 RENDERIZADO CORREGIDO - PATRÓN SERVICE.JSX
    const renderToolCard = (tool) => {
        const importanceConfig = IMPORTANCE_CONFIG[tool.importance];
        const CategoryIcon = CATEGORIES_CONFIG[tool.category]?.icon || DocumentTextIcon;

        return (
            <Card
                key={`${tool.key}-${tool.name}`}
                title={tool.name}
                icon={tool.icon}
                padding="p-5"
                className="group relative overflow-hidden h-full flex flex-col"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                <div className="flex-1 flex flex-col">
                    {/* CATEGORÍA Y DESCRIPCIÓN */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <CategoryIcon className="h-4 w-4 text-gray-400" />
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    {tool.category}
                                </span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${importanceConfig.badge}`}>
                                {importanceConfig.label}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {tool.description}
                        </p>
                    </div>

                    {/* ESTADO DE CONFIGURACIÓN */}
                    <div className="mb-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${tool.isConfigured
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

                    {/* 🆕 BOTONES CORREGIDOS - PATRÓN SERVICE.JSX */}
                    <div className="mt-auto space-y-3">
                        <button
                            onClick={() => openDocument(tool.url, tool.name)}
                            className={`w-full inline-flex items-center justify-between p-3 rounded-xl transition-all duration-300 border ${tool.isConfigured
                                ? 'bg-prolinco-secondary text-white border-prolinco-secondary hover:bg-prolinco-primary hover:border-prolinco-primary hover:shadow-lg hover:scale-[1.02]'
                                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              }`}
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
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => startUrlEdit(tool.name, tool.key, tool.url)}
                                className="w-full inline-flex items-center justify-center px-3 py-2 text-sm text-gray-600 hover:text-prolinco-primary font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-prolinco-primary focus:ring-offset-2"
                            >
                                <PencilIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                {tool.isConfigured ? 'Cambiar URL' : 'Configurar URL'}
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    // COMPONENTE DE CATEGORÍA (mantener igual)
    const CategorySection = ({ category, tools }) => {
        const categoryConfig = CATEGORIES_CONFIG[category];
        const CategoryIcon = categoryConfig?.icon || DocumentTextIcon;

        return (
            <section key={category} className="mb-10">
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
                                {tools.length} herramienta{tools.length !== 1 ? 's' : ''} {category.toLowerCase()}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool, index) => (
                        <div key={`${tool.key}-${index}-${category}`}>
                            {renderToolCard(tool)}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    return (
        <div className="animate-fadeIn relative min-h-screen">
            {/* ELEMENTOS GEOMÉTRICOS DE FONDO - PATRONES ARQUITECTÓNICOS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* LÍNEAS PARALELAS ARQUITECTÓNICAS */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-10 w-40 h-px bg-gradient-to-r from-gray-300/40 to-transparent"></div>
                    <div className="absolute top-32 left-10 w-px h-20 bg-gradient-to-b from-gray-300/40 to-transparent"></div>
                    <div className="absolute top-32 left-50 w-32 h-px bg-gradient-to-r from-gray-300/40 to-transparent"></div>

                    <div className="absolute bottom-40 right-20 w-48 h-px bg-gradient-to-l from-gray-400/40 to-transparent"></div>
                    <div className="absolute bottom-40 right-20 w-px h-24 bg-gradient-to-b from-gray-400/40 to-transparent"></div>
                    <div className="absolute bottom-64 right-68 w-40 h-px bg-gradient-to-r from-gray-400/40 to-transparent"></div>
                </div>

                {/* FORMAS HEXAGONALES Y GEOMÉTRICAS */}
                <div className="absolute top-1/3 right-1/4 w-16 h-16 border-2 border-gray-300/20 rotate-45"></div>
                <div className="absolute bottom-1/3 left-1/3 w-12 h-12 border-2 border-gray-400/20 rotate-12"></div>
                <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-gradient-to-br from-gray-300/10 to-transparent rotate-30"></div>

                {/* PUNTOS DE CONEXIÓN ESTRATÉGICOS */}
                <div className="absolute top-40 left-1/2 flex space-x-4">
                    <div className="w-3 h-3 bg-prolinco-primary/50 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-prolinco-secondary/50 rounded-full animate-pulse delay-100"></div>
                    <div className="w-3 h-3 bg-gray-500/50 rounded-full animate-pulse delay-200"></div>
                </div>

                {/* ELEMENTOS ARQUITECTÓNICOS ABSTRACTOS */}
                <div className="absolute top-20 right-40 w-10 h-10 border border-gray-300/30 rotate-45"></div>
                <div className="absolute bottom-20 left-40 w-6 h-6 border border-gray-400/30 rotate-12"></div>
            </div>

            {/* 🆕 DEBUG CONSOLE */}
            {console.log('🔍 Administracion - editingUrl:', editingUrl)}

            {/* 🆕 MODAL CORREGIDO - PATRÓN SERVICE.JSX */}
            {editingUrl.toolName && (
                <ToolUrlModal
                    tool={{
                        name: editingUrl.toolName,
                        key: editingUrl.toolKey,
                        url: editingUrl.url
                    }}
                    section="admin"
                    onComplete={handleUrlUpdate}
                    onClose={closeModal}
                />
            )}

            {/* HEADER ASIMÉTRICO CON ELEMENTOS ARQUITECTÓNICOS */}
            <header className="relative mb-20 overflow-hidden">
                {/* BARRA DIAGONAL ARQUITECTÓNICA */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-gray-100/20 via-transparent to-gray-200/20 transform skew-x-12"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-10">
                        <div className="relative">
                            <div className="p-6 bg-white border-2 border-gray-300 rounded-3xl shadow-xl">
                                <BuildingOfficeIcon className="h-14 w-14 text-prolinco-primary" />
                            </div>
                            {/* ELEMENTO GEOMÉTRICO DECORATIVO */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-prolinco-secondary/40 rotate-45"></div>
                        </div>
                        <div>
                            <h1 className="text-6xl font-black text-prolinco-dark mb-4">Administración Estratégica</h1>
                            <p className="text-gray-600 text-xl max-w-xl">Gestión integral de identidad organizacional y herramientas estratégicas para el crecimiento sostenible</p>
                        </div>
                    </div>

                    {/* INDICADORES DE SISTEMA CON ANIMACIONES AVANZADAS */}
                    <div className="hidden xl:flex items-center space-x-10 text-sm">
                        <div className="flex items-center space-x-4 group">
                            <div className="w-4 h-4 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse"></div>
                            <span className="text-gray-600 font-semibold">Sistema operativo</span>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-4 h-4 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse delay-150"></div>
                            <span className="text-gray-600 font-semibold">{adminTools.length} herramientas estratégicas</span>
                        </div>
                        <div className="flex items-center space-x-4 group">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse delay-300"></div>
                            <span className="text-gray-600 font-semibold">{adminTools.filter(t => t.isConfigured).length} configuradas</span>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center space-x-4 group">
                                <div className="w-4 h-4 bg-prolinco-primary rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse delay-450"></div>
                                <span className="text-gray-600 font-semibold">Modo administrador</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* SECCIÓN DIAGNÓSTICO CON LAYOUT ARQUITECTÓNICO */}
            <section className="mb-24 relative">
                {/* LÍNEA DE CONEXIÓN ESTRATÉGICA */}
                <div className="absolute left-16 top-16 bottom-16 w-px bg-gradient-to-b from-prolinco-primary/40 via-gray-400/20 to-prolinco-secondary/40"></div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 pl-24">
                    {/* DIAGNÓSTICO - POSICIÓN ASIMÉTRICA */}
                    <div className="xl:col-span-3 bg-white rounded-3xl shadow-2xl border border-gray-300 p-12 relative overflow-hidden group hover:shadow-3xl transition-all duration-700">
                        {/* ELEMENTO GEOMÉTRICO INTERNO */}
                        <div className="absolute top-8 right-8 w-24 h-24 border-2 border-prolinco-primary/15 rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-8 mb-10">
                                <div className="w-6 h-20 bg-prolinco-primary rounded-full"></div>
                                <h3 className="text-4xl font-black text-prolinco-dark">Diagnóstico Administrativo</h3>
                            </div>
                            <div className="text-xl leading-relaxed text-gray-700">
                                <EditableField
                                    initialContent={diagnostic}
                                    section="admin"
                                    subsection="diagnostico"
                                    onUpdate={refetch}
                                    showTitle={false}
                                    placeholder="Describe el diagnóstico administrativo actual de la organización..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* OBJETIVO ESPECÍFICO - POSICIÓN ASIMÉTRICA */}
                    <div className="xl:col-span-2 bg-white rounded-3xl shadow-2xl border border-gray-300 p-12 relative overflow-hidden group hover:shadow-3xl transition-all duration-700">
                        {/* ELEMENTO GEOMÉTRICO INTERNO */}
                        <div className="absolute bottom-8 left-8 w-20 h-20 border-2 border-prolinco-secondary/15 rotate-12 group-hover:-rotate-12 transition-transform duration-1000"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-8 mb-10">
                                <div className="w-6 h-20 bg-prolinco-secondary rounded-full"></div>
                                <h3 className="text-4xl font-black text-prolinco-dark">Objetivo Específico</h3>
                            </div>
                            <div className="text-xl leading-relaxed text-gray-700">
                                <EditableField
                                    initialContent={specificObjective}
                                    section="admin"
                                    subsection="Objetivos Especificos"
                                    onUpdate={refetch}
                                    showTitle={false}
                                    placeholder="Define el objetivo específico para el área administrativa..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN IDENTIDAD ORGANIZACIONAL CON ELEMENTOS ARQUITECTÓNICOS */}
            <section className="mb-24 relative">
                {/* TÍTULO CON ELEMENTOS VISUALES ARQUITECTÓNICOS */}
                <div className="flex items-center space-x-10 mb-20">
                    <div className="w-3 h-24 bg-gradient-to-b from-prolinco-primary via-gray-500 to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-5xl font-black text-prolinco-dark mb-4">Identidad Organizacional</h2>
                        <p className="text-gray-600 text-2xl">Fundamentos estratégicos que definen la esencia y propósito de Prolinco</p>
                    </div>
                </div>

                {/* GRID ASIMÉTRICO CON ESPACIOS ARQUITECTÓNICOS */}
                <div className="space-y-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Misión",
                                icon: ViewfinderCircleIcon,
                                content: mission,
                                subsection: "mission",
                                placeholder: "Define el propósito fundamental de la organización...",
                                color: "from-prolinco-primary/10 to-prolinco-primary/5"
                            },
                            {
                                title: "Visión",
                                icon: LightBulbIcon,
                                content: vision,
                                subsection: "vision",
                                placeholder: "Describe el futuro deseado de la organización...",
                                color: "from-prolinco-secondary/10 to-prolinco-secondary/5"
                            },
                            {
                                title: "Valores Corporativos",
                                icon: ShieldCheckIcon,
                                content: corporateValues,
                                subsection: "corporateValues",
                                placeholder: "Separar valores por comas: Calidad, Servicio, Innovación...",
                                color: "from-gray-100/50 to-gray-200/30",
                                hasTip: true
                            }
                        ].map((item, index) => (
                            <Card
                                key={item.title}
                                title={item.title}
                                icon={item.icon}
                                padding="p-10"
                                className={`h-full relative overflow-hidden group hover:shadow-2xl transition-all duration-700 ${index % 2 === 1 ? 'lg:mt-12' : ''}`}
                            >
                                {/* ELEMENTO GEOMÉTRICO EN CARD */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                <div className="absolute top-4 right-4 w-10 h-10 border border-gray-300/40 rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>

                                <div className="relative z-10 flex-1 flex flex-col">
                                    <EditableField
                                        initialContent={item.content}
                                        section="admin"
                                        subsection={item.subsection}
                                        onUpdate={refetch}
                                        textAreaRows={8}
                                        showTitle={false}
                                        placeholder={item.placeholder}
                                    />
                                    {item.hasTip && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <p className="text-sm text-blue-700">
                                              💡 <strong>Formato:</strong> Separar cada valor con una coma.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECCIÓN HERRAMIENTAS ESTRATÉGICAS CON ELEMENTOS ARQUITECTÓNICOS */}
            <section className="relative">
                {/* TÍTULO CON ELEMENTOS VISUALES */}
                <div className="flex items-center space-x-10 mb-20">
                    <div className="w-3 h-24 bg-gradient-to-b from-prolinco-primary via-gray-500 to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-5xl font-black text-prolinco-dark mb-4">Herramientas Estratégicas</h2>
                        <p className="text-gray-600 text-2xl">Marco legal y matrices de análisis para la toma de decisiones estratégicas</p>
                    </div>
                </div>

                {/* BARRA DE PROGRESO CON ELEMENTOS VISUALES */}
                <div className="mb-20">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-300 p-10 relative overflow-hidden">
                        {/* ELEMENTOS DECORATIVOS */}
                        <div className="absolute top-6 right-6 w-16 h-16 border-2 border-prolinco-primary/10 rotate-45"></div>
                        <div className="absolute bottom-6 left-6 w-12 h-12 bg-prolinco-secondary/10 rotate-12"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-black text-prolinco-dark">Progreso de Configuración Estratégica</h3>
                                <div className="text-right">
                                    <div className="text-4xl font-black text-prolinco-primary">{adminTools.filter(t => t.isConfigured).length}</div>
                                    <div className="text-lg text-gray-500">de {adminTools.length} herramientas</div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                              <div
                                className="bg-gradient-to-r from-prolinco-primary to-prolinco-secondary h-4 rounded-full transition-all duration-1000 shadow-lg"
                                style={{
                                  width: `${adminTools.length ? (adminTools.filter(t => t.isConfigured).length / adminTools.length) * 100 : 0}%`
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Por configurar</span>
                              <span>Completado</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MENSAJE DE CONFIGURACIÓN PENDIENTE */}
                {!isAdmin && adminTools.every(tool => !tool.isConfigured) && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-10 mb-16 relative overflow-hidden">
                    <div className="absolute top-4 right-4 w-12 h-12 border border-yellow-300/50 rotate-45"></div>
                    <div className="flex items-center space-x-6">
                      <ExclamationTriangleIcon className="h-10 w-10 text-yellow-600 flex-shrink-0" />
                      <div>
                        <h4 className="text-2xl font-black text-yellow-800 mb-2">
                          Herramientas en Configuración
                        </h4>
                        <p className="text-yellow-700 text-lg">
                          Las herramientas estratégicas están siendo configuradas por el administrador.
                          Estarán disponibles próximamente para su uso.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* GRID DE CATEGORÍAS CON ESPACIOS ARQUITECTÓNICOS */}
                <div className="space-y-24">
                    {Object.keys(toolsByCategory).map((category, index) => (
                        <div key={category} className={`relative ${index % 2 === 1 ? 'xl:ml-20' : ''}`}>
                            {/* ELEMENTOS GEOMÉTRICOS DE SEPARACIÓN */}
                            <div className="absolute -left-16 top-16 w-8 h-8 border-2 border-gray-300/40 rotate-45"></div>
                            <div className="absolute -right-8 bottom-16 w-4 h-4 bg-prolinco-primary/40 rounded-full"></div>

                            <section className="bg-white rounded-3xl shadow-2xl border border-gray-300 overflow-hidden group hover:shadow-3xl transition-all duration-700">
                                {/* HEADER DE CATEGORÍA CON ELEMENTOS ARQUITECTÓNICOS */}
                                <div className="relative bg-gradient-to-r from-gray-50/50 to-gray-100/50 p-12 border-b border-gray-300">
                                    {/* ELEMENTOS DECORATIVOS */}
                                    <div className="absolute top-6 right-6 w-16 h-16 border-2 border-prolinco-primary/20 rotate-45"></div>
                                    <div className="absolute bottom-6 left-6 w-12 h-12 bg-prolinco-secondary/10 rotate-12"></div>

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center space-x-8">
                                            <div className="w-6 h-20 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                                            <div>
                                                <h3 className="text-4xl font-black text-prolinco-dark capitalize">{category}</h3>
                                                <p className="text-gray-600 text-xl mt-2">
                                                    {category === 'Legal' && 'Documentación jurídica y normativa organizacional'}
                                                    {category === 'Estratégica' && 'Herramientas de análisis y planificación estratégica'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-4xl font-black text-prolinco-primary">{toolsByCategory[category].length}</div>
                                            <div className="text-lg text-gray-500 font-medium">herramientas</div>
                                        </div>
                                    </div>
                                </div>

                                {/* GRID DE HERRAMIENTAS */}
                                <div className="p-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        {toolsByCategory[category].map((tool) => (
                                            <Card
                                                key={tool.name}
                                                title={tool.name}
                                                icon={tool.icon}
                                                padding="p-8"
                                                className="group/card relative overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-500"
                                            >
                                                {/* ELEMENTO GEOMÉTRICO EN CARD */}
                                                <div className="absolute top-4 right-4 w-10 h-10 border border-gray-300/50 rotate-45 group-hover/card:rotate-90 transition-transform duration-500"></div>
                                                <div className="relative z-10 flex-1 flex flex-col">
                                                    {renderToolCard(tool)}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    ))}
                </div>

                {/* PANEL DE ADMINISTRADOR CON ELEMENTOS ARQUITECTÓNICOS */}
                {isAdmin && (
                  <div className="bg-gradient-to-r from-prolinco-primary/10 to-prolinco-secondary/10 border-2 border-prolinco-primary/30 rounded-3xl p-12 mt-20 relative overflow-hidden">
                    <div className="absolute top-6 right-6 w-16 h-16 border-2 border-prolinco-primary/20 rotate-45"></div>
                    <div className="absolute bottom-6 left-6 w-12 h-12 bg-prolinco-secondary/10 rotate-12"></div>

                    <div className="relative z-10">
                        <div className="flex items-center space-x-6 mb-10">
                            <ShieldCheckIcon className="h-10 w-10 text-prolinco-primary" />
                            <h3 className="text-3xl font-black text-prolinco-dark">Panel de Administrador</h3>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-base">
                          <div className="space-y-4">
                            <h4 className="font-black text-prolinco-dark text-xl">Configuración de URLs</h4>
                            <ul className="text-gray-700 space-y-3">
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-prolinco-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Haz clic en "Configurar URL" en cada herramienta</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-prolinco-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Usa enlaces públicos de Google Drive</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-prolinco-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>Verifica permisos de visualización pública</span>
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-black text-prolinco-dark text-xl">Prioridades Estratégicas</h4>
                            <ul className="text-gray-700 space-y-3">
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-red-600">Críticas:</strong> Configurar inmediatamente</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-orange-600">Altas:</strong> Configurar esta semana</span>
                              </li>
                              <li className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span><strong className="text-blue-600">Medias:</strong> Configurar cuando sea posible</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                    </div>
                  </div>
                )}
            </section>
        </div>

    );

};

export default AdministracionPage;
