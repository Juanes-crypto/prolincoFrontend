// frontend/src/pages/OperationalToolsPage.jsx

import React, { useState } from 'react';
import useOperationalData from '../hooks/useOperationalData'; // ✅ El hook de datos reales
import ClientePage from './ClientePage'; // 🛑 Próximo archivo a crear
import TalentoHumanoPage from './TalentoHumanoPage'; // 🛑 Próximo archivo a crear
import AdministracionPage from './AdministracionPage'; // 🛑 Próximo archivo a crear

// Definición de las secciones para la navegación
const sections = [
    { key: 'Cliente', name: '1. Servicio al Cliente' },
    { key: 'Talento Humano', name: '2. Talento Humano' },
    { key: 'Admin', name: '3. Administración' },
];

const OperationalToolsPage = () => {
    // Estado para la navegación lateral
    const [activeSection, setActiveSection] = useState(sections[0].key);
    
    // Carga REAL de datos con el hook
    const { data, loading, error, refetch } = useOperationalData();

    // Función para renderizar el componente de la sección activa
    const renderSection = () => {
        if (loading) {
            return <p className="p-6 text-xl text-center text-prolinco-primary">Cargando contenido estratégico...</p>;
        }
        
        if (error || !data) {
            return <p className="p-6 text-xl text-center text-red-600">Error: {error || "No se pudieron cargar los datos."}</p>;
        }

        // Seleccionar los datos específicos para la sección activa
        const sectionData = data[activeSection] || {};

        switch (activeSection) {
            case 'Cliente':
                // Nota: ClientePage aún no usa todos los datos, pero ya los tiene disponibles
                return <ClientePage data={sectionData} refetch={refetch} />;
            case 'Talento Humano':
                return <TalentoHumanoPage data={sectionData} refetch={refetch} />;
            case 'Admin':
                return <AdministracionPage data={sectionData} refetch={refetch} />;
            default:
                return <p className="p-6 text-gray-500">Seleccione una sección.</p>;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* 1. Menú Lateral (Sidebar) */}
            <aside className="w-64 bg-white p-6 shadow-xl border-r">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Plataforma Estratégica</h2>
                <nav>
                    <ul>
                        {sections.map((section) => (
                            <li key={section.key} className="mb-2">
                                <button
                                    onClick={() => setActiveSection(section.key)}
                                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 text-sm ${
                                        activeSection === section.key
                                            ? 'bg-prolinco-primary text-white font-bold shadow-md'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {section.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* 2. Área de Contenido Principal */}
            <main className="flex-1 p-8">
                <h1 className="text-4xl font-black text-gray-800 mb-8">
                    {sections.find(s => s.key === activeSection)?.name}
                </h1>
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default OperationalToolsPage;