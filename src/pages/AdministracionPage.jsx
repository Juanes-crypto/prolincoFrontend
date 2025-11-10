// frontend/src/pages/AdministracionPage.jsx (VERSIÓN ARQUITECTÓNICA PREMIUM)

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
        <div className="animate-fadeIn relative">
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

            {/* 🆕 HEADER DE PÁGINA MEJORADO */}
            <header className="mb-10">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-prolinco-primary/10 rounded-xl">
                        <BuildingOfficeIcon className="h-8 w-8 text-prolinco-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-prolinco-dark">
                            Administración Estratégica
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Gestión de identidad organizacional y herramientas estratégicas
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
                        <span className="text-gray-600">{adminTools.length} herramientas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-600">
                          {adminTools.filter(t => t.isConfigured).length} configuradas
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
                            <h3 className="text-xl font-bold text-prolinco-dark">Diagnóstico Administrativo</h3>
                        </div>
                        <EditableField
                            initialContent={diagnostic}
                            section="admin"
                            subsection="diagnostic"
                            onUpdate={refetch}
                            showTitle={false}
                            placeholder="Describe el diagnóstico administrativo actual..."
                        />
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-2 h-8 bg-prolinco-secondary rounded-full"></div>
                            <h3 className="text-xl font-bold text-prolinco-dark">Objetivo Específico</h3>
                        </div>
                        <EditableField
                            initialContent={specificObjective}
                            section="admin"
                            subsection="specificObjective"
                            onUpdate={refetch}
                            showTitle={false}
                        />
                    </div>
                </div>
            </section>

            {/* 🆕 IDENTIDAD ORGANIZACIONAL MEJORADA */}
            <section className="mb-12">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-1 h-12 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-2xl font-black text-prolinco-dark">
                            Identidad Organizacional
                        </h2>
                        <p className="text-gray-600">
                            Fundamentos y principios que definen la esencia de Prolinco
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card
                        title="Misión"
                        icon={ViewfinderCircleIcon}
                        padding="p-6"
                        className="h-full"
                    >
                        <div className="flex-1">
                            <EditableField
                                initialContent={mission}
                                section="admin" // ✨ CORRECCIÓN 2: Estandarizar a 'admin'
                                subsection="mission"
                                onUpdate={refetch}
                                textAreaRows={6}
                                showTitle={false}
                                placeholder="Define el propósito fundamental de la organización..."
                            />
                        </div>
                    </Card>

                    <Card
                        title="Visión"
                        icon={LightBulbIcon}
                        padding="p-6"
                        className="h-full"
                    >
                        <div className="flex-1">
                            <EditableField
                                initialContent={vision}
                                section="admin" // ✨ CORRECCIÓN 3: Estandarizar a 'admin'
                                subsection="vision"
                                onUpdate={refetch}
                                textAreaRows={6}
                                showTitle={false}
                                placeholder="Describe el futuro deseado de la organización..."
                            />
                        </div>
                    </Card>

                    <Card
                        title="Valores Corporativos"
                        icon={ShieldCheckIcon}
                        padding="p-6"
                        className="h-full"
                    >
                        <div className="flex-1">
                            <EditableField
                                initialContent={corporateValues}
                                section="admin" // ✨ CORRECCIÓN 4: Estandarizar a 'admin'
                                subsection="corporateValues"
                                onUpdate={refetch}
                                textAreaRows={6}
                                showTitle={false}
                                placeholder="Separar valores por comas: Calidad, Servicio, Innovación..."
                            />
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700">
                                  💡 <strong>Formato:</strong> Separar cada valor con una coma.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* 🆕 MARCO LEGAL Y MATRICES ESTRATÉGICAS MEJORADO */}
            <section>
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-1 h-12 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-2xl font-black text-prolinco-dark">
                            Marco Legal y Matrices Estratégicas
                        </h2>
                        <p className="text-gray-600">
                            Documentación legal y herramientas de análisis estratégico
                        </p>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-prolinco-dark">
                                Progreso de Configuración Estratégica
                            </h3>
                            <span className="text-sm font-medium text-prolinco-primary">
                                {adminTools.filter(t => t.isConfigured).length}/{adminTools.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-prolinco-primary to-prolinco-secondary h-3 rounded-full transition-all duration-1000"
                            style={{
                              width: `${adminTools.length ? (adminTools.filter(t => t.isConfigured).length / adminTools.length) * 100 : 0}%`
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Por configurar</span>
                          <span>Completado</span>
                        </div>
                    </div>
                </div>

                {!isAdmin && adminTools.every(tool => !tool.isConfigured) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-center space-x-3">
                      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                      <div>
                        <h4 className="text-lg font-semibold text-yellow-800 mb-1">
                          Herramientas en Configuración
                        </h4>
                        <p className="text-yellow-700">
                          Las herramientas estratégicas están siendo configuradas por el administrador.
                          Estarán disponibles próximamente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {Object.keys(toolsByCategory).map(category => (
                  <CategorySection
                    key={category}
                    category={category}
                    tools={toolsByCategory[category]}
                  />
                ))}

                {isAdmin && (
                  <div className="bg-gradient-to-r from-prolinco-primary/10 to-prolinco-secondary/10 border border-prolinco-primary/20 rounded-2xl p-6 mt-8">
                    <div className="flex items-center space-x-3 mb-4">
                      <ShieldCheckIcon className="h-6 w-6 text-prolinco-primary" />
                      <h3 className="text-lg font-semibold text-prolinco-dark">
                        Panel de Administrador
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-prolinco-dark">Configuración de URLs</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• Haz clic en "Configurar URL" en cada herramienta</li>
                          <li>• Usa enlaces públicos de Google Drive</li>
                          <li>• Verifica permisos de visualización pública</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-prolinco-dark">Prioridades</h4>
                        <ul className="text-gray-700 space-y-1">
                          <li>• <span className="text-red-600 font-medium">Críticas:</span> Configurar inmediatamente</li>
                          <li>• <span className="text-orange-600 font-medium">Altas:</span> Configurar esta semana</li>
                          <li>• <span className="text-blue-600 font-medium">Medias:</span> Configurar cuando sea posible</li>
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