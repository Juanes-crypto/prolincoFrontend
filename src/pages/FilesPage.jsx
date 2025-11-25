// frontend/src/pages/FilesPage.jsx (VERSIÓN FINAL - VISOR OFFICE ONLINE)

import React, { useState, useEffect } from 'react';
import { API } from '../api/api';
import { useAuth } from '../context/AuthProvider';
import { 
    FolderIcon, 
    ArrowUpTrayIcon, 
    TrashIcon, 
    DocumentIcon,
    ArrowDownTrayIcon,
    EyeIcon // 👁️ Nuevo ícono para visualizar
} from '@heroicons/react/24/solid';

const FilesPage = () => {
    const { user } = useAuth();
    const canEdit = ['admin', 'talento'].includes(user?.role);

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const fetchDocuments = async () => {
        try {
            const res = await API.get('/documents');
            setDocuments(res.data);
        } catch (error) {
            console.error("Error cargando documentos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await API.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchDocuments(); // Recargar lista
        } catch (error) {
            alert("Error al subir archivo");
        } finally {
            setUploading(false);
            e.target.value = null; // Resetear input
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que quieres eliminar este archivo permanentemente?")) return;
        try {
            await API.delete(`/documents/${id}`);
            fetchDocuments();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    const getIcon = (mime) => {
        return <DocumentIcon className="h-8 w-8 text-gray-400" />;
    };

    // 🌟 FUNCIÓN HELPER PARA DETECTAR OFFICE
    const isOfficeFile = (filename) => {
        if (!filename) return false;
        const lower = filename.toLowerCase();
        return lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.doc') || lower.endsWith('.docx') || lower.endsWith('.ppt') || lower.endsWith('.pptx');
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50 animate-fadeIn">
            <header className="flex justify-between items-end mb-10">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
                        <FolderIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-prolinco-dark">Repositorio de Archivos</h1>
                        <p className="text-gray-600 mt-1 text-lg">Documentación general y recursos descargables</p>
                    </div>
                </div>

                {canEdit && (
                    <div className="relative">
                        <input 
                            type="file" 
                            onChange={handleUpload} 
                            className="hidden" 
                            id="file-upload"
                            disabled={uploading}
                        />
                        <label 
                            htmlFor="file-upload"
                            className={`flex items-center px-6 py-3 bg-prolinco-primary text-white font-bold rounded-xl shadow-lg cursor-pointer hover:bg-yellow-500 transition-all ${uploading ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {uploading ? (
                                <span>Subiendo...</span>
                            ) : (
                                <>
                                    <ArrowUpTrayIcon className="h-6 w-6 mr-2" />
                                    Subir Archivo
                                </>
                            )}
                        </label>
                    </div>
                )}
            </header>

            {/* Tabla de Archivos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-sm font-bold text-gray-500">Nombre</th>
                                <th className="p-4 text-sm font-bold text-gray-500">Tipo</th>
                                <th className="p-4 text-sm font-bold text-gray-500">Subido por</th>
                                <th className="p-4 text-sm font-bold text-gray-500">Fecha</th>
                                <th className="p-4 text-right text-sm font-bold text-gray-500">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {documents.map(doc => {
                                // 🌟 LÓGICA DE URL INTELIGENTE
                                const isOffice = isOfficeFile(doc.originalName);
                                const finalUrl = isOffice 
                                    ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(doc.path)}`
                                    : doc.path;

                                return (
                                    <tr key={doc._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-3">
                                                {getIcon(doc.mimetype)}
                                                <span className="font-medium text-gray-800">{doc.originalName}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500 truncate max-w-[150px]">{doc.mimetype}</td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {doc.uploadedBy?.documentNumber || 'Desconocido'}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {new Date(doc.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            {/* BOTÓN DE ACCIÓN (Ver o Descargar) */}
                                            <a 
                                                href={finalUrl} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex p-2 rounded-lg transition-colors ${
                                                    isOffice 
                                                        ? 'text-green-600 hover:bg-green-50' 
                                                        : 'text-blue-500 hover:bg-blue-50'
                                                }`}
                                                title={isOffice ? "Ver Documento" : "Descargar"}
                                            >
                                                {isOffice ? <EyeIcon className="h-5 w-5" /> : <ArrowDownTrayIcon className="h-5 w-5" />}
                                            </a>

                                            {canEdit && (
                                                <button 
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="inline-flex p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {documents.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-gray-400 italic">
                                        No hay documentos en el repositorio.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FilesPage;