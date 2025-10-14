// src/hooks/useSessionTimeout.js - VERSIÓN CORREGIDA Y ESTABLE
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthProvider';

export const useSessionTimeout = (timeoutMinutes = 10) => {
    const { logout } = useAuth();
    const timeoutRef = useRef(null);
    const warningRef = useRef(null);

    useEffect(() => {
        const timeoutMs = timeoutMinutes * 60 * 1000;
        const warningMs = (timeoutMinutes - 1) * 60 * 1000; // Advertencia 1 min antes

        const resetTimers = () => {
            // Limpiar timers existentes
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (warningRef.current) clearTimeout(warningRef.current);

            // Timer de advertencia
            warningRef.current = setTimeout(() => {
                alert(`🕒 Tu sesión expirará en 1 minuto por inactividad. Realiza alguna acción para mantenerla activa.`);
            }, warningMs);

            // Timer de logout
            timeoutRef.current = setTimeout(() => {
                logout();
                alert('🔒 Sesión cerrada por inactividad. Por favor, inicia sesión nuevamente.');
            }, timeoutMs);
        };

        // Eventos que resetearán el timer
        const events = [
            'mousedown', 'mousemove', 'keypress', 
            'scroll', 'touchstart', 'click',
            'keydown'
        ];

        // Agregar event listeners
        events.forEach(event => {
            document.addEventListener(event, resetTimers);
        });

        // Iniciar timers por primera vez
        resetTimers();

        // Cleanup function
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetTimers);
            });
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (warningRef.current) clearTimeout(warningRef.current);
        };
    }, [timeoutMinutes, logout]); // ✅ DEPENDENCIAS CORRECTAS

    return { isWarning: false, timeLeft: timeoutMinutes * 60 };
};

// Hook para cerrar sesión al cerrar pestaña - VERSIÓN SIMPLIFICADA
export const useTabCloseListener = () => {
    const { logout } = useAuth();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            // Opcional: hacer logout antes de cerrar
            logout();
            // Para algunos navegadores necesitas esto
            event.preventDefault();
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [logout]);
};