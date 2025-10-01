// frontend/src/components/Sidebar.jsx (COMPLETO Y CORREGIDO)

import React, { useContext } from 'react'; // 🌟 Importar useContext
import { NavLink } from 'react-router-dom';
import { 
    TruckIcon, 
    UsersIcon, 
    HomeIcon, 
    DocumentTextIcon, 
    ClockIcon, 
    ArrowLeftOnRectangleIcon,
    ChartBarIcon
} from '@heroicons/react/24/solid'; 

// 🌟 Importar el contexto 🌟
import { AuthContext } from '../context/AuthContextDefinition'; 

// Definición de ítems de navegación con roles permitidos
const navItems = [
    // La ruta del Dashboard (/) necesita la propiedad 'end' para coincidencia exacta
    { name: 'Dashboard', path: '/', icon: HomeIcon, role: ['admin', 'talento', 'servicio', 'basico', 'invitado',] },
    { name: 'Plataforma Estratégica', path: '/plataforma', icon: ChartBarIcon, role: ['admin', 'talento', 'servicio'] },
    
    // Módulos
    { name: 'Servicio al Cliente', path: '/servicio', icon: TruckIcon, role: ['admin', 'servicio'] },
    { name: 'Talento Humano', path: '/talento-humano', icon: UsersIcon, role: ['admin', 'servicio', 'basico', 'talento'] },
    { name: 'Gestión de Archivos', path: '/archivos', icon: DocumentTextIcon, role: ['admin', 'talento', 'servicio'] },
    
    // Administración y Auditoría (Solo para Admin)
    { name: 'Gestión de Usuarios', path: '/usuarios', icon: UsersIcon, role: ['admin'] },
    { name: 'Auditoría / Historial', path: '/auditoria', icon: ClockIcon, role: ['admin'] },
];

const Sidebar = () => {
    // 🌟 CAMBIO CLAVE: Obtener el usuario y la función logout del contexto 🌟
    const { user, logout } = useContext(AuthContext); 
    
    // Obtenemos el rol del estado global. Si no hay usuario, es 'invitado'.
    const userRole = user?.role || 'invitado';

    const handleLogout = () => {
        // Usamos la función de logout del contexto (limpia localStorage y estado)
        logout(); 
        // El router se encargará de redirigir al /login después de la actualización del estado.
    };
    
    // Función para renderizar el enlace de navegación con un diseño atractivo
    const NavItem = ({ item }) => (
        <NavLink
            to={item.path}
            // 🌟 CORRECCIÓN DE RUTA: Aplicar 'end: true' solo a la ruta raíz '/' 🌟
            {...(item.path === '/' ? { end: true } : {})}
            
            // Clases de Tailwind para un diseño interactivo y vibrante
            className={({ isActive }) => 
                `flex items-center p-3 rounded-xl transition duration-200 group 
                ${isActive 
                    ? 'bg-prolinco-primary text-prolinco-dark font-bold shadow-lg transform translate-x-1' 
                    : 'text-prolinco-light hover:bg-prolinco-dark/70 hover:shadow-md'
                }`
            }
        >
            <item.icon className="h-6 w-6 mr-3 transition-colors duration-200" />
            <span className="text-sm font-medium">{item.name}</span>
        </NavLink>
    );
    
    return (
        // Usamos una clase fija para el sidebar
        <div className="w-64 bg-prolinco-secondary shadow-2xl p-4 flex flex-col justify-between z-10">
            {/* Header del Sidebar */}
            <div>
                <div className="text-prolinco-primary text-2xl font-black mb-10 border-b-2 border-prolinco-primary/50 pb-4">
                    LACTEOS PROLINCO
                </div>
                
                {/* Ítems de Navegación */}
                <nav className="space-y-3">
                    {navItems
                        // Filtramos para mostrar solo los enlaces que correspondan al rol del usuario
                        .filter(item => item.role.includes(userRole))
                        .map((item) => (
                            <NavItem key={item.name} item={item} />
                        ))}
                </nav>
            </div>
            
            {/* Pie de página con botón de Logout */}
            <div className="pt-6 border-t border-prolinco-dark/50">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 rounded-xl transition duration-200 text-red-400 hover:bg-red-900/50"
                >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 mr-3" />
                    <span className="text-sm font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;