import React from 'react';
import { Phone, MessageCircle, Send } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';

const MobileStickyCta: React.FC = () => {
  const cleanPhone = currentTrainer.phone.replace(/\D/g, '');
  const telHref = cleanPhone ? `tel:${cleanPhone}` : '#contact';
  const whatsappHref = cleanPhone ? `https://wa.me/${cleanPhone}` : '#contact';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur p-3">
      <div className="grid grid-cols-3 gap-2">
        <a
          href={telHref}
          className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 py-3 text-sm font-bold"
          aria-label="Zadzwon do trenera"
        >
          <Phone size={16} />
          Telefon
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 py-3 text-sm font-bold"
          aria-label="Napisz na WhatsApp"
        >
          <MessageCircle size={16} />
          WhatsApp
        </a>
        <a
          href="#contact"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 py-3 text-sm font-black text-zinc-950"
          aria-label="Przejdz do formularza"
        >
          <Send size={16} />
          Formularz
        </a>
      </div>
    </div>
  );
};

export default MobileStickyCta;
