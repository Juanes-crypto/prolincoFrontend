import React, { useState, useEffect } from "react";
import Card from "../components/Card";
import prolincoLogo from "../../public/img/logo-prolinco.jpg";

// ✅ Iconos para el nuevo diseño arquitectónico
import {
  UserCircleIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  CubeIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/solid";

const Dashboard = () => {
  // Info del usuario obtenida del localStorage
  const documentNumber = localStorage.getItem("documentNumber") || "N/A";
  const userRole = localStorage.getItem("userRole") || "invitado";
  const userRoleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  // 🆕 ESTADO PARA DATOS DINÁMICOS
  const [systemStats, setSystemStats] = useState({
    activeModules: 3, // Servicio, Talento, Admin
    systemStatus: '100%',
    totalRoles: 5, // admin, talento, servicio, basico, invitado
    totalTools: 20, // Servicio(8) + Talento(6) + Admin(6)
    activeUsers: 0, // Podrías obtener esto del backend
  });

  // 🆕 DATOS REALES DE TU PLATAFORMA
  const platformData = {
    modules: [
      { name: 'Servicio al Cliente', tools: 8, active: true },
      { name: 'Talento Humano', tools: 6, active: true },
      { name: 'Administración', tools: 6, active: true }
    ],
    roles: ['admin', 'talento', 'servicio', 'basico', 'invitado'],
    totalTools: 20 // Suma real de todas las herramientas
  };

  // 🆕 PODRÍAS CARGAR DATOS REALES DESDE TU API
  useEffect(() => {
    // Ejemplo de cómo podrías cargar datos reales
    const loadSystemStats = async () => {
      try {
        // Aquí iría tu llamada a la API
        // const response = await api.get('/system/stats');
        // setSystemStats(response.data);

        // Por ahora usamos datos estáticos pero REALES
        setSystemStats({
          activeModules: platformData.modules.filter(m => m.active).length,
          systemStatus: '100%', // Podría venir de un health check
          totalRoles: platformData.roles.length,
          totalTools: platformData.totalTools,
          activeUsers: 12, // Ejemplo: podrías obtener esto de tu DB
        });
      } catch (error) {
        console.error('Error loading system stats:', error);
      }
    };

    loadSystemStats();
  }, []);

  // Datos corporativos
  const mission = "Somos una distribuidora comprometida con ofrecer productos de calidad al detalle y al por mayor, con atención cordial, precios justos y un servicio eficiente. Apoyamos el desarrollo de Girardota mediante empleo local, relaciones comerciales sostenibles y una atención cercana al cliente.";
  const vision = "Para 2029, seremos una de las distribuidoras líderes de alimentos, bebidas y productos esenciales en Girardota, con reconocimiento por parte de la comunidad y los negocios locales. Nos diferenciaremos por una infraestructura moderna, presencia digital sólida y nuevos puntos de venta que amplíen nuestra cobertura.";
  const values = ["Calidad", "Fidelidad", "Compromiso", "Responsabilidad", "Servicio", "Innovación"];

  return (
    <div className="min-h-screen bg-white">
      {/* 🏢 NAVBAR SUPERIOR - ESTILO EMPRESARIAL */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-prolinco-primary rounded-lg flex items-center justify-center">
              <CubeIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-prolinco-dark">Plataforma Prolinco</h1>
              <p className="text-sm text-gray-500">Portal Estratégico Empresarial</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-medium text-prolinco-dark">{userRoleDisplay}</p>
              <p className="text-xs text-gray-500">Documento: {documentNumber}</p>
            </div>
            <div className="h-10 w-10 bg-prolinco-secondary rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </nav>

      {/* 🏗️ ESTRUCTURA PRINCIPAL - DISEÑO ARQUITECTÓNICO */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* 🎯 HERO SECTION - ESTRUCTURADA CON DATOS REALES */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Logo y Titular */}
            <div className="lg:col-span-5">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-white border-4 border-prolinco-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <img 
                      src={prolincoLogo}
                      alt="Prolinco"
                      className="h-12 w-auto"
                    />
                  </div>
                  <div>
                    <h1 className="text-4xl font-black text-prolinco-dark">
                      Lácteos <span className="text-prolinco-primary">Prolinco</span>
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">Distribuidora de Lácteos - Girardota</p>
                  </div>
                </div>
                
                <div className="bg-prolinco-primary/5 border border-prolinco-primary/20 rounded-xl p-4">
                  <p className="text-prolinco-dark font-medium">
                    Plataforma de gestión estratégica para la excelencia operacional
                  </p>
                </div>
              </div>
            </div>

            {/* 🆕 STATS GRID CON DATOS REALES */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <BuildingStorefrontIcon className="h-8 w-8 text-prolinco-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-prolinco-dark">{systemStats.activeModules}</p>
                  <p className="text-xs text-gray-500">Módulos Activos</p>
                  <div className="mt-1 text-xs text-green-600 font-medium">
                    {platformData.modules.map(m => m.name).join(', ')}
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <RocketLaunchIcon className="h-8 w-8 text-prolinco-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-prolinco-dark">{systemStats.systemStatus}</p>
                  <p className="text-xs text-gray-500">Operacional</p>
                  <div className="mt-1 text-xs text-green-600 font-medium">
                    ✅ Sistema Activo
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <UsersIcon className="h-8 w-8 text-prolinco-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-prolinco-dark">{systemStats.totalRoles}</p>
                  <p className="text-xs text-gray-500">Roles Sistema</p>
                  <div className="mt-1 text-xs text-blue-600 font-medium">
                    {platformData.roles.length} configurados
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                  <WrenchScrewdriverIcon className="h-8 w-8 text-prolinco-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-prolinco-dark">{systemStats.totalTools}</p>
                  <p className="text-xs text-gray-500">Herramientas</p>
                  <div className="mt-1 text-xs text-purple-600 font-medium">
                    {platformData.totalTools} disponibles
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 📊 PANEL DE ESTADO DEL USUARIO - ESTRUCTURA DEFINIDA */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-1 w-8 bg-prolinco-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-prolinco-dark">Estado del Sistema</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Perfil de Usuario */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-prolinco-primary/10 rounded-lg flex items-center justify-center">
                  <UserCircleIcon className="h-6 w-6 text-prolinco-primary" />
                </div>
                <h3 className="text-lg font-semibold text-prolinco-dark">Perfil de Usuario</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Documento</span>
                  <span className="font-mono font-bold text-prolinco-dark">{documentNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-500">Rol Asignado</span>
                  <span className="px-3 py-1 bg-prolinco-secondary/10 text-prolinco-secondary text-sm font-medium rounded-full">
                    {userRoleDisplay}
                  </span>
                </div>
              </div>
            </div>

            {/* Acceso Rápido */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-prolinco-secondary/10 rounded-lg flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-prolinco-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-prolinco-dark">Navegación</h3>
              </div>
              <div className="space-y-2">
                {platformData.modules.map((module, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`h-2 w-2 rounded-full ${
                      index === 0 ? 'bg-prolinco-primary' : 
                      index === 1 ? 'bg-prolinco-secondary' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm text-gray-700">{module.name}</span>
                    <span className="text-xs text-gray-400">({module.tools} tools)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones Prioritarias */}
            <div className="bg-prolinco-secondary border border-prolinco-secondary rounded-2xl p-6 text-white shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ClipboardDocumentCheckIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Acciones Requeridas</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm opacity-90">Complete configuración estratégica</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm opacity-90">Actualice URLs de documentos Drive</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="h-1.5 w-1.5 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm opacity-90">Revise auditoría regularmente</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🏢 IDENTIDAD CORPORATIVA - ESTRUCTURA MONGODB STYLE */}
        <section className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-1 w-8 bg-prolinco-primary rounded-full"></div>
            <h2 className="text-2xl font-bold text-prolinco-dark">Identidad Corporativa</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Misión */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-prolinco-primary/10 rounded-lg flex items-center justify-center group-hover:bg-prolinco-primary/20 transition-colors">
                  <BuildingStorefrontIcon className="h-4 w-4 text-prolinco-primary" />
                </div>
                <h3 className="text-lg font-semibold text-prolinco-dark">Misión</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-sm italic">
                  "{mission}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs font-medium text-prolinco-primary bg-prolinco-primary/10 px-2 py-1 rounded">
                  PROPÓSITO
                </span>
              </div>
            </div>

            {/* Visión */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-prolinco-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-prolinco-secondary/20 transition-colors">
                  <RocketLaunchIcon className="h-4 w-4 text-prolinco-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-prolinco-dark">Visión</h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-sm italic">
                  "{vision}"
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs font-medium text-prolinco-secondary bg-prolinco-secondary/10 px-2 py-1 rounded">
                  FUTURO 2029
                </span>
              </div>
            </div>

            {/* Valores */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-prolinco-primary/10 rounded-lg flex items-center justify-center group-hover:bg-prolinco-primary/20 transition-colors">
                  <ShieldCheckIcon className="h-4 w-4 text-prolinco-primary" />
                </div>
                <h3 className="text-lg font-semibold text-prolinco-dark">Valores</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-2 bg-white border border-prolinco-primary/20 rounded-lg hover:bg-prolinco-primary/5 transition-colors"
                  >
                    <span className="text-xs font-semibold text-prolinco-dark">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <span className="text-xs font-medium text-prolinco-primary bg-prolinco-primary/10 px-2 py-1 rounded">
                  6 PILARES
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 🎯 FOOTER ESTRUCTURADO */}
        <footer className="text-center py-8 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="h-px flex-1 bg-gray-200"></div>
              <div className="h-6 w-6 bg-prolinco-primary rounded-full flex items-center justify-center">
                <CubeIcon className="h-3 w-3 text-white" />
              </div>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <p className="text-gray-500 text-sm">
              Plataforma Estratégica Prolinco • {new Date().getFullYear()} • Girardota, Antioquia
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;