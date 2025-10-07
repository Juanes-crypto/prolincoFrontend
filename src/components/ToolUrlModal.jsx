// components/ToolUrlModal.jsx - NUEVO ARCHIVO
import React, { useState } from 'react';
import Card from './Card';
import { LinkIcon, XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { API } from '../api/api';

const ToolUrlModal = ({ tool, section, onComplete, onClose }) => {
    const [url, setUrl] = useState(tool?.url || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Necesitamos una nueva ruta en el backend para esto
            await API.put(`/content/${section}/tool/${tool.name}`, { url });
            onComplete();
            onClose();
        } catch (error) {
            console.error('Error updating tool URL:', error);
            alert('Error al actualizar la URL');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card title={`Editar URL: ${tool?.name}`} className="w-96">
                <form onSubmit={handleSave}>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full p-2 border rounded mb-4"
                        required
                    />
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded">
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ToolUrlModal;