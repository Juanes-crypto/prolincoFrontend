// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Define la URL base de la API para el entorno de producción
  const VITE_API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

  return {
    plugins: [react()],
    // 🌟 CLAVE: Definir variables de entorno en el objeto 'define' 🌟
    define: {
      // Esto hace que la variable esté disponible en el bundle JavaScript final
      'import.meta.env.VITE_API_URL': JSON.stringify(VITE_API_URL),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    build: {
      // Opcional: Asegúrate de que el path sea el correcto si hay problemas con rutas estáticas
      outDir: 'dist',
    },
    // Configuración para el proxy de desarrollo (solo si usas el dev server de Vite como proxy)
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: VITE_API_URL, // Usaría la URL que definimos arriba
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  };
});