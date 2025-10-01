// frontend/src/components/DocumentUpload.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/api'; 


// ✅ El componente ahora recibe la prop onUploadSuccess
const DocumentUpload = ({ onUploadSuccess }) => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('userToken');

    const handleFileChange = (e) => {
        // Solo selecciona el primer archivo si se seleccionaron varios
        setFile(e.target.files[0]);
        setError(''); // Limpiar errores al seleccionar un nuevo archivo
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!file) {
            setError('Por favor, selecciona un archivo para subir.');
            return;
        }

        if (!token) {
            setError('Sesión no válida. Por favor, inicia sesión.');
            navigate('/login');
            return;
        }

        setLoading(true);

        // ⚠️ CLAVE: Usar FormData para enviar archivos (multipart/form-data)
        const formData = new FormData();
        formData.append('file', file); // El primer 'file' coincide con upload.single('file') en el backend
        formData.append('category', category); // El backend lo leerá como req.body.category

        try {
            const config = {
                headers: {
                    // ⚠️ IMPORTANTE: No definimos Content-Type: 'multipart/form-data'. 
                    // Axios lo hace automáticamente con FormData, y es crucial no hacerlo manualmente.
                    'Authorization': `Bearer ${token}`, 
                },
                // Opcional: para ver el progreso de la subida en la consola
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Subiendo: ${percent}%`);
                }
            };
            
            // 🌟 CAMBIO: Usamos API.post y solo la ruta relativa
            const response = await API.post('/documents/upload', formData, config);

            // Éxito
            setMessage(response.data.message || 'Archivo subido con éxito.');
            setFile(null); // Limpiar el campo de archivo
            setCategory('General');

            // ✅ Llama a la función que recarga la lista en FilesPage
            if (onUploadSuccess) {
                onUploadSuccess(); 
            }
            
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Error desconocido al subir el archivo.';
            setError(msg);

            // Si es un 401/403 (token expirado o sin permisos), forzar login
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.clear();
                setTimeout(() => navigate('/login'), 1500);
            }
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-2xl">
            <h2 className="text-3xl font-extrabold text-prolinco-primary mb-6 border-b pb-3">
                Subir Documento
            </h2>

            {/* Mensajes */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    ⚠️ {error}
                </div>
            )}
            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    ✅ {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Campo de Archivo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar Archivo (Max 5MB - PDF, DOC/X, Imagen)
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2"
                        required
                    />
                    {file && (
                        <p className="mt-2 text-sm text-gray-500">
                            Archivo seleccionado: **{file.name}**
                        </p>
                    )}
                </div>

                {/* Categoría */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría del Documento
                    </label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-prolinco-primary focus:border-prolinco-primary"
                    >
                        <option value="General">General</option>
                        <option value="Contratos">Contratos</option>
                        <option value="Nomina">Nómina</option>
                        <option value="Personal">Archivos Personales</option>
                        <option value="Soporte">Soporte Operacional</option>
                    </select>
                </div>
                
                {/* Botón de Envío */}
                <button
                    type="submit"
                    disabled={loading || !file}
                    className={`w-full py-3 px-4 rounded-xl text-lg font-bold text-white transition duration-300 shadow-xl flex items-center justify-center
                            ${loading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-prolinco-primary hover:bg-prolinco-secondary/90'}`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Subiendo...
                        </>
                    ) : (
                        'Subir y Guardar Documento'
                    )}
                </button>
            </form>
        </div>
    );
};

export default DocumentUpload;