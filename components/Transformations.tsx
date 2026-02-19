import React, { useState } from 'react';
import { ArrowRight, Star, TrendingUp, Trophy, Zap, ChevronDown, ChevronUp, UserCheck, Activity, Heart } from 'lucide-react';

const Transformations: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const transformations = [
    {
      id: 1,
      name: "Tomek",
      age: 34,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1770&auto=format&fit=crop",
      result: "-24 kg",
      time: "6 miesięcy",
      type: "Redukcja",
      quote: "Myślałem, że po 30-tce metabolizm zwalnia. Andrew udowodnił mi, że to tylko wymówka. Czułem się ciężki i bez energii, teraz przygotowuję się do półmaratonu.",
      icon: <TrendingUp className="text-brand-500" size={20} />
    },
    {
      id: 2,
      name: "Magda",
      age: 28,
      image: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=1887&auto=format&fit=crop",
      result: "+6 kg",
      time: "8 miesięcy",
      type: "Budowa Pośladków",
      quote: "Bałam się ciężarów, by nie wyglądać jak facet. Teraz kocham martwy ciąg, a moja sylwetka nabrała w końcu kobiecych kształtów, o jakich marzyłam.",
      icon: <Trophy className="text-brand-500" size={20} />
    },
    {
      id: 3,
      name: "Piotr",
      age: 41,
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      result: "Rekomp.",
      time: "4 miesiące",
      type: "Zdrowy Kręgosłup",
      quote: "Siedzący tryb życia zniszczył mi plecy. Treningi funkcjonalne sprawiły, że ból zniknął po 3 tygodniach, a przy okazji zgubiłem 'brzuszek piwny'.",
      icon: <Zap className="text-brand-500" size={20} />
    },
    {
      id: 4,
      name: "Kasia",
      age: 45,
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop",
      result: "-12 kg",
      time: "5 miesięcy",
      type: "Zdrowie & Witalność",
      quote: "Zgłosiłam się z bólami kolan i nadwagą. Dziś biegam za wnukami i czuję się młodziej niż 10 lat temu. Dieta jest pyszna i prosta.",
      icon: <Heart className="text-brand-500" size={20} />
    },
    {
      id: 5,
      name: "Marek",
      age: 22,
      image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1887&auto=format&fit=crop",
      result: "+8 kg",
      time: "12 miesięcy",
      type: "Masa Mięśniowa",
      quote: "Zawsze byłem tym 'chudym'. Andrew rozpisał mi plan, który w końcu ruszył moją wagę w górę bez zalewania się tłuszczem. 40cm w ramieniu pękło!",
      icon: <UserCheck className="text-brand-500" size={20} />
    },
    {
      id: 6,
      name: "Anna",
      age: 33,
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop",
      result: "-15 cm",
      time: "3 miesiące",
      type: "Powrót do formy",
      quote: "Powrót do formy po ciąży wydawał się niemożliwy przy małym dziecku. Krótkie treningi domowe zrobiły robotę. Talia węższa niż przed ciążą.",
      icon: <Activity className="text-brand-500" size={20} />
    }
  ];

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const visibleTransformations = showAll ? transformations : transformations.slice(0, 3);

  return (
    <section id="transformations" className="py-24 scroll-mt-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">Realne Wyniki</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
              Oni już <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-500">zmienili swoje życie.</span>
            </h2>
            <p className="text-zinc-400 mt-4 text-lg">
                To nie są modele ze stocka. To prawdziwi ludzie, tacy jak Ty, którzy zaufali procesowi i wykonali pracę.
            </p>
          </div>
          <a 
            href="#contact" 
            onClick={handleScrollToContact}
            className="px-6 py-3 border border-zinc-700 hover:bg-brand-500 hover:text-black hover:border-brand-500 text-white rounded-lg transition-all font-bold flex items-center gap-2 group"
          >
             Dołącz do nich <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          {visibleTransformations.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[4/5] bg-zinc-900 border border-zinc-800 animate-fade-in-up">
                {/* Image Background */}
                <img 
                    src={item.image} 
                    alt={`Metamorfoza ${item.name}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    
                    {/* Badge */}
                    <div className="absolute top-6 right-6 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
                        {item.icon}
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{item.type}</span>
                    </div>

                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {/* Quote */}
                        <div className="mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                            <div className="flex text-brand-500 mb-2">
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                                <Star size={12} fill="currentColor" />
                            </div>
                            <p className="text-zinc-300 text-sm italic leading-relaxed border-l-2 border-brand-500 pl-3">
                                "{item.quote}"
                            </p>
                        </div>

                        {/* Name & Stats */}
                        <h3 className="text-3xl font-black text-white mb-4">{item.name}, <span className="text-zinc-500 text-xl font-bold">{item.age} l.</span></h3>
                        
                        <div className="flex gap-4">
                            <div className="bg-brand-500 text-zinc-950 px-4 py-2 rounded-lg font-bold">
                                <p className="text-[10px] uppercase opacity-70 mb-0.5">Wynik</p>
                                <p className="text-lg leading-none">{item.result}</p>
                            </div>
                            <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700">
                                <p className="text-[10px] uppercase text-zinc-400 mb-0.5">Czas</p>
                                <p className="text-lg leading-none font-bold">{item.time}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        <div className="mt-12 flex justify-center">
            <button 
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-2 text-white border border-zinc-700 hover:border-brand-500 hover:text-brand-500 px-8 py-3 rounded-full transition-all duration-300 font-bold uppercase tracking-wider text-sm bg-zinc-900"
            >
                {showAll ? (
                    <>Pokaż mniej <ChevronUp size={16} /></>
                ) : (
                    <>Zobacz więcej podopiecznych <ChevronDown size={16} /></>
                )}
            </button>
        </div>
      </div>
    </section>
  );
};

export default Transformations;