// frontend/src/components/AuthGuard.jsx (FINAL Y CORREGIDO)

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextDefinition";

const AuthGuard = ({ children }) => {
  // Obtenemos user y la bandera de carga
  const { user, isAuthLoading } = useContext(AuthContext);

  // 🌟 1. ESPERAR A QUE LA AUTENTICACIÓN TERMINE DE CARGAR 🌟
  // Esto es CRUCIAL para evitar que el bucle se dispare al inicio.
  if (isAuthLoading) {
    return null; // Muestra un Spinner o null mientras carga
  }

  // 2. LÓGICA DE PROTECCIÓN (Solo se ejecuta si isAuthLoading es false)
  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/login" replace />;
  }

  if (!user.isPasswordSet) {
    // Si no ha cambiado la contraseña, redirige a cambiar contraseña
    return <Navigate to="/cambio-contrasena" replace />; // ⬅️ Ruta correcta
  } // Si el usuario está logeado y tiene la contraseña cambiada, muestra el contenido

  return children;
};

export default AuthGuard;
