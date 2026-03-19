import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';

const FAQ: React.FC = () => {
  const quickWin = getQuickWinConfig(currentTrainer.slug);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs = [
    {
      q: 'Czy muszę chodzić na siłownię?',
      a: 'Nie. Plany treningowe można dopasować również do domu, podstawowego sprzętu albo pracy z ciężarem własnego ciała.',
    },
    {
      q: 'Czy dieta jest bardzo restrykcyjna?',
      a: 'Nie. Chodzi o model, który da się utrzymać, a nie o chwilową katorgę. Najpierw ustawiamy podstawy i rytm działania.',
    },
    {
      q: 'Jak wygląda kontakt?',
      a: 'Na starcie ustalamy najlepszą formę kontaktu i jasne zasady współpracy, tak żebyś od razu wiedział, co dzieje się dalej.',
    },
    {
      q: 'Kiedy zobaczę pierwsze efekty?',
      a: 'Pierwsze zmiany zwykle widać najpierw w samopoczuciu, energii i regularności. Na mocniejsze efekty wizualne trzeba kilku tygodni spokojnej pracy.',
    },
  ];

  const faqsBase = currentTrainer.faqItems && currentTrainer.faqItems.length > 0
    ? currentTrainer.faqItems
    : defaultFaqs;

  const beginnerFaqs = [
    {
      q: 'Nigdy nie ćwiczyłem regularnie. Czy dam radę?',
      a: 'Tak. Zaczynamy od prostego planu i lekkiego progu wejścia, żeby od pierwszego tygodnia złapać regularność.',
    },
    {
      q: 'Ile czasu tygodniowo muszę zarezerwować?',
      a: 'Na start zwykle wystarczą 2-3 treningi tygodniowo plus krótki check-in postępu.',
    },
  ];

  const faqs = quickWin.showBeginnerFaqIntro
    ? [...beginnerFaqs, ...faqsBase]
    : faqsBase;

  return (
    <section id="faq" className="py-24 scroll-mt-20 bg-zinc-900">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">Częste Pytania</h2>

        {quickWin.showBeginnerFaqIntro && (
          <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            Sekcja dla początkujących: odpowiedzi na najczęstsze obawy przed pierwszym treningiem.
          </div>
        )}

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-zinc-800 rounded-lg bg-zinc-950 overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-6 text-left hover:bg-zinc-900 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`faq-content-${idx}`}
                id={`faq-button-${idx}`}
              >
                <span className="font-bold text-white">{faq.q}</span>
                {openIndex === idx ? <Minus className="text-brand-500" /> : <Plus className="text-zinc-500" />}
              </button>

              {openIndex === idx && (
                <div
                  id={`faq-content-${idx}`}
                  role="region"
                  aria-labelledby={`faq-button-${idx}`}
                  className="p-6 pt-0 text-zinc-400 leading-relaxed"
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
