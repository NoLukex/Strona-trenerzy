import React, { useState, useEffect } from 'react';
import { Menu, X, Dumbbell } from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';
import currentTrainer from '../data/currentTrainer';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileMenuOpen(false);

    if (href === '#') {
       e.preventDefault();
       scrollToSection('top', { updateHash: true });
       return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href.replace('#', ''), { updateHash: true });
    }
  };

  const navLinks = [
    { name: 'O Mnie', href: '#about' },
    { name: 'Start', href: '#start' },
    { name: 'Metamorfozy', href: '#transformations' },
    { name: 'Oferta', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => handleNavClick(e, '#')}
          className="flex items-center gap-2 group"
        >
          <div className="bg-brand-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <Dumbbell className="text-zinc-950 w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            {currentTrainer.navName.toUpperCase().split(' ')[0]}<span className="text-brand-500">{currentTrainer.navName.toUpperCase().split(' ').slice(1).join(' ')}</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-semibold text-zinc-300 hover:text-brand-400 transition-colors uppercase tracking-wide cursor-pointer"
            >
              {link.name}
            </a>
          ))}
          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, '#contact')}
            className="bg-white text-zinc-950 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-brand-400 hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Współpraca
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-zinc-300 hover:text-brand-500 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otworz menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-zinc-900 border-b border-zinc-800 p-6 flex flex-col gap-4 shadow-2xl">
           {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-lg font-medium text-zinc-300 hover:text-brand-500"
            >
              {link.name}
            </a>
          ))}
           <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, '#contact')}
            className="bg-brand-500 text-zinc-950 text-center py-3 rounded-lg font-bold mt-2"
          >
            Rozpocznij Współpracę
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
