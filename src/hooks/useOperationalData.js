// frontend/src/hooks/useOperationalData.js

import { useState, useEffect } from 'react';
import { API } from '../api/api';

/**
 * Hook para cargar el contenido operacional de la plataforma (Diagnósticos, Objetivos, URLs).
 * @returns {object} { data, loading, error, refetch }
 */
const useOperationalData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("userToken");

    const fetchData = async () => {
        if (!token) {
            setError("No hay sesión activa.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            
            // 🟡 CAMBIO: Obtener datos de cada sección por separado
            const sections = ['admin', 'servicio', 'talento', 'organizacional'];
            const promises = sections.map(section => 
                API.get(`/content/${section}`, config)
            );
            
            // Esperar todas las peticiones
            const responses = await Promise.all(promises);
            
            // Transformar las respuestas en la estructura esperada
            const transformedData = {};
            responses.forEach((response, index) => {
                const section = sections[index];
                transformedData[section] = response.data;
            });

            // Aplanar la data para compatibilidad con páginas existentes
            const flattenedData = {
                // Combinar campos de identidad organizacional
                mission: transformedData.organizacional?.mission || '',
                vision: transformedData.organizacional?.vision || '',
                corporateValues: transformedData.organizacional?.corporateValues || [],

                // Campos de servicio (para ClientePage)
                diagnostic: transformedData.servicio?.diagnostic || '',
                specificObjective: transformedData.servicio?.specificObjective || '',

                // Mantener URLs de herramientas por sección para compatibilidad
                ...transformedData.servicio?.tools?.reduce((acc, tool) => {
                    acc[tool.name] = tool.url;
                    return acc;
                }, {}),
                ...transformedData.talento?.tools?.reduce((acc, tool) => {
                    acc[tool.name] = tool.url;
                    return acc;
                }, {}),
                ...transformedData.admin?.tools?.reduce((acc, tool) => {
                    acc[tool.name] = tool.url;
                    return acc;
                }, {}),
                ...transformedData.organizacional?.tools?.reduce((acc, tool) => {
                    acc[tool.name] = tool.url;
                    return acc;
                }, {}),

                // Mantener referencias a secciones completas para casos especiales
                servicio: transformedData.servicio,
                talento: transformedData.talento,
                admin: transformedData.admin,
                organizacional: transformedData.organizacional
            };

            setData(flattenedData);
        } catch (err) {
            console.error("Error al cargar datos operacionales:", err);
            setError("Fallo al cargar los datos. Verifique el backend.");
            setData({}); // Asegura que 'data' sea un objeto vacío en caso de error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Función de recarga para usar después de que un EditableField guarde un cambio
    const refetch = () => {
        fetchData();
    };

    return { data, loading, error, refetch };
};

export default useOperationalData;