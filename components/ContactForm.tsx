import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'Chcę schudnąć'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error if user starts typing in contact fields
    if (error && (name === 'email' || name === 'phone')) {
        setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Require at least Email OR Phone
    if (!formData.email.trim() && !formData.phone.trim()) {
        setError('Podaj email LUB numer telefonu, abym mógł się z Tobą skontaktować.');
        return;
    }

    // Simulate submission
    setTimeout(() => {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', goal: 'Chcę schudnąć' });
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 scroll-mt-32 bg-zinc-950 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-900/10 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl grid md:grid-cols-2">
            
            <div className="p-10 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Zacznijmy Twoją <br /><span className="text-brand-500">Przemianę</span></h2>
                <p className="text-zinc-400 mb-8">
                    Wypełnij formularz. To nic nie kosztuje, a może zmienić wszystko. Oddzwonię do Ciebie w ciągu 24h i ustalimy plan działania.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-brand-500 font-bold">1</div>
                        <span className="text-white font-medium">Analiza Twojego celu</span>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-brand-500 font-bold">2</div>
                        <span className="text-white font-medium">Dobór odpowiedniej strategii</span>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-brand-500 font-bold">3</div>
                        <span className="text-white font-medium">Start współpracy</span>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 p-10 md:p-16">
                {submitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                        <CheckCircle className="w-20 h-20 text-brand-500 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">Wiadomość Wysłana!</h3>
                        <p className="text-zinc-400">Skontaktuję się z Tobą wkrótce.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-8 text-brand-500 hover:underline">Wyślij nową wiadomość</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Imię i Nazwisko</label>
                            <input 
                                required 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors placeholder-zinc-700" 
                                placeholder="Jan Kowalski" 
                            />
                        </div>
                        
                        {/* Contact Info Group */}
                        <div className="space-y-6 p-4 border border-zinc-800 rounded-xl bg-zinc-900/30">
                            <p className="text-xs text-zinc-400 font-medium">Wybierz preferowaną formę kontaktu (podaj min. jedno):</p>
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Email</label>
                                <input 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email" 
                                    className={`w-full bg-zinc-900 border ${error && !formData.email && !formData.phone ? 'border-red-500' : 'border-zinc-800'} rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors placeholder-zinc-700`} 
                                    placeholder="jan@example.com" 
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Numer Telefonu</label>
                                <input 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    type="tel" 
                                    className={`w-full bg-zinc-900 border ${error && !formData.email && !formData.phone ? 'border-red-500' : 'border-zinc-800'} rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors placeholder-zinc-700`} 
                                    placeholder="+48 000 000 000" 
                                />
                            </div>
                            
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-sm animate-pulse">
                                    <AlertCircle size={16} />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">Twój Cel</label>
                            <select 
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-brand-500 outline-none transition-colors"
                            >
                                <option>Chcę schudnąć</option>
                                <option>Chcę zbudować mięśnie</option>
                                <option>Chcę poprawić zdrowie</option>
                                <option>Inne / Konsultacja</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group">
                            Wyślij Zgłoszenie
                            <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;