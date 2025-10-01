// frontend/src/pages/FilesPage.jsx

import React, { useState, useEffect } from "react"; 
import DocumentUpload from "../components/DocumentUpload";
import { API } from '../api/api';
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/solid"; 
// ✅ NUEVA IMPORTACIÓN: Importar el hook para acceder al usuario y su rol
import { useAuth } from '../context/AuthProvider'; 
const FilesPage = () => {
  // ✅ NUEVO USO: Obtener el usuario del contexto
  const { user } = useAuth();
    
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");
    
  // ✅ NUEVA LÓGICA: Determinar si el usuario es administrador
  const isAdmin = user && user.role === 'admin';

  // Función para obtener los documentos
  const fetchDocuments = async () => {
    if (!token) {
      setError("Sesión no válida. Inicie sesión.");
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await API.get("/documents", config);
      
      setDocuments(response.data);
      setError("");
    } catch (err) {
      console.error("Error al cargar documentos:", err);
      setError(
        "Fallo al cargar los documentos. Verifique su conexión y permisos."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ EFECTO: Cargar documentos al montar el componente
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Función que se pasa al componente de subida para refrescar la lista
  const handleUploadSuccess = () => {
    fetchDocuments(); // Recargar la lista después de una subida exitosa
  };

  const handleDownloadDocument = async (documentId, fileName) => {
    if (!token) {
      alert("Sesión expirada. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await API({
        url: `/documents/${documentId}/download`, 
        method: "GET",
        responseType: "blob", 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); 
      document.body.appendChild(link);
      link.click(); 
      link.remove();
      window.URL.revokeObjectURL(url); 
    } catch (error) {
      console.error("Error al descargar el documento:", error);
      alert(
        "Fallo la descarga del documento. Puede que el archivo haya sido eliminado del servidor."
      );
    }
  };

  const handleDeleteDocument = async (documentId, fileName) => {
    // La lógica de eliminación permanece igual, pero el botón solo se muestra a admins.
    if (!token) {
      alert("Sesión expirada. Por favor, inicia sesión.");
      return;
    }

    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el documento "${fileName}"? Esta acción es irreversible.`
      )
    ) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await API.delete(`/documents/${documentId}`, config);

      fetchDocuments();

      alert(`Documento "${fileName}" eliminado con éxito.`);
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Fallo al eliminar el documento. Verifique permisos o conexión.";
      alert(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-CO");
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-black text-gray-800 mb-6">
        Gestión de Archivos y Documentos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna de Subida: NOTA: Podrías querer ocultar esto también si user.role !== 'admin' */}
        <div className="lg:col-span-1">
          {/* Aquí podrías añadir {isAdmin && <DocumentUpload ... />} */}
          <DocumentUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Columna de Listado */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Documentos Recientes
            </h2>

            {error && <div className="text-red-600 mb-4">{error}</div>}
            {loading ? (
              <p className="text-gray-500">Cargando documentos...</p>
            ) : documents.length === 0 ? (
              <p className="text-gray-500">No hay documentos subidos aún.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* ... (encabezados de tabla) ... */}
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subido Por
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc._id}>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
                          {doc.fileName}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.category}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.uploadedBy.name || "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(doc.createdAt)}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                          {/* Botón de Descarga (siempre visible para autenticados) */}
                          <button
                            onClick={() =>
                              handleDownloadDocument(doc._id, doc.fileName)
                            }
                            className="text-prolinco-primary hover:text-prolinco-dark transition-colors mr-3"
                            title="Descargar"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>

                          {/* 🛑 APLICACIÓN DE LA RECOMENDACIÓN: SOLO MOSTRAR SI ES ADMIN */}
                          {isAdmin && (
                            <button
                              onClick={() =>
                                handleDeleteDocument(doc._id, doc.fileName)
                              } 
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Eliminar"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesPage;