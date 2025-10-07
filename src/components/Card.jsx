// frontend/src/components/Card.jsx (VERSIÓN ARQUITECTÓNICA PREMIUM)

import React from 'react';

const Card = ({ 
    title, 
    icon: Icon, 
    children, 
    color = 'bg-white', 
    className = '', 
    hoverEffect = true,
    padding = 'p-6',
    border = true,
    shadow = 'shadow-lg',
    titleSize = 'text-xl'
}) => {
    
    // 🆕 SISTEMA DE COLORES MEJORADO
    const isDarkBackground = color.includes('bg-prolinco-secondary') || color.includes('bg-prolinco-dark');
    const isPrimaryBackground = color.includes('bg-prolinco-primary');
    
    // 🆕 CONFIGURACIÓN DE COLORES BASADA EN FONDO
    const titleTextColor = isDarkBackground ? 'text-white' : 
                         isPrimaryBackground ? 'text-prolinco-dark' : 'text-prolinco-secondary';
    
    const contentTextColor = isDarkBackground ? 'text-gray-200' : 
                           isPrimaryBackground ? 'text-prolinco-dark' : 'text-gray-700';
    
    const iconBackground = isDarkBackground ? 'bg-white/20' : 
                          isPrimaryBackground ? 'bg-white/20' : 'bg-prolinco-primary/10';
    
    const iconColor = isDarkBackground ? 'text-white' : 
                     isPrimaryBackground ? 'text-prolinco-dark' : 'text-prolinco-primary';
    
    const borderColor = isDarkBackground ? 'border-white/20' : 
                       isPrimaryBackground ? 'border-prolinco-primary/30' : 'border-gray-200';
    
    // 🆕 SISTEMA DE EFECTOS MEJORADO
    const cardShadow = hoverEffect ? `${shadow} hover:shadow-2xl` : shadow;
    const hoverTransform = hoverEffect ? 'hover:scale-[1.02] hover:-translate-y-1' : '';
    const borderStyle = border ? `border ${borderColor}` : 'border-0';
    
    return (
        // 🆕 DISEÑO ARQUITECTÓNICO COHERENTE
        <div className={`
            relative rounded-2xl transition-all duration-500 ease-out 
            ${color} ${cardShadow} ${borderStyle} ${hoverTransform} ${padding} ${className}
            group overflow-hidden
        `}>
            
            {/* 🆕 EFECTO DE BACKGROUND SUTIL */}
            {!isDarkBackground && !isPrimaryBackground && (
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            )}
            
            {/* 🆕 HEADER MEJORADO CON DISEÑO ESTRUCTURADO */}
            <header className={`relative flex items-center mb-5 pb-4 ${border ? 'border-b ' + borderColor : ''}`}>
                {/* 🆕 ICON BOX ARQUITECTÓNICO */}
                {Icon && (
                    <div className={`
                        flex items-center justify-center rounded-xl p-3 mr-4 transition-all duration-300
                        ${iconBackground} ${iconColor}
                        group-hover:scale-110 group-hover:rotate-3
                    `}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
                
                {/* 🆕 TÍTULO CON MEJOR JERARQUÍA */}
                <div className="flex-1 min-w-0">
                    <h3 className={`
                        font-bold leading-tight tracking-tight
                        ${titleTextColor} ${titleSize}
                        group-hover:translate-x-1 transition-transform duration-300
                    `}>
                        {title}
                    </h3>
                    
                    {/* 🆕 LÍNEA DECORATIVA */}
                    <div className={`
                        h-0.5 w-8 mt-2 rounded-full transition-all duration-500
                        ${isDarkBackground ? 'bg-prolinco-primary' : 
                          isPrimaryBackground ? 'bg-prolinco-dark' : 'bg-prolinco-secondary'}
                        group-hover:w-12
                    `}></div>
                </div>
                
                {/* 🆕 INDICADOR DE HOVER */}
                <div className={`
                    opacity-0 transform translate-x-2 transition-all duration-300
                    ${isDarkBackground ? 'text-prolinco-primary' : 
                      isPrimaryBackground ? 'text-prolinco-dark' : 'text-prolinco-secondary'}
                    group-hover:opacity-100 group-hover:translate-x-0
                `}>
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
            </header>
            
            {/* 🆕 CONTENIDO CON MEJOR ESPACIADO Y TIPOGRAFÍA */}
            <div className={`
                relative space-y-4 leading-relaxed transition-colors duration-300
                ${contentTextColor}
            `}>
                {children}
            </div>
            
            {/* 🆕 EFECTO DE BORDE DINÁMICO */}
            <div className={`
                absolute inset-0 rounded-2xl border-2 pointer-events-none transition-all duration-500
                ${isDarkBackground ? 'border-prolinco-primary/20' : 
                  isPrimaryBackground ? 'border-prolinco-dark/20' : 'border-prolinco-secondary/20'}
                opacity-0 group-hover:opacity-100
            `}></div>
        </div>
    );
};

// 🆕 COMPONENTES ESPECIALIZADOS PARA CASOS DE USO COMUNES
export const StatsCard = ({ title, value, description, icon: Icon, trend, className = '' }) => (
    <Card 
        title={title}
        icon={Icon}
        className={`text-center ${className}`}
        padding="p-5"
        hoverEffect={true}
    >
        <div className="space-y-3">
            <div className="text-3xl font-black text-prolinco-dark">
                {value}
            </div>
            <div className="text-sm text-gray-600">
                {description}
            </div>
            {trend && (
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    trend > 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                }`}>
                    {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
                </div>
            )}
        </div>
    </Card>
);

export const ActionCard = ({ title, description, icon: Icon, action, actionText, className = '' }) => (
    <Card 
        title={title}
        icon={Icon}
        className={`cursor-pointer ${className}`}
        padding="p-5"
        hoverEffect={true}
    >
        <div className="space-y-3">
            <p className="text-sm text-gray-600 leading-relaxed">
                {description}
            </p>
            <button 
                onClick={action}
                className="w-full bg-prolinco-primary text-prolinco-dark font-semibold py-2 px-4 rounded-lg hover:bg-prolinco-primary/90 transition-colors duration-300"
            >
                {actionText}
            </button>
        </div>
    </Card>
);

export const InfoCard = ({ title, items, icon: Icon, className = '' }) => (
    <Card 
        title={title}
        icon={Icon}
        className={className}
        padding="p-5"
    >
        <div className="space-y-2">
            {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="text-sm font-semibold text-prolinco-dark">{item.value}</span>
                </div>
            ))}
        </div>
    </Card>
);

export default Card;