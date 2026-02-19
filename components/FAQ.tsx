import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Czy muszę chodzić na siłownię?",
      a: "Nie. Układam plany treningowe również do wykonania w domu, z minimalnym sprzętem lub masą własnego ciała."
    },
    {
      q: "Czy dieta jest bardzo restrykcyjna?",
      a: "Jestem zwolennikiem diety 80/20. 80% to zdrowe, nieprzetworzone produkty, a 20% to miejsce na Twoje ulubione przyjemności. Dieta ma być stylem życia, a nie katorgą."
    },
    {
      q: "Jak wygląda kontakt?",
      a: "W pakiecie opieki 1:1 kontaktujemy się przez WhatsApp na bieżąco. Dodatkowo raz w tygodniu wysyłasz mi raport, na który odpowiadam szczegółową analizą wideo lub głosową."
    },
    {
      q: "Kiedy zobaczę pierwsze efekty?",
      a: "Pierwsze zmiany w samopoczuciu odczujesz już po tygodniu. Wizualne zmiany zazwyczaj pojawiają się po 3-4 tygodniach regularnej pracy."
    }
  ];

  return (
    <section id="faq" className="py-24 scroll-mt-20 bg-zinc-900">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">Częste Pytania</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
              <button 
                className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-900 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-bold text-white">{faq.q}</span>
                {openIndex === idx ? <Minus className="text-brand-500" /> : <Plus className="text-zinc-500" />}
              </button>
              
              {openIndex === idx && (
                <div className="p-6 pt-0 text-zinc-400 leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;