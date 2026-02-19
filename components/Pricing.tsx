import React from 'react';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 scroll-mt-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Wybierz Swoją Drogę</h2>
          <p className="text-zinc-400">Proste zasady. Żadnych ukrytych kosztów. Inwestujesz w siebie.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Plan 1 */}
          <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Plan Treningowy</h3>
            <p className="text-zinc-500 text-sm mb-6">Dla tych, którzy potrzebują tylko mapy.</p>
            <div className="text-3xl font-black text-white mb-6">199 zł <span className="text-sm font-normal text-zinc-500">/ msc</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-zinc-300 text-sm"><Check size={16} className="text-brand-500" /> Indywidualny plan treningowy</li>
              <li className="flex items-center gap-3 text-zinc-300 text-sm"><Check size={16} className="text-brand-500" /> Atlas ćwiczeń wideo</li>
              <li className="flex items-center gap-3 text-zinc-300 text-sm"><Check size={16} className="text-brand-500" /> Raz w miesiącu korekta planu</li>
            </ul>
            <a href="#contact" onClick={handleScrollToContact} className="w-full py-3 border border-zinc-700 text-white rounded-lg text-center font-bold hover:bg-zinc-800 transition-colors cursor-pointer">Wybieram</a>
          </div>

          {/* Plan 2 - Featured */}
          <div className="p-8 rounded-2xl bg-zinc-900 border-2 border-brand-500 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-brand-900/20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-500 text-zinc-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
              Bestseller
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Opieka 1:1 Online</h3>
            <p className="text-zinc-500 text-sm mb-6">Kompleksowe prowadzenie dla najlepszych efektów.</p>
            <div className="text-3xl font-black text-white mb-6">349 zł <span className="text-sm font-normal text-zinc-500">/ msc</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-white text-sm font-medium"><Check size={16} className="text-brand-500" /> Wszystko z pakietu podstawowego</li>
              <li className="flex items-center gap-3 text-white text-sm font-medium"><Check size={16} className="text-brand-500" /> Plan żywieniowy / makroskładniki</li>
              <li className="flex items-center gap-3 text-white text-sm font-medium"><Check size={16} className="text-brand-500" /> Cotygodniowe raporty i analiza</li>
              <li className="flex items-center gap-3 text-white text-sm font-medium"><Check size={16} className="text-brand-500" /> Kontakt WhatsApp 24/7</li>
            </ul>
            <a href="#contact" onClick={handleScrollToContact} className="w-full py-3 bg-brand-500 text-zinc-950 rounded-lg text-center font-bold hover:bg-brand-400 transition-colors cursor-pointer">Wybieram</a>
          </div>

          {/* Plan 3 */}
          <div className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">VIP Hybryda</h3>
            <p className="text-zinc-500 text-sm mb-6">Połączenie online z treningami personalnymi.</p>
            <div className="text-3xl font-black text-white mb-6">999 zł <span className="text-sm font-normal text-zinc-500">/ msc</span></div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-zinc-300 text-sm"><Check size={16} className="text-brand-500" /> Pełna opieka online</li>
              <li className="flex items-center gap-3 text-zinc-300 text-sm"><Check size={16} className="text-brand-500" /> 4 treningi personalne (Warszawa)</li>
              <li className="flex items-center gap-3 text-zinc-300 text-sm"><Check size={16} className="text-brand-500" /> Analiza składu ciała co miesiąc</li>
              <li className="flex items-center gap-3 text-zinc-300 text-sm"><Check size={16} className="text-brand-500" /> Wspólne zakupy / edukacja</li>
            </ul>
            <a href="#contact" onClick={handleScrollToContact} className="w-full py-3 border border-zinc-700 text-white rounded-lg text-center font-bold hover:bg-zinc-800 transition-colors cursor-pointer">Wybieram</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;