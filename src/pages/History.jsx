// frontend/src/pages/History.jsx

import React, { useState, useEffect } from 'react';
import { API } from '../api/api';
import { ClockIcon, ClipboardListIcon } from '@heroicons/react/solid';
import Card from '../components/Card';
import moment from 'moment';
import { useAuth } from '../context/AuthProvider'; // ✅ Usar nuestro hook corregido

const sections = [
    { key: 'organizacional', name: 'Identidad Organizacional (Misión/Visión)' },
    { key: 'admin', name: 'Diagnóstico y Objetivos (Administración)' },
    { key: 'servicio', name: 'Diagnóstico y Objetivos (Servicio al Cliente)' },
    { key: 'talento', name: 'Diagnóstico y Objetivos (Talento Humano)' },
];

const History = () => {
    const { user } = useAuth(); // ✅ Usar el contexto de autenticación

    const [selectedSection, setSelectedSection] = useState(sections[0].key);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ VERIFICACIÓN CORRECTA: Después de los hooks
    if (user?.role !== "admin") {
        return (
            <div className="p-10 text-red-600 font-bold">
                Acceso denegado. Solo el rol Administrador puede acceder a la Auditoría.
            </div>
        );
    }

    // 1. Lógica de Carga de Historial
    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setHistoryData([]);
            setError(null);

            try {
                // Usamos el endpoint GET /api/content/:section/history que creamos en el backend
                const response = await API.get(`/content/${selectedSection}/history`);
                setHistoryData(response.data);
            } catch (err) {
                setError("Error al cargar el historial. Asegúrate de que el backend esté activo y que el usuario tenga permisos.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (selectedSection) {
            fetchHistory();
        }
    }, [selectedSection]);

    return (
        <div className="animate-fadeIn">
            <header className="mb-8 border-b border-prolinco-secondary pb-4">
                <h1 className="text-4xl font-black text-prolinco-secondary flex items-center">
                    <ClockIcon className="h-8 w-8 mr-3 text-prolinco-primary" />
                    Auditoría y Historial de Cambios
                </h1>
                <p className="text-gray-500 mt-1">
                    Visualiza y rastrea todos los cambios realizados en el contenido estratégico.
                </p>
            </header>

            {/* Selector de Sección */}
            <div className="mb-6">
                <label htmlFor="section-select" className="block text-lg font-medium text-prolinco-dark mb-2">
                    Seleccionar Sección a Auditar:
                </label>
                <select
                    id="section-select"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-prolinco-primary focus:border-prolinco-primary transition duration-150"
                >
                    {sections.map((section) => (
                        <option key={section.key} value={section.key}>
                            {section.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Contenido del Historial */}
            <Card title={`Historial de Cambios: ${sections.find(s => s.key === selectedSection)?.name}`} icon={ClipboardListIcon} hoverEffect={false}>
                {loading && <p className="text-center py-8">Cargando historial...</p>}
                {error && <p className="text-center py-8 text-red-600 font-semibold">{error}</p>}

                {!loading && historyData.length === 0 && (
                    <p className="text-center py-8 text-gray-500 italic">
                        No se encontraron registros de cambios para la sección seleccionada.
                    </p>
                )}

                {!loading && historyData.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-prolinco-light">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campo Editado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Anterior</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nuevo Valor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editado Por</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {historyData.map((record, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-prolinco-secondary">
                                            {record.field}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 max-w-xs overflow-hidden truncate hover:whitespace-normal hover:overflow-visible">
                                            {record.oldValue}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-900 max-w-xs overflow-hidden truncate hover:whitespace-normal hover:overflow-visible">
                                            {record.newValue}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {record.changedBy?.documentNumber || 'N/A'} 
                                            <span className={`inline-block ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${record.changedBy?.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {record.changedBy?.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {moment(record.changeDate).format('YYYY-MM-DD HH:mm')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default History;