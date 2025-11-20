import React, { useState, useContext } from "react";
import { API } from '../api/api'; 
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextDefinition"; 

const ChangePassword = () => {
    const { user, setUser } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState(""); // El usuario debe poner su documento aquí
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Si ya cambió la clave, se va
    if (user && user.isPasswordSet) return <Navigate to="/" replace />;
    // Si no hay usuario logueado, se va al login
    if (!user) return <Navigate to="/login" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (password !== confirmPassword) return setError("Las nuevas contraseñas no coinciden");
        if (password.length < 6) return setError("Mínimo 6 caracteres");

        setLoading(true);

        try {
            // 🌟 RUTA CORRECTA
            await API.put("/auth/change-password", { 
                currentPassword: currentPassword, // Envía documento como validación
                newPassword: password 
            });

            // Actualizar contexto para que isPasswordSet sea true
            setUser({ ...user, isPasswordSet: true });

            alert("¡Contraseña actualizada! Bienvenido.");
            setTimeout(() => {
                navigate('/', { replace: true }); 
            }, 1000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error al actualizar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-red-500">
                <h2 className="text-2xl font-black text-center mb-4">Configura tu Acceso</h2>
                <p className="text-gray-600 text-sm mb-6 text-center">
                    Por seguridad, ingresa tu número de documento como contraseña actual y crea una nueva.
                </p>
                
                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500">CONTRASEÑA ACTUAL (TU DOCUMENTO)</label>
                        <input type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500">NUEVA CONTRASEÑA</label>
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500">CONFIRMAR NUEVA</label>
                        <input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full p-2 border rounded" required />
                    </div>
                    <button disabled={loading} className="w-full py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700">
                        {loading ? 'Guardando...' : 'Establecer Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;