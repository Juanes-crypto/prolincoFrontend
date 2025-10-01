// frontend/src/pages/ClientePage.jsx (Refactorizado de Service.jsx)

import React, { useState, useEffect, useCallback } from "react";

import Card from "../components/Card";

import {
  TruckIcon,
  LinkIcon,
  EnvelopeIcon,
  ChatBubbleLeftEllipsisIcon,
  PhoneIcon,
  ShareIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

import { useAuth } from "../context/AuthProvider"; // ✅ Importar useAuth para el rol

// ✅ NUEVOS IMPORTS

import EditableField from "../components/EditableField";

import EditModal from "../components/EditModal"; // Aún se necesita para editar URLs

// ✅ MOVER FUERA DEL COMPONENTE - ESTRUCTURAS ESTÁTICAS
const TOOLS_STRUCTURE = {
  preventa: [
    { name: "Volantes Digitales", key: "Volantes Digitales", icon: ShareIcon },
    { name: "Carteles Publicitarios", key: "Carteles Publicitarios", icon: ChartBarIcon },
    { name: "Formulario de Contacto", key: "Formulario de Contacto", icon: EnvelopeIcon },
  ],
  venta: [
    { name: "Volantes (Ofertas)", key: "Volantes (Ofertas)", icon: ShareIcon },
    { name: "Ciclo de Servicio", key: "Ciclo de Servicio", icon: DocumentTextIcon },
    { name: "Chat en Vivo", key: "Chat en Vivo", icon: ChatBubbleLeftEllipsisIcon },
    { name: "WhatsApp Business", key: "WhatsApp Venta", icon: PhoneIcon, type: "whatsapp" },
  ],
  postventa: [
    { name: "Estrategias de Marketing", key: "Estrategias de Marketing", icon: EnvelopeIcon },
    { name: "WhatsApp Soporte", key: "WhatsApp Soporte", icon: PhoneIcon, type: "whatsapp" },
    { name: "Instagram", key: "Instagram", icon: ShareIcon },
    { name: "Encuestas de Satisfacción", key: "Encuestas de Satisfacción", icon: ChartBarIcon },
    { name: "Sección de Soporte (PQRS)", key: "Sección de Soporte (PQRS)", icon: ChatBubbleLeftEllipsisIcon },
  ],
};

// ✅ MOVER FUERA DEL COMPONENTE - FUNCIÓN ESTÁTICA
const mapUrlsToTools = (tools, urls) =>
  tools.map((tool) => ({
    ...tool,
    url: urls[tool.key] || "#",
  }));

const ClientePage = ({ data = {}, refetch }) => {
  const { user } = useAuth();

  const isAdmin = user && user.role === "admin"; // isServiceUser ya no es necesario si asumimos que cualquier usuario puede ver el contenido // Extraer datos de texto

  const diagnostic = data.diagnostic || "";
  const specificObjective = data.specificObjective || "";

  // ✅ ESTADO INICIAL CORRECTO
  const [serviceTools, setServiceTools] = useState({
    preventa: [],
    venta: [],
    postventa: [],
  });

  // ✅ useEffect ÚNICO Y OPTIMIZADO
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setServiceTools({
        preventa: mapUrlsToTools(TOOLS_STRUCTURE.preventa, data),
        venta: mapUrlsToTools(TOOLS_STRUCTURE.venta, data),
        postventa: mapUrlsToTools(TOOLS_STRUCTURE.postventa, data),
      });
    }
  }, [data]);

  // ✅ useCallback PARA EVITAR RECREACIONES
  const [editingUrl, setEditingUrl] = useState({
    toolName: null,
    toolKey: null,
    url: "",
    currentUrl: "",
  });

  const startUrlEdit = useCallback((toolName, toolKey, currentUrl) => {
    setEditingUrl({ toolName, toolKey, url: currentUrl, currentUrl });
  }, []);

  const handleUrlUpdate = useCallback((updatedPayload) => {
    const updatedKey = Object.keys(updatedPayload)[0];
    const updatedValue = Object.values(updatedPayload)[0];

    setServiceTools(prev => ({
      preventa: prev.preventa.map(tool => 
        tool.key === updatedKey ? { ...tool, url: updatedValue } : tool
      ),
      venta: prev.venta.map(tool => 
        tool.key === updatedKey ? { ...tool, url: updatedValue } : tool
      ),
      postventa: prev.postventa.map(tool => 
        tool.key === updatedKey ? { ...tool, url: updatedValue } : tool
      ),
    }));

    if (refetch) {
      refetch();
    }
  }, [refetch]);

  const closeModal = useCallback(() => {
    setEditingUrl({ toolName: null });
  }, []);

  const renderToolButton = useCallback((tool) => {
    const isWhatsapp = tool.type === "whatsapp";
    const buttonClasses = isWhatsapp
      ? "w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
      : "w-full inline-flex items-center justify-center px-4 py-2 bg-prolinco-secondary text-white font-semibold rounded-lg hover:bg-prolinco-primary transition duration-300 shadow-md";

    return (
      <div key={tool.name}>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses}
        >
          <LinkIcon className="h-5 w-5 mr-2" />
          {isWhatsapp ? "Contactar por WhatsApp" : "Acceder a Herramienta"}
        </a>
        {isAdmin && (
          <button
            onClick={() => startUrlEdit(tool.name, tool.key, tool.url)}
            className="w-full inline-flex items-center justify-center px-4 py-1 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold"
          >
            Cambiar URL
          </button>
        )}
      </div>
    );
  }, [isAdmin, startUrlEdit]);

  return (
    <div className="animate-fadeIn relative">
      {/* Modal de Edición de URL (solo necesitamos el modal de URL) */}
      <EditModal
        type="url"
        section="Cliente"
        editingData={{ ...editingUrl, field: editingUrl.toolKey }}
        onComplete={handleUrlUpdate}
        onClose={closeModal}
      />
      {/* Diagnóstico y Objetivo (USANDO EditableField) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* 1. Diagnóstico */}
        <EditableField
          initialContent={diagnostic}
          section="Cliente"
          subsection="Diagnóstico"
          onUpdate={refetch} // Refresca los datos del padre después de guardar
        />
        {/* 2. Objetivo Específico */}
        <EditableField
          initialContent={specificObjective}
          section="Cliente"
          subsection="Objetivo Específico"
          onUpdate={refetch} // Refresca los datos del padre después de guardar
        />
      </div>
      {/* Sección de Herramientas (URLs EDITABLES) */}
      <h2 className="text-2xl font-black text-prolinco-dark mb-4 border-b border-gray-300 pb-2">
        Herramientas por Fase del Ciclo de Servicio
      </h2>
      {/* Subsecciones Preventa, Venta, Postventa */}
      {Object.keys(serviceTools).map((phase) => (
        <section key={phase} className="mb-8">
          <h3 className="text-xl font-bold text-prolinco-secondary mb-3 bg-gray-100 p-3 rounded-t-lg border-b border-prolinco-primary">
            {/* Capitalizar el nombre de la fase */}
            {phase.charAt(0).toUpperCase() + phase.slice(1)}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 bg-white rounded-b-lg shadow-inner">
            {serviceTools[phase].map((tool) => (
              <Card
                key={tool.name}
                title={tool.name}
                icon={tool.icon}
                hoverEffect={true}
              >
                {renderToolButton(tool)}
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ClientePage;
