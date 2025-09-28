// frontend/src/api/api.js

import axios from 'axios';

// 1. Configuración de la URL base de la API
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Usamos el puerto 5000 que está corriendo
});

// 2. Interceptor para agregar el token JWT a todas las solicitudes
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        
        // Si existe un token, lo adjuntamos al encabezado 'Authorization'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Exportamos el cliente configurado
export { API };