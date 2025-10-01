// frontend/vite.config.js

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Se usa una función de configuración para acceder al modo (desarrollo, producción)
export default defineConfig(({ mode }) => {
  
  // 1. Cargar las variables de entorno de la carpeta raíz del proyecto (donde está el .env)
  // La función loadEnv ayuda a cargar las variables correctamente.
  // El tercer parámetro '' carga todas las variables sin prefijo VITE_, pero es buena práctica usarlo.
  // Aquí estamos cargando solo las que empiezan con VITE_ (comportamiento por defecto de Vite)
  const env = loadEnv(mode, process.cwd(), 'VITE_'); 

  // 2. Definir la URL de fallback (por si acaso)
  // Usamos el valor cargado, si existe.
  const API_URL_INJECTED = env.VITE_API_URL || 'http://localhost:5000/api'; 

  return {
    plugins: [react()],
    
    // 🌟 CLAVE: Configuración 'define' para inyectar variables en el bundle 🌟
    // Esto asegura que `import.meta.env.VITE_API_URL` tenga el valor correcto 
    // (Render URL en producción, localhost en desarrollo).
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(API_URL_INJECTED),
      // Aunque no lo uses mucho, esta es la forma de definir el modo de Node para el build.
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    // 3. Configuración del directorio de salida para el build (Render necesita 'dist')
    build: {
      outDir: 'dist', 
    },

    // 4. Configuración del servidor de desarrollo (opcional, pero ayuda)
    server: {
      // Abre el navegador automáticamente
      open: true,
      // Proxy solo si lo necesitas, pero con la inyección directa en api.js no es necesario.
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:5000',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, '/api'),
      //   },
      // },
    },
  };
});