// frontend/src/pages/Dashboard.jsx

import React from "react";
import Card from "../components/Card";

// ✅ Importamos SOLO los iconos que se usan en el cuerpo del componente (Versión 2/3)
import {
  HomeIcon,
  UserCircleIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";

const Dashboard = () => {
  // Info del usuario obtenida del localStorage
  const documentNumber = localStorage.getItem("documentNumber") || "N/A";
  // Nota: userRole se usa para mostrar/ocultar elementos, aquí solo para display.
  const userRole = localStorage.getItem("userRole") || "invitado";
  const userRoleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  // Simulación de Misión/Visión/Valores para la landing
  const mission =
    "Somos una distribuidora comprometida con ofrecer productos de calidad al detalle y al por mayor, con atención cordial, precios justos y un servicio eficiente. Apoyamos el desarrollo de Girardota mediante empleo local, relaciones comerciales sostenibles y una atención cercana al cliente.";
  const vision =
    "Para 2029, seremos una de las distribuidoras líderes de alimentos, bebidas y productos esenciales en Girardota, con reconocimiento por parte de la comunidad y los negocios locales. Nos diferenciaremos por una infraestructura moderna, presencia digital sólida y nuevos puntos de venta que amplíen nuestra cobertura.";
  const values = [
    "Calidad",
    "Fidelidad",
    "Compromiso",
    "Responsabilidad",
    "Servicio",
    "Innovación",
  ];

  return (
    <div className="animate-fadeIn">
      {/* 🆕 CAMBIO: Header con imagen corporativa en lugar de texto */}
      <header className="mb-10 border-b-4 border-prolinco-primary pb-4">
        <div className="flex justify-center mb-4">
          {/* 
            🖼️ Reemplaza la ruta con la imagen corporativa de Prolinco 
            Por ahora, usamos un placeholder. Puedes poner la imagen en la carpeta public/images/
          */}
          <img 
            src="/public/img/logo-prolinco.jpg" // Cambia esta ruta por la correcta
            alt="Lácteos Prolinco - Identidad Corporativa"
            className="h-32 w-auto"
          />
        </div>
        <p className="text-xl text-gray-600 text-center">
          Portal Estratégico de Intervención Empresarial
        </p>
      </header>

      {/* Tarjeta de Perfil Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card
          title="Perfil de Usuario"
          icon={UserCircleIcon}
          color="bg-prolinco-secondary text-white"
        >
          <p>
            Documento:{" "}
            <span className="font-bold text-prolinco-primary">
              {documentNumber}
            </span>
          </p>
          <p>
            Rol Asignado:{" "}
            <span className="font-bold text-prolinco-primary">
              {userRoleDisplay}
            </span>
          </p>
        </Card>

        <Card title="Acceso Rápido" icon={ClockIcon}>
          <p className="text-sm text-gray-500">
            Usa el menú lateral para navegar por las secciones: **Servicio al
            Cliente**, **Talento Humano** y **Administración**.
          </p>
        </Card>

        <Card title="Próximas Tareas" icon={ClipboardDocumentCheckIcon}>
          <p className="text-sm text-gray-500 italic">
            Administrador: Ingrese la Misión, Visión y URLs de Drive en la
            sección Administración.
          </p>
        </Card>
      </div>

      {/* Identidad de la Empresa */}
      <h2 className="text-3xl font-black text-prolinco-dark mb-5 border-b border-gray-300 pb-2">
        Nuestra Identidad Corporativa
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Misión */}
        <Card title="Misión" color="bg-prolinco-secondary text-white">
          <p className="text-sm italic">{mission}</p>
        </Card>

        {/* Visión */}
        <Card title="Visión" color="bg-prolinco-secondary text-white">
          <p className="text-sm italic">{vision}</p>
        </Card>

        {/* Valores */}
        <Card
          title="Valores Corporativos"
          color="bg-prolinco-secondary text-white"
        >
          <div className="flex flex-wrap gap-2 mt-1">
            {values.map((value, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-prolinco-primary text-prolinco-dark text-xs font-bold rounded-full"
              >
                {value}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;