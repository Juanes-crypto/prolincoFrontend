// frontend/src/pages/AuditPage.jsx (COMPLETO Y CORREGIDO)

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

  // 🌟 CORRECCIÓN HOOKS: El if condicional de return debe ir antes de cualquier Hook (como useState/useEffect)
  // 🔒 Verificación de rol temprana
  if (user?.role !== "admin") {
    return (
      <div className="p-8 text-center text-xl text-red-600">
        <LockClosedIcon className="h-10 w-10 mx-auto mb-4 text-red-500" />
        Acceso denegado. Esta sección es solo para **Administradores**.
      </div>
    );
  }

  // 🌟 CORRECCIÓN HOOKS Y LÓGICA: Dejamos solo un useEffect sin la función auxiliar duplicada 🌟
  useEffect(() => {
        const fetchLogs = async () => {
        setLoading(true);
        setError(null);

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            // 🌟 CAMBIO: Usamos API.get y solo la ruta relativa
            const response = await API.get("/audit/logs", config);

            // 🌟 CORRECCIÓN DEL MAP: Aseguramos que la respuesta sea un array antes de setLogs 🌟
            if (Array.isArray(response.data)) {
                setLogs(response.data);
            } else {
                console.error("La API no devolvió un array. Usando array vacío.");
                setLogs([]);
            }
        } catch (err) {
            console.error("Error fetching audit logs:", err);
            const message =
                err.response?.status === 403
                ? "Permisos insuficientes. Solo Administradores pueden acceder."
                : "Error al cargar el historial. Asegúrate de que el backend esté corriendo.";
            setError(message);
            setLogs([]); // Aseguramos que logs sea un array vacío
        } finally {
            setLoading(false);
        }
        };

        fetchLogs();
    }, [token]);

  const formatDate = (dateString) => {
    // ... (Tu función formatDate es correcta)
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderActionBadge = (actionType) => {
    // ... (Tu función renderActionBadge es correcta)
    let color = "bg-gray-200 text-gray-800";
    let Icon = ArrowRightIcon;

    switch (actionType) {
      case "LOGIN":
        color = "bg-green-100 text-green-800";
        Icon = LockClosedIcon;
        break;
      case "USER_CREATE":
      case "ROLE_CHANGE":
        color = "bg-blue-100 text-blue-800";
        Icon = UserIcon;
        break;
      case "DOC_UPLOAD":
        color = "bg-yellow-100 text-yellow-800";
        Icon = DocumentIcon;
        break;
      case "DOC_DELETE":
        color = "bg-red-100 text-red-800";
        Icon = DocumentIcon;
        break;
      case "PASS_CHANGE":
        color = "bg-purple-100 text-purple-800";
        Icon = LockClosedIcon;
        break;
      default:
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {actionType}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-black text-gray-800 mb-6">
        Historial de Auditoría 🔒
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* ... (Resto del JSX, ahora logs es definitivamente un array [] y no dará error .map) */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Registro de Actividad del Sistema
        </h2>

        {error && (
          <div className="text-red-600 mb-4 p-3 bg-red-50 rounded">{error}</div>
        )}

        {loading ? (
          <p className="text-gray-500">Cargando eventos...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500">
            No se encontraron registros de auditoría.
          </p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Acción
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      {renderActionBadge(log.actionType)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user
                        ? `${log.user.name} (${log.user.role})`
                        : "Usuario Desconocido"}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700 max-w-lg truncate">
                      {log.description}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-400">
                      {log.ipAddress || "N/A"}
                    </td>
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
