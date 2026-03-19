import { defaultTrainerSlug, trainerProfiles } from './trainerProfiles';
import fallbackTrainer from './fallbackTrainer';
import { emailTrainerPersonalization } from './emailTrainerPersonalization';
import { poznanTop20ManualOverrides } from './poznanTop20ManualOverrides';
import { torunTrainerProfiles } from './torunTrainerProfiles';
import { poznanTrainerProfiles } from './poznanTrainerProfiles';
import { gdanskTrainerProfiles } from './gdanskTrainerProfiles';
import { gdanskTop8ManualOverrides } from './gdanskTop8ManualOverrides';
import { gdanskManualVoiceFixes } from './gdanskManualVoiceFixes';
import type { TrainerProfile } from './trainerProfile';
import { fixMojibake, fixTrainerProfileText } from '../utils/fixMojibake';

const normalizeGeneratedCopy = (value: string): string =>
  fixMojibake(value)
    .replaceAll(
      'To zależy od profilu trenera, ale strona ma jasno prowadzić do najlepszego wariantu kontaktu.',
      'To zależy od modelu współpracy, ale już na starcie warto wybrać najwygodniejszą formę kontaktu i ustalić najlepszy wariant działania.',
    )
    .replaceAll(
      'Strona ma szybko wyjaśnić proces i skierować do jednego, konkretnego działania.',
      'Od razu wiadomo, jak wygląda proces i jaki pierwszy krok warto zrobić.',
    )
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

const normalizeTrainerProfile = (profile: TrainerProfile): TrainerProfile => {
  const fixed = fixTrainerProfileText(profile);
  return {
    ...fixed,
    heroText: normalizeGeneratedCopy(fixed.heroText),
    aboutHeading: normalizeGeneratedCopy(fixed.aboutHeading),
    aboutText: normalizeGeneratedCopy(fixed.aboutText),
    nicheLabel: fixed.nicheLabel ? normalizeGeneratedCopy(fixed.nicheLabel) : fixed.nicheLabel,
    quickWin: fixed.quickWin ? normalizeGeneratedCopy(fixed.quickWin) : fixed.quickWin,
    researchCue: fixed.researchCue ? normalizeGeneratedCopy(fixed.researchCue) : fixed.researchCue,
    leadMagnetTitle: fixed.leadMagnetTitle ? normalizeGeneratedCopy(fixed.leadMagnetTitle) : fixed.leadMagnetTitle,
    leadMagnetText: fixed.leadMagnetText ? normalizeGeneratedCopy(fixed.leadMagnetText) : fixed.leadMagnetText,
    valueProps: fixed.valueProps?.map((item) => ({
      title: normalizeGeneratedCopy(item.title),
      desc: normalizeGeneratedCopy(item.desc),
    })),
    pricingPlans: fixed.pricingPlans?.map((plan) => ({
      ...plan,
      name: normalizeGeneratedCopy(plan.name),
      subtitle: normalizeGeneratedCopy(plan.subtitle),
      features: plan.features.map((feature) => normalizeGeneratedCopy(feature)),
      ctaLabel: normalizeGeneratedCopy(plan.ctaLabel),
    })),
    faqItems: fixed.faqItems?.map((item) => ({
      q: normalizeGeneratedCopy(item.q),
      a: normalizeGeneratedCopy(item.a),
    })),
  };
};

const allTrainerProfiles: Record<string, TrainerProfile> = {
  ...trainerProfiles,
  ...torunTrainerProfiles,
  ...poznanTrainerProfiles,
  ...gdanskTrainerProfiles,
};

Object.entries(gdanskTop8ManualOverrides).forEach(([slug, override]) => {
  if (!allTrainerProfiles[slug]) {
    return;
  }

  allTrainerProfiles[slug] = {
    ...allTrainerProfiles[slug],
    ...override,
  };
});

const getSlugFromEnv = (): string | null => {
  const envSlug = (import.meta.env.VITE_CLIENT_SLUG || '').trim().toLowerCase();
  if (envSlug && allTrainerProfiles[envSlug]) {
    return envSlug;
  }
  return null;
};

const getSlugFromPath = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const querySlug = (new URLSearchParams(window.location.search).get('trainer') || '').trim().toLowerCase();
  if (querySlug && allTrainerProfiles[querySlug]) {
    return querySlug;
  }

  const match = window.location.pathname.match(/^\/t\/([a-z0-9-]+)/i);
  if (match && allTrainerProfiles[match[1]]) {
    return match[1];
  }

  return null;
};

const getSlugFromHostname = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const host = window.location.hostname.toLowerCase();
  const firstLabel = host.split('.')[0];
  const allSlugs = Object.keys(allTrainerProfiles);

  if (allTrainerProfiles[firstLabel]) {
    return firstLabel;
  }

  const candidate = firstLabel.startsWith('trener-')
    ? firstLabel.replace(/^trener-/, '')
    : firstLabel;

  if (allTrainerProfiles[candidate]) {
    return candidate;
  }

  const prefixMatches = allSlugs.filter((slug) => slug.startsWith(candidate));
  if (prefixMatches.length === 1) {
    return prefixMatches[0];
  }

  if (prefixMatches.length > 1) {
    return prefixMatches.sort((a, b) => a.length - b.length)[0];
  }

  return null;
};

const resolvedSlug = getSlugFromEnv() || getSlugFromPath() || getSlugFromHostname();

const useLocalDefault =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const baseTrainer =
  (resolvedSlug && allTrainerProfiles[resolvedSlug]) ||
  (useLocalDefault ? allTrainerProfiles[defaultTrainerSlug] : null) ||
  fallbackTrainer;

const trainerOverride = {
  ...(emailTrainerPersonalization[baseTrainer.slug] || {}),
  ...(poznanTop20ManualOverrides[baseTrainer.slug] || {}),
  ...(gdanskManualVoiceFixes[baseTrainer.slug] || {}),
};

const currentTrainer: TrainerProfile = trainerOverride
  ? { ...baseTrainer, ...trainerOverride }
  : baseTrainer;

export default normalizeTrainerProfile(currentTrainer);
