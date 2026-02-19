import React from 'react';
import { ChevronRight, Play, Star, Activity } from 'lucide-react';
import { scrollToSection as scrollToTarget } from '../utils/scrollToSection';
import currentTrainer from '../data/currentTrainer';

const Hero: React.FC = () => {
  const handleScrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    scrollToTarget(id, { updateHash: true });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden" id="home">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-zinc-900 via-zinc-950 to-transparent opacity-50 z-0 hidden lg:block" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl z-0 animate-pulse" />
      
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Text Content */}
        <div className="flex flex-col justify-center gap-8">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full w-fit">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">
              Przyjmuje nowych podopiecznych
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
            {currentTrainer.heroTitleTop} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-500">
              {currentTrainer.heroTitleAccent}
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-lg leading-relaxed">
            {currentTrainer.heroText}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a 
              href="#contact" 
              onClick={(e) => handleScrollToSection(e, 'contact')}
              className="px-8 py-4 bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2 group"
            >
              Bezplatna Konsultacja
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#start" 
              onClick={(e) => handleScrollToSection(e, 'start')}
              className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Odbierz Plan Startowy
            </a>
          </div>

          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-zinc-800/50">
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">{currentTrainer.rating.toFixed(1)}/5</span>
              <span className="text-sm text-zinc-500 uppercase tracking-wider">Ocena profilu</span>
            </div>
            <div className="w-px h-12 bg-zinc-800"></div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white">{currentTrainer.city}</span>
              <span className="text-sm text-zinc-500 uppercase tracking-wider">Lokalizacja</span>
            </div>
            <div className="w-px h-12 bg-zinc-800"></div>
            <div className="flex items-center gap-1">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/40/40?random=${i+10}`} loading="lazy" decoding="async" className="w-10 h-10 rounded-full border-2 border-zinc-950" alt="Klient" />
                  ))}
               </div>
               <div className="flex flex-col ml-3">
                  <div className="flex text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span className="text-xs font-bold text-white">4.9/5 Opinii</span>
               </div>
            </div>
          </div>
        </div>

        {/* Hero Image / Visual */}
        <div className="relative hidden lg:flex justify-center items-end h-full">
            <div className="relative z-10 w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-brand-900/20 group">
                <img 
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Trainer in action" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"
                />
                
                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-zinc-700/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-brand-500 rounded-lg">
                            <Activity size={16} className="text-black fill-black" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400">Twój Cel</p>
                            <p className="font-bold text-sm">Wymarzona Sylwetka</p>
                        </div>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-brand-500 h-full w-[85%] rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-zinc-500">Realizacja planu</span>
                        <span className="text-[10px] text-brand-400 font-bold">85%</span>
                    </div>
                </div>
            </div>

            {/* Decorative Grid */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-none border border-zinc-800 opacity-20" style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
