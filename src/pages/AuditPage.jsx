// frontend/src/pages/AuditPage.jsx (VERSIÓN FINAL CORREGIDA)

import React, { useEffect, useState, useContext } from "react";
import { API } from '../api/api'; 
import { AuthContext } from "../context/AuthContextDefinition";
import {
    LockClosedIcon,
    DocumentIcon,
    UserIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/solid";

const AuditPage = () => {
    const { user, token } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✨ CORRECCIÓN: Todos los hooks (useState, useEffect, etc.) se declaran JUNTOS al principio del componente.
    useEffect(() => {
        // No hacemos nada si el usuario no es admin o si no hay token.
        // La propia vista ya mostrará el mensaje de "Acceso denegado".
        if (user?.role !== "admin" || !token) {
            setLoading(false);
            return;
        }

        const fetchLogs = async () => {
            setLoading(true);
            setError(null);

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await API.get("/audit/logs", config);

                if (Array.isArray(response.data)) {
                    setLogs(response.data);
                } else {
                    console.error("La respuesta de la API no es un array. Se usará un array vacío.");
                    setLogs([]);
                }
            } catch (err) {
                console.error("Error al obtener los registros de auditoría:", err);
                const message =
                    err.response?.status === 403
                    ? "Permisos insuficientes. Solo los Administradores pueden acceder a esta sección."
                    : "No se pudo cargar el historial. Verifica que el servidor backend esté funcionando.";
                setError(message);
                setLogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [user, token]); // Añadimos 'user' como dependencia para que se re-evalue si el usuario cambia.

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("es-CO", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderActionBadge = (actionType) => {
        let color = "bg-gray-200 text-gray-800";
        let Icon = ArrowRightIcon;

        switch (actionType) {
            case "LOGIN": color = "bg-green-100 text-green-800"; Icon = LockClosedIcon; break;
            case "USER_CREATE":
            case "ROLE_CHANGE": color = "bg-blue-100 text-blue-800"; Icon = UserIcon; break;
            case "CONTENT_UPDATE": color = "bg-yellow-100 text-yellow-800"; Icon = DocumentIcon; break;
            case "PASS_CHANGE": color = "bg-purple-100 text-purple-800"; Icon = LockClosedIcon; break;
            default: break;
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                <Icon className="h-3 w-3 mr-1.5" />
                {actionType.replace('_', ' ')}
            </span>
        );
    };
    
    // 🔒 Ahora la comprobación de rol se hace aquí, después de declarar todos los hooks.
    if (user?.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <LockClosedIcon className="h-12 w-12 mx-auto mb-4 text-red-400" />
                <h2 className="text-2xl font-bold text-red-700">Acceso Denegado</h2>
                <p className="mt-2 text-gray-600">
                    Esta sección está reservada exclusivamente para usuarios con rol de **Administrador**.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 animate-fadeIn">
            <header className="mb-8">
                <h1 className="text-4xl font-black text-prolinco-dark">Historial de Auditoría</h1>
                <p className="text-lg text-gray-600 mt-1">Registro de todas las acciones importantes realizadas en el sistema.</p>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Registro de Actividad del Sistema</h2>
                
                {error && (<div className="text-red-700 mb-4 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>)}

                {loading ? (
                    <p className="text-gray-500 py-4">Cargando eventos, por favor espera...</p>
                ) : logs.length === 0 ? (
                    <div className="text-center py-10">
                        <DocumentIcon className="h-12 w-12 mx-auto text-gray-300" />
                        <h3 className="mt-2 text-lg font-medium text-gray-800">No hay registros</h3>
                        <p className="mt-1 text-gray-500">Aún no se han registrado actividades en el sistema.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto mt-4 border border-gray-200 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo de Acción</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección IP</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">{formatDate(log.createdAt)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">{renderActionBadge(log.actionType)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{log.user ? `${log.user.name} (${log.user.role})` : "Sistema"}</td>
                                        <td className="px-4 py-4 text-sm text-gray-800 max-w-md truncate" title={log.description}>{log.description}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditPage;