// frontend/src/components/WhatsAppFloat.jsx
import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const WhatsAppFloat = () => {
  // Número de WhatsApp de la empresa (formato internacional sin +)
  const phoneNumber = '573218043056';
  
  // Mensaje predeterminado
  const defaultMessage = 'Hola, me gustaría conocer más sobre los productos de Lacteos Prolinco';
  
  const encodedMessage = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 transition duration-300 transform hover:scale-110"
        title="Contactar por WhatsApp"
      >
        <ChatBubbleLeftRightIcon className="h-8 w-8" />
      </a>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
    </div>
  );
};

export default WhatsAppFloat;