import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Star,
  TrendingUp,
  Trophy,
  Zap,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Activity,
  Heart,
} from 'lucide-react';
import { scrollToSection } from '../utils/scrollToSection';
import currentTrainer from '../data/currentTrainer';
import { fixMojibake } from '../utils/fixMojibake';

type StorySeed = {
  name: string;
  age: number;
  result: string;
  time: string;
  type: string;
  quote: string;
};

type Story = StorySeed & {
  id: number;
  image: string;
  icon: React.ReactNode;
};

const storySets: Record<string, StorySeed[]> = {
  'trening medyczny / fizjo': [
    {
      name: 'Robert',
      age: 39,
      result: '-80% bólu',
      time: '8 tygodni',
      type: 'Kręgosłup',
      quote:
        'Po pracy przy biurku ból odcinka lędźwiowego był codziennością. Po wdrożeniu planu ruchu i mobilności mogę ćwiczyć bez strachu o nawrót objawów.',
    },
    {
      name: 'Kasia',
      age: 44,
      result: 'Pełny zakres',
      time: '10 tygodni',
      type: 'Kolano',
      quote:
        'Wcześniej każde wejście po schodach kończyło się dyskomfortem. Dziś chodzę bez bólu i regularnie trenuję siłowo.',
    },
    {
      name: 'Marcin',
      age: 31,
      result: '+12 kg siła',
      time: '4 miesiące',
      type: 'Powrót po kontuzji',
      quote:
        'Po urazie barku bałem się wyciskania. Plan etapowy i kontrola techniki pozwoliły wrócić do mocnych treningów.',
    },
    {
      name: 'Iza',
      age: 35,
      result: 'Lepsza postura',
      time: '6 tygodni',
      type: 'Ruch bez bólu',
      quote:
        'Najbardziej zaskoczyło mnie to, jak drobne korekty techniki zmieniły codzienne funkcjonowanie i samopoczucie.',
    },
    {
      name: 'Damian',
      age: 29,
      result: 'Bez nawrotów',
      time: '3 miesiące',
      type: 'Stabilizacja',
      quote:
        'Zamiast przypadkowych ćwiczeń dostałem jasną kolejność i obciążenia. Wreszcie czułem, że wiem co i po co robię.',
    },
    {
      name: 'Ewa',
      age: 47,
      result: '-9 kg',
      time: '5 miesięcy',
      type: 'Forma + zdrowie',
      quote:
        'Najpierw priorytetem był ból i sprawność, potem sylwetka. Takie podejście pozwoliło utrzymać regularność.',
    },
  ],
  'metamorfoza sylwetki': [
    {
      name: 'Tomek',
      age: 34,
      result: '-24 kg',
      time: '6 miesięcy',
      type: 'Redukcja',
      quote:
        'Myślałem, że po 30. roku życia wszystko idzie wolniej. Kluczowe okazały się regularność i dobrze ustawiony plan.',
    },
    {
      name: 'Magda',
      age: 28,
      result: '+6 kg',
      time: '8 miesięcy',
      type: 'Modelowanie sylwetki',
      quote:
        'Dzięki prowadzeniu 1:1 przestałam skakać po planach z internetu. Progres był stabilny i bez cofania efektów.',
    },
    {
      name: 'Piotr',
      age: 41,
      result: 'Rekompozycja',
      time: '4 miesiące',
      type: 'Siła + forma',
      quote:
        'Połączenie treningu i nawyków żywieniowych dało lepszy efekt niż moje poprzednie próby na własną rękę.',
    },
    {
      name: 'Natalia',
      age: 32,
      result: '-13 cm',
      time: '3 miesiące',
      type: 'Talia',
      quote:
        'Największą różnicę zrobiły proste zasady, które byłam w stanie utrzymać przy pracy i życiu rodzinnym.',
    },
    {
      name: 'Krzysztof',
      age: 26,
      result: '+7 kg',
      time: '7 miesięcy',
      type: 'Masa mięśniowa',
      quote:
        'W końcu przestałem trenować przypadkowo. Plan był konkretny, a korekty robione na bieżąco.',
    },
    {
      name: 'Monika',
      age: 37,
      result: '-11 kg',
      time: '5 miesięcy',
      type: 'Powrót do formy',
      quote:
        'Program był dopasowany do realnego tygodnia. Bez skrajności, ale z efektem, który utrzymał się po zakończeniu współpracy.',
    },
  ],
  'sport wytrzymalosciowy': [
    {
      name: 'Norbert',
      age: 36,
      result: '-9 min',
      time: '12 tygodni',
      type: '10 km',
      quote:
        'Dzięki monitorowaniu obciążeń i regeneracji poprawiłem wynik bez przetrenowania i bez kryzysów w trakcie sezonu.',
    },
    {
      name: 'Aneta',
      age: 30,
      result: 'Pierwszy start',
      time: '4 miesiące',
      type: 'Triathlon sprint',
      quote:
        'Dostałam jasną rozpiskę, co robić tydzień po tygodniu. Start był spokojny i bez improwizacji.',
    },
    {
      name: 'Marek',
      age: 42,
      result: '+18% FTP',
      time: '5 miesięcy',
      type: 'Kolarstwo',
      quote:
        'Najbardziej doceniłem łączenie treningu wytrzymałościowego z siłowym. Czuję stabilny progres przez cały sezon.',
    },
    {
      name: 'Karolina',
      age: 33,
      result: '-6 min',
      time: '10 tygodni',
      type: 'Półmaraton',
      quote:
        'Wreszcie trenowałam pod cel i termin, a nie pod przypadkowe inspiracje. Wynik i samopoczucie mocno na plus.',
    },
    {
      name: 'Adam',
      age: 27,
      result: 'Bez urazów',
      time: '6 miesięcy',
      type: 'Przygotowanie sezonowe',
      quote:
        'W poprzednich sezonach łapałem przeciążenia. Teraz plan i kontrola regeneracji utrzymały ciągłość treningu.',
    },
    {
      name: 'Paulina',
      age: 35,
      result: '+22% wydolność',
      time: '4 miesiące',
      type: 'MTB',
      quote:
        'Dokładne mikrocykle i feedback co tydzień dały mi pewność, że wszystko idzie we właściwym kierunku.',
    },
  ],
  'trening + odzywianie': [
    {
      name: 'Marta',
      age: 33,
      result: '-14 kg',
      time: '5 miesięcy',
      type: 'Forma + nawyki',
      quote:
        'Największy plus to spójny plan treningu i jedzenia. Wcześniej próbowałam łączyć to sama i szybko traciłam motywację.',
    },
    {
      name: 'Daniel',
      age: 40,
      result: '-10 cm',
      time: '4 miesiące',
      type: 'Redukcja centralna',
      quote:
        'Drobne zmiany nawyków i regularne raporty dały efekt bez radykalnych diet i bez efektu jojo.',
    },
    {
      name: 'Klaudia',
      age: 29,
      result: '+4 kg',
      time: '6 miesięcy',
      type: 'Siła i sylwetka',
      quote:
        'Dostałam plan dopasowany do pracy zmianowej. W końcu jadłam i trenowałam tak, by to było do utrzymania.',
    },
    {
      name: 'Michał',
      age: 38,
      result: '-8 kg',
      time: '3 miesiące',
      type: 'Restart formy',
      quote:
        'Program był prosty i konkretny. Co tydzień wiedziałem, czy idziemy zgodnie z planem i co poprawić.',
    },
    {
      name: 'Ola',
      age: 31,
      result: '-16 cm',
      time: '5 miesięcy',
      type: 'Sylwetka',
      quote:
        'Najbardziej pomogła regularna korekta planu. Bez tego bardzo łatwo byłoby się zablokować po kilku tygodniach.',
    },
    {
      name: 'Sebastian',
      age: 45,
      result: '-12 kg',
      time: '6 miesięcy',
      type: 'Zdrowie metaboliczne',
      quote:
        'To pierwsza współpraca, w której plan był realistyczny. Mniej chaosu, więcej systemu i spokojny, trwały progres.',
    },
  ],
  'trening personalny 1:1': [
    {
      name: 'Marek',
      age: 29,
      result: '-10 kg',
      time: '4 miesiące',
      type: 'Redukcja',
      quote:
        'Dzięki prowadzeniu 1:1 przestałem zgadywać co robić na treningu. Każdy tydzień miał jasny cel i to dało efekt.',
    },
    {
      name: 'Ania',
      age: 35,
      result: '+5 kg',
      time: '7 miesięcy',
      type: 'Siła i sylwetka',
      quote:
        'Współpraca była dopasowana do mojego grafiku. Mało chaosu, dużo konkretu i stałe wsparcie po drodze.',
    },
    {
      name: 'Kamil',
      age: 42,
      result: 'Lepsza forma',
      time: '10 tygodni',
      type: 'Kondycja',
      quote:
        'Najważniejsze było to, że plan był realny. Trening przestał być dodatkowym obowiązkiem, a stał się rutyną.',
    },
    {
      name: 'Joanna',
      age: 31,
      result: '-11 cm',
      time: '3 miesiące',
      type: 'Modelowanie',
      quote:
        'Regularne check-iny i szybkie korekty pomogły utrzymać tempo. Efekty były widoczne już po kilku tygodniach.',
    },
    {
      name: 'Paweł',
      age: 37,
      result: '+6 kg',
      time: '8 miesięcy',
      type: 'Masa mięśniowa',
      quote:
        'Po raz pierwszy miałem plan z prawdziwego zdarzenia i wiedziałem, jak progresować bez przestojów.',
    },
    {
      name: 'Ewelina',
      age: 34,
      result: '-9 kg',
      time: '5 miesięcy',
      type: 'Powrót do formy',
      quote:
        'To był system krok po kroku. Zero skrajności, za to regularność i wyniki, które zostały na dłużej.',
    },
  ],
};

const storyImages = [
  'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1887&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1887&auto=format&fit=crop',
  'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/4498294/pexels-photo-4498294.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1887&auto=format&fit=crop',
];

const storyIcons = [TrendingUp, Trophy, Zap, Heart, UserCheck, Activity];

const normalizeNiche = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getStoriesIntro = () => {
  const niche = normalizeNiche(currentTrainer.nicheLabel || '');

  if (niche.includes('medyczny') || niche.includes('fizjo')) {
    return {
      label: 'Typowe Efekty Współpracy',
      title: 'Tak zwykle wygląda droga od dyskomfortu do spokojniejszego, pewniejszego ruchu.',
      text: 'Te historie pokazują typ zmian, jakich najczęściej szukają osoby rozpoczynające współpracę 1:1.',
      cta: 'Sprawdź, czy to model dla Ciebie',
    };
  }

  if (niche.includes('sport') || niche.includes('motoryczne')) {
    return {
      label: 'Typowe Efekty Współpracy',
      title: 'Tutaj liczy się lepszy wynik, mniejszy chaos treningowy i większa kontrola progresu.',
      text: 'To przykłady rezultatów, które dobrze oddają sportowy kierunek współpracy i regularny progres.',
      cta: 'Porozmawiaj o swoim celu',
    };
  }

  if (niche.includes('kobiet')) {
    return {
      label: 'Typowe Efekty Współpracy',
      title: 'Najczęściej zaczyna się od regularności, a potem przychodzą forma, siła i pewność siebie.',
      text: 'Poniżej widzisz przykłady efektów, które dobrze oddają charakter współpracy 1:1.',
      cta: 'Umów konsultację',
    };
  }

  return {
    label: 'Typowe Efekty Współpracy',
    title: 'Efekt zwykle nie bierze się z jednego treningu, tylko z dobrze poprowadzonego procesu.',
    text: 'Poniżej są przykładowe historie, które dobrze pokazują typ progresu budowanego w procesie 1:1.',
    cta: 'Dołącz do współpracy',
  };
};

const Transformations: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const intro = getStoriesIntro();

  const transformations = useMemo<Story[]>(() => {
    const key = normalizeNiche(currentTrainer.nicheLabel || 'trening personalny 1:1');
    const baseStories = storySets[key] || storySets['trening personalny 1:1'];
    return baseStories.map((item, idx) => {
      const Icon = storyIcons[idx % storyIcons.length];
      return {
        id: idx + 1,
        ...item,
        name: fixMojibake(item.name),
        result: fixMojibake(item.result),
        time: fixMojibake(item.time),
        type: fixMojibake(item.type),
        quote: fixMojibake(item.quote),
        image: storyImages[idx % storyImages.length],
        icon: <Icon className="text-brand-500" size={20} />,
      };
    });
  }, [currentTrainer.nicheLabel]);

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('contact', { updateHash: true });
  };

  const visibleTransformations = showAll ? transformations : transformations.slice(0, 3);

  return (
    <section id="transformations" className="py-24 scroll-mt-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">{intro.label}</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
              {fixMojibake(intro.title)}
            </h2>
            <p className="text-zinc-400 mt-4 text-lg">
              {fixMojibake(intro.text)}
            </p>
          </div>
          <a
            href="#contact"
            onClick={handleScrollToContact}
            className="px-6 py-3 border border-zinc-700 hover:bg-brand-500 hover:text-black hover:border-brand-500 text-white rounded-lg transition-all font-bold flex items-center gap-2 group"
          >
            {fixMojibake(intro.cta)} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleTransformations.map((item) => (
            <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[4/5] bg-zinc-900 border border-zinc-800">
              <img
                src={item.image}
                alt={`Metamorfoza ${fixMojibake(item.name)}`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="absolute top-6 right-6 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 flex items-center gap-2">
                  {item.icon}
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{item.type}</span>
                </div>

                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="mb-6">
                    <div className="flex text-brand-500 mb-2">
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                      <Star size={12} fill="currentColor" />
                    </div>
                    <p className="text-zinc-300 text-sm italic leading-relaxed border-l-2 border-brand-500 pl-3">
                      "{fixMojibake(item.quote)}"
                    </p>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-4">
                    {fixMojibake(item.name)}, <span className="text-zinc-500 text-xl font-bold">{item.age} l.</span>
                  </h3>

                  <div className="flex gap-4">
                    <div className="bg-brand-500 text-zinc-950 px-4 py-2 rounded-lg font-bold">
                      <p className="text-[10px] uppercase opacity-70 mb-0.5">Wynik</p>
                      <p className="text-lg leading-none">{fixMojibake(item.result)}</p>
                    </div>
                    <div className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700">
                      <p className="text-[10px] uppercase text-zinc-400 mb-0.5">Czas</p>
                      <p className="text-lg leading-none font-bold">{fixMojibake(item.time)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 text-white border border-zinc-700 hover:border-brand-500 hover:text-brand-500 px-8 py-3 rounded-full transition-all duration-300 font-bold uppercase tracking-wider text-sm bg-zinc-900"
          >
            {showAll ? (
              <>
                Pokaż mniej <ChevronUp size={16} />
              </>
            ) : (
              <>
                Zobacz więcej historii <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Transformations;
