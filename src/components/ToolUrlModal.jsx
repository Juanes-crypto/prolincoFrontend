// components/ToolUrlModal.jsx - VERSIÓN COMPLETA Y CORREGIDA
import React, { useState } from 'react';
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';
import { API } from '../api/api';

const ToolUrlModal = ({ tool, section, onComplete, onClose }) => {
    const [url, setUrl] = useState(tool?.url || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!url.trim()) {
            setError('La URL no puede estar vacía');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Usar el endpoint correcto para herramientas según el backend
            await API.put(`/content/${section}/tool/${tool.key}`, { url: url.trim() });
            
            // Éxito - cerramos modal y refrescamos datos
            onComplete();
            onClose();
            
        } catch (err) {
            console.error('Error updating tool URL:', err);
            setError('Error al actualizar la URL. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-scaleIn">
                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-prolinco-primary/10 rounded-lg">
                            <LinkIcon className="h-5 w-5 text-prolinco-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">
                                Configurar URL
                            </h3>
                            <p className="text-sm text-gray-500">
                                {tool?.name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSave} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                                URL del Documento
                            </label>
                            <input
                                id="url"
                                type="url"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setError('');
                                }}
                                placeholder="https://drive.google.com/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-prolinco-primary focus:border-transparent transition-all"
                                disabled={loading}
                            />
                            {error && (
                                <p className="text-red-600 text-sm mt-2 flex items-center">
                                    <XMarkIcon className="h-4 w-4 mr-1" />
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* INSTRUCCIONES */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-blue-800 mb-2">
                                💡 Instrucciones:
                            </h4>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Usa enlaces públicos de Google Drive</li>
                                <li>• Verifica los permisos de visualización</li>
                                <li>• El enlace debe comenzar con https://</li>
                            </ul>
                        </div>
                    </div>

                    {/* BOTONES */}
                    <div className="flex space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-prolinco-secondary text-white hover:bg-prolinco-primary rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar URL'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ToolUrlModal;