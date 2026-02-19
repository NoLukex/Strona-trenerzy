import React from 'react';
import { Instagram, Facebook, Twitter, Dumbbell, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 relative">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
                <Dumbbell className="text-brand-500 w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">
            TITANIUM<span className="text-brand-500">PHYSIQUE</span>
            </span>
        </div>

        <div className="text-zinc-500 text-sm text-center md:text-right flex flex-col md:flex-row items-center gap-6">
            <p>&copy; 2024 Titanium Physique. Wszelkie prawa zastrzeżone.</p>
            <div className="flex justify-center md:justify-end gap-6">
                <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
            
            <button 
                onClick={scrollToTop}
                className="bg-zinc-900 hover:bg-brand-500 hover:text-black text-white p-3 rounded-full transition-all duration-300 border border-zinc-800"
                aria-label="Wróć na górę"
            >
                <ArrowUp size={20} />
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;