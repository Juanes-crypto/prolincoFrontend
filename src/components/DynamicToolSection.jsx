import React, { useState } from 'react';
import { API } from '../api/api';
import {
    LinkIcon,
    DocumentArrowUpIcon,
    ArrowTopRightOnSquareIcon,
    TrashIcon,
    PencilSquareIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';

// Componente individual de Tarjeta
const ToolCard = ({ tool, onUpdate }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [isEditing, setIsEditing] = useState(false);
    const [urlInput, setUrlInput] = useState(tool.urlValue || '');
    const [fileInput, setFileInput] = useState(null);
    const [loading, setLoading] = useState(false);

    // Determinar si está configurada
    const isConfigured = (tool.config.allowsUrl && tool.urlValue) || (tool.config.allowsFile && tool.fileUrl);

    const isOfficeFile = (filename) => {
        if (!filename) return false;
        const lower = filename.toLowerCase();
        return lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.doc') || lower.endsWith('.docx') || lower.endsWith('.ppt') || lower.endsWith('.pptx');
    };

    // Lógica para generar la URL correcta
    const getFileUrl = () => {
        if (!tool.fileUrl) return '#';

        // Si es Office, usamos el visor de Microsoft
        if (isOfficeFile(tool.originalFileName)) {
            // encodeURIComponent es vital para que la URL pase bien como parámetro
            return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(tool.fileUrl)}`;
        }

        // Si es PDF o Imagen, URL directa
        return tool.fileUrl;
    };

    const handleSave = async () => {
        setLoading(true);
        const formData = new FormData();

        if (tool.config.allowsUrl) formData.append('urlValue', urlInput);
        if (tool.config.allowsFile && fileInput) formData.append('file', fileInput);

        try {
            await API.put(`/tools/${tool._id}/data`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setIsEditing(false);
            onUpdate(); // Refrescar lista
        } catch (error) {
            console.error("Error guardando herramienta", error);
            alert("Error al guardar.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar esta herramienta?")) return;
        try {
            await API.delete(`/tools/${tool._id}`);
            onUpdate();
        } catch (error) {
            console.error("Error eliminando", error);
        }
    };

    // 1. MODO EDICIÓN (Admin o primera vez)
    if (isEditing || (!isConfigured && isAdmin)) {
        return (
            <div className="bg-white p-5 rounded-xl shadow-lg border-2 border-prolinco-primary/20 animate-fadeIn">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-800">{tool.title}</h3>
                    {isAdmin && <button onClick={handleDelete}><TrashIcon className="h-4 w-4 text-red-400 hover:text-red-600" /></button>}
                </div>

                <div className="space-y-3">
                    {tool.config.allowsUrl && (
                        <div>
                            <label className="text-xs font-bold text-gray-500">URL / Enlace</label>
                            <div className="flex items-center border rounded-lg px-2 bg-gray-50">
                                <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    className="w-full bg-transparent p-2 text-sm outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    )}

                    {tool.config.allowsFile && (
                        <div>
                            <label className="text-xs font-bold text-gray-500">Archivo (Excel, PDF, Word)</label>
                            <div className="flex items-center border rounded-lg px-2 bg-gray-50 py-1">
                                <DocumentArrowUpIcon className="h-4 w-4 text-gray-400 mr-2" />
                                <input
                                    type="file"
                                    onChange={(e) => setFileInput(e.target.files[0])}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            {tool.fileUrl && !fileInput && <p className="text-xs text-green-600 mt-1">✅ Archivo actual: {tool.originalFileName}</p>}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 mt-4">
                        {isConfigured && <button onClick={() => setIsEditing(false)} className="text-xs text-gray-500 underline">Cancelar</button>}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-prolinco-primary text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-500 transition-colors"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. MODO VISUALIZACIÓN (Para el usuario final)
    return (
        <div className="group relative bg-white p-5 rounded-xl shadow-sm hover:shadow-md border border-gray-200 transition-all duration-300 hover:border-prolinco-secondary/30">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="font-bold text-lg text-prolinco-dark group-hover:text-prolinco-secondary transition-colors">
                        {tool.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 leading-snug">{tool.description}</p>
                </div>
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-prolinco-primary/10 transition-colors">
                    {tool.config.allowsFile ? <DocumentArrowUpIcon className="h-6 w-6 text-gray-400 group-hover:text-prolinco-primary" /> : <LinkIcon className="h-6 w-6 text-gray-400 group-hover:text-prolinco-primary" />}
                </div>
            </div>

            <div className="mt-6 space-y-2">
                {/* Botón URL */}
                {tool.config.allowsUrl && tool.urlValue && (
                    <a href={tool.urlValue} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-2.5 bg-prolinco-secondary text-white rounded-lg font-medium text-sm hover:bg-blue-900 transition-colors shadow-sm hover:shadow">
                        <span>Abrir Enlace</span>
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-2" />
                    </a>
                )}

                {/* Botón Archivo */}
                {tool.config.allowsFile && tool.fileUrl && (
                    <a
                        href={getFileUrl()} // 👈 Usamos la función inteligente
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                        <span>
                            {isOfficeFile(tool.originalFileName) ? 'Abrir Documento' : 'Ver Archivo'}
                        </span>
                        <DocumentArrowUpIcon className="h-4 w-4 ml-2" />
                    </a>
                )}

                {!isConfigured && (
                    <div className="text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <span className="text-xs text-gray-500 italic">Pendiente de configurar</span>
                    </div>
                )}
            </div>

            {/* Botón Flotante Editar (Solo Admin) */}
            {isAdmin && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white p-1.5 rounded-full shadow-md text-gray-400 hover:text-prolinco-secondary transition-all"
                >
                    <PencilSquareIcon className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

// Componente Contenedor Principal
const DynamicToolSection = ({ sectionData, onUpdate }) => {
    // sectionData es un objeto: { "Preventa": [...tools], "Venta": [...] }
    const categories = Object.keys(sectionData);

    if (categories.length === 0) {
        return <div className="text-center py-10 text-gray-400 italic">No hay herramientas creadas aún. Sé el primero en agregar una.</div>;
    }

    return (
        <div className="space-y-12">
            {categories.map(category => (
                <div key={category} className="animate-fadeInUp">
                    {/* Título de la Fase */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <h2 className="text-2xl font-black text-gray-400 uppercase tracking-widest">{category}</h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    {/* Grid de Tarjetas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sectionData[category].map(tool => (
                            <ToolCard key={tool._id} tool={tool} onUpdate={onUpdate} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DynamicToolSection;