import React from 'react';
import { Quote } from 'lucide-react';

const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Marta K.",
      role: "Pracownik Biurowy",
      text: "Nigdy nie sądziłam, że będę w stanie trzymać dietę. Podejście jest tak elastyczne, że jem to co lubię, a waga spada.",
      image: "https://picsum.photos/100/100?random=1"
    },
    {
      name: "Piotr W.",
      role: "Programista",
      text: "Bóle pleców zniknęły po 3 tygodniach treningów. Plan jest idealnie skrojony pod siedzący tryb życia. Polecam każdemu.",
      image: "https://picsum.photos/100/100?random=2"
    },
    {
      name: "Karolina S.",
      role: "Młoda Mama",
      text: "Krótkie treningi domowe dały lepsze efekty niż godziny spędzone kiedyś na siłowni. Pełen profesjonalizm i wsparcie.",
      image: "https://picsum.photos/100/100?random=3"
    }
  ];

  return (
    <section className="py-24 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-16 text-center">
          Głosy tych, którzy <br/> <span className="text-brand-500">już wygrali</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 relative hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-8 right-8 text-zinc-800 w-12 h-12" />
              <p className="text-zinc-300 mb-8 leading-relaxed relative z-10">"{review.text}"</p>
              
              <div className="flex items-center gap-4">
                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full border border-zinc-700" />
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-zinc-500 text-xs">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;