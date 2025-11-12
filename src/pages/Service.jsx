// frontend/src/pages/Service.jsx (VERSIÓN CORREGIDA - NOMBRES DE CAMPOS FIXED)

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { TruckIcon, Cog6ToothIcon, ClipboardDocumentCheckIcon , LinkIcon, EnvelopeIcon , ChatBubbleLeftEllipsisIcon, PhoneIcon, ShareIcon, ChartBarIcon, PencilIcon } from '@heroicons/react/24/solid';
import { API } from '../api/api';
import EditModal from '../components/EditModal';
import { useAuth } from '../context/AuthProvider';

const Service = () => {
    const { user } = useAuth();

    // 🆕 CORRECCIÓN: Usar los nombres correctos del backend
    const [content, setContent] = useState({
        diagnostic: '',
        specificObjective: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingText, setEditingText] = useState({ field: null, value: '' });
    const [editingUrl, setEditingUrl] = useState({ toolName: null, toolKey: null, url: '', currentUrl: '' });

    const isAdmin = user && user.role === 'admin';
    const isServiceUser = user && user.role === 'servicio';

    const initialTools = {
        preventa: [
            { name: 'Volantes Digitales', key: 'volantesUrl', icon: ShareIcon },
            { name: 'Carteles Publicitarios', key: 'bannersUrl', icon: ChartBarIcon },
            { name: 'Formulario de Contacto', key: 'formularioUrl', icon: EnvelopeIcon  },
        ],
        venta: [
            { name: 'Volantes (Ofertas)', key: 'ofertasUrl', icon: ShareIcon },
            { name: 'Ciclo de Servicio', key: 'cicloServicioUrl', icon: ClipboardDocumentCheckIcon  },
            { name: 'Chat en Vivo', key: 'chatVirtualUrl', icon: ChatBubbleLeftEllipsisIcon },
            { name: 'WhatsApp Business', key: 'whatsappVentaUrl', icon: PhoneIcon, type: 'whatsapp' },
        ],
        postventa: [
            { name: 'Estrategias de Marketing', key: 'marketingUrl', icon: EnvelopeIcon  },
            { name: 'WhatsApp Soporte', key: 'whatsappSoporteUrl', icon: PhoneIcon, type: 'whatsapp' },
            { name: 'Instagram', key: 'instagramUrl', icon: ShareIcon },
            { name: 'Encuestas de Satisfacción', key: 'encuestasUrl', icon: ChartBarIcon },
            { name: 'Sección de Soporte (PQRS)', key: 'pqrsUrl', icon: ChatBubbleLeftEllipsisIcon },
        ]
    };
    
    const [serviceTools, setServiceTools] = useState(initialTools);

    // 🆕 CORRECCIÓN: Cargar datos con nombres correctos
    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await API.get('/content/servicio');
            const data = response.data;
            
            const mapUrlsToTools = (tools, urls) => tools.map(tool => ({
                ...tool,
                url: urls[tool.key] || '#', 
            }));

            setServiceTools({
                preventa: mapUrlsToTools(initialTools.preventa, data),
                venta: mapUrlsToTools(initialTools.venta, data),
                postventa: mapUrlsToTools(initialTools.postventa, data),
            });

            // 🆕 CORRECCIÓN CRÍTICA: Usar los nombres correctos del backend
            setContent({
                diagnostic: data.diagnostic || '',
                specificObjective: data.specificObjective || ''
            });
            setError(null);
        } catch {
            setError("Error al cargar el contenido de Servicio al Cliente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);
    
    const startTextEdit = (field, initialValue) => {
        setEditingText({ field, value: initialValue });
        setEditingUrl({ toolName: null });
    };

    const startUrlEdit = (toolName, toolKey, currentUrl) => {
        setEditingUrl({ toolName, toolKey, url: currentUrl, currentUrl });
        setEditingText({ field: null });
    };

    const handleContentUpdate = (updatedPayload) => {
        const updatedKey = Object.keys(updatedPayload)[0];
        const updatedValue = Object.values(updatedPayload)[0];

        // 1. Actualizar el contenido (Diagnóstico/Objetivo)
        setContent(prev => ({ ...prev, ...updatedPayload }));

        // 2. Actualizar las URLs de las herramientas
        const updateToolState = (tools) => {
            let updatedTools = { ...tools };
            for (let phase in updatedTools) {
                updatedTools[phase] = updatedTools[phase].map(tool => 
                    tool.key === updatedKey ? { ...tool, url: updatedValue } : tool
                );
            }
            return updatedTools;
        };
        
        setServiceTools(updateToolState);
    };
    
    const closeModal = () => {
        setEditingText({ field: null });
        setEditingUrl({ toolName: null });
    };

    const renderToolButton = (tool) => {
        const isWhatsapp = tool.type === 'whatsapp';
        const buttonClasses = isWhatsapp 
            ? 'w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-md'
            : 'w-full inline-flex items-center justify-center px-4 py-2 bg-prolinco-secondary text-white font-semibold rounded-lg hover:bg-prolinco-primary hover:text-prolinco-dark transition duration-300 shadow-md';

        return (
            <div key={tool.name}>
                <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={buttonClasses}
                >
                    <LinkIcon className="h-5 w-5 mr-2" />
                    {isWhatsapp ? 'Contactar por WhatsApp' : 'Acceder a Herramienta'}
                </a>
                
                {isAdmin && (
                    <button
                        onClick={() => startUrlEdit(tool.name, tool.key, tool.url)}
                        className="w-full inline-flex items-center justify-center px-4 py-1 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold"
                    >
                        <PencilIcon className="h-4 w-4 mr-1" /> Cambiar URL
                    </button>
                )}
            </div>
        );
    };

    if (loading && !editingText.field && !editingUrl.toolName) return <div className="text-prolinco-secondary text-center p-10 font-semibold">Cargando la Plataforma de Servicio al Cliente...</div>;
    if (error && !editingText.field && !editingUrl.toolName) return <div className="text-red-600 text-center p-10 font-semibold">{error}</div>;

    return (
        <div className="animate-fadeIn relative min-h-screen">
            {/* ELEMENTOS GEOMÉTRICOS DE FONDO - CIRCUITOS Y GRIDS TECNOLÓGICOS */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* LÍNEAS DE CIRCUITO */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-16 left-8 w-32 h-px bg-gradient-to-r from-prolinco-primary/30 to-transparent"></div>
                    <div className="absolute top-24 left-8 w-px h-16 bg-gradient-to-b from-prolinco-primary/30 to-transparent"></div>
                    <div className="absolute top-24 left-40 w-24 h-px bg-gradient-to-r from-prolinco-primary/30 to-transparent"></div>

                    <div className="absolute bottom-32 right-16 w-40 h-px bg-gradient-to-l from-prolinco-secondary/30 to-transparent"></div>
                    <div className="absolute bottom-32 right-16 w-px h-20 bg-gradient-to-b from-prolinco-secondary/30 to-transparent"></div>
                    <div className="absolute bottom-52 right-56 w-32 h-px bg-gradient-to-r from-prolinco-secondary/30 to-transparent"></div>
                </div>

                {/* GRIDS GEOMÉTRICOS */}
                <div className="absolute top-1/4 right-1/4 w-24 h-24 border border-prolinco-primary/10 rotate-45"></div>
                <div className="absolute bottom-1/4 left-1/4 w-20 h-20 border border-prolinco-secondary/10 rotate-12"></div>

                {/* FORMAS ABSTRACTAS TECNOLÓGICAS */}
                <div className="absolute top-16 right-32 w-8 h-8 border border-gray-300/20 rotate-45"></div>
                <div className="absolute bottom-16 left-32 w-6 h-6 bg-gradient-to-br from-prolinco-primary/10 to-transparent rotate-30"></div>

                {/* PUNTOS DE CONEXIÓN */}
                <div className="absolute top-32 left-1/3 flex space-x-3">
                    <div className="w-2 h-2 bg-prolinco-primary/40 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-prolinco-secondary/40 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400/40 rounded-full animate-pulse delay-150"></div>
                </div>
            </div>

            {/* MODALES */}
            <EditModal
                type="text"
                section="servicio"
                editingData={editingText}
                onComplete={handleContentUpdate}
                onClose={closeModal}
            />
            <EditModal
                type="url"
                section="servicio"
                editingData={{
                    ...editingUrl,
                    field: editingUrl.toolKey,
                    toolName: editingUrl.toolName
                }}
                onComplete={handleContentUpdate}
                onClose={closeModal}
            />

            {/* HEADER ASIMÉTRICO CON ELEMENTOS TECNOLÓGICOS */}
            <header className="relative mb-16 overflow-hidden">
                {/* BARRA DIAGONAL TECNOLÓGICA */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-prolinco-primary/5 via-transparent to-prolinco-secondary/5 transform skew-x-6"></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div className="relative">
                            <div className="p-5 bg-white border-2 border-gray-200 rounded-3xl shadow-lg">
                                <TruckIcon className="h-12 w-12 text-prolinco-primary" />
                            </div>
                            {/* ELEMENTO GEOMÉTRICO DECORATIVO */}
                            <div className="absolute -top-3 -right-3 w-6 h-6 border border-prolinco-secondary/30 rotate-45"></div>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-prolinco-dark mb-3">Servicio al Cliente</h1>
                            <p className="text-gray-600 text-xl max-w-lg">Ciclo de venta completo con herramientas estratégicas para cada fase del proceso</p>
                        </div>
                    </div>

                    {/* INDICADORES DE SISTEMA CON ANIMACIONES */}
                    <div className="hidden xl:flex items-center space-x-8 text-sm">
                        <div className="flex items-center space-x-3 group">
                            <div className="w-3 h-3 bg-green-500 rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse"></div>
                            <span className="text-gray-600 font-medium">Sistema operativo</span>
                        </div>
                        <div className="flex items-center space-x-3 group">
                            <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse delay-100"></div>
                            <span className="text-gray-600 font-medium">{Object.keys(serviceTools).length} fases activas</span>
                        </div>
                        <div className="flex items-center space-x-3 group">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform duration-300 animate-pulse delay-200"></div>
                            <span className="text-gray-600 font-medium">{Object.values(serviceTools).flat().length} herramientas</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* SECCIÓN DIAGNÓSTICO CON LAYOUT ASIMÉTRICO */}
            <section className="mb-20 relative">
                {/* LÍNEA DE CONEXIÓN TECNOLÓGICA */}
                <div className="absolute left-12 top-12 bottom-12 w-px bg-gradient-to-b from-prolinco-primary/30 via-gray-300/20 to-prolinco-secondary/30"></div>

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 pl-20">
                    {/* DIAGNÓSTICO - POSICIÓN ASIMÉTRICA */}
                    <div className="xl:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-200 p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
                        {/* ELEMENTO GEOMÉTRICO INTERNO */}
                        <div className="absolute top-6 right-6 w-20 h-20 border-2 border-prolinco-primary/10 rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="w-4 h-16 bg-prolinco-primary rounded-full"></div>
                                <h3 className="text-3xl font-bold text-prolinco-dark">Diagnóstico Específico</h3>
                            </div>
                            <div className="text-lg leading-relaxed text-gray-700">
                                {/* 🆕 CORRECCIÓN: Usar content.diagnostic en lugar de content.diagnostico */}
                                <p className="whitespace-pre-line">{content.diagnostic || 'Aún no se ha definido el diagnóstico específico del área de servicio al cliente.'}</p>
                            </div>
                            {(isAdmin || isServiceUser) && (
                                <button
                                    {/* 🆕 CORRECCIÓN: Usar 'diagnostic' en lugar de 'diagnóstico' */}
                                    onClick={() => startTextEdit('diagnostic', content.diagnostic || '')}
                                    className="mt-8 inline-flex items-center space-x-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-prolinco-primary font-bold rounded-2xl transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-prolinco-primary/20 border-2 border-transparent hover:border-prolinco-primary/30 hover:shadow-lg"
                                >
                                    <PencilIcon className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                                    <span>Editar Diagnóstico</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* OBJETIVO ESPECÍFICO - POSICIÓN ASIMÉTRICA */}
                    <div className="xl:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-200 p-10 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
                        {/* ELEMENTO GEOMÉTRICO INTERNO */}
                        <div className="absolute bottom-6 left-6 w-16 h-16 border-2 border-prolinco-secondary/10 rotate-12 group-hover:-rotate-12 transition-transform duration-1000"></div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-6 mb-8">
                                <div className="w-4 h-16 bg-prolinco-secondary rounded-full"></div>
                                <h3 className="text-3xl font-bold text-prolinco-dark">Objetivo Específico</h3>
                            </div>
                            <div className="text-lg leading-relaxed text-gray-700">
                                {/* 🆕 CORRECCIÓN: Usar content.specificObjective en lugar de content.objetivoEspecifico */}
                                <p className="whitespace-pre-line">{content.specificObjective || 'Aún no se ha definido el objetivo específico para el servicio al cliente.'}</p>
                            </div>
                            {(isAdmin || isServiceUser) && (
                                <button
                                    {/* 🆕 CORRECCIÓN: Usar 'specificObjective' en lugar de 'objetivo específico' */}
                                    onClick={() => startTextEdit('specificObjective', content.specificObjective || '')}
                                    className="mt-8 inline-flex items-center space-x-3 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-prolinco-secondary font-bold rounded-2xl transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-prolinco-secondary/20 border-2 border-transparent hover:border-prolinco-secondary/30 hover:shadow-lg"
                                >
                                    <PencilIcon className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                                    <span>Editar Objetivo</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECCIÓN DE HERRAMIENTAS CON ELEMENTOS TECNOLÓGICOS */}
            <section className="relative">
                {/* TÍTULO CON ELEMENTOS VISUALES */}
                <div className="flex items-center space-x-8 mb-16">
                    <div className="w-2 h-20 bg-gradient-to-b from-prolinco-primary via-gray-400 to-prolinco-secondary rounded-full"></div>
                    <div>
                        <h2 className="text-4xl font-black text-prolinco-dark mb-3">Herramientas por Fase</h2>
                        <p className="text-gray-600 text-xl">Recursos tecnológicos estratégicos organizados por ciclo de servicio</p>
                    </div>
                </div>

                {/* GRID ASIMÉTRICO CON ESPACIOS TECNOLÓGICOS */}
                <div className="space-y-20">
                    {Object.keys(serviceTools).map((phase, index) => (
                        <div key={phase} className={`relative ${index % 2 === 1 ? 'xl:ml-16' : ''}`}>
                            {/* ELEMENTOS GEOMÉTRICOS DE SEPARACIÓN */}
                            <div className="absolute -left-12 top-12 w-6 h-6 border border-gray-300/30 rotate-45"></div>
                            <div className="absolute -right-6 bottom-12 w-3 h-3 bg-prolinco-primary/30 rounded-full"></div>

                            <section className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden group hover:shadow-2xl transition-all duration-700">
                                {/* HEADER DE FASE CON ELEMENTOS TECNOLÓGICOS */}
                                <div className="relative bg-gradient-to-r from-prolinco-primary/10 to-prolinco-secondary/10 p-8 border-b border-gray-200">
                                    {/* ELEMENTOS DECORATIVOS */}
                                    <div className="absolute top-4 right-4 w-12 h-12 border border-prolinco-primary/20 rotate-45"></div>
                                    <div className="absolute bottom-4 left-4 w-8 h-8 bg-prolinco-secondary/10 rotate-12"></div>

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-4 h-16 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
                                            <div>
                                                <h3 className="text-3xl font-black text-prolinco-dark capitalize">{phase}</h3>
                                                <p className="text-gray-600 text-lg mt-1">
                                                    {phase === 'preventa' && 'Herramientas para captación y preparación de leads'}
                                                    {phase === 'venta' && 'Recursos para conversión y cierre de ventas'}
                                                    {phase === 'postventa' && 'Soporte y fidelización post-compra'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-prolinco-primary">{serviceTools[phase].length}</div>
                                            <div className="text-sm text-gray-500 font-medium">herramientas</div>
                                        </div>
                                    </div>
                                </div>

                                {/* GRID DE HERRAMIENTAS */}
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {serviceTools[phase].map((tool) => (
                                            <Card key={tool.name} title={tool.name} icon={tool.icon} hoverEffect={true} className="group/card relative overflow-hidden">
                                                {/* ELEMENTO GEOMÉTRICO EN CARD */}
                                                <div className="absolute top-3 right-3 w-8 h-8 border border-gray-200/50 rotate-45 group-hover/card:rotate-90 transition-transform duration-500"></div>
                                                <div className="relative z-10">
                                                    {renderToolButton(tool)}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Service;