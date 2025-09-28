// frontend/src/components/Card.jsx

import React from 'react';

const Card = ({ title, icon: Icon, children, color = 'bg-white', className = '', hoverEffect = true }) => {
    
    // Determinar el color del texto principal de la tarjeta.
    // Si el fondo es oscuro (prolinco-secondary), el texto debe ser claro (white/light).
    // Para todos los demás fondos (blancos o claros), el texto debe ser oscuro.
    const isDarkBackground = color.includes('bg-prolinco-secondary') || color.includes('bg-prolinco-dark');
    const titleTextColor = isDarkBackground ? 'text-prolinco-primary' : 'text-prolinco-secondary';
    const contentTextColor = isDarkBackground ? 'text-prolinco-light' : 'text-prolinco-dark';
    const cardShadow = hoverEffect ? 'shadow-lg hover:shadow-xl' : 'shadow-md';
    
    return (
        <div className={`p-6 rounded-2xl transition duration-300 ${color} ${cardShadow} ${className}`}>
            <header className="flex items-center mb-4 border-b border-prolinco-primary/30 pb-2">
                {Icon && <Icon className={`h-7 w-7 mr-3 ${titleTextColor}`} />}
                <h3 className={`text-xl font-bold ${titleTextColor}`}>
                    {title}
                </h3>
            </header>
            
            {/* Aplica el color del texto al contenedor principal del contenido */}
            <div className={`space-y-4 text-base ${contentTextColor}`}>
                {children}
            </div>
        </div>
    );
};

export default Card;