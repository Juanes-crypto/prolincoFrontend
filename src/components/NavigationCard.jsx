// src/components/NavigationCard.jsx

import React from 'react';

// Un componente de ícono genérico para flexibilidad
const IconWrapper = ({ icon, className }) => (
    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg ${className}`}>
        {icon}
    </div>
);

const NavigationCard = ({
    icon,
    title,
    description,
    colorClass,
    statusText,
    onClick,
}) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
        >
            {/* Efecto de gradiente sutil en el fondo */}
            <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
                {/* Header de la tarjeta */}
                <div className="flex items-center space-x-5 mb-5">
                    <IconWrapper icon={icon} className={colorClass} />
                    <div>
                        <h2 className="text-2xl font-black text-prolinco-dark">
                            {title}
                        </h2>
                        <p className="text-gray-500 font-medium">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Contenido principal (placeholder o status) */}
                <div className="flex-1 mb-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                        <span className="text-sm font-semibold text-prolinco-secondary">
                            {statusText}
                        </span>
                    </div>
                </div>

                {/* Footer y botón */}
                <div className="mt-auto">
                    <button className="w-full bg-prolinco-secondary text-white font-bold py-3 px-6 rounded-xl group-hover:bg-prolinco-primary transition-colors duration-300 transform group-hover:scale-105">
                        Acceder al Módulo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NavigationCard;