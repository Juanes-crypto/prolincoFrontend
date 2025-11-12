// frontend/src/pages/ClientePage.jsx (VERSIÓN ARQUITECTÓNICA PREMIUM)

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  MegaphoneIcon,
  ShoppingCartIcon,
  HeartIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthProvider";
import useOperationalData from '../hooks/useOperationalData';
import EditableField from "../components/EditableField";
import EditModal from "../components/EditModal";

// 🆕 ESTRUCTURA MEJORADA CON DESCRIPCIONES Y COLORES
const TOOLS_STRUCTURE = {
  preventa: [
    { 
      name: "Volantes Digitales", 
      key: "Volantes Digitales", 
      icon: MegaphoneIcon,
      description: "Material promocional digital para captar clientes",
      color: "from-blue-500 to-cyan-500"
    },
    { 
      name: "Carteles Publicitarios", 
      key: "Carteles Publicitarios", 
      icon: ChartBarIcon,
      description: "Diseños para puntos de venta y ubicaciones estratégicas",
      color: "from-purple-500 to-indigo-500"
    },
    { 
      name: "Formulario de Contacto", 
      key: "Formulario de Contacto", 
      icon: EnvelopeIcon,
      description: "Sistema para captación de leads y contactos",
      color: "from-green-500 to-emerald-500"
    },
  ],
  venta: [
    { 
      name: "Volantes (Ofertas)", 
      key: "Volantes (Ofertas)", 
      icon: ShareIcon,
      description: "Promociones y ofertas especiales de temporada",
      color: "from-orange-500 to-red-500"
    },
    { 
      name: "Ciclo de Servicio", 
      key: "Ciclo de Servicio", 
      icon: DocumentTextIcon,
      description: "Protocolos y estándares de atención al cliente",
      color: "from-teal-500 to-blue-500"
    },
    { 
      name: "Chat en Vivo", 
      key: "Chat en Vivo", 
      icon: ChatBubbleLeftEllipsisIcon,
      description: "Atención inmediata y resolución de consultas",
      color: "from-pink-500 to-rose-500"
    },
    { 
      name: "WhatsApp Venta", 
      key: "WhatsApp Venta", 
      icon: PhoneIcon, 
      type: "whatsapp",
      description: "Canal directo para ventas y cotizaciones",
      color: "from-green-600 to-emerald-600"
    },
  ],
  postventa: [
    { 
      name: "Estrategias de Marketing", 
      key: "Estrategias de Marketing", 
      icon: EnvelopeIcon,
      description: "Campañas de fidelización y remarketing",
      color: "from-yellow-500 to-amber-500"
    },
    { 
      name: "WhatsApp Soporte", 
      key: "WhatsApp Soporte", 
      icon: PhoneIcon, 
      type: "whatsapp",
      description: "Soporte técnico y seguimiento post-venta",
      color: "from-green-500 to-teal-500"
    },
    { 
      name: "Instagram", 
      key: "Instagram", 
      icon: ShareIcon,
      description: "Presencia digital y engagement en redes sociales",
      color: "from-pink-600 to-purple-600"
    },
    { 
      name: "Encuestas de Satisfacción", 
      key: "Encuestas de Satisfacción", 
      icon: ChartBarIcon,
      description: "Medición de experiencia y calidad de servicio",
      color: "from-indigo-500 to-blue-500"
    },
    { 
      name: "Sección de Soporte (PQRS)", 
      key: "Sección de Soporte (PQRS)", 
      icon: ChatBubbleLeftEllipsisIcon,
      description: "Sistema de peticiones, quejas, reclamos y sugerencias",
      color: "from-gray-600 to-gray-700"
    },
  ],
};

// 🆕 CONFIGURACIÓN DE FASES MEJORADA
const PHASES_CONFIG = {
  preventa: {
    title: "Preventa",
    description: "Estrategias para captar y generar interés en clientes potenciales",
    icon: MegaphoneIcon,
    color: "border-blue-200 bg-blue-50",
    accent: "text-blue-700"
  },
  venta: {
    title: "Venta", 
    description: "Herramientas para el proceso de compra y cierre de ventas",
    icon: ShoppingCartIcon,
    color: "border-green-200 bg-green-50",
    accent: "text-green-700"
  },
  postventa: {
    title: "Postventa",
    description: "Seguimiento, fidelización y soporte post-compra",
    icon: HeartIcon,
    color: "border-purple-200 bg-purple-50",
    accent: "text-purple-700"
  }
};

// 🌟 CORRECCIÓN CRÍTICA: Función de mapeo mejorada
const mapToolsWithData = (tools, data) => {
  console.log('🔄 ClientePage - Mapeando herramientas con datos:', data);
  
  if (!data || !data.tools) {
    return tools.map(tool => ({
      ...tool,
      url: '#',
      isConfigured: false
    }));
  }

  return tools.map(tool => {
    const backendTool = data.tools.find(backendTool => {
      const backendName = backendTool.name.toLowerCase().replace(/\s/g, '');
      const toolName = tool.name.toLowerCase().replace(/\s/g, '');
      console.log(`🔍 ClientePage - Comparando: "${backendName}" vs "${toolName}"`);
      return backendName === toolName;
    });

    console.log(`📊 ClientePage - Herramienta "${tool.name}" encontrada:`, backendTool);
    
    return {
      ...tool,
      url: backendTool ? backendTool.url || '#' : '#',
      isConfigured: backendTool && backendTool.url && backendTool.url !== '' && backendTool.url !== '#'
    };
  });
};

const ClientePage = () => {
  // Usar hook directamente
  const { data, loading, error, refetch } = useOperationalData();

  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  const serviceData = useMemo(() => data?.servicio || {}, [data]);

  const diagnostic = serviceData.diagnostic || "";
  const specificObjective = serviceData.specificObjective || "";

  // 🌟 CORRECCIÓN: Usar el mismo estado que TalentoHumanoPage
  const [editingUrl, setEditingUrl] = useState({ toolName: null, toolKey: null, url: '' });
  const [serviceTools, setServiceTools] = useState({
    preventa: [],
    venta: [],
    postventa: [],
  });

  const serviceDataJson = JSON.stringify(serviceData || {});

  // 🌟 CORRECCIÓN: useEffect mejorado
  useEffect(() => {
    console.log('🎯 ClientePage - useEffect ejecutado con serviceData:', serviceData);
    
    if (serviceData && serviceData.tools) {
      console.log('📊 ClientePage - Tools del backend:', serviceData.tools);
      const mappedTools = {
        preventa: mapToolsWithData(TOOLS_STRUCTURE.preventa, serviceData),
        venta: mapToolsWithData(TOOLS_STRUCTURE.venta, serviceData),
        postventa: mapToolsWithData(TOOLS_STRUCTURE.postventa, serviceData),
      };
      console.log('🔄 ClientePage - Herramientas mapeadas:', mappedTools);
      setServiceTools(mappedTools);
    } else {
      console.log('📭 ClientePage - No hay datos, usando valores por defecto');
      setServiceTools({
        preventa: mapToolsWithData(TOOLS_STRUCTURE.preventa, {}),
        venta: mapToolsWithData(TOOLS_STRUCTURE.venta, {}),
        postventa: mapToolsWithData(TOOLS_STRUCTURE.postventa, {}),
      });
    }
  }, [serviceDataJson, serviceData]);

  

  // 🌟 CORRECCIÓN: Función de edición mejorada
  const startUrlEdit = useCallback((toolName, toolKey, currentUrl) => {
    console.log('🎯 ClientePage - startUrlEdit llamado:', toolName, toolKey, currentUrl);
    setEditingUrl({ toolName, toolKey, url: currentUrl });
  }, []);

  // 🌟 CORRECCIÓN CRÍTICA: handleUrlUpdate mejorado
  const handleUrlUpdate = useCallback((updatedData) => {
    console.log('🔄 ClientePage - handleUrlUpdate recibió:', updatedData);
    
    if (updatedData && updatedData.url) {
      const { toolName, toolKey, url } = updatedData;
      const newUrl = url;
      
      // Actualizar estado inmediatamente
      setServiceTools(prev => {
        const updatedTools = { ...prev };
        
        Object.keys(updatedTools).forEach(phase => {
          updatedTools[phase] = updatedTools[phase].map(tool => {
            const toolMatches = 
              tool.key === toolKey || 
              tool.name === toolName ||
              tool.name.toLowerCase().replace(/\s/g, '') === (toolName || '').toLowerCase().replace(/\s/g, '');
            
            if (toolMatches) {
              console.log(`🔄 ClientePage - Actualizando: ${tool.name} con URL: ${newUrl}`);
              return {
                ...tool,
                url: newUrl,
                isConfigured: !!newUrl && newUrl !== '' && newUrl !== '#'
              };
            }
            return tool;
          });
        });
        
        return updatedTools;
      });
    }
    
    setEditingUrl({ toolName: null, toolKey: null, url: '' });
    
    // Recargar datos después de un delay
    setTimeout(() => {
      console.log('🔄 ClientePage - Forzando recarga...');
      refetch();
    }, 500);
  }, [refetch]);

  const closeModal = useCallback(() => {
    setEditingUrl({ toolName: null, toolKey: null, url: '' });
  }, []);

  // 🆕 RENDERIZADO MEJORADO DE HERRAMIENTAS
  const renderToolButton = useCallback((tool) => {
    const isWhatsapp = tool.type === "whatsapp";
    
    return (
      <div key={tool.name} className="space-y-3">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative w-full inline-flex items-center justify-between p-4 rounded-xl transition-all duration-300 shadow-sm border ${
            tool.isConfigured
              ? isWhatsapp
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600 hover:shadow-lg hover:scale-[1.02]'
                : 'bg-prolinco-secondary text-white border-prolinco-secondary hover:bg-prolinco-primary hover:border-prolinco-primary hover:shadow-lg hover:scale-[1.02]'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }`}
          onClick={!tool.isConfigured ? (e) => e.preventDefault() : undefined}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              tool.isConfigured 
                ? isWhatsapp ? 'bg-white/20' : 'bg-white/20'
                : 'bg-gray-200'
            }`}>
              <LinkIcon className={`h-5 w-5 ${
                tool.isConfigured ? 'text-white' : 'text-gray-400'
              }`} />
            </div>
            <span className="font-semibold text-sm">
              {tool.isConfigured 
                ? (isWhatsapp ? "Contactar por WhatsApp" : "Abrir Herramienta")
                : "No Configurado"
              }
            </span>
          </div>
          {tool.isConfigured && (
            <ArrowTopRightOnSquareIcon className="h-4 w-4 opacity-90" />
          )}
        </a>
        
        {/* 🌟 CORRECCIÓN: Estado de configuración */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            tool.isConfigured 
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
          }`}>
            {tool.isConfigured ? (
              <>
                <CheckCircleIcon className="h-3 w-3" />
                <span>Configurado</span>
              </>
            ) : (
              <>
                <ExclamationCircleIcon className="h-3 w-3" />
                <span>Por Configurar</span>
              </>
            )}
          </div>
          
          {isAdmin && (
            <button
              onClick={() => startUrlEdit(tool.name, tool.key, tool.url)}
              className="inline-flex items-center px-3 py-1 text-sm text-prolinco-primary hover:text-prolinco-secondary font-medium bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              <PencilIcon className="h-4 w-4 mr-1" /> 
              {tool.isConfigured ? 'Cambiar URL' : 'Configurar URL'}
            </button>
          )}
        </div>
      </div>
    );
  }, [isAdmin, startUrlEdit]);

  // 🆕 COMPONENTE DE FASE MEJORADO
  const PhaseSection = ({ phaseKey, tools }) => {
    const phaseConfig = PHASES_CONFIG[phaseKey];
    const PhaseIcon = phaseConfig.icon;
    
    return (
      <section key={phaseKey} className="mb-12">
        {/* 🆕 HEADER DE FASE MEJORADO */}
        <div className={`rounded-2xl border-2 ${phaseConfig.color} p-6 mb-6`}>
          <div className="flex items-center space-x-4 mb-3">
            <div className={`p-3 rounded-xl ${phaseConfig.accent} bg-white shadow-sm`}>
              <PhaseIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-800">
                {phaseConfig.title}
              </h3>
              <p className="text-gray-600 mt-1">
                {phaseConfig.description}
              </p>
            </div>
            <div className="ml-auto">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${phaseConfig.accent} bg-white/80`}>
                {tools.length} herramientas
              </span>
            </div>
          </div>
        </div>

        {/* 🆕 GRID DE HERRAMIENTAS MEJORADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.name}
              title={tool.name}
              icon={tool.icon}
              hoverEffect={true}
              padding="p-5"
              className="group relative overflow-hidden"
            >
              {/* 🆕 BACKGROUND GRADIENT SUTIL */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative">
                {/* 🆕 DESCRIPCIÓN DE HERRAMIENTA */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {tool.description}
                </p>
                
                {/* BOTONES */}
                {renderToolButton(tool)}
              </div>
            </Card>
          ))}
        </div>
      </section>
    );
  };

  if (loading) return <div className="text-center p-8">Cargando Cliente...</div>;
  if (error) return <div className="text-red-600 text-center p-8">Error: {error}</div>;

  return (
    <div className="animate-fadeIn relative">
      {/* MODAL */}
      {editingUrl.toolName && (
        <EditModal
          type="url"
          section="servicio"
          editingData={{
            toolName: editingUrl.toolName,
            toolKey: editingUrl.toolKey,
            url: editingUrl.url,
            field: editingUrl.toolKey
          }}
          onComplete={handleUrlUpdate}
          onClose={closeModal}
        />
      )}

      {/* 🆕 HEADER DE PÁGINA MEJORADO */}
      <header className="mb-10">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-prolinco-primary/10 rounded-xl">
            <TruckIcon className="h-8 w-8 text-prolinco-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-prolinco-dark">
              Servicio al Cliente
            </h1>
            <p className="text-gray-600 text-lg">
              Gestión integral del ciclo completo de atención al cliente
            </p>
          </div>
        </div>

        {/* 🆕 INDICADORES DE ESTADO */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Sistema activo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">{Object.values(serviceTools).flat().length} herramientas</span>
          </div>
          {isAdmin && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-prolinco-primary rounded-full"></div>
              <span className="text-gray-600">Modo administrador</span>
            </div>
          )}
        </div>
      </header>

      {/* 🆕 DIAGNÓSTICO Y OBJETIVO MEJORADO */}
      <section className="mb-12">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-8 bg-prolinco-primary rounded-full"></div>
              <h3 className="text-xl font-bold text-prolinco-dark">Diagnóstico Actual</h3>
            </div>
            <EditableField
              initialContent={diagnostic}
              section="servicio"
              subsection="diagnostico"
              onUpdate={refetch}
            />
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-8 bg-prolinco-secondary rounded-full"></div>
              <h3 className="text-xl font-bold text-prolinco-dark">Objetivo Específico</h3>
            </div>
            <EditableField
              initialContent={specificObjective}
              section="servicio"
              subsection="Objetivos Especificos"
              onUpdate={refetch}
            />
          </div>
        </div>
      </section>

      {/* 🆕 SECCIÓN DE HERRAMIENTAS MEJORADA */}
      <section>
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-prolinco-primary to-prolinco-secondary rounded-full"></div>
          <div>
            <h2 className="text-2xl font-black text-prolinco-dark">
              Herramientas por Fase del Ciclo de Servicio
            </h2>
            <p className="text-gray-600">
              Recursos organizados por cada etapa del proceso de atención al cliente
            </p>
          </div>
        </div>

        {/* RENDERIZADO DE FASES */}
        {Object.keys(serviceTools).map((phase) => (
          <PhaseSection 
            key={phase} 
            phaseKey={phase} 
            tools={serviceTools[phase]} 
          />
        ))}
      </section>
    </div>
  );
};

export default ClientePage;