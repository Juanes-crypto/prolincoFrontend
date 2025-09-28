// frontend/src/pages/Login.jsx (VERSIÓN FINAL Y CORREGIDA)

import React, { useState, useContext } from 'react'; // 🌟 Importar useContext 🌟
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextDefinition'; // 🌟 Importar AuthContext 🌟

// URL base de nuestra API (Puerto 5000)
const API_URL = 'http://localhost:5000/api/auth/'; 

const Login = () => {
    // 🌟 1. USAR EL CONTEXTO Y SUS FUNCIONES 🌟
    const { user, login } = useContext(AuthContext); // Obtenemos el user y la función login
    
    // Estados existentes
    const [documentNumber, setDocumentNumber] = useState('');
    const [password, setPassword] = useState('');
    const [documentType, setDocumentType] = useState('CC'); 
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // *** ESTADOS NUEVOS ***
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    // 🌟 2. CORRECCIÓN DEL BUCLE (Línea 25 anterior) 🌟
    // Si el estado de React/Context ya tiene un usuario, redirigir al Dashboard.
    if (user) {
        // Redirige al inicio. El AuthGuard se encargará de enviarlo a /cambio-contrasena si es nuevo.
        return <Navigate to="/" replace />; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const endpoint = isRegistering ? 'register' : 'login';
            
            let payload = {};

            if (isRegistering) {
                // Payload para REGISTRO (Mantenemos la contraseña inicial como docNumber)
                payload = { 
                    name,
                    email,
                    documentType, 
                    documentNumber, 
                    password: documentNumber // Contraseña es el mismo número por requisito
                };
            } else {
                // Payload para LOGIN
                payload = { documentNumber, password };
            }
            
            const { data } = await axios.post(API_URL + endpoint, payload);

            // 🌟 3. USAR LA FUNCIÓN 'login' DEL CONTEXTO EN LUGAR DE LOCALSTORAGE 🌟
            // Esto actualiza el estado 'user' globalmente y guarda token/user en localStorage
            login(data.user, data.token);

            // Redirigir al dashboard (ya que el estado se actualizó, el AuthGuard se encargará)
            // No necesitamos window.location.href, solo el contexto se actualiza y React lo maneja.
            // La redirección ocurrirá automáticamente gracias al "if (user)" de arriba
            // o gracias al AuthGuard en la ruta /.

        } catch (err) {
            setError(err.response?.data?.message || 'Error de conexión o credenciales inválidas.');
        } finally {
            setLoading(false);
        }
    };

    // ... (handleSwitchMode y el JSX son correctos)
    
    const handleSwitchMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        // Limpiamos todos los campos al cambiar de modo
        setDocumentNumber('');
        setPassword('');
        setDocumentType('CC');
        setName('');
        setEmail('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-prolinco-secondary p-4">
            
            {/* Tarjeta Flotante y Dinámica */}
            <div className={`bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-700 ease-in-out ${isRegistering ? 'scale-105' : 'scale-100'} border-t-8 border-prolinco-primary`}>
                
                <h2 className="text-3xl font-black text-prolinco-dark mb-2 text-center">
                    {isRegistering ? 'Registro Prolinco' : 'Acceso Prolinco'}
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Portal Estratégico de Intervención Empresarial
                </p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* *** CAMPOS EXCLUSIVOS DE REGISTRO *** */}
                    {isRegistering && (
                        <>
                            {/* Nombre Completo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    placeholder="Nombre y Apellido"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-xl focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                                <input
                                    type="email"
                                    placeholder="ejemplo@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-xl focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150"
                                />
                            </div>
                            
                            {/* Tipo de Documento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                                <select 
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-xl focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150"
                                >
                                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                                    <option value="TI">Tarjeta de Identidad (TI)</option>
                                    <option value="CE">Cédula de Extranjería (CE)</option>
                                    <option value="NIT">NIT</option>
                                </select>
                            </div>
                        </>
                    )}
                    {/* *** FIN CAMPOS EXCLUSIVOS DE REGISTRO *** */}


                    {/* Número de Documento (Común a Login y Registro) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Número de Documento</label>
                        <input
                            type="text"
                            placeholder="Ej: 102345678"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-xl focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150"
                            required
                        />
                    </div>

                    {/* Contraseña (Solo en Login) */}
                    {!isRegistering && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-xl focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150"
                                required
                            />
                        </div>
                    )}

                    {/* Botón Principal */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl text-lg font-bold text-prolinco-dark transition duration-300 shadow-xl 
                            ${loading ? 'bg-gray-300' : 'bg-prolinco-primary hover:bg-yellow-400 hover:shadow-2xl'}`}
                    >
                        {loading ? 'Cargando...' : (isRegistering ? 'Registrarme (Contraseña = Documento)' : 'Iniciar Sesión')}
                    </button>
                </form>

                {/* Switch Registro/Login */}
                <p className="mt-6 text-center text-sm text-gray-500">
                    {isRegistering ? '¿Ya tienes cuenta?' : '¿Eres nuevo?'}
                    <button 
                        type="button" 
                        onClick={handleSwitchMode} // Usamos la función auxiliar
                        className="ml-2 font-semibold text-prolinco-secondary hover:text-prolinco-primary transition duration-150"
                    >
                        {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;