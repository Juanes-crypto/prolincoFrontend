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
            
            // 🛑 Llama al endpoint REAL del backend para obtener todo el contenido operativo
            // Este endpoint debe devolver un array con todos los objetos de contenido
            const response = await API.get('/operational/content', config);
            
            // Transformar el array de respuesta en un objeto fácil de usar:
            // { 'Talento Humano': { 'Diagnóstico': 'texto...', 'Organigrama': 'url...' } }
            const transformedData = response.data.reduce((acc, item) => {
                // Inicializar la sección si aún no existe
                if (!acc[item.section]) {
                    acc[item.section] = {};
                }
                // Almacenar el contenido bajo su subsección
                acc[item.section][item.subsection] = item.content;
                return acc;
            }, {});

            setData(transformedData);
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