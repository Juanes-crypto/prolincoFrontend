// frontend/src/components/EditableField.jsx (Este archivo está CORRECTO)

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider'; // Importar el hook de autenticación
import { API } from '../api/api'; // Cliente API
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/solid';

/**
 * Componente que muestra un campo de texto simple o un textarea editable.
 * @param {string} initialContent - El texto inicial a mostrar.
 * @param {string} section - La sección (ej: 'Servicio al Cliente', 'Talento Humano').
 * @param {string} subsection - El subapartado (DEBE COINCIDIR CON EL MODELO: 'diagnostico', 'specificObjective', 'mission', etc.).
 * @param {string} title - Título a mostrar (opcional, por defecto usa subsection).
 * @param {function} onUpdate - Callback a ejecutar después de una actualización exitosa.
 */
const EditableField = ({ initialContent, section, subsection, title, onUpdate }) => {
    const { user } = useAuth();
    
    // CORRECCIÓN 1: Definir la variable de permiso (canEdit)
    const sectionNormalized = section.toLowerCase().replace(' ', '');
    const canEdit = user && (user.role === 'admin' || user.role === sectionNormalized);

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent || "Contenido pendiente de definir...");
    const [isLoading, setIsLoading] = useState(false);

    // Sincronizar el estado interno si la prop cambia
    useEffect(() => {
        setContent(initialContent || "Contenido pendiente de definir...");
    }, [initialContent]);


    const handleSave = async () => {
        // CORRECCIÓN 1: Usar canEdit para la validación
        if (!canEdit || isLoading) return;

        if (content.trim() === "") {
            alert("El contenido no puede estar vacío.");
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("userToken");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // CORRECCIÓN 2: Mapeo de la sección para el endpoint del backend
            const sectionMap = { 
                'servicio al cliente': 'servicio', 
                'talento humano': 'talento', 
                'administracion': 'admin' 
            };
            const endpointSection = sectionMap[section.toLowerCase()] || section.toLowerCase().replace(' ', '');
            
            if (!endpointSection) {
                 throw new Error("Error de mapeo de sección. Sección inválida.");
            }

            // El payload debe contener el campo de la base de datos (ej: diagnostic, specificObjective)
            // 🛑 ¡ASEGÚRATE QUE LA PROP 'subsection' SEA CORRECTA EN LA PÁGINA PADRE!
            const payload = { [subsection]: content.trim() };
            
            // LLAMADA CLAVE: PUT /api/content/:section
            await API.put(`/content/${endpointSection}`, payload, config);

            setIsEditing(false);
            alert("Contenido actualizado con éxito.");
            
            if (onUpdate) {
                onUpdate();
            }

        } catch (error) {
            console.error("Error al guardar contenido:", error);
            const errorMessage = error.response?.data?.message || "Fallo al guardar el contenido. Verifique el servidor.";
            alert(errorMessage);
            // Revertir el estado si falla la actualización
            setContent(initialContent); 

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
            <h3 className="text-lg font-semibold text-prolinco-dark mb-2">
                {/* 🛑 Ojo: 'subsection' aquí es solo para el título, no afecta el guardado. */}
                {title || subsection}
            </h3>
            
            {/* Botón de Edición/Guardar (Solo si canEdit) */}
            {canEdit && ( 
                <div className="absolute top-3 right-3">
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center text-white bg-prolinco-primary hover:bg-prolinco-dark transition-colors py-1 px-3 rounded-md text-sm disabled:opacity-50"
                            title="Guardar Cambios"
                        >
                            {isLoading ? 'Guardando...' : <><CheckIcon className="h-4 w-4 mr-1" /> Guardar</>}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-500 hover:text-prolinco-dark transition-colors"
                            title="Editar"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            )}

            {/* Contenido (Editable o Solo Lectura) */}
            <div className="mt-4 pr-10">
                {isEditing && canEdit ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-2 border border-prolinco-primary rounded-md focus:ring-prolinco-primary focus:border-prolinco-primary min-h-[150px] resize-y"
                        placeholder={`Escribe el contenido para ${subsection}...`}
                    />
                ) : (
                    <p className="whitespace-pre-wrap text-gray-700 min-h-[50px]">
                        {content}
                    </p>
                )}
            </div>
            
        </div>
    );
};

export default EditableField;