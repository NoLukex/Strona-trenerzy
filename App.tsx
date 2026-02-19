import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import TrafficEssentials from './components/TrafficEssentials';
import Transformations from './components/Transformations';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import MobileStickyCta from './components/MobileStickyCta';
import { scrollToSection } from './utils/scrollToSection';
import currentTrainer from './data/currentTrainer';

function App() {
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-400', currentTrainer.theme.accentSoft || '#b2e23a');
    root.style.setProperty('--brand-500', currentTrainer.theme.accent || '#94c918');
    root.style.setProperty('--brand-600', currentTrainer.theme.accentDark || '#73a10f');
    root.style.setProperty('--app-bg', currentTrainer.theme.bg || '#09090b');
    root.style.setProperty('--app-bg-soft', currentTrainer.theme.bgSoft || '#18181b');
    root.style.setProperty('--app-surface', currentTrainer.theme.surface || '#18181b');
    root.style.setProperty('--app-surface-alt', currentTrainer.theme.surfaceAlt || '#27272a');
    root.style.setProperty('--app-border', currentTrainer.theme.border || '#3f3f46');
    root.style.setProperty('--app-muted', currentTrainer.theme.textMuted || '#a1a1aa');

    const scrollFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) {
        return;
      }

      window.setTimeout(() => {
        scrollToSection(hash);
      }, 0);
    };

    scrollFromHash();
    window.addEventListener('hashchange', scrollFromHash);
    return () => window.removeEventListener('hashchange', scrollFromHash);
  }, [currentTrainer]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-brand-500 selection:text-black" style={{ backgroundColor: 'var(--app-bg)' }}>
      <a
        href="#main-content"
        className="skip-link fixed left-4 top-4 z-[60] rounded-md bg-brand-500 px-4 py-2 font-bold text-zinc-950"
      >
        Przejdz do tresci
      </a>
      <Navbar />
      
      <main id="main-content" className="pb-24 md:pb-0">
        <Hero />
        <About />
        <Features />
        <TrafficEssentials />
        <Transformations />
        <Testimonials />
        <Pricing />
        <FAQ />
        <ContactForm />
      </main>

      <Footer />
      <MobileStickyCta />
    </div>
  );
}

export default App;
