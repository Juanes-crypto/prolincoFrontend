// frontend/src/hooks/useOperationalData.js - VERSIÓN MEJORADA

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
                API.get(`/content/${section}`, config).catch(err => {
                    console.warn(`⚠️ Error cargando sección ${section}:`, err.message);
                    return { data: { section, tools: [], diagnostic: '', specificObjective: '' } };
                })
            );
            
            // Esperar todas las peticiones
            const responses = await Promise.all(promises);
            
            // Transformar las respuestas en la estructura esperada
            const transformedData = {};
            responses.forEach((response, index) => {
                const section = sections[index];
                transformedData[section] = response.data || { tools: [], diagnostic: '', specificObjective: '' };
            });

            console.log('📊 Datos transformados:', transformedData);

            // 🌟 CORRECCIÓN: Estructura simplificada y consistente
            const flattenedData = {
                // Secciones completas para cada página
                servicio: transformedData.servicio,
                talento: transformedData.talento,
                admin: transformedData.admin,
                organizacional: transformedData.organizacional,
                
                // Campos específicos para compatibilidad
                mission: transformedData.organizacional?.mission || '',
                vision: transformedData.organizacional?.vision || '',
                corporateValues: transformedData.organizacional?.corporateValues || [],
                diagnostic: transformedData.servicio?.diagnostic || '',
                specificObjective: transformedData.servicio?.specificObjective || ''
            };

            setData(flattenedData);
        } catch (err) {
            console.error("Error general al cargar datos operacionales:", err);
            setError("Fallo al cargar los datos. Verifique el backend.");
            setData({ 
                servicio: { tools: [] },
                talento: { tools: [] }, 
                admin: { tools: [] },
                organizacional: { tools: [] }
            });
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