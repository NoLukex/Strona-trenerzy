import React from 'react';
import { Award, Target, Zap } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';
import { fixMojibake } from '../utils/fixMojibake';

const PERSONAL_NAME_HINTS = new Set([
  'adam',
  'adrian',
  'agnieszka',
  'alicja',
  'asia',
  'bartosz',
  'daniel',
  'dawid',
  'deniz',
  'dominik',
  'dominika',
  'gracjan',
  'igor',
  'irek',
  'jakub',
  'joanna',
  'kamil',
  'karol',
  'karolina',
  'kasia',
  'lukasz',
  'maciej',
  'marcin',
  'michal',
  'oktawia',
  'patryk',
  'piotr',
  'przemyslaw',
  'rafal',
  'renato',
  'seweryn',
  'szymon',
  'weronika',
  'wojtek',
]);

const BRAND_TOKENS = new Set([
  'body',
  'by',
  'club',
  'ems',
  'fit',
  'gym',
  'life',
  'medyczny',
  'motion',
  'move',
  'movement',
  'point',
  'premium',
  'smart',
  'speed',
  'studio',
  'team',
  'trainer',
  'trener',
  'trenerka',
  'trening',
]);

const normalizeNiche = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const buildIntroText = (personLike: boolean): string => {
  const niche = normalizeNiche(currentTrainer.nicheLabel || '');
  const brand = currentTrainer.brandName;
  const brandSignals = normalizeNiche(`${currentTrainer.heroText} ${currentTrainer.aboutText}`);

  if (personLike) {
    return `Nazywam się ${currentTrainer.fullName}. Prowadzę trening w prosty, konkretny sposób i od początku ustawiam jasny plan pracy.`;
  }

  if (brandSignals.includes('odzywianie') || brandSignals.includes('jedzenie')) {
    return `${brand} to miejsce dla osób, które chcą połączyć trening i odżywianie w jeden prosty proces, zamiast składać plan z przypadkowych elementów.`;
  }

  if (niche.includes('medyczny') || niche.includes('fizjo')) {
    return `${brand} to miejsce dla osób, które chcą wracać do ruchu spokojnie, bezpiecznie i z planem dopasowanym do realnego punktu startowego.`;
  }

  if (niche.includes('kobiet')) {
    return `${brand} to miejsce dla kobiet, które chcą trenować regularnie, czuć się pewniej i budować formę bez presji oraz przypadkowego chaosu.`;
  }

  if (niche.includes('ems')) {
    return `${brand} to miejsce dla osób, które chcą trenować skutecznie przy ograniczonym czasie i od razu wiedzieć, jak wygląda taki model pracy.`;
  }

  if (niche.includes('sport') || niche.includes('motoryczne')) {
    return `${brand} to miejsce dla osób, które chcą trenować pod konkretny wynik, ruch i sprawność, a nie działać przypadkowo od treningu do treningu.`;
  }

  return `${brand} to miejsce dla osób, które chcą trenować regularnie, mieć jasny proces i nie gubić się w przypadkowych metodach.`;
};

const buildSupportCards = () => {
  const niche = normalizeNiche(currentTrainer.nicheLabel || '');

  if (niche.includes('medyczny') || niche.includes('fizjo')) {
    return [
      {
        title: 'Bezpieczny start',
        desc: 'Zaczynasz spokojnie, z planem dopasowanym do ruchu, ograniczeń i realnego punktu startowego.',
      },
      {
        title: 'Kontrola procesu',
        desc: 'Każdy kolejny etap wynika z obserwacji ciała, reakcji na obciążenie i czytelnej progresji.',
      },
    ];
  }

  if (niche.includes('kobiet')) {
    return [
      {
        title: 'Regularnosc bez presji',
        desc: 'Proces jest ustawiony tak, żeby trening dało się utrzymać w normalnym tygodniu.',
      },
      {
        title: 'Forma i pewność',
        desc: 'Pracujesz nad sylwetką, siłą i lepszym samopoczuciem bez niepotrzebnej spiny.',
      },
    ];
  }

  if (niche.includes('ems')) {
    return [
      {
        title: 'Krótki model pracy',
        desc: 'Od razu wiesz, jak wygląda start, ile trwa sesja i kiedy taki model daje najwięcej.',
      },
      {
        title: 'Dobrany wariant',
        desc: 'Łatwiej ocenisz, czy lepszy będzie EMS, klasyczne 1:1 czy model mieszany.',
      },
    ];
  }

  if (niche.includes('sport') || niche.includes('motoryczne')) {
    return [
      {
        title: 'Progres pod wynik',
        desc: 'Plan porządkuje siłę, sprawność i obciążenie pod konkretny cel ruchowy.',
      },
      {
        title: 'Lepsza kontrola pracy',
        desc: 'Każdy etap ma swoje priorytety zamiast przypadkowego dokładania kolejnych bodźców.',
      },
    ];
  }

  return [
    {
      title: 'Jasny plan startu',
      desc: 'Od początku widzisz pierwszy krok, kolejne tygodnie i sposób prowadzenia współpracy.',
    },
    {
      title: 'Regularny progres',
      desc: 'Współpraca nie kończy się na jednej sesji, tylko prowadzi do realnej zmiany.',
    },
  ];
};

const sanitizeMarketingCopyDirect = (value: string): string =>
  value
    .replace(/Ta strona powinna od poczatku tlumaczyc, ze /g, '')
    .replace(/Na stronie ma byc od razu jasne, /g, '')
    .replace(/Na stronie ma byc jasne, ze /g, '')
    .replace(/Strona ma jasno mowic, /g, '')
    .replace(/Najmocniejszy kierunek tej strony to /g, '')
    .replace(/Najwieksza (sila|przewaga) tej (marki|strony|wspolpracy|oferty|uslugi) (to|jest) /g, 'Od poczatku widzisz ')
    .replace(/Najwieksza (sila|przewaga) tego profilu (to|jest) /g, 'Od poczatku widzisz ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) prowadzi wspolprace 1:1 /i, 'Dostajesz wspolprace 1:1 ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) prowadzi wspolprace dla kobiet /i, 'Dostajesz wspolprace dla kobiet ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) prowadzi trening personalny /i, 'Dostajesz trening personalny ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) prowadzi trening dla kobiet /i, 'Dostajesz trening dla kobiet ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) prowadzi trening medyczny /i, 'Dostajesz trening medyczny ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) pokazuje prosty proces: /i, 'Zaczynasz od prostego procesu: ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) pokazuje prosty model wspolpracy: /i, 'Zaczynasz od prostego modelu wspolpracy: ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) pokazuje klientowi, jak /i, 'Od poczatku widzisz, jak ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) pokazuje, ze /i, 'Od poczatku widzisz, ze ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) komunikuje /i, 'Od poczatku widzisz ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) sprzedaje /i, 'Tutaj dostajesz ')
    .replace(/^([A-Z][A-Za-z0-9& .'-]+?) laczy /i, 'To miejsce laczy ')
    .replace(/^To marka, ktora najlepiej dziala wtedy, gdy /i, 'Najlepiej dziala tu, gdy ')
    .replace(/^To strona, ktora najlepiej dziala wtedy, gdy /i, 'Najlepiej dziala tu, gdy ')
    .replace(/^To marka, ktora /i, 'Tutaj ')
    .replace(/^To strona, ktora /i, 'Tutaj ')
    .replace(/^To strona trenera, ktory /i, 'Tutaj ')
    .replace(/Klient powinien od razu widziec, ze /g, 'Od razu widzisz, ze ')
    .replace(/Klient ma od razu widziec, ze /g, 'Od razu widzisz, ze ')
    .replace(/Klient ma od razu widziec, jak /g, 'Od razu widzisz, jak ')
    .replace(/Klient ma czuc, ze /g, 'Od poczatku czujesz, ze ')
    .replace(/Klient szybko widzi /g, 'Od razu widzisz ')
    .replace(/klient od razu rozumie /g, 'od razu rozumiesz ')
    .replace(/klient od pierwszego kontaktu wie, jak /g, 'od pierwszego kontaktu wiesz, jak ')
    .replace(/klient od pierwszego kontaktu wie, co /g, 'od pierwszego kontaktu wiesz, co ')
    .replace(/klient widzi /g, 'od razu widzisz ')
    .replace(/klient dostaje /g, 'dostajesz ')
    .replace(/klient trafia do /g, 'trafiasz do ')
    .replace(/klient trafia na /g, 'trafiasz na ')
    .replace(/daje klientowi /g, 'daje Ci ')
    .replace(/pokazuje klientowi /g, 'pokazuje Ci ')
    .replace(/klientowi /g, 'Ci ')
    .replace(/ze trafia do /g, 'ze trafiasz do ')
    .replace(/ze klient nie trafia /g, 'ze nie trafiasz ')
    .replace(/ze klient dostaje /g, 'ze dostajesz ')
    .replace(/^Tutaj dostajesz przypadkowych sesji, tylko /i, 'Tutaj nie dostajesz przypadkowych sesji, tylko ')
    .replace(/^Najlepiej dziala tu, gdy od razu pokazuje ([^.]+)\./i, 'Najlepiej dziala tu wyraznie pokazany $1.')
    .replace(/^Tutaj od poczatku czujesz /i, 'Od poczatku czujesz ')
    .replace(/dobrze ustawiona wspolprace/gi, 'dobrze ustawiony proces')
    .replace(/^["'""]+/, '')
    .replace(/["'""]+\.?$/, '')
    .replace(/"/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const About: React.FC = () => {
  const normalizedTokens = currentTrainer.fullName
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(Boolean);

  const personLike =
    !/[0-9]/.test(currentTrainer.fullName) &&
    normalizedTokens.some((token) => PERSONAL_NAME_HINTS.has(token)) &&
    !normalizedTokens.some((token) => BRAND_TOKENS.has(token));

  const introText = buildIntroText(personLike);
  const supportCards = buildSupportCards();

  return (
    <section id="about" className="py-24 scroll-mt-32 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-zinc-800 relative z-10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1887&auto=format&fit=crop"
                alt="Trener personalny"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-brand-500 p-6 rounded-2xl z-20 shadow-xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="text-zinc-950">
                  <p className="text-4xl font-black">10+</p>
                  <p className="text-xs font-bold uppercase">Lat doświadczenia</p>
                </div>
                <Award size={32} className="text-zinc-950 opacity-20" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
              {fixMojibake(currentTrainer.aboutHeading)}
            </h2>

            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>{fixMojibake(introText)}</p>
              <p>{fixMojibake(sanitizeMarketingCopyDirect(currentTrainer.aboutText))}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-900 rounded-lg text-brand-500">
                  <Target size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{supportCards[0].title}</h4>
                  <p className="text-xs text-zinc-500">{supportCards[0].desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-zinc-900 rounded-lg text-brand-500">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white">{supportCards[1].title}</h4>
                  <p className="text-xs text-zinc-500">{supportCards[1].desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
