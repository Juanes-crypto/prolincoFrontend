// src/pages/OperationalToolsPage.jsx (VERSIÓN REDISEÑADA CON HUB)

import React, { useState } from 'react';
import useOperationalData from '../hooks/useOperationalData';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

// Importamos las páginas y nuestro nuevo componente de tarjeta
import ClientePage from './ClientePage';
import TalentoHumanoPage from './TalentoHumanoPage';
import AdministracionPage from './AdministracionPage';
import NavigationCard from '../components/NavigationCard';

const sections = [
    { key: 'servicio', name: 'Servicio al Cliente', description: 'Ciclo de ventas y atención', icon: '👥', colorClass: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { key: 'talento', name: 'Talento Humano', description: 'Gestión de personal', icon: '💼', colorClass: 'bg-gradient-to-br from-green-500 to-emerald-500' },
    { key: 'admin', name: 'Administración', description: 'Configuración estratégica', icon: '🏢', colorClass: 'bg-gradient-to-br from-purple-500 to-indigo-500' },
];

const OperationalToolsPage = () => {
    // 'selectedSection' controla qué se muestra: 'null' para el hub, o la key para una página
    const [selectedSection, setSelectedSection] = useState(null);
    const { data, loading, error, refetch } = useOperationalData();

    // Función para renderizar el contenido principal
    const renderContent = () => {
        // Si no hay una sección seleccionada, mostramos el Hub
        if (!selectedSection) {
            return (
                <>
                    <header className="text-center mb-12">
                        <h1 className="text-5xl font-black text-prolinco-dark mb-2">Plataforma Estratégica</h1>
                        <p className="text-xl text-gray-600">Bienvenido. Selecciona un módulo para comenzar a gestionar.</p>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {sections.map(section => {
                            // Calculamos un texto de estado para cada tarjeta
                            const sectionData = data ? data[section.key] : {};
                            const toolKeys = Object.keys(sectionData || {});
                            const configuredCount = toolKeys.filter(k => sectionData[k] && sectionData[k] !== '#').length;
                            const totalCount = toolKeys.length > 2 ? toolKeys.length - 2 : toolKeys.length; // Excluir diagnostic y specificObjective
                            const statusText = loading ? "Cargando estado..." : `${configuredCount} de ${totalCount} herramientas configuradas`;

                            return (
                                <NavigationCard
                                    key={section.key}
                                    icon={section.icon}
                                    title={section.name}
                                    description={section.description}
                                    colorClass={section.colorClass}
                                    statusText={statusText}
                                    onClick={() => setSelectedSection(section.key)}
                                />
                            );
                        })}
                    </div>
                </>
            );
        }

        // Si hay una sección seleccionada, la renderizamos
        const sectionData = data?.[selectedSection] || {};
        switch (selectedSection) {
            case 'servicio': return <ClientePage data={sectionData} refetch={refetch} />;
            case 'talento': return <TalentoHumanoPage data={sectionData} refetch={refetch} />;
            case 'admin': return <AdministracionPage data={sectionData} refetch={refetch} />;
            default: return null;
        }
    };
    
    // Header dinámico que muestra el botón de "Volver" si es necesario
    const DynamicHeader = () => {
        if (!selectedSection) return null;

        const currentSection = sections.find(s => s.key === selectedSection);

        return (
            <div className="mb-6 flex items-center space-x-4">
                <button
                    onClick={() => setSelectedSection(null)}
                    className="bg-white hover:bg-gray-100 text-prolinco-dark font-bold p-3 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-4xl font-black text-prolinco-dark">{currentSection.name}</h1>
                    <p className="text-lg text-gray-600">{currentSection.description}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-full animate-fadeIn">
            <DynamicHeader />
            <div className={selectedSection ? "bg-white rounded-2xl shadow-lg border border-gray-200 p-6" : ""}>
                {renderContent()}
            </div>
        </div>
    );
};

export default OperationalToolsPage;