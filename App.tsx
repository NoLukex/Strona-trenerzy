import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import AiPlanner from './components/AiPlanner';
import Transformations from './components/Transformations';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-brand-500 selection:text-black">
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Features />
        <AiPlanner />
        <Transformations />
        <Testimonials />
        <Pricing />
        <FAQ />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
}

export default App;