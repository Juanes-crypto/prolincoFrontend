// frontend/src/components/EditModal.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import { PencilIcon, XMarkIcon, ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/solid';
import { API } from '../api/api';

const EditModal = ({ type, section, editingData, onComplete, onClose }) => {
    // ✅ MEJOR: Verificación temprana para no renderizar
    if (!editingData || !editingData.field) return null;
    
    const [localValue, setLocalValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ useEffect CORREGIDO - Solo se ejecuta cuando editingData cambia
    useEffect(() => {
        if (editingData) {
            setLocalValue(editingData.value || editingData.currentUrl || editingData.url || '');
            setError(null);
        }
    }, [editingData]); // Dependencia correcta

    // ✅ useCallback para evitar recreaciones
    const handleSave = useCallback(async (e) => {
        e.preventDefault();
        
        // ✅ Validación adicional
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
        
        // Lógica especial para los valores corporativos
        if (section === 'organizacional' && actualField === 'corporateValues') {
            payload[actualField] = localValue.split(',').map(item => item.trim()).filter(item => item.length > 0);
        } else {
            payload[actualField] = localValue;
        }

        try {
            // ✅ Endpoint corregido - usar section en minúsculas para coincidir con backend
            const endpointSection = section.toLowerCase().replace(' ', '-');
            await API.put(`/content/${endpointSection}`, payload);
            
            // ✅ Llamar a onComplete con el payload correcto
            onComplete(payload);
            
            alert(`${editingData.toolName || field} actualizado con éxito.`);
            onClose();
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al actualizar el contenido. Verifique el backend.';
            setError(errorMessage);
            console.error('Error al guardar:', err);
        } finally {
            setLoading(false);
        }
    }, [localValue, editingData, section, onComplete, onClose]);

    const handleClose = useCallback(() => {
        setError(null);
        setLoading(false);
        onClose();
    }, [onClose]);

    // ✅ Determinar el título y el tipo de input
    const isUrl = type === 'url';
    const modalTitle = isUrl 
        ? `Editar URL: ${editingData.toolName || editingData.field}`
        : `Editar: ${editingData.field.toUpperCase()}`;

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
                    <p className="text-red-500 mb-4 font-semibold p-2 border border-red-200 rounded-lg">
                        {error}
                    </p>
                )}
                
                <form onSubmit={handleSave}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isUrl ? 'Nueva URL de Documento' : editingData.field.toUpperCase()}
                        {editingData.field === 'corporateValues' && " (Separados por coma: Calidad, Servicio)"}
                    </label>
                    
                    {inputComponent}
                    
                    {isUrl && editingData.currentUrl && (
                        <p className="mt-2 text-xs text-gray-500 truncate">
                            Actual: {editingData.currentUrl}
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