// frontend/src/pages/Admin.jsx (VERSIÓN REFACTORIZADA)

import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import {
  ShieldCheckIcon,
  Cog6ToothIcon,
  ClipboardDocumentCheckIcon,
  LinkIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/solid";
import { API } from "../api/api";
// *** NUEVO IMPORT ***
import EditModal from "../components/EditModal";

const Admin = () => {
  const [content, setContent] = useState({ organizational: {}, admin: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // *** ESTADO UNIFICADO DE EDICIÓN ***
  const [editingText, setEditingText] = useState({
    section: null,
    field: null,
    value: "",
  });
  const [editingUrl, setEditingUrl] = useState({
    toolName: null,
    toolKey: null,
    url: "",
    currentUrl: "",
  });

  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";

  // Datos de las herramientas (las URLs vendrán del backend)
  const initialTools = [
    { name: "Marco Legal", key: "marcoLegalUrl", icon: DocumentTextIcon },
    { name: "Matriz DOFA", key: "dofaUrl", icon: DocumentTextIcon },
    { name: "Matriz PESTEL", key: "pestelUrl", icon: DocumentTextIcon },
    { name: "Matriz EFI", key: "efiUrl", icon: DocumentTextIcon },
    { name: "Matriz EFE", key: "efeUrl", icon: DocumentTextIcon },
  ];

  const [adminTools, setAdminTools] = useState(initialTools);

  // Lógica de Carga Inicial
  const fetchContent = async () => {
    setLoading(true);
    try {
      const orgResponse = await API.get("/content/organizacional");
      const adminResponse = await API.get("/content/admin");

      const urls = adminResponse.data;

      setAdminTools(
        initialTools.map((tool) => ({
          ...tool,
          url: urls[tool.key] || "#",
        }))
      );

      setContent({
        organizational: orgResponse.data,
        admin: adminResponse.data,
      });
      setError(null);
    } catch (_err) {
      setError(
        "Error al cargar el contenido. Asegúrate de que el backend esté activo y el token sea válido."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // ----------------------------------------------------
  // *** FUNCIONES DE INICIO Y ACTUALIZACIÓN REUTILIZABLES ***
  // ----------------------------------------------------

  const startTextEdit = (section, field, initialValue) => {
    setEditingText({
      section,
      field,
      value: Array.isArray(initialValue)
        ? initialValue.join(", ")
        : initialValue,
    });
    setEditingUrl({ toolName: null }); // Cerrar el modal de URL
  };

  const startUrlEdit = (toolName, toolKey, currentUrl) => {
    setEditingUrl({ toolName, toolKey, url: currentUrl, currentUrl });
    setEditingText({ field: null }); // Cerrar el modal de Texto
  };

  // Función que se llama DESPUÉS de que el modal haya guardado con éxito
  const handleContentUpdate = (updatedPayload) => {
    const updatedKey = Object.keys(updatedPayload)[0];
    const updatedValue = Object.values(updatedPayload)[0];

    // Determinar qué sección actualizar
    const sectionToUpdate = editingText.section || "admin"; // Asumimos 'admin' si es URL o texto de admin

    if (sectionToUpdate === "organizacional") {
      setContent((prev) => ({
        ...prev,
        organizational: { ...prev.organizational, ...updatedPayload },
      }));
    } else if (sectionToUpdate === "admin") {
      setContent((prev) => ({
        ...prev,
        admin: { ...prev.admin, ...updatedPayload },
      }));
    }

    // Si se actualizó una URL, actualizamos el estado de las herramientas
    if (adminTools.some((tool) => tool.key === updatedKey)) {
      setAdminTools((prevTools) =>
        prevTools.map((tool) =>
          tool.key === updatedKey ? { ...tool, url: updatedValue } : tool
        )
      );
    }
  };

  // Función para cerrar ambos modales
  const closeModal = () => {
    setEditingText({ section: null, field: null, value: "" });
    setEditingUrl({ toolName: null, url: "", currentUrl: "" });
  };

  // Componente auxiliar para el botón de herramienta
  const renderToolButton = (tool) => (
    <>
      <p className="text-sm text-gray-500 mb-3 truncate">URL: {tool.url}</p>
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center px-4 py-2 mb-2 bg-prolinco-secondary text-white font-semibold rounded-lg hover:bg-prolinco-primary hover:text-prolinco-dark transition duration-300 shadow-md"
      >
        <LinkIcon className="h-5 w-5 mr-2" />
        Abrir Documento
      </a>

      {isAdmin && (
        <button
          onClick={() => startUrlEdit(tool.name, tool.key, tool.url)}
          className="w-full inline-flex items-center justify-center px-4 py-1 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold"
        >
          <PencilIcon className="h-4 w-4 mr-1" /> Cambiar URL
        </button>
      )}
    </>
  );

  if (loading && !editingText.field && !editingUrl.toolName)
    return (
      <div className="text-prolinco-secondary text-center p-10 font-semibold">
        Cargando contenido estratégico...
      </div>
    );
  if (error && !editingText.field && !editingUrl.toolName)
    return (
      <div className="text-red-600 text-center p-10 font-semibold">{error}</div>
    );

  return (
    <div className="animate-fadeIn relative">
      {/* *** REEMPLAZO DE LOS MODALES DUPLICADOS POR EL NUEVO COMPONENTE *** */}
      <EditModal
        type="text"
        // La sección viene del estado de edición de texto (organizacional o admin)
        section={editingText.section}
        editingData={editingText}
        onComplete={handleContentUpdate}
        onClose={closeModal}
      />
      <EditModal
        type="url"
        section="admin" // La sección para URLs siempre es 'admin' en esta vista
        editingData={{ ...editingUrl, field: editingUrl.toolKey }} // Renombramos toolKey a field
        onComplete={handleContentUpdate}
        onClose={closeModal}
      />

      <header className="mb-8 border-b border-prolinco-secondary pb-4">
        <h1 className="text-4xl font-black text-prolinco-secondary flex items-center">
          <ShieldCheckIcon className="h-8 w-8 mr-3 text-prolinco-primary" />
          Administración / Plataforma Estratégica
        </h1>
        <p className="text-gray-500 mt-1">
          Gestión del diagnóstico general y los documentos fundamentales de la
          empresa.
        </p>
      </header>

      {/* Diagnóstico, Objetivo e Identidad Organizacional (TEXTO EDITABLE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* 1. Diagnóstico */}
        <Card title="Diagnóstico General" icon={Cog6ToothIcon}>
          <p className="whitespace-pre-line">
            {content.admin.diagnostic || "No definido."}
          </p>
          {isAdmin && (
            <button
              onClick={() =>
                startTextEdit(
                  "admin",
                  "diagnostic",
                  content.admin.diagnostic || ""
                )
              }
              className="mt-4 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-1" /> Editar
            </button>
          )}
        </Card>

        {/* 2. Objetivo Específico */}
        <Card title="Objetivo Específico" icon={ClipboardDocumentCheckIcon}>
          <p className="whitespace-pre-line">
            {content.admin.specificObjective || "No definido."}
          </p>
          {isAdmin && (
            <button
              onClick={() =>
                startTextEdit(
                  "admin",
                  "specificObjective",
                  content.admin.specificObjective || ""
                )
              }
              className="mt-4 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-1" /> Editar
            </button>
          )}
        </Card>

        {/* 3. Identidad Organizacional */}
        <Card
          title="Identidad Organizacional"
          color="bg-prolinco-secondary text-prolinco-light"
          hoverEffect={false}
        >
          <h4 className="font-bold text-prolinco-primary mt-2">Misión:</h4>
          <p className="text-sm italic">
            {content.organizational.mission || "No definida."}
          </p>

          <h4 className="font-bold text-prolinco-primary mt-4">Visión:</h4>
          <p className="text-sm italic">
            {content.organizational.vision || "No definida."}
          </p>

          <h4 className="font-bold text-prolinco-primary mt-4">Valores:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {(content.organizational.corporateValues || []).map(
              (value, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-prolinco-dark text-prolinco-primary text-xs font-medium rounded-full"
                >
                  {value}
                </span>
              )
            )}
          </div>
          {isAdmin && (
            // Usamos la misión para disparar la edición de todo el bloque
            <button
              onClick={() =>
                startTextEdit(
                  "organizacional",
                  "corporateValues",
                  content.organizational.corporateValues || []
                )
              }
              className="mt-4 text-sm text-prolinco-primary hover:text-yellow-200 font-semibold flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-1" /> Editar Valores
            </button>
          )}
          {/* Botón para Misión/Visión, puedes agregar otro si necesitas editar solo esos: */}
          {isAdmin && (
            <button
              onClick={() =>
                startTextEdit(
                  "organizacional",
                  "mission",
                  content.organizational.mission || ""
                )
              }
              className="mt-2 text-sm text-prolinco-primary hover:text-yellow-200 font-semibold flex items-center"
            >
              <PencilIcon className="h-4 w-4 mr-1" /> Editar Misión
            </button>
          )}
        </Card>
      </div>

      {/* Sección de Herramientas (URLs EDITABLES) */}
      <h2 className="text-2xl font-black text-prolinco-dark mb-4 border-b border-gray-300 pb-2">
        Herramientas y Matrices Estratégicas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminTools.map((tool, index) => (
          <Card key={index} title={tool.name} icon={tool.icon}>
            {renderToolButton(tool)}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;
