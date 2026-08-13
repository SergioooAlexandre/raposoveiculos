import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { cleanPhoneForWhatsApp } from '../utils/formatters';

interface WhatsAppButtonProps {
  vehicleModel?: string;
  customMessage?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ vehicleModel, customMessage }) => {
  const { settings } = useSiteSettings();

  const defaultMsg = vehicleModel
    ? `Olá! Tenho interesse no veículo ${vehicleModel} que vi no site da Raposo Veículos. Gostaria de receber mais informações.`
    : 'Olá! Vim pelo site da Raposo Veículos e gostaria de receber mais informações.';

  const finalMsg = customMessage || defaultMsg;
  const rawPhone = settings?.whatsapp || '5511999999999';
  const cleanPhone = cleanPhoneForWhatsApp(rawPhone);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMsg)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3.5 rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_10px_35px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-105"
    >
      <MessageCircle className="w-6 h-6 fill-current animate-bounce" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-sm font-semibold pr-1">
        WhatsApp
      </span>
    </a>
  );
};
