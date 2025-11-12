// frontend/src/pages/Talent.jsx (VERSIÓN REFACTORIZADA)

import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { UsersIcon, Cog6ToothIcon, ClipboardDocumentCheckIcon , LinkIcon, DocumentTextIcon, PencilIcon } from '@heroicons/react/24/solid';
import { API } from '../api/api';
// *** NUEVO IMPORT ***
import EditModal from '../components/EditModal';
// *** UNIFIED AUTH IMPORT ***
import { useAuth } from '../context/AuthProvider';

const Talent = () => {
    // *** UNIFIED AUTH USAGE ***
    const { user } = useAuth();

    const [content, setContent] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // *** ESTADO UNIFICADO DE EDICIÓN ***
    const [editingText, setEditingText] = useState({ field: null, value: '' });
    const [editingUrl, setEditingUrl] = useState({ toolName: null, toolKey: null, url: '', currentUrl: '' });

    const isAdmin = user && user.role === 'admin';
    const isTalentUser = user && user.role === 'talento';
    
    const initialTools = [
        { name: 'Manual de Funciones', key: 'manualFuncionesUrl', icon: DocumentTextIcon },
        { name: 'Protocolos de Seguridad', key: 'protocolosSeguridadUrl', icon: DocumentTextIcon },
        { name: 'Formatos de Contratación', key: 'formatosContratacionUrl', icon: DocumentTextIcon },
        { name: 'Calendario de Capacitaciones', key: 'calendarioCapacitacionesUrl', icon: DocumentTextIcon },
        { name: 'Organigrama Oficial', key: 'organigramaUrl', icon: DocumentTextIcon },
    ];
    
    const [talentTools, setTalentTools] = useState(initialTools);

    // Lógica de Carga Inicial (fetchContent sigue igual)
    const fetchContent = async () => {
        setLoading(true);
        try {
            const response = await API.get('/content/talento');
            const data = response.data;
            
            setTalentTools(initialTools.map(tool => ({
                ...tool,
                url: data[tool.key] || '#', 
            })));

            setContent(data);
            setError(null);
        } catch {
            setError("Error al cargar el contenido de Talento Humano.");
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
        setEditingUrl({ toolName: null }); // Asegurarse de que el otro modal esté cerrado
    };
    
    const startUrlEdit = (toolName, toolKey, currentUrl) => {
        setEditingUrl({ toolName, toolKey, url: currentUrl, currentUrl });
        setEditingText({ field: null }); // Asegurarse de que el otro modal esté cerrado
    };

    // Función que se llama DESPUÉS de que el modal haya guardado con éxito
    const handleContentUpdate = (updatedPayload) => {
        // Actualizamos el estado de contenido (textos)
        setContent(prev => ({ ...prev, ...updatedPayload }));

        // Si se actualizó una URL, actualizamos el estado de las herramientas
        const updatedKey = Object.keys(updatedPayload)[0];
        const updatedValue = Object.values(updatedPayload)[0];

        // Verificamos si la key actualizada es una de nuestras herramientas
        if (talentTools.some(tool => tool.key === updatedKey)) {
            setTalentTools(prevTools => prevTools.map(tool => 
                tool.key === updatedKey ? { ...tool, url: updatedValue } : tool
            ));
        }
        // No necesitamos `setLoading(false)` aquí, lo hace el modal antes de llamar a esta función
    };

    // Función para cerrar ambos modales
    const closeModal = () => {
        setEditingText({ field: null });
        setEditingUrl({ toolName: null });
    };

    // Componente auxiliar para el botón de herramienta (queda más limpio)
    const renderToolButton = (tool) => (
        <>
            <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center px-4 py-2 mb-2 bg-prolinco-secondary text-white font-semibold rounded-lg hover:bg-prolinco-primary hover:text-prolinco-dark transition duration-300 shadow-md"
            >
                <LinkIcon className="h-5 w-5 mr-2" />
                Abrir Documento
            </a>
            
            {isAdmin && (
                <button
                    onClick={() => startUrlEdit(tool.name, tool.key, tool.url)}
                    className="w-full inline-flex items-center justify-center px-4 py-1 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold"
                >
                    <PencilIcon className="h-4 w-4 mr-1" /> Cambiar URL
                </button>
            )}
        </>
    );

    
    if (loading && !editingText.field && !editingUrl.toolName) return <div className="text-prolinco-secondary text-center p-10 font-semibold">Cargando la Plataforma de Talento Humano...</div>;
    if (error && !editingText.field && !editingUrl.toolName) return <div className="text-red-600 text-center p-10 font-semibold">{error}</div>;

    return (
        <div className="animate-fadeIn relative"> 
            
            {/* *** REEMPLAZO DE LOS MODALES DUPLICADOS POR EL NUEVO COMPONENTE *** */}
            <EditModal 
                type="text"
                section="talento"
                editingData={editingText}
                onComplete={handleContentUpdate}
                onClose={closeModal}
            />
            <EditModal
                type="url"
                section="talento"
                editingData={{
                    ...editingUrl,
                    field: editingUrl.toolKey,
                    toolName: editingUrl.toolName
                }}
                onComplete={handleContentUpdate}
                onClose={closeModal}
            />

            <header className="mb-8 border-b border-prolinco-primary pb-4">
                <h1 className="text-4xl font-black text-prolinco-secondary flex items-center">
                    <UsersIcon className="h-8 w-8 mr-3 text-prolinco-primary" />
                    Talento Humano (Gestión Interna)
                </h1>
                <p className="text-gray-500 mt-1">Plataforma para la gestión del personal, documentación y cumplimiento legal.</p>
            </header>

            {/* Diagnóstico y Objetivo (TEXTO EDITABLE) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                
                {/* 1. Diagnóstico */}
                <Card title="Diagnóstico Específico" icon={Cog6ToothIcon}>
                    <p className="whitespace-pre-line">{content.diagnostic || 'Aún no se ha definido el diagnóstico de Talento Humano.'}</p>
                    {(isAdmin || isTalentUser) && (
                        <button
                            onClick={() => startTextEdit('diagnostico', content.diagnostic || '')}
                            className="mt-4 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold flex items-center"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" /> Editar
                        </button>
                    )}
                </Card>

                {/* 2. Objetivo Específico */}
                <Card title="Objetivo Específico" icon={ClipboardDocumentCheckIcon }>
                    <p className="whitespace-pre-line">{content.specificObjective || 'Aún no se ha definido el objetivo de Talento Humano.'}</p>
                    {(isAdmin || isTalentUser) && (
                        <button
                            onClick={() => startTextEdit('objetivo específico', content.specificObjective || '')}
                            className="mt-4 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold flex items-center"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" /> Editar
                        </button>
                    )}
                </Card>
            </div>

            {/* Sección de Herramientas (URLs EDITABLES) */}
            <h2 className="text-2xl font-black text-prolinco-dark mb-4 border-b border-gray-300 pb-2">
                Documentos y Herramientas Operativas
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {talentTools.map((tool) => (
                    <Card key={tool.name} title={tool.name} icon={tool.icon}>
                        <p className="text-sm text-gray-500 mb-3 truncate">URL: {tool.url}</p>
                        {renderToolButton(tool)}
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Talent;