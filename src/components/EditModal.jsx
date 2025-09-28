// frontend/src/components/EditModal.jsx

import React, { useState, useEffect } from 'react';
import Card from './Card'; // Asegúrate de que el path sea correcto
import { PencilIcon, XMarkIcon , ArrowDownTrayIcon, LinkIcon } from '@heroicons/react/24/solid';
import { API } from '../api/api';

/**
 * Componente Modal Reusable para la edición de Contenido (Texto o URL).
 * * @param {object} props
 * @param {string} type - 'text' o 'url'
 * @param {string} section - El endpoint del contenido (e.g., 'admin', 'talento', 'organizacional')
 * @param {object} editingData - { field: 'campo', value: 'valor inicial', currentUrl: 'url actual' }
 * @param {function} onComplete - Función que se llama al guardar (para actualizar el estado padre)
 * @param {function} onClose - Función para cerrar el modal y limpiar el estado padre
 */
const EditModal = ({ type, section, editingData, onComplete, onClose }) => {
    
    // Si no hay datos de edición, no renderizar el modal
    if (!editingData || !editingData.field) return null;
    
    const [localValue, setLocalValue] = useState(editingData.value || editingData.currentUrl || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Sincronizar el valor inicial cada vez que cambian los datos de edición
    useEffect(() => {
        setLocalValue(editingData.value || editingData.currentUrl || '');
        setError(null);
    }, [editingData]);


    // Función para manejar el guardado (funciona para texto y URL)
    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { field } = editingData;
        let payload = {};
        
        // Lógica especial para los valores corporativos (separados por coma)
        if (section === 'organizacional' && field === 'corporateValues') {
            payload[field] = localValue.split(',').map(item => item.trim()).filter(item => item.length > 0);
        } else {
            payload[field] = localValue;
        }

        try {
            // Endpoint para la actualización. 
            // Usa el token que debe estar en la configuración de la API o localStorage.
            await API.put(`/content/${section}`, payload);
            
            // Llamar a la función de completado para que el componente padre actualice su estado
            onComplete(payload);

            alert(`${editingData.toolName || field} actualizado con éxito.`);
            onClose(); // Cerrar el modal
            
        } catch (_err) { // Usamos _err para evitar la advertencia de 'err definido pero no usado'
            setError(_err.response?.data?.message || 'Error al actualizar el contenido. Verifique el backend.');
            console.error('Error al guardar:', _err);
        } finally {
            setLoading(false);
        }
    };
    
    // Determinar el título y el tipo de input
    const isUrl = type === 'url';
    const modalTitle = isUrl ? `Editar URL: ${editingData.toolName}` : `Editar: ${editingData.field.toUpperCase()}`;
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
                {error && <p className="text-red-500 mb-4 font-semibold p-2 border border-red-200 rounded-lg">{error}</p>}
                
                <form onSubmit={handleSave}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {isUrl ? 'Nueva URL de Documento' : editingData.field.toUpperCase()}
                        {editingData.field === 'corporateValues' && " (Separados por coma: Calidad, Servicio)"}
                    </label>
                    
                    {inputComponent}
                    
                    {isUrl && editingData.currentUrl && (
                        <p className="mt-2 text-xs text-gray-500 truncate">Actual: {editingData.currentUrl}</p>
                    )}
                    
                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-prolinco-dark hover:bg-gray-100 transition duration-150"
                        >
                            <XMarkIcon  className="h-5 w-5 mr-2" />
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