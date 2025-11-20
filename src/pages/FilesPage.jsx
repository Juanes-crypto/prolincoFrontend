import React, { useState, useEffect } from 'react';
import { API } from '../api/api';
import { useAuth } from '../context/AuthProvider';
import { 
    FolderIcon, 
    ArrowUpTrayIcon, 
    TrashIcon, 
    DocumentIcon,
    ArrowDownTrayIcon 
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
        // Opcional: Podrías agregar un input para 'category' si quieres clasificar

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

    // Función auxiliar para iconos según tipo
    const getIcon = (mime) => {
        // Aquí podrías poner iconos de Excel/PDF específicos, por ahora uno genérico
        return <DocumentIcon className="h-8 w-8 text-gray-400" />;
    };

    return (
        <div className="p-4 lg:p-8 min-h-screen bg-gray-50 animate-fadeIn">
            <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-6 lg:mb-10 space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
                        <FolderIcon className="h-8 w-8 lg:h-10 lg:w-10" />
                    </div>
                    <div>
                        <h1 className="text-2xl lg:text-4xl font-black text-prolinco-dark">Repositorio de Archivos</h1>
                        <p className="text-gray-600 mt-1 text-base lg:text-lg">Documentación general y recursos descargables</p>
                    </div>
                </div>

                {canEdit && (
                    <div className="relative w-full lg:w-auto">
                        <input
                            type="file"
                            onChange={handleUpload}
                            className="hidden"
                            id="file-upload"
                            disabled={uploading}
                        />
                        <label
                            htmlFor="file-upload"
                            className={`flex items-center justify-center px-4 lg:px-6 py-3 bg-prolinco-primary text-white font-bold rounded-xl shadow-lg cursor-pointer hover:bg-yellow-500 transition-all w-full lg:w-auto ${uploading ? 'opacity-50 cursor-wait' : ''}`}
                        >
                            {uploading ? (
                                <span>Subiendo...</span>
                            ) : (
                                <>
                                    <ArrowUpTrayIcon className="h-5 w-5 lg:h-6 lg:w-6 mr-2" />
                                    <span className="hidden sm:inline">Subir Archivo</span>
                                    <span className="sm:hidden">Subir</span>
                                </>
                            )}
                        </label>
                    </div>
                )}
            </header>

            {/* Tabla de Archivos - Desktop / Cards Mobile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
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
                            {documents.map(doc => (
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
                                        <a
                                            href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${doc.path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Descargar"
                                        >
                                            <ArrowDownTrayIcon className="h-5 w-5" />
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
                            ))}
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

                {/* Mobile Cards */}
                <div className="lg:hidden">
                    {documents.length === 0 && !loading ? (
                        <div className="p-10 text-center text-gray-400 italic">
                            No hay documentos en el repositorio.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {documents.map(doc => (
                                <div key={doc._id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                                            {getIcon(doc.mimetype)}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-800 truncate">{doc.originalName}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{doc.mimetype}</p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Por: {doc.uploadedBy?.documentNumber || 'Desconocido'} • {new Date(doc.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-2">
                                            <a
                                                href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${doc.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Descargar"
                                            >
                                                <ArrowDownTrayIcon className="h-5 w-5" />
                                            </a>
                                            {canEdit && (
                                                <button
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilesPage;