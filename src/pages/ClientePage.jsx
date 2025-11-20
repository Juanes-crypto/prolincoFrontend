// frontend/src/pages/ClientePage.jsx
import React, { useState, useEffect } from 'react';
import { API } from '../api/api';
import { useAuth } from '../context/AuthProvider';
import ToolBuilder from '../components/ToolBuilder';
import DynamicToolSection from '../components/DynamicToolSection';
import { TruckIcon, PlusIcon } from '@heroicons/react/24/solid';

const ClientePage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    
    const [toolsData, setToolsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showBuilder, setShowBuilder] = useState(false);

    const fetchTools = async () => {
        setLoading(true);
        try {
            // Pedimos solo las herramientas de 'servicio'
            const res = await API.get('/tools/servicio');
            setToolsData(res.data); // { "Preventa": [...], "Venta": [...] }
        } catch (error) {
            console.error("Error cargando herramientas", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
    }, []);

    return (
        <div className="p-8 min-h-screen bg-gray-50 animate-fadeIn">
            
            {/* Header */}
            <header className="flex justify-between items-end mb-10">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl text-blue-600 shadow-sm">
                        <TruckIcon className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-prolinco-dark">Servicio al Cliente</h1>
                        <p className="text-gray-600 mt-1 text-lg">Ciclo completo de atención y ventas</p>
                    </div>
                </div>

                {/* Botón Crear Herramienta (Solo Admin) */}
                {isAdmin && (
                    <button 
                        onClick={() => setShowBuilder(true)}
                        className="flex items-center px-6 py-3 bg-prolinco-primary text-white font-bold rounded-xl shadow-lg hover:bg-yellow-500 hover:scale-105 transition-all"
                    >
                        <PlusIcon className="h-6 w-6 mr-2" />
                        Agregar Herramienta
                    </button>
                )}
            </header>

            {/* Contenido Dinámico */}
            {loading ? (
                <div className="text-center p-10">Cargando herramientas...</div>
            ) : (
                <DynamicToolSection sectionData={toolsData} onUpdate={fetchTools} />
            )}

            {/* Modal Constructor */}
            {showBuilder && (
                <ToolBuilder 
                    section="servicio" // 👈 Esto es lo único que cambia para las otras páginas
                    onClose={() => setShowBuilder(false)}
                    onSuccess={fetchTools}
                />
            )}
        </div>
    );
};

export default ClientePage;