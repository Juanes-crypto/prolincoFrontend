// frontend/src/api/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL; 

const API = axios.create({
    baseURL: API_BASE_URL, 
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