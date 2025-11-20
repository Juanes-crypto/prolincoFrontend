import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextDefinition';
import { API } from '../api/api';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Campos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [documentType, setDocumentType] = useState('CC');
    const [documentNumber, setDocumentNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isRegistering ? '/auth/register' : '/auth/login';
        
        // Preparamos datos. Si es registro, NO enviamos password (el backend lo pone igual al documento)
        const payload = isRegistering 
            ? { name, email, documentType, documentNumber } 
            : { documentNumber, password };

        try {
            const { data } = await API.post(endpoint, payload);
            
            // data.user contiene la info del usuario
            // data.token contiene el token
            
            // 1. Guardar sesión
            login(data.user, data.token);

            // 2. Decidir a dónde ir
            // Usamos setTimeout para asegurar que el estado se guardó
            setTimeout(() => {
                if (data.user.isPasswordSet === false) {
                    console.log("Usuario nuevo -> A cambiar contraseña");
                    navigate('/cambiar-password');
                } else {
                    console.log("Usuario antiguo -> Al Dashboard");
                    navigate('/');
                }
            }, 100);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-prolinco-secondary p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-prolinco-primary transition-all">
                <h2 className="text-3xl font-black text-prolinco-dark mb-6 text-center">
                    {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegistering && (
                        <>
                            <input type="text" placeholder="Nombre Completo" className="w-full p-3 border rounded-xl" value={name} onChange={e => setName(e.target.value)} required />
                            <input type="email" placeholder="Correo" className="w-full p-3 border rounded-xl" value={email} onChange={e => setEmail(e.target.value)} required />
                            <select className="w-full p-3 border rounded-xl" value={documentType} onChange={e => setDocumentType(e.target.value)}>
                                <option value="CC">Cédula de Ciudadanía</option>
                                <option value="TI">Tarjeta de Identidad</option>
                                <option value="CE">Cédula de Extranjería</option>
                            </select>
                        </>
                    )}

                    <input type="text" placeholder="Número de Documento" className="w-full p-3 border rounded-xl" value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} required />

                    {!isRegistering && (
                        <input type="password" placeholder="Contraseña" className="w-full p-3 border rounded-xl" value={password} onChange={e => setPassword(e.target.value)} required />
                    )}

                    <button disabled={loading} className="w-full py-3 bg-prolinco-primary font-bold rounded-xl hover:bg-yellow-400 transition-colors">
                        {loading ? 'Procesando...' : (isRegistering ? 'Registrarme' : 'Entrar')}
                    </button>
                </form>

                <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="w-full mt-4 text-sm text-gray-500 hover:text-prolinco-secondary">
                    {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿Eres nuevo? Regístrate'}
                </button>
            </div>
        </div>
    );
};

export default Login;