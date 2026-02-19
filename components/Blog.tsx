import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const Blog: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "5 Błędów, które hamują Twoją redukcję",
      excerpt: "Jesz mało, biegasz godzinami, a waga stoi? Sprawdź, czy nie wpadasz w pułapkę adaptacji metabolicznej lub ukrytych kalorii.",
      category: "Redukcja",
      date: "12 Mar 2024",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Kreatyna - czy warto? Fakty i Mity",
      excerpt: "Najlepiej przebadany suplement na świecie. Czy powoduje łysienie? Czy zalewa wodą? Rozwiewamy wątpliwości na bazie badań.",
      category: "Suplementacja",
      date: "08 Mar 2024",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Trening FBW vs Split - co wybrać?",
      excerpt: "Trenujesz 3 razy w tygodniu? Zobacz, dlaczego Full Body Workout może dać Ci 2x szybsze efekty niż tradycyjny Split.",
      category: "Trening",
      date: "01 Mar 2024",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Sen a budowa mięśni",
      excerpt: "Dlaczego 6 godzin snu to za mało, by rosnąć? Odkryj wpływ regeneracji nocnej na poziom testosteronu i kortyzolu.",
      category: "Regeneracja",
      date: "24 Lut 2024",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1541781777621-af13943727dd?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Jak zacząć bieganie i nie stracić mięśni?",
      excerpt: "Cardio to nie wróg kulturysty, jeśli robisz je mądrze. Poznaj strefy tętna i zasady łączenia biegania z siłownią.",
      category: "Kondycja",
      date: "15 Lut 2024",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1552674605-469523f54050?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Przepis na omlet anaboliczny (50g białka)",
      excerpt: "Szybkie śniadanie mistrzów. Bez proszku do pieczenia, puszyste i gotowe w 5 minut. Idealne po ciężkim treningu.",
      category: "Dieta",
      date: "10 Lut 2024",
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="pt-32 pb-24 min-h-screen bg-zinc-950 relative overflow-hidden animate-fade-in">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand-900/10 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">Baza Wiedzy</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            Trenuj <span className="text-brand-500">Mądrze.</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Zbiór artykułów opartych o najnowszą wiedzę naukową. Bez mitów, bez marketingu, same konkrety, które wdrożysz od zaraz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-brand-500/50 transition-all hover:-translate-y-2 duration-300 flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter grayscale group-hover:grayscale-0"
                />
                <div className="absolute top-4 left-4 bg-brand-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {article.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-500 transition-colors">
                  {article.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                  {article.excerpt}
                </p>

                <button className="flex items-center gap-2 text-white font-bold text-sm hover:gap-3 transition-all group-hover:text-brand-400 mt-auto">
                  Czytaj dalej <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;