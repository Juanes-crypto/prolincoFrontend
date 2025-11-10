// frontend/src/context/AuthProvider.jsx (Anteriormente AuthContext.jsx)

import React, { useState, useEffect, useContext } from "react";
// 🌟 IMPORTAMOS el Contexto desde el nuevo archivo de definición
import { AuthContext } from "./AuthContextDefinition";

// 2. Crear el Provider (el contenedor que provee el estado)
export const AuthProvider = ({ children }) => {
  // Inicializar el estado de usuario y token desde el localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("userToken")); // 🌟 ESTADO CLAVE: Bandera de carga para la inicialización del contexto

  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // ... lógica de sincronización de user ...
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "isPasswordSet",
        user.isPasswordSet ? "true" : "false"
      );
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("isPasswordSet");
    }
  }, [user]);

  useEffect(() => {
    // ... lógica de sincronización de token ...
    if (token) {
      localStorage.setItem("userToken", token);
    } else {
      localStorage.removeItem("userToken");
    }
  }, [token]); // 🌟 MARCA LA CARGA COMO COMPLETADA 🌟

  useEffect(() => {
    setIsAuthLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };





  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout: () => {
          // Limpiar localStorage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // Resetear estado
          setUser(null);
          // Redirigir a login
          window.location.href = "/login";
        },
        setUser,
        isAuthenticated: !!user,
        isAuthLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default AuthProvider;