import React from 'react';
import { ShieldCheck, MessageCircle, TrendingUp, Smartphone } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';
import { fixMojibake } from '../utils/fixMojibake';

const normalizeNiche = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getFeatureIntro = () => {
  const niche = normalizeNiche(currentTrainer.nicheLabel || '');

  if (niche.includes('medyczny') || niche.includes('fizjo')) {
    return {
      label: 'Jak Wygląda Współpraca',
      title: 'Tu liczy się spokojny proces, kontrola ruchu i progres bez dokładania chaosu.',
      text: 'Każdy etap ma sens: od pierwszej konsultacji po kolejne tygodnie pracy nad sprawnością i siłą.',
    };
  }

  if (niche.includes('kobiet')) {
    return {
      label: 'Dlaczego To Działa',
      title: 'To współpraca ustawiona pod regularność, formę i poczucie pewności na treningu.',
      text: 'Proces ma być konkretny, ale bez presji. Chodzi o wynik, który da się utrzymać w normalnym życiu.',
    };
  }

  if (niche.includes('ems')) {
    return {
      label: 'Dlaczego Ten Model',
      title: 'Nie chodzi o sam EMS, tylko o dobrze dobrany model pracy pod Twój cel.',
      text: 'Najpierw trzeba wiedzieć, czy ten system ma sens, a dopiero potem ustawić trening i kolejne kroki.',
    };
  }

  if (niche.includes('sport') || niche.includes('motoryczne')) {
    return {
      label: 'Co Daje Przewagę',
      title: 'Plan, kontrola obciążenia i regularne korekty są ważniejsze niż przypadkowa motywacja.',
      text: 'Tutaj wygrywa uporządkowany proces pod wynik, sprawność i lepszy ruch w konkretnym wysiłku.',
    };
  }

  if (niche.includes('odzywianie')) {
    return {
      label: 'Dlaczego To Działa',
      title: 'Efekt buduje się wtedy, gdy trening i odżywianie są ustawione w jednym, spójnym systemie.',
      text: 'Zamiast skakać między metodami, dostajesz jedną ścieżkę działania i jasny sposób kontroli postępu.',
    };
  }

  return {
    label: 'Dlaczego Warto',
    title: 'Najwięcej daje prosty plan, regularne korekty i współpraca, która nie rozsypuje się po pierwszym tygodniu.',
    text: 'To nie jest przypadkowy trening z internetu, tylko proces ustawiony pod realny cel i normalny rytm dnia.',
  };
};

const Features: React.FC = () => {
  const defaultFeatures = [
    {
      title: 'Plan szyty na miarę',
      desc: 'Koniec z metodą kopiuj-wklej. Plan uwzględnia Twój punkt startowy, rytm tygodnia i cel współpracy.',
    },
    {
      title: 'Stały progres',
      desc: 'Postęp jest monitorowany regularnie, a korekty pojawiają się wtedy, gdy są potrzebne.',
    },
    {
      title: 'Szybki kontakt',
      desc: 'Masz pytanie o trening, plan albo kolejny krok? Dostajesz konkretną odpowiedź bez czekania.',
    },
    {
      title: 'Wygodny system pracy',
      desc: 'Wszystkie ważne elementy współpracy są uporządkowane i czytelne zamiast rozrzucone po kilku miejscach.',
    },
  ];

  const icons = [ShieldCheck, TrendingUp, MessageCircle, Smartphone];
  const features = currentTrainer.valueProps && currentTrainer.valueProps.length > 0
    ? currentTrainer.valueProps
    : defaultFeatures;
  const intro = getFeatureIntro();

  return (
    <section id="features" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-500 font-bold tracking-wider uppercase text-sm">{intro.label}</span>
          <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">
            {fixMojibake(intro.title)}
          </h2>
          <p className="text-zinc-400">
            {fixMojibake(intro.text)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div key={idx} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-brand-500/50 transition-all hover:bg-zinc-900 group">
                <div className="mb-6 bg-zinc-950 w-16 h-16 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:scale-110 transition-transform shadow-lg shadow-black">
                  <Icon className="w-8 h-8 text-brand-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{fixMojibake(feature.title)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{fixMojibake(feature.desc)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
