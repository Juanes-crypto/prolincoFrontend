import React, { useState, useEffect } from 'react';
import { API } from '../api/api';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';

const ToolBuilder = ({ section, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '', 
        newCategory: '', 
        allowsUrl: false,
        allowsFile: false
    });
    
    const [existingCategories, setExistingCategories] = useState([]);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar categorías existentes
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get(`/tools/${section}`);
                // El backend devuelve: { "Preventa": [...], "Venta": [...] }
                const cats = Object.keys(res.data);
                setExistingCategories(cats);

                // 💡 MEJORA: Si no hay categorías, activar modo "Nueva" automáticamente
                if (cats.length === 0) {
                    setIsCustomCategory(true);
                }
            } catch (error) {
                console.error("Error cargando categorías", error);
                // En caso de error, permitir escribir manualmente
                setIsCustomCategory(true);
            }
        };
        fetchCategories();
    }, [section]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar antes de enviar
        const categoryToSend = isCustomCategory ? formData.newCategory : formData.category;

        if (!categoryToSend || categoryToSend.trim() === '') {
            alert("Por favor escribe una Categoría o Fase (ej: Venta)");
            return;
        }

        if (!formData.allowsUrl && !formData.allowsFile) {
            alert("Selecciona al menos una opción: URL o Archivo");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                section: section,
                category: categoryToSend,
                config: {
                    allowsUrl: formData.allowsUrl,
                    allowsFile: formData.allowsFile
                }
            };

            await API.post('/tools', payload);
            onSuccess(); // Recargar la página padre
            onClose(); // Cerrar modal
        } catch (error) {
            console.error("Error creando herramienta:", error);
            alert("Error al crear. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="bg-prolinco-dark p-4 flex justify-between items-center">
                    <h2 className="text-white font-bold text-xl flex items-center gap-2">
                        <PlusIcon className="h-6 w-6 text-prolinco-primary" />
                        Nueva Herramienta
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input 
                            type="text" 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-prolinco-primary outline-none"
                            placeholder="Ej: Volantes Digitales"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-prolinco-primary outline-none"
                            placeholder="Para qué sirve..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    {/* Selector de Categoría Inteligente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fase / Categoría</label>
                        
                        {/* Si hay categorías y NO estamos en modo custom, mostramos select */}
                        {!isCustomCategory && existingCategories.length > 0 ? (
                            <div className="flex gap-2">
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="">Selecciona una fase...</option>
                                    {existingCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsCustomCategory(true);
                                        setFormData(prev => ({...prev, category: ''})); // Limpiar selección
                                    }}
                                    className="bg-gray-100 px-3 rounded-lg hover:bg-gray-200 text-sm font-semibold whitespace-nowrap"
                                >
                                    + Nueva
                                </button>
                            </div>
                        ) : (
                            /* Si NO hay categorías O el usuario quiso una nueva, mostramos input */
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    required={isCustomCategory} 
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-prolinco-primary"
                                    placeholder="Ej: Preventa, Venta, Inducción..."
                                    value={formData.newCategory}
                                    onChange={e => setFormData({...formData, newCategory: e.target.value})}
                                    autoFocus // Poner el foco aquí automáticamente
                                />
                                {existingCategories.length > 0 && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsCustomCategory(false)}
                                        className="text-sm text-red-500 underline whitespace-nowrap"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Checkboxes */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                        <p className="text-sm font-bold text-gray-700">Configuración</p>
                        
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-prolinco-primary rounded focus:ring-prolinco-primary"
                                checked={formData.allowsUrl}
                                onChange={e => setFormData({...formData, allowsUrl: e.target.checked})}
                            />
                            <span className="text-gray-600">Requiere <strong>Enlace (URL)</strong></span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-prolinco-primary rounded focus:ring-prolinco-primary"
                                checked={formData.allowsFile}
                                onChange={e => setFormData({...formData, allowsFile: e.target.checked})}
                            />
                            <span className="text-gray-600">Requiere <strong>Archivo</strong></span>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-bold text-white shadow-md transition-all ${
                                loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-prolinco-primary hover:bg-yellow-500'
                            }`}
                        >
                            {loading ? 'Creando...' : 'Crear Herramienta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ToolBuilder;