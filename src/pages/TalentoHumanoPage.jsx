// frontend/src/pages/TalentoHumanoPage.jsx (VERSIÓN COMPLETA Y CORREGIDA)

import React, { useState, useEffect, useMemo } from 'react';
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
import useOperationalData from '../hooks/useOperationalData';
import EditModal from '../components/EditModal';

const TOOL_STRUCTURE = [
    { name: 'Organigrama', key: 'Organigrama', icon: BuildingOfficeIcon, description: 'Estructura organizacional y relaciones jerárquicas', category: 'Estructura', color: 'from-blue-500 to-cyan-500' },
    { name: 'Mapa de Procesos', key: 'Mapa de Procesos', icon: MapIcon, description: 'Flujos de trabajo y procedimientos operativos', category: 'Procesos', color: 'from-green-500 to-emerald-500' },
    { name: 'Perfil del Empleado', key: 'Perfil del Empleado', icon: UserCircleIcon, description: 'Competencias y responsabilidades por cargo', category: 'Gestión', color: 'from-purple-500 to-indigo-500' },
    { name: 'Manual del Empleado', key: 'Manual del Empleado', icon: BookOpenIcon, description: 'Políticas, normas y cultura organizacional', category: 'Documentación', color: 'from-orange-500 to-amber-500' },
    { name: 'Proceso de Inducción', key: 'Proceso de Inducción', icon: AcademicCapIcon, description: 'Onboarding y adaptación de nuevo personal', category: 'Desarrollo', color: 'from-teal-500 to-blue-500' },
    { name: 'Proceso de Capacitación', key: 'Proceso de Capacitación', icon: ChartBarIcon, description: 'Plan de formación y desarrollo de competencias', category: 'Desarrollo', color: 'from-pink-500 to-rose-500' },
];

const CATEGORIES_CONFIG = {
    'Estructura': { icon: BuildingOfficeIcon, color: 'border-blue-200 bg-blue-50', accent: 'text-blue-700' },
    'Procesos': { icon: MapIcon, color: 'border-green-200 bg-green-50', accent: 'text-green-700' },
    'Gestión': { icon: UserCircleIcon, color: 'border-purple-200 bg-purple-50', accent: 'text-purple-700' },
    'Documentación': { icon: BookOpenIcon, color: 'border-orange-200 bg-orange-50', accent: 'text-orange-700' },
    'Desarrollo': { icon: AcademicCapIcon, color: 'border-teal-200 bg-teal-50', accent: 'text-teal-700' }
};

// Función para mapear herramientas con datos del backend
const mapToolsWithData = (tools, data) => {
    console.log('🔄 Mapeando herramientas con datos:', data);
    
    return tools.map(tool => {
        if (!data || !data.tools) {
            return {
                ...tool,
                url: '#',
                isConfigured: false
            };
        }

        // Buscar la herramienta de forma robusta
        const backendTool = data.tools.find(backendTool => {
            const backendName = backendTool.name.toLowerCase().replace(/\s/g, '');
            const toolName = tool.name.toLowerCase().replace(/\s/g, '');
            console.log(`🔍 Comparando: "${backendName}" vs "${toolName}"`);
            return backendName === toolName;
        });

        console.log(`📊 Herramienta "${tool.name}" encontrada:`, backendTool);
        
        return {
            ...tool,
            url: backendTool ? backendTool.url || '#' : '#',
            isConfigured: backendTool && backendTool.url && backendTool.url !== '' && backendTool.url !== '#'
        };
    });
};

const TalentoHumanoPage = () => {
    // Usar hook directamente
    const { data, loading, error, refetch } = useOperationalData();
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';
    const isTalentUser = user && user.role === 'talento';

    // Extraer datos específicos de talento
    const talentData = useMemo(() => data?.talento || {}, [data]);
    
    // 🆕 ESTADOS PARA CONTENIDO Y EDICIÓN
    const [content, setContent] = useState({
        diagnostic: '',
        specificObjective: ''
    });
    
    const [editingUrl, setEditingUrl] = useState({ toolName: null, toolKey: null, url: '' });
    const [editingText, setEditingText] = useState({ field: null, value: '' });
    const [talentTools, setTalentTools] = useState([]);

    const talentDataJson = JSON.stringify(talentData || {});

    // Sincronizar contenido cuando cambian los datos
    useEffect(() => {
        if (talentData) {
            setContent({
                diagnostic: talentData.diagnostic || '',
                specificObjective: talentData.specificObjective || ''
            });
        }
    }, [talentData]);

    // Mapear herramientas
    useEffect(() => {
        console.log('🎯 useEffect ejecutado con talentData:', talentData);

        if (talentData && talentData.tools) {
            console.log('📊 Tools del backend (talento):', talentData.tools);
            const mappedTools = mapToolsWithData(TOOL_STRUCTURE, talentData);
            console.log('🔄 Herramientas mapeadas:', mappedTools);
            setTalentTools(mappedTools);
        } else {
            console.log('📭 No hay datos de talento, usando valores por defecto');
            setTalentTools(mapToolsWithData(TOOL_STRUCTURE, {}));
        }
    }, [talentDataJson, talentData]);

    // 🆕 FUNCIONES PARA EDICIÓN DE TEXTOS
    const startTextEdit = (field, initialValue) => {
        setEditingText({ field, value: initialValue });
        setEditingUrl({ toolName: null });
    };

    const handleContentUpdate = (updatedPayload) => {
        console.log('📝 handleContentUpdate recibió:', updatedPayload);
        
        if (updatedPayload && typeof updatedPayload === 'object') {
            const key = Object.keys(updatedPayload)[0];
            const newValue = Object.values(updatedPayload)[0];
            
            // Actualizar estado local inmediatamente
            setContent(prev => ({ ...prev, [key]: newValue }));
        }

        // Cerrar modal
        setEditingText({ field: null, value: '' });
        
        // Recargar datos
        setTimeout(() => {
            if (refetch) {
                refetch();
            }
        }, 500);
    };

    // 🆕 FUNCIONES PARA EDICIÓN DE URLs
    const startUrlEdit = (toolName, toolKey, currentUrl) => {
        setEditingUrl({ toolName, toolKey, url: currentUrl || '' });
    };

    const handleUrlUpdate = (updatedData) => {
        console.log('🔄 handleUrlUpdate recibió:', updatedData);
        
        if (updatedData && updatedData.url) {
            const { toolName, toolKey, url } = updatedData;
            const newUrl = url;
            
            // Actualizar estado de herramientas
            setTalentTools(prev =>
                prev.map(t => {
                    const toolMatches = 
                        t.key === toolKey || 
                        t.name === toolName ||
                        t.name.toLowerCase().replace(/\s/g, '') === (toolName || '').toLowerCase().replace(/\s/g, '');
                    
                    if (toolMatches) {
                        console.log(`🔄 Actualizando herramienta: ${t.name} con URL: ${newUrl}`);
                        return { 
                            ...t, 
                            url: newUrl, 
                            isConfigured: !!newUrl && newUrl !== '' && newUrl !== '#' 
                        };
                    }
                    return t;
                })
            );
        }
        
        setEditingUrl({ toolName: null, toolKey: null, url: '' });
        
        setTimeout(() => {
            if (refetch) {
                console.log('🔄 Forzando recarga de datos...');
                refetch();
            }
        }, 500);
    };

    const closeModal = () => {
        setEditingUrl({ toolName: null, toolKey: null, url: '' });
        setEditingText({ field: null, value: '' });
    };

    if (loading) return <div className="text-center p-10">Cargando Talento Humano...</div>;
    if (error) return <div className="text-red-600 text-center p-10">Error: {error}</div>;

    const toolsByCategory = talentTools.reduce((acc, tool) => {
        const category = tool.category;
        if (!acc[category]) acc[category] = [];
        acc[category].push(tool);
        return acc;
    }, {});

    const renderToolCard = (tool) => {
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
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                            <CategoryIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{tool.category}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="mb-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${tool.isConfigured ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
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
                    <div className="mt-auto space-y-3">
                        <a 
                            href={tool.isConfigured ? tool.url : '#'} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={`w-full inline-flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 group focus:outline-none focus:ring-4 focus:ring-prolinco-primary/20 focus:border-prolinco-primary ${
                                tool.isConfigured 
                                    ? 'bg-prolinco-secondary text-white border-prolinco-secondary hover:bg-prolinco-primary hover:border-prolinco-primary hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1' 
                                    : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                            }`} 
                            onClick={!tool.isConfigured ? (e) => e.preventDefault() : undefined}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`p-1.5 rounded-lg ${tool.isConfigured ? 'bg-white/20' : 'bg-gray-200'}`}>
                                    <LinkIcon className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-sm">{tool.isConfigured ? 'Abrir Documento' : 'No Configurado'}</span>
                            </div>
                            {tool.isConfigured && (
                                <ArrowTopRightOnSquareIcon className="h-4 w-4 opacity-90 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                            )}
                        </a>
                        {isAdmin && (
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    e.preventDefault(); 
                                    startUrlEdit(tool.name, tool.key, tool.url); 
                                }} 
                                className="w-full inline-flex items-center justify-center px-4 py-3 text-sm text-gray-600 hover:text-prolinco-primary font-semibold bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-prolinco-primary/20 focus:border-prolinco-primary border-2 border-transparent hover:border-prolinco-primary/30 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                            >
                                <PencilIcon className="h-4 w-4 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                                <span>{tool.isConfigured ? 'Cambiar URL' : 'Configurar URL'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

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
                            <h3 className="text-2xl font-black text-gray-800">{category}</h3>
                            <p className="text-gray-600">{tools.length} herramienta{tools.length !== 1 ? 's' : ''} de {category.toLowerCase()}</p>
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
            {/* ELEMENTOS GEOMÉTRICOS DE FONDO - LÍNEAS Y FORMAS SOFISTICADAS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* LÍNEAS DIAGONALES */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-10 w-px h-32 bg-gradient-to-b from-prolinco-primary/20 to-transparent rotate-12"></div>
                    <div className="absolute top-40 right-20 w-px h-24 bg-gradient-to-b from-prolinco-secondary/20 to-transparent -rotate-12"></div>
                    <div className="absolute bottom-32 left-1/4 w-px h-40 bg-gradient-to-b from-gray-300/30 to-transparent rotate-45"></div>
                </div>

                {/* FORMAS GEOMÉTRICAS ABSTRACTAS */}
                <div className="absolute top-16 right-16 w-20 h-20 border border-prolinco-primary/10 rotate-45"></div>
                <div className="absolute bottom-24 left-16 w-16 h-16 border border-prolinco-secondary/10 rotate-12"></div>
                <div className="absolute top-1/2 right-8 w-12 h-12 bg-gradient-to-br from-gray-100/20 to-transparent rotate-30"></div>

                {/* PATRÓN DE PUNTOS */}
                <div className="absolute top-32 left-1/3 flex space-x-2">
                    <div className="w-1 h-1 bg-prolinco-primary/30 rounded-full"></div>
                    <div className="w-1 h-1 bg-prolinco-secondary/30 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400/30 rounded-full"></div>
                </div>
            </div>

            {/* 🆕 MODALES PARA EDICIÓN */}
            <EditModal
                type="text"
                section="talento"
                editingData={editingText}
                onComplete={handleContentUpdate}
                onClose={() => setEditingText({ field: null, value: '' })}
            />

            <EditModal
                type="url"
                section="talento"
                editingData={{
                    toolName: editingUrl.toolName,
                    toolKey: editingUrl.toolKey,
                    url: editingUrl.url,
                    field: editingUrl.toolKey
                }}
                onComplete={handleUrlUpdate}
                onClose={closeModal}
            />

            {/* HEADER ASIMÉTRICO CON ELEMENTOS GEOMÉTRICOS */}
            <header className="relative mb-16 overflow-hidden">
                {/* BARRA GEOMÉTRICA DIAGONAL */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-prolinco-primary/5 to-transparent transform skew-x-12"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                                <UsersIcon className="h-10 w-10 text-prolinco-primary" />
                            </div>
                            {/* ELEMENTO GEOMÉTRICO DECORATIVO */}
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-prolinco-secondary/20 rotate-45"></div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-prolinco-dark mb-2">Talento Humano</h1>
                            <p className="text-gray-600 text-lg max-w-md">Gestión integral de recursos humanos y desarrollo organizacional</p>
                        </div>
                    </div>

                    {/* INDICADORES DE ESTADO CON MICRO-ANIMACIONES */}
                    <div className="hidden lg:flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 group">
                            <div className="w-2 h-2 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                            <span className="text-gray-600">Sistema activo</span>
                        </div>
                        <div className="flex items-center space-x-2 group">
                            <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                            <span className="text-gray-600">{talentTools.length} herramientas</span>
                        </div>
                        <div className="flex items-center space-x-2 group">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                            <span className="text-gray-600">{talentTools.filter(t => t.isConfigured).length} configuradas</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* SECCIÓN DIAGNÓSTICO CON LAYOUT ASIMÉTRICO */}
            <section className="mb-16 relative">
                {/* LÍNEA GEOMÉTRICA DE CONEXIÓN */}
                <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-prolinco-primary/20 via-transparent to-prolinco-secondary/20"></div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pl-16">
                    {/* DIAGNÓSTICO - POSICIÓN ASIMÉTRICA */}
                    <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        {/* ELEMENTO GEOMÉTRICO INTERNO */}
                        <div className="absolute top-4 right-4 w-16 h-16 border border-prolinco-primary/10 rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-3 h-12 bg-prolinco-primary rounded-full"></div>
                                <h3 className="text-2xl font-bold text-prolinco-dark">Diagnóstico Actual</h3>
                            </div>
                            <div className="text-lg leading-relaxed text-gray-700">
                                <p className="whitespace-pre-line">
                                    {content.diagnostic || 'Aún no se ha definido el diagnóstico del área de talento humano.'}
                                </p>
                            </div>
                            {(isAdmin || isTalentUser) && (
                                <button
                                    onClick={() => startTextEdit('diagnostic', content.diagnostic || '')}
                                    className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-prolinco-primary font-semibold rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-prolinco-primary/20"
                                >
                                    <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    <span>Editar Diagnóstico</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* OBJETIVO ESPECÍFICO - POSICIÓN ASIMÉTRICA */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        {/* ELEMENTO GEOMÉTRICO INTERNO */}
                        <div className="absolute bottom-4 left-4 w-12 h-12 border border-prolinco-secondary/10 rotate-12 group-hover:-rotate-12 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-3 h-12 bg-prolinco-secondary rounded-full"></div>
                                <h3 className="text-2xl font-bold text-prolinco-dark">Objetivo Específico</h3>
                            </div>
                            <div className="text-lg leading-relaxed text-gray-700">
                                <p className="whitespace-pre-line">
                                    {content.specificObjective || 'Aún no se ha definido el objetivo específico para talento humano.'}
                                </p>
                            </div>
                            {(isAdmin || isTalentUser) && (
                                <button
                                    onClick={() => startTextEdit('specificObjective', content.specificObjective || '')}
                                    className="mt-6 inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-prolinco-secondary font-semibold rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-prolinco-secondary/20"
                                >
                                    <PencilIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    <span>Editar Objetivo</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE HERRAMIENTAS CON ELEMENTOS GEOMÉTRICOS */}
            <section className="relative">
                {/* TÍTULO CON ELEMENTOS VISUALES */}
                <div className="flex items-center space-x-6 mb-12">
                    <div className="w-1 h-16 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-3xl font-black text-prolinco-dark mb-2">Herramientas por Categoría</h2>
                        <p className="text-gray-600 text-lg">Recursos organizados para la gestión integral del talento humano</p>
                    </div>
                </div>

                {/* GRID ASIMÉTRICO CON ESPACIOS GEOMÉTRICOS */}
                <div className="space-y-16">
                    {Object.keys(toolsByCategory).map((category, index) => (
                        <div key={category} className={`relative ${index % 2 === 1 ? 'xl:ml-12' : ''}`}>
                            {/* ELEMENTOS GEOMÉTRICOS DE SEPARACIÓN */}
                            <div className="absolute -left-8 top-8 w-4 h-4 border border-gray-300/30 rotate-45"></div>
                            <div className="absolute -right-4 bottom-8 w-2 h-2 bg-prolinco-primary/20 rounded-full"></div>

                            <CategorySection
                                category={category}
                                tools={toolsByCategory[category]}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TalentoHumanoPage;