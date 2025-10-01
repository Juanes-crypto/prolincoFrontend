// frontend/src/components/EditableField.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Importar el hook de autenticación
import { API } from '../api/api'; // Cliente API
import { PencilSquareIcon, CheckIcon } from '@heroicons/react/24/solid';

/**
 * Componente que muestra un campo de texto simple o un textarea editable para admins.
 * * @param {string} initialContent - El texto inicial a mostrar.
 * @param {string} section - La sección (ej: 'Talento Humano').
 * @param {string} subsection - El subapartado (ej: 'Diagnostico').
 * @param {function} onUpdate - Callback a ejecutar después de una actualización exitosa.
 */
const EditableField = ({ initialContent, section, subsection, onUpdate }) => {
    const { user } = useAuth();
    const isAdmin = user && user.role === 'admin';

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(initialContent || "Contenido pendiente de definir...");
    const [isLoading, setIsLoading] = useState(false);

    // Sincronizar el estado interno si la prop cambia (ej: después de una actualización externa)
    useEffect(() => {
        setContent(initialContent || "Contenido pendiente de definir...");
    }, [initialContent]);


    const handleSave = async () => {
        if (!isAdmin || isLoading) return;

        // Validar que el contenido no esté vacío (opcional)
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

            // ⚠️ NOTA: Asumimos que el backend tendrá un endpoint para guardar contenido operativo
            // Usaremos POST para crear o PUT para actualizar el contenido basado en section/subsection
            await API.post('/operational/content', {
                section,
                subsection,
                content: content.trim(),
            }, config);

            setIsEditing(false);
            alert("Contenido actualizado con éxito.");
            
            // Llamar al callback para que la página superior pueda refrescar datos si es necesario
            if (onUpdate) {
                onUpdate();
            }

        } catch (error) {
            console.error("Error al guardar contenido:", error);
            alert("Fallo al guardar el contenido. Verifique el servidor.");
            // Revertir el estado si falla la actualización
            setContent(initialContent); 

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
            <h3 className="text-lg font-semibold text-prolinco-dark mb-2">
                {subsection}
            </h3>
            
            {/* Botón de Edición/Guardar (Solo para Admins) */}
            {isAdmin && (
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
            <div className="mt-4 pr-10"> {/* pr-10 para dejar espacio al botón */}
                {isEditing && isAdmin ? (
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