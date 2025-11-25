// frontend/src/pages/FilesPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { API } from '../api/api';
import { useAuth } from '../context/AuthProvider';
import {
  TrashIcon,
  DocumentIcon,
  ArrowDownTrayIcon,
  EyeIcon,
} from '@heroicons/react/24/solid';

const DocumentRow = React.memo(({ doc, canEdit, onDelete, isOfficeFile }) => {
  const isOffice = isOfficeFile(doc.originalName);

  const finalUrl = useMemo(() => {
    if (!doc.path) return '#';
    return isOffice
      ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
          doc.path
        )}`
      : doc.path;
  }, [doc.path, isOffice]);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <DocumentIcon className="h-8 w-8 text-gray-400" />
          <span className="font-medium text-gray-800">{doc.originalName}</span>
        </div>
      </td>
      <td className="p-4 text-sm text-gray-500 truncate max-w-[150px]">
        {doc.mimetype}
      </td>
      <td className="p-4 text-sm text-gray-500">
        {doc.uploadedBy?.documentNumber || 'Desconocido'}
      </td>
      <td className="p-4 text-sm text-gray-500">
        {new Date(doc.createdAt).toLocaleDateString()}
      </td>
      <td className="p-4 text-right space-x-2">
        <a
          href={finalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex p-2 rounded-lg transition-colors ${
            isOffice
              ? 'text-green-600 hover:bg-green-50'
              : 'text-blue-500 hover:bg-blue-50'
          }`}
        >
          {isOffice ? (
            <EyeIcon className="h-5 w-5" />
          ) : (
            <ArrowDownTrayIcon className="h-5 w-5" />
          )}
        </a>
        {canEdit && (
          <button
            onClick={() => onDelete(doc._id)}
            className="inline-flex p-2 text-red-400 hover:bg-red-50 rounded-lg"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </td>
    </tr>
  );
});

const FilesPage = () => {
  const { user } = useAuth();
  const canEdit = ['admin', 'talento'].includes(user?.role);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await API.get('/documents');
      setDocuments(res.data);
    } catch (error) {
      console.error('Error al cargar documentos', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(true);

      const tempDoc = {
        _id: 'temp-' + Date.now(),
        originalName: file.name,
        mimetype: file.type,
        createdAt: new Date().toISOString(),
        uploadedBy: { documentNumber: user?.documentNumber || 'Tú' },
        path: null,
      };

      setDocuments((prev) => [tempDoc, ...prev]); // Optimistic UI

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await API.post('/documents', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setDocuments((prev) =>
          prev.map((d) => (d._id === tempDoc._id ? res.data : d))
        );
      } catch (error) {
        alert('Error al subir archivo');
        setDocuments((prev) => prev.filter((d) => d._id !== tempDoc._id));
      } finally {
        setUploading(false);
        e.target.value = null;
      }
    },
    [user]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!confirm('¿Seguro que deseas eliminar este documento?')) return;

      const docToDelete = documents.find((d) => d._id === id);
      setDocuments((prev) => prev.filter((d) => d._id !== id)); // Optimistic UI

      try {
        await API.delete(`/documents/${id}`);
      } catch (error) {
        alert('Error al eliminar');
        if (docToDelete) setDocuments((prev) => [docToDelete, ...prev]);
      }
    },
    [documents]
  );

  const isOfficeFile = useCallback((filename) => {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return (
      lower.endsWith('.xlsx') ||
      lower.endsWith('.xls') ||
      lower.endsWith('.doc') ||
      lower.endsWith('.docx')
    );
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-700">Gestión de Archivos</h1>
        {canEdit && (
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            {uploading ? 'Subiendo...' : 'Subir archivo'}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando documentos...</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Nombre
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Tipo
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Subido por
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-600">
                Fecha
              </th>
              <th className="p-4 text-right text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc._id}
                doc={doc}
                canEdit={canEdit}
                onDelete={handleDelete}
                isOfficeFile={isOfficeFile}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FilesPage;