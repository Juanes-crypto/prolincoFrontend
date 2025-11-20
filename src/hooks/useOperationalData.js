// frontend/src/hooks/useOperationalData.js (VERSIÓN COMPATIBLE V2)

import { useState, useEffect, useCallback } from 'react';
import { API } from '../api/api';

const useOperationalData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mover fetchData fuera del useEffect y usar useCallback
    const fetchData = useCallback(async () => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const sections = ['admin', 'servicio', 'talento', 'organizacional'];
            
            // 🟡 CAMBIO: Ahora apuntamos a la ruta NUEVA de textos
            const promises = sections.map(section => 
                API.get(`/page-content/${section}`, config).catch(err => {
                    // Si falla (ej: no existe aun), retornamos estructura vacía segura
                    return { data: { section, texts: {} } };
                })
            );
            
            const responses = await Promise.all(promises);
            
            const transformedData = {};
            responses.forEach((response, index) => {
                const section = sections[index];
                // La respuesta ahora trae { texts: { diagnostic: '...', ... } }
                transformedData[section] = response.data || { texts: {} };
            });

            // Aplanamos la estructura para que sea fácil de usar en el frontend
            const flattenedData = {
                // Datos crudos por sección
                servicio: transformedData.servicio?.texts || {},
                talento: transformedData.talento?.texts || {},
                admin: transformedData.admin?.texts || {},
                organizacional: transformedData.organizacional?.texts || {},
                
                // Accesos directos para compatibilidad
                mission: transformedData.organizacional?.texts?.mission || '',
                vision: transformedData.organizacional?.texts?.vision || '',
                corporateValues: transformedData.organizacional?.texts?.values || [],
                diagnostic: transformedData.servicio?.texts?.diagnostic || '',
                specificObjective: transformedData.servicio?.texts?.specificObjective || ''
            };

            setData(flattenedData);
        } catch (err) {
            console.error("Error cargando datos operacionales:", err);
            setError("Fallo al cargar datos.");
        } finally {
            setLoading(false);
        }
    }, []); // Dependencias vacías porque no usa nada externo cambiante

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export default useOperationalData;