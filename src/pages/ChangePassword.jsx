// frontend/src/pages/ChangePassword.jsx (FINAL Y LIMPIO)

import React, { useState, useContext } from "react"; // Eliminamos useEffect si no lo usamos
import { API } from '../api/api'; 
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextDefinition"; 

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [matchError, setMatchError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const token = localStorage.getItem("userToken");

    // **Lógica de Redirección Inicial:** Se dispara solo si ya se completó el cambio
    if (user && user.isPasswordSet) {
        return <Navigate to="/" replace />;
    }

    const handlePasswordChange = (value) => {
        setPassword(value);
        setError("");
        if (confirmPassword) {
            if (value !== confirmPassword) {
                setMatchError("Las contraseñas no coinciden.");
            } else {
                setMatchError("");
            }
        }
    };

    const handleConfirmChange = (value) => {
        setConfirmPassword(value);
        setError("");
        if (password && value && password !== value) {
            setMatchError("Las contraseñas no coinciden.");
        } else {
            setMatchError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        if (password.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden. Por favor, verifícalas.");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            // 🌟 CAMBIO: Usamos API.put y solo la ruta relativa
            const response = await API.put(
                "/users/change-password", // La ruta completa será: baseURL/api/users/change-password
                { password },
                config
            );

            setMessage(response.data.message || "Contraseña actualizada con éxito."); // 1. Actualizar el estado GLOBAL del usuario

            setUser({
                ...user,
                isPasswordSet: true,
            }); 
            
            // 2. Redirección forzada con Recarga
            setTimeout(() => {
                window.location.href = "/";
            }, 100);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                setError(
                    "Sesión expirada o inválida. Por favor, inicie sesión de nuevo."
                );
                localStorage.clear();
                setUser(null);
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setError(
                    err.response?.data?.message ||
                    "Error al cambiar la contraseña (Verifique conexión)."
                );
            }
        } finally {
            setLoading(false);
        }
    }; 
    // mostramos null temporalmente para evitar errores en el JSX.
    if (!user) {
        return null;
    }

    // ... (Tu JSX del formulario es igual)
    return (
        <div className="min-h-screen flex items-center justify-center bg-prolinco-secondary p-4">
            
            <div
                className={`bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-red-500`}
            >
                
                <h2 className="text-3xl font-black text-red-500 mb-2 text-center">
                    ¡Atención Requerida! 
                </h2>
                
                <p className="text-center text-gray-700 mb-8">
                    Por seguridad, debes establecer una contraseña
                    personal.
                </p>
                {/* Mensajes de Error/Éxito */}
                {error && (
                    <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                        role="alert"
                    >
                        
                        <span className="block sm:inline">⚠️ {error}</span>
                        
                    </div>
                )}
                
                {message && (
                    <div
                        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                        role="alert"
                    >
                        
                        <span className="block sm:inline">✅ {message}</span>
                        
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nueva Contraseña */}
                    <div>
                        
                        <label className="block text-sm font-medium text-gray-700">
                            Nueva Contraseña (Mín. 6 caracteres)
                        </label>
                        
                        <div className="relative">
                            
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Introduce tu nueva contraseña"
                                value={password}
                                onChange={(e) => handlePasswordChange(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-xl focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150 pr-10"
                                required
                            />
                            
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900"
                                aria-label={
                                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                            >
                                {showPassword ? "👁️" : "👁‍🗨"}
                                
                            </button>
                            
                        </div>
                        
                    </div>
                    {/* Confirmar Contraseña */}
                    <div>
                        
                        <label className="block text-sm font-medium text-gray-700">
                            Confirma la Nueva Contraseña
                        </label>
                        
                        <div className="relative">
                            
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Repite la nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => handleConfirmChange(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-xl focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150 pr-10"
                                required
                            />
                            
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-900"
                                aria-label={
                                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                                }
                            >
                                {showPassword ? "👁️" : "👁‍🗨"}
                                
                            </button>
                            
                        </div>
                        
                        {matchError && (
                            <p className="mt-2 text-sm text-red-600">{matchError}</p>
                        )}
                        
                    </div>
                    {/* Botón de envío */}
                    <button
                        type="submit"
                        disabled={loading || !!matchError}
                        className={`w-full py-3 px-4 rounded-xl text-lg font-bold text-white transition duration-300 shadow-xl 
  ${loading || matchError
                                ? "bg-gray-500"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        
                        {loading ? "Cambiando..." : "Establecer Nueva Contraseña"}
                        
                    </button>
                    
                </form>
                
            </div>
            
        </div>
    );
};

export default ChangePassword;
