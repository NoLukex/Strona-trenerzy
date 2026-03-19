import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';
import { fixMojibake } from '../utils/fixMojibake';

type Review = {
  name: string;
  role: string;
  text: string;
  image: string;
};

const reviewSets: Record<string, Review[]> = {
  'trening medyczny / fizjo': [
    {
      name: 'Marta K.',
      role: 'Praca siedząca',
      text: 'Po kilku tygodniach ból odcinka lędźwiowego wyraźnie się zmniejszył, a trening przestał mnie przeciążać. W końcu mam plan, który jest bezpieczny i skuteczny.',
      image: 'https://picsum.photos/100/100?random=101',
    },
    {
      name: 'Piotr W.',
      role: 'Kierowca',
      text: 'Najlepiej działa połączenie mobilności i ćwiczeń siłowych. Wszystko jest dobrze wytłumaczone, więc wiem jak trenować bez ryzyka nawrotu problemu.',
      image: 'https://picsum.photos/100/100?random=102',
    },
    {
      name: 'Karolina S.',
      role: 'Mama 2 dzieci',
      text: 'Po kontuzji bałam się wrócić do ćwiczeń. Tu dostałam spokojny progres i duże wsparcie, dzięki czemu znów czuję się pewnie na treningu.',
      image: 'https://picsum.photos/100/100?random=103',
    },
  ],
  'metamorfoza sylwetki': [
    {
      name: 'Natalia P.',
      role: 'Specjalistka HR',
      text: 'Program był prosty i konkretny. Efekty na sylwetce zobaczyłam po kilku tygodniach, a największą różnicę zrobiła regularna korekta planu.',
      image: 'https://picsum.photos/100/100?random=104',
    },
    {
      name: 'Adam R.',
      role: 'Przedsiębiorca',
      text: 'Wcześniej zaczynałem i szybko odpuszczałem. Teraz mam system, który mogę utrzymać przy pracy i rodzinie. Waga spada, siła rośnie.',
      image: 'https://picsum.photos/100/100?random=105',
    },
    {
      name: 'Monika L.',
      role: 'Księgowa',
      text: 'Dieta bez skrajności i trening dopasowany do tygodnia. To pierwsza współpraca, gdzie zmiany zostały ze mną na dłużej.',
      image: 'https://picsum.photos/100/100?random=106',
    },
  ],
  'sport wytrzymalosciowy': [
    {
      name: 'Paweł T.',
      role: 'Biegacz amator',
      text: 'Plan pod zawody i regularny monitoring dały mi najlepszy sezon od lat. Bez przetrenowania i bez chaosu w tygodniu startowym.',
      image: 'https://picsum.photos/100/100?random=107',
    },
    {
      name: 'Aneta M.',
      role: 'Triathlon',
      text: 'Duży plus za łączenie treningu siłowego i wytrzymałościowego. Wreszcie wszystko było spójne, a progres mierzony z tygodnia na tydzień.',
      image: 'https://picsum.photos/100/100?random=108',
    },
    {
      name: 'Krzysztof D.',
      role: 'MTB',
      text: 'Szczegółowy plan i szybkie korekty uratowały mój sezon. Wynik sportowy poprawił się, ale ważniejsze, że czułem kontrolę nad procesem.',
      image: 'https://picsum.photos/100/100?random=109',
    },
  ],
  'trening + odzywianie': [
    {
      name: 'Kasia N.',
      role: 'Praca biurowa',
      text: 'Najbardziej cenię to, że trening i odżywianie są w jednym planie. Nie muszę zgadywać co robić, bo wszystko mam rozpisane krok po kroku.',
      image: 'https://picsum.photos/100/100?random=110',
    },
    {
      name: 'Damian K.',
      role: 'Manager',
      text: 'Współpraca pomogła mi odzyskać energię i regularność. Efekt jest widoczny na sylwetce, ale też w codziennym samopoczuciu.',
      image: 'https://picsum.photos/100/100?random=111',
    },
    {
      name: 'Ewa S.',
      role: 'Mama + praca zmianowa',
      text: 'Plan był realistyczny i dopasowany do mojego tygodnia. To zadecydowało, że nie odpuściłam po pierwszym trudniejszym miesiącu.',
      image: 'https://picsum.photos/100/100?random=112',
    },
  ],
  'trening personalny 1:1': [
    {
      name: 'Marta K.',
      role: 'Pracownik biurowy',
      text: 'Nigdy nie sądziłam, że utrzymam regularność. Podejście 1:1 jest elastyczne i konkretne, dlatego progres jest widoczny z miesiąca na miesiąc.',
      image: 'https://picsum.photos/100/100?random=113',
    },
    {
      name: 'Piotr W.',
      role: 'Programista',
      text: 'Plan został dopasowany do mojego trybu pracy i ograniczonego czasu. Treningi są konkretne, a kontakt szybki i rzeczowy.',
      image: 'https://picsum.photos/100/100?random=114',
    },
    {
      name: 'Karolina S.',
      role: 'Młoda mama',
      text: 'Krótkie, dobrze zaplanowane treningi dały lepszy efekt niż moje poprzednie próby. Czuję się mocniejsza i mam więcej energii.',
      image: 'https://picsum.photos/100/100?random=115',
    },
  ],
};

const normalizeNiche = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const Testimonials: React.FC = () => {
  const reviews = useMemo(() => {
    const key = normalizeNiche(currentTrainer.nicheLabel || 'trening personalny 1:1');
    return reviewSets[key] || reviewSets['trening personalny 1:1'];
  }, [currentTrainer.nicheLabel]);

  return (
    <section className="py-24 bg-zinc-900 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-16 text-center">
          Opinie podopiecznych <br />
          <span className="text-brand-500">po realnej współpracy 1:1</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 relative hover:-translate-y-2 transition-transform duration-300">
              <Quote className="absolute top-8 right-8 text-zinc-800 w-12 h-12" />
              <p className="text-zinc-300 mb-8 leading-relaxed relative z-10">"{fixMojibake(review.text)}"</p>

              <div className="flex items-center gap-4">
                <img src={review.image} alt={fixMojibake(review.name)} loading="lazy" decoding="async" className="w-12 h-12 rounded-full border border-zinc-700" />
                <div>
                  <h4 className="text-white font-bold">{fixMojibake(review.name)}</h4>
                  <p className="text-zinc-500 text-xs">{fixMojibake(review.role)}</p>
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
