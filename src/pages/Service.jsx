// frontend/src/pages/Service.jsx (VERSIÓN REFACTORIZADA)

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { TruckIcon, Cog6ToothIcon, ClipboardDocumentCheckIcon , LinkIcon, EnvelopeIcon , ChatBubbleLeftEllipsisIcon, PhoneIcon, ShareIcon, ChartBarIcon, PencilIcon } from '@heroicons/react/24/solid';
import { API } from '../api/api'; 
// *** NUEVO IMPORT ***
import EditModal from '../components/EditModal';

const Service = () => {
    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // *** ESTADO UNIFICADO DE EDICIÓN ***
    const [editingText, setEditingText] = useState({ field: null, value: '' }); 
    const [editingUrl, setEditingUrl] = useState({ toolName: null, toolKey: null, url: '', currentUrl: '' });
    
    const userRole = localStorage.getItem('userRole');
    const isAdmin = userRole === 'admin';
    const isServiceUser = userRole === 'servicio';

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

    // Lógica de Carga Inicial
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

            setContent(data);
            setError(null);
        } catch (_err) {
            setError("Error al cargar el contenido de Servicio al Cliente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);
    
    // ----------------------------------------------------
    // *** FUNCIONES DE INICIO Y ACTUALIZACIÓN REUTILIZABLES ***
    // ----------------------------------------------------

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
        <div className="animate-fadeIn relative"> 
            
            {/* *** REEMPLAZO DE LOS MODALES DUPLICADOS POR EL NUEVO COMPONENTE *** */}
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
                editingData={{...editingUrl, field: editingUrl.toolKey}}
                onComplete={handleContentUpdate}
                onClose={closeModal}
            />
            
            <header className="mb-8 border-b border-prolinco-primary pb-4">
                <h1 className="text-4xl font-black text-prolinco-secondary flex items-center">
                    <TruckIcon className="h-8 w-8 mr-3 text-prolinco-primary" />
                    Servicio al Cliente (Ciclo de Venta)
                </h1>
                <p className="text-gray-500 mt-1">Herramientas y estrategias clave para cada fase del servicio.</p>
            </header>

            {/* Diagnóstico y Objetivo (TEXTO EDITABLE) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                
                {/* 1. Diagnóstico */}
                <Card title="Diagnóstico Específico" icon={Cog6ToothIcon}>
                    <p className="whitespace-pre-line">{content.diagnostic || 'Aún no se ha definido el diagnóstico.'}</p>
                    {(isAdmin || isServiceUser) && (
                        <button 
                            onClick={() => startTextEdit('diagnostic', content.diagnostic || '')}
                            className="mt-4 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold flex items-center"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" /> Editar
                        </button>
                    )}
                </Card>

                {/* 2. Objetivo Específico */}
                <Card title="Objetivo Específico" icon={ClipboardDocumentCheckIcon }>
                    <p className="whitespace-pre-line">{content.specificObjective || 'Aún no se ha definido el objetivo.'}</p>
                    {(isAdmin || isServiceUser) && (
                        <button 
                            onClick={() => startTextEdit('specificObjective', content.specificObjective || '')}
                            className="mt-4 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold flex items-center"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" /> Editar
                        </button>
                    )}
                </Card>
            </div>

            {/* Sección de Herramientas (URLs EDITABLES) */}
            <h2 className="text-2xl font-black text-prolinco-dark mb-4 border-b border-gray-300 pb-2">
                Herramientas por Fase del Ciclo de Servicio
            </h2>
            
            {/* Subsecciones Preventa, Venta, Postventa */}
            {Object.keys(serviceTools).map(phase => (
                <section key={phase} className="mb-8">
                    <h3 className="text-xl font-bold text-prolinco-secondary mb-3 bg-prolinco-light p-3 rounded-t-lg border-b border-prolinco-primary">
                        {/* Capitalizar el nombre de la fase */}
                        {phase.charAt(0).toUpperCase() + phase.slice(1)}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-white rounded-b-lg shadow-inner">
                        {serviceTools[phase].map((tool) => (
                            <Card key={tool.name} title={tool.name} icon={tool.icon} hoverEffect={true}>
                                {renderToolButton(tool)}
                            </Card>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Service;