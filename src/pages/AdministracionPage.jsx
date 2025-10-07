// frontend/src/pages/AdministracionPage.jsx
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { 
  BuildingLibraryIcon, 
  LinkIcon, 
  ChartBarIcon, 
  DocumentTextIcon, 
  PencilIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthProvider';
import EditableField from '../components/EditableField';
import ToolUrlModal from '../components/ToolUrlModal'; // ✅ NUEVO IMPORT

// Estructura de herramientas para la sección Admin
const ADMIN_TOOLS_STRUCTURE = [
  { 
    name: 'Marco Legal', 
    key: 'Marco Legal', 
    icon: DocumentTextIcon,
    type: 'drive'
  },
  { 
    name: 'Matriz DOFA', 
    key: 'Matriz DOFA', 
    icon: ChartBarIcon,
    type: 'drive' 
  },
  { 
    name: 'Matriz PESTEL', 
    key: 'Matriz PESTEL', 
    icon: ChartBarIcon,
    type: 'drive' 
  },
  { 
    name: 'Matriz EFI', 
    key: 'Matriz EFI', 
    icon: ChartBarIcon,
    type: 'drive' 
  },
  { 
    name: 'Matriz EFE', 
    key: 'Matriz EFE', 
    icon: ChartBarIcon,
    type: 'drive' 
  }
];

const AdministracionPage = ({ data = {}, refetch }) => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  // Extraer datos según la estructura de tu backend
  const diagnostic = data.diagnostic || '';
  const specificObjective = data.specificObjective || '';
  const mission = data.mission || '';
  const vision = data.vision || '';
  const corporateValues = Array.isArray(data.corporateValues) ? data.corporateValues.join(', ') : '';

  // Estado para herramientas y edición
  const [adminTools, setAdminTools] = useState([]);
  const [editingTool, setEditingTool] = useState(null); // ✅ NUEVO ESTADO PARA TOOL MODAL

  // Sincronizar herramientas con datos del backend
  useEffect(() => {
    if (data && data.tools && Array.isArray(data.tools)) {
      const mappedTools = ADMIN_TOOLS_STRUCTURE.map(tool => {
        const backendTool = data.tools.find(t => t.name === tool.name);
        return {
          ...tool,
          url: backendTool?.url || '#',
          _id: backendTool?._id
        };
      });
      setAdminTools(mappedTools);
    } else {
      setAdminTools(ADMIN_TOOLS_STRUCTURE.map(tool => ({ ...tool, url: '#' })));
    }
  }, [data]);

  // Función para abrir enlaces de Drive
  const abrirDrive = (url) => {
    if (url && url !== '#' && url !== '') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('URL no configurada. Contacta al administrador.');
    }
  };

  // ✅ NUEVA FUNCIÓN para editar herramientas
  const startToolUrlEdit = (tool) => {
    setEditingTool(tool);
  };

  // ✅ NUEVA FUNCIÓN para manejar actualización exitosa
  const handleToolUrlUpdate = () => {
    if (refetch) {
      refetch();
    }
    setEditingTool(null);
  };

  // Componente para botones de herramientas
  const renderToolButton = (tool) => (
    <div className="flex flex-col space-y-2">
      <button
        onClick={() => abrirDrive(tool.url)}
        disabled={!tool.url || tool.url === '#'}
        className={`w-full inline-flex items-center justify-center px-4 py-2 font-semibold rounded-lg transition duration-300 ${
          tool.url && tool.url !== '#'
            ? 'bg-prolinco-secondary text-white hover:bg-prolinco-primary'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <LinkIcon className="h-5 w-5 mr-2" />
        {tool.url && tool.url !== '#' ? 'Abrir Documento' : 'URL no configurada'}
      </button>

      {isAdmin && (
        <button
          onClick={() => startToolUrlEdit(tool)}
          className="w-full inline-flex items-center justify-center px-4 py-1 text-sm text-prolinco-primary hover:text-prolinco-secondary font-semibold transition duration-200"
        >
          <PencilIcon className="h-4 w-4 mr-1" />
          Cambiar URL
        </button>
      )}
    </div>
  );

  return (
    <div className="animate-fadeIn relative">
      {/* ✅ NUEVO MODAL PARA HERRAMIENTAS */}
      {editingTool && (
        <ToolUrlModal
          tool={editingTool}
          section="admin"
          onComplete={handleToolUrlUpdate}
          onClose={() => setEditingTool(null)}
        />
      )}

      {/* Diagnóstico y Objetivo Específico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <EditableField
          initialContent={diagnostic}
          section="admin"
          subsection="diagnostic"
          onUpdate={refetch}
          title="Diagnóstico Administrativo"
        />
        <EditableField
          initialContent={specificObjective}
          section="admin"
          subsection="specificObjective"
          onUpdate={refetch}
          title="Objetivo Específico"
        />
      </div>

      {/* Identidad Organizacional */}
      <section className="mb-10">
        <h2 className="text-2xl font-black text-prolinco-dark mb-6 border-b border-gray-300 pb-3">
          Identidad Organizacional
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card title="Misión" icon={BuildingLibraryIcon} hoverEffect={true}>
            <EditableField
              initialContent={mission}
              section="organizacional"
              subsection="mission"
              onUpdate={refetch}
              textAreaRows={5}
              showTitle={false}
            />
          </Card>
          
          <Card title="Visión" icon={BuildingLibraryIcon} hoverEffect={true}>
            <EditableField
              initialContent={vision}
              section="organizacional"
              subsection="vision"
              onUpdate={refetch}
              textAreaRows={5}
              showTitle={false}
            />
          </Card>
          
          <Card title="Valores Corporativos" icon={BuildingLibraryIcon} hoverEffect={true}>
            <EditableField
              initialContent={corporateValues}
              section="organizacional"
              subsection="corporateValues"
              onUpdate={refetch}
              textAreaRows={5}
              showTitle={false}
              placeholder="Separar valores por comas: Calidad, Servicio, Innovación..."
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Separar cada valor con una coma
            </p>
          </Card>
        </div>
      </section>

      {/* Marco Legal y Matrices Estratégicas */}
      <section className="mb-8">
        <h2 className="text-2xl font-black text-prolinco-dark mb-6 border-b border-gray-300 pb-3">
          Marco Legal y Matrices Estratégicas
        </h2>

        {!isAdmin && adminTools.every(tool => !tool.url || tool.url === '#') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-700">
                Las herramientas aún no han sido configuradas por el administrador.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminTools.map((tool) => (
            <Card 
              key={tool.key} 
              title={tool.name} 
              icon={tool.icon}
              hoverEffect={true}
              className={!tool.url || tool.url === '#' ? 'opacity-75' : ''}
            >
              {(!tool.url || tool.url === '#') && (
                <p className="text-xs text-red-500 mb-2 text-center">
                  ⚠️ URL no configurada
                </p>
              )}
              {renderToolButton(tool)}
            </Card>
          ))}
        </div>
      </section>

      {/* Información para Administradores */}
      {isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            💡 Información para Administradores
          </h3>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Para configurar las URLs, haz clic en "Cambiar URL" en cada herramienta</li>
            <li>Las URLs deben ser enlaces públicos de Google Drive</li>
            <li>Asegúrate de que los documentos en Drive tengan permisos de "Cualquier persona con el enlace puede ver"</li>
            <li>El sistema guardará automáticamente las URLs en el array de herramientas</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdministracionPage;