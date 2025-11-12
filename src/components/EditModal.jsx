import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import { PencilIcon, XMarkIcon, ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/solid';
import { API } from '../api/api';

const EditModal = ({ type, section, editingData, onComplete, onClose }) => {
    const [localValue, setLocalValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Sincroniza el estado interno cuando la prop editingData cambia
    useEffect(() => {
        if (editingData) {
            setLocalValue(editingData.value || editingData.currentUrl || editingData.url || '');
            setError(null);
        }
    }, [editingData]);

    // ✅ Determinar el título y el tipo de input
    const isUrl = type === 'url';
    const modalTitle = isUrl
        ? `Editar URL: ${editingData?.toolName || editingData?.field || ''}`
        : `Editar: ${editingData?.field?.toUpperCase() || ''}`;

    const handleSave = useCallback(async (e) => {
        e.preventDefault();

        if (!editingData?.field) {
            setError('Datos de edición inválidos');
            return;
        }

        setLoading(true);
        setError(null);

        const { field, toolKey } = editingData;
        let payload = {};

        // Usar toolKey si está disponible (para URLs), sino field
        const actualField = toolKey || field;

        // Lógica especial para los valores corporativos (asumiendo que es el único caso especial)
        if (section === 'organizacional' && actualField === 'corporateValues') {
            payload[actualField] = localValue.split(',').map(item => item.trim()).filter(item => item.length > 0);
        } else {
            // 🌟 CORRECCIÓN: Aplicar trim() para eliminar espacios
            payload[actualField] = typeof localValue === 'string' ? localValue.trim() : localValue;
        }

        try {
            // 1. Normalizar la SECCIÓN usando el mismo mapa que EditableField
            const sectionMap = {
                'servicio al cliente': 'servicio',
                'talento humano': 'talento',
                'administracion': 'admin',
                'organizacional': 'organizacional'
            };
            const sectionKey = section.toLowerCase();
            const endpointSection = sectionMap[sectionKey] || sectionKey.replace(/\s/g, '');

            let apiEndpoint;
            let apiPayload;

            // Si es una URL de herramienta (tiene toolName)
            if (isUrl && editingData.toolName) {
                // 🌟 CORRECCIÓN CLAVE: Normalizar toolName igual que el backend (lowercase + sin espacios)
                const toolNameNormalized = editingData.toolName.toLowerCase().replace(/\s/g, '');

                // 🌟 CORRECCIÓN CRÍTICA: Usar la ruta correcta del backend
                apiEndpoint = `/content/${endpointSection}/tool/${toolNameNormalized}`;
                apiPayload = { url: localValue };

                console.log(`🔧 Sending PUT to: ${apiEndpoint} with payload:`, apiPayload);
            } else {
                // Endpoint general para textos
                apiEndpoint = `/content/${endpointSection}`;
                apiPayload = payload;
                console.log(`📝 Sending PUT to: ${apiEndpoint} with payload:`, apiPayload);
            }

            // 🌟 CORRECCIÓN: Verificar que la URL no esté vacía para herramientas
            if (isUrl && (!localValue || localValue.trim() === '')) {
                setError('La URL no puede estar vacía');
                setLoading(false);
                return;
            }

            // 🌟 CORRECCIÓN: Mejor manejo de errores
            const response = await API.put(apiEndpoint, apiPayload);

            console.log('✅ Success response:', response.data);

            // 🌟 CORRECCIÓN CRÍTICA: Pasar los datos COMPLETOS de respuesta
            onComplete({
                toolName: editingData.toolName,
                toolKey: editingData.toolKey,
                url: localValue,
                // Para compatibilidad con el formato antiguo
                [editingData.toolKey]: localValue
            });
            alert(`${editingData.toolName || field} actualizado con éxito.`);
            onClose();

        } catch (err) {
            console.error('❌ Error completo:', err);

            // 🌟 CORRECCIÓN MEJORADA: Manejo detallado de errores
            let errorMessage = 'Error al actualizar el contenido.';

            if (err.response) {
                // El servidor respondió con un código de error
                errorMessage = err.response.data?.message || `Error ${err.response.status}: ${err.response.statusText}`;

                if (err.response.status === 404) {
                    errorMessage = 'Ruta no encontrada. Verifica la conexión con el servidor.';
                } else if (err.response.status === 403) {
                    errorMessage = 'No tienes permisos para realizar esta acción.';
                } else if (err.response.status === 500) {
                    errorMessage = 'Error interno del servidor. Intenta nuevamente.';
                }
            } else if (err.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.';
            } else {
                // Algo pasó al configurar la solicitud
                errorMessage = err.message || 'Error desconocido al realizar la solicitud.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [localValue, editingData, section, onComplete, onClose, isUrl]);

    const handleClose = useCallback(() => {
        setError(null);
        setLoading(false);
        onClose();
    }, [onClose]);

    // ✅ Verificación tardía para no renderizar
    if (!editingData || !editingData.field) return null;

    const inputComponent = isUrl ?
        (
            <input
                type="url"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-prolinco-primary focus:border-prolinco-primary"
                placeholder="https://enlace.aqui..."
                required
            />
        ) :
        (
            <textarea
                rows={editingData.field === 'corporateValues' ? 3 : 5}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-prolinco-primary focus:border-prolinco-primary resize-y"
                required
            ></textarea>
        );

    return (
        <div className="fixed inset-0 bg-prolinco-dark bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
            <Card
                title={modalTitle}
                color="bg-white"
                icon={isUrl ? LinkIcon : PencilIcon}
                className="w-full max-w-2xl"
                hoverEffect={false}
            >
                {error && (
                    <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-lg">
                        <p className="text-red-700 font-semibold">Error:</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSave}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isUrl ? 'Nueva URL de Documento' : editingData.field.toUpperCase()}
                        {editingData.field === 'corporateValues' && " (Separados por coma: Calidad, Servicio)"}
                    </label>

                    {inputComponent}

                    {isUrl && editingData.currentUrl && editingData.currentUrl !== '#' && (
                        <p className="mt-2 text-xs text-gray-500 truncate">
                            <strong>URL actual:</strong> {editingData.currentUrl}
                        </p>
                    )}

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-prolinco-dark hover:bg-gray-100 transition duration-150 disabled:opacity-50"
                        >
                            <XMarkIcon className="h-5 w-5 mr-2" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-4 py-2 bg-prolinco-primary text-prolinco-dark font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-300 transition duration-150"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EditModal;