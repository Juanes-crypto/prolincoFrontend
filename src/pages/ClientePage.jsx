// frontend/src/pages/ClientePage.jsx
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
  PencilIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthProvider";
import EditableField from "../components/EditableField";
import ToolUrlModal from "../components/ToolUrlModal"; // ✅ NUEVO IMPORT

// Estructura de herramientas
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

// Función auxiliar
const mapUrlsToTools = (tools, urls) =>
  tools.map((tool) => ({
    ...tool,
    url: urls[tool.key] || "#",
  }));

const ClientePage = ({ data = {}, refetch }) => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  const diagnostic = data.diagnostic || "";
  const specificObjective = data.specificObjective || "";

  // ✅ NUEVO ESTADO PARA TOOL MODAL
  const [editingTool, setEditingTool] = useState(null);

  // Estado para herramientas
  const [serviceTools, setServiceTools] = useState({
    preventa: [],
    venta: [],
    postventa: [],
  });

  // Sincronizar herramientas con datos
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setServiceTools({
        preventa: mapUrlsToTools(TOOLS_STRUCTURE.preventa, data),
        venta: mapUrlsToTools(TOOLS_STRUCTURE.venta, data),
        postventa: mapUrlsToTools(TOOLS_STRUCTURE.postventa, data),
      });
    }
  }, [data]);

  // ✅ NUEVA FUNCIÓN para editar herramientas
  const startToolUrlEdit = useCallback((tool) => {
    setEditingTool(tool);
  }, []);

  // ✅ NUEVA FUNCIÓN para manejar actualización exitosa
  const handleToolUrlUpdate = useCallback(() => {
    if (refetch) {
      refetch();
    }
    setEditingTool(null);
  }, [refetch]);

  // Renderizar botones de herramientas
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
            onClick={() => startToolUrlEdit(tool)}
            className="w-full inline-flex items-center justify-center px-4 py-1 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold"
          >
            <PencilIcon className="h-4 w-4 mr-1" /> Cambiar URL
          </button>
        )}
      </div>
    );
  }, [isAdmin, startToolUrlEdit]);

  return (
    <div className="animate-fadeIn relative">
      {/* ✅ NUEVO MODAL PARA HERRAMIENTAS */}
      {editingTool && (
        <ToolUrlModal
          tool={editingTool}
          section="servicio"
          onComplete={handleToolUrlUpdate}
          onClose={() => setEditingTool(null)}
        />
      )}

      {/* Diagnóstico y Objetivo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <EditableField
          initialContent={diagnostic}
          section="Cliente"
          subsection="Diagnóstico"
          onUpdate={refetch}
        />
        <EditableField
          initialContent={specificObjective}
          section="Cliente"
          subsection="Objetivo Específico"
          onUpdate={refetch}
        />
      </div>

      {/* Sección de Herramientas */}
      <h2 className="text-2xl font-black text-prolinco-dark mb-4 border-b border-gray-300 pb-2">
        Herramientas por Fase del Ciclo de Servicio
      </h2>

      {/* Subsecciones Preventa, Venta, Postventa */}
      {Object.keys(serviceTools).map((phase) => (
        <section key={phase} className="mb-8">
          <h3 className="text-xl font-bold text-prolinco-secondary mb-3 bg-gray-100 p-3 rounded-t-lg border-b border-prolinco-primary">
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