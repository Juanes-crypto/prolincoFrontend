// frontend/src/pages/Talent.jsx (VERSIÓN REFACTORIZADA)

import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import { UsersIcon, LinkIcon, DocumentTextIcon, PencilIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';
import EditableField from '../components/EditableField';
import EditModal from '../components/EditModal';

// ✅ MOVER FUERA DEL COMPONENTE
const TOOL_KEYS_STRUCTURE = [
    { name: 'Organigrama', key: 'Organigrama', icon: DocumentTextIcon },
    { name: 'Mapa de Procesos', key: 'Mapa de Procesos', icon: DocumentTextIcon },
    { name: 'Perfil del Empleado', key: 'Perfil del Empleado', icon: DocumentTextIcon },
    { name: 'Manual del Empleado', key: 'Manual del Empleado', icon: DocumentTextIcon },
    { name: 'Proceso de Inducción', key: 'Proceso de Inducción', icon: DocumentTextIcon },
    { name: 'Proceso de Capacitación', key: 'Proceso de Capacitación', icon: DocumentTextIcon },
];

// ✅ MOVER FUERA DEL COMPONENTE
const mapToolsWithData = (tools, data) => tools.map(tool => ({
    ...tool,
    url: data[tool.key] || '#',
}));

const TalentoHumanoPage = ({ data = {}, refetch }) => {
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const diagnostic = data['Diagnóstico'] || '';
    const specificObjective = data['Objetivo Específico'] || '';

    const [editingUrl, setEditingUrl] = useState({ toolName: null, toolKey: null, url: '', currentUrl: '' });
    
    // ✅ ESTADO INICIAL SIMPLIFICADO
    const [talentTools, setTalentTools] = useState([]);

    // ✅ useEffect ÚNICO
    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setTalentTools(mapToolsWithData(TOOL_KEYS_STRUCTURE, data));
        }
    }, [data]);

    // ✅ useCallback PARA FUNCIONES
    const startUrlEdit = useCallback((toolName, toolKey, currentUrl) => {
        setEditingUrl({ toolName, toolKey, url: currentUrl, currentUrl });
    }, []);

    const handleUrlUpdate = useCallback((updatedPayload) => {
        const updatedKey = Object.keys(updatedPayload)[0];
        const updatedValue = Object.values(updatedPayload)[0];

        setTalentTools(prevTools => prevTools.map(tool =>
            tool.key === updatedKey ? { ...tool, url: updatedValue } : tool
        ));

        if (refetch) {
            refetch();
        }
    }, [refetch]);

    const closeModal = useCallback(() => {
        setEditingUrl({ toolName: null });
    }, []);

    // ----------------------------------------------------
    // *** RENDER ***
    // ----------------------------------------------------
    return (
        <div className="animate-fadeIn relative">
            {/* Modal de Edición de URL (solo necesitamos el modal de URL) */}
            <EditModal
                type="url"
                section="Talento Humano"
                editingData={editingUrl}
                onComplete={handleUrlUpdate}
                onClose={closeModal}
            />

            {/* Diagnóstico y Objetivo (USANDO EditableField) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* 1. Diagnóstico */}
                <EditableField
                    initialContent={diagnostic}
                    section="Talento Humano"
                    subsection="Diagnóstico"
                    onUpdate={refetch} // Refresca los datos del padre después de guardar
                />

                {/* 2. Objetivo Específico */}
                <EditableField
                    initialContent={specificObjective}
                    section="Talento Humano"
                    subsection="Objetivo Específico"
                    onUpdate={refetch} // Refresca los datos del padre después de guardar
                />
            </div>

            {/* Sección de Herramientas (URLs EDITABLES) */}
            <h2 className="text-2xl font-black text-prolinco-dark mb-4 border-b border-gray-300 pb-2">
                Documentos y Herramientas Operativas (Drive)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {talentTools.map((tool) => (
                    <Card key={tool.key} title={tool.name} icon={tool.icon}>
                        <p className="text-sm text-gray-500 mb-3 truncate">URL: {tool.url}</p>
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
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TalentoHumanoPage;