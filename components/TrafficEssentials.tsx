import React, { useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { submitLead } from '../services/leadService';
import currentTrainer from '../data/currentTrainer';
import { getQuickWinConfig } from '../data/quickWinConfig';

const sanitizeLeadMagnetText = (value: string): string =>
  value
    .replace(/Lead magnet ma skracać dystans i pokazywać, że pierwszy etap współpracy jest prosty oraz dobrze poukładany\./g, 'Materiał startowy pokazuje, że pierwszy etap współpracy jest prosty, konkretny i łatwy do wdrożenia.')
    .replace(/Uniwersalny punkt wejścia dla każdego trenera: lead magnet, szybka wartość i naturalne przejście do współpracy 1:1\./g, 'Krótki materiał startowy, który daje szybką wartość i naturalnie prowadzi do współpracy 1:1.')
    .trim();

const TrafficEssentials: React.FC = () => {
  const quickWin = getQuickWinConfig(currentTrainer.slug);
  const leadMagnetTitle = currentTrainer.leadMagnetTitle || 'Pobierz plan startowy na 7 dni';
  const leadMagnetText =
    sanitizeLeadMagnetText(currentTrainer.leadMagnetText || 'Uniwersalny punkt wejścia dla każdego trenera: lead magnet, szybka wartość i naturalne przejście do współpracy 1:1.');

  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState('Redukcja tkanki tłuszczowej');
  const [timeline, setTimeline] = useState('');
  const [consent, setConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [startedAt] = useState(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Podaj adres e-mail, aby odebrać materiał.');
      return;
    }

    setLoading(true);
    setError('');
    const result = await submitLead(
      {
        source: 'lead-magnet',
        email,
        goal,
        timeline: timeline || undefined,
        note: quickWin.leadMagnetFollowup
          ? 'Krótka ścieżka startowa po zapisie.'
          : undefined,
        consent,
        marketingConsent,
        honeypot,
      },
      { fillTimeMs: Date.now() - startedAt },
    );

    if (!result.ok) {
      setLoading(false);
      setError(result.error || 'Nie udało się zapisać formularza.');
      return;
    }

    setSubmitted(true);
    setEmail('');
    setTimeline('');
    setConsent(false);
    setMarketingConsent(false);
    setHoneypot('');
    setLoading(false);
  };

  return (
    <section id="start" className="py-24 bg-zinc-900 border-y border-zinc-800">
      <div className="max-w-3xl mx-auto px-6">
        <article className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="inline-flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wide mb-4">
            <Download size={14} />
            Darmowy materiał startowy
          </div>
          <h2 className="text-3xl font-black text-white mb-4">{leadMagnetTitle}</h2>
          <p className="text-zinc-400 mb-6">{leadMagnetText}</p>

          {submitted ? (
            <div className="bg-zinc-900 border border-brand-500/40 rounded-xl p-4 text-brand-300 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Dziękujemy. Zgłoszenie zapisane. Materiał startowy zostanie przesłany mailowo.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="lead-email" className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                  E-mail
                </label>
                <input
                  id="lead-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="twoj@email.pl"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="lead-goal" className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                  Cel
                </label>
                <select
                  id="lead-goal"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                >
                  <option>Redukcja tkanki tłuszczowej</option>
                  <option>Budowa masy mięśniowej</option>
                  <option>Poprawa kondycji</option>
                  <option>Powrót po kontuzji</option>
                </select>
              </div>

              {quickWin.leadMagnetFollowup && (
                <>
                  <div>
                    <label htmlFor="lead-timeline" className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                      Kiedy chcesz zacząć?
                    </label>
                    <select
                      id="lead-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                    >
                      <option value="">Wybierz termin</option>
                      <option>Od razu</option>
                      <option>W ciągu 14 dni</option>
                      <option>W ciągu miesiąca</option>
                      <option>Najpierw konsultacja</option>
                    </select>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-400">
                    Po zapisie dostajesz material i krotka wiadomosc z dalszym krokiem, zeby latwiej zaczac wspolprace.
                  </div>
                </>
              )}
              <div className="space-y-2 text-sm text-zinc-400">
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-1" />
                  <span>
                    Wyrażam zgodę na kontakt i znam <a className="text-brand-400 hover:underline" href="/polityka-prywatnosci.html" target="_blank" rel="noreferrer">politykę prywatności</a>.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} className="mt-1" />
                  <span>Opcjonalnie: chcę otrzymywać wskazówki i oferty e-mail.</span>
                </label>
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
              </div>
              {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-400 text-zinc-950 font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Zapisywanie...' : 'Pobieram darmowy plan'}
              </button>
            </form>
          )}
        </article>
      </div>
    </section>
  );
};

export default TrafficEssentials;


