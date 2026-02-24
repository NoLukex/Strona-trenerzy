import { defaultTrainerSlug, trainerProfiles } from './trainerProfiles';
import fallbackTrainer from './fallbackTrainer';
import { emailTrainerPersonalization } from './emailTrainerPersonalization';
import { torunTrainerProfiles } from './torunTrainerProfiles';
import type { TrainerProfile } from './trainerProfile';

const allTrainerProfiles: Record<string, TrainerProfile> = {
  ...trainerProfiles,
  ...torunTrainerProfiles,
};

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

const trainerOverride = emailTrainerPersonalization[baseTrainer.slug];

const currentTrainer: TrainerProfile = trainerOverride
  ? { ...baseTrainer, ...trainerOverride }
  : baseTrainer;

export default currentTrainer;
