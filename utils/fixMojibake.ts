import type { TrainerProfile } from '../data/trainerProfile';

const POLISH_LETTERS_RE = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g;
const MOJIBAKE_HINT_RE = /[ÃÅÄĹĂÂâ�]|�|[³¹æêñœŸ¿£ÆÊÑŒ¯]/;
const GARBAGE_RE = /[ÃÅÄĹĂÂâ�]|�/g;

const CP1250_CHAR_MAP: Record<string, string> = {
  '¹': 'ą',
  'æ': 'ć',
  'ê': 'ę',
  '³': 'ł',
  'ñ': 'ń',
  'œ': 'ś',
  'Ÿ': 'ź',
  '¿': 'ż',
  '¥': 'Ą',
  'Æ': 'Ć',
  'Ê': 'Ę',
  '£': 'Ł',
  'Ñ': 'Ń',
  'Œ': 'Ś',
  '¯': 'Ż',
};

const CP1252_BYTE_MAP: Record<string, number> = {
  '€': 0x80,
  '‚': 0x82,
  'ƒ': 0x83,
  '„': 0x84,
  '…': 0x85,
  '†': 0x86,
  '‡': 0x87,
  'ˆ': 0x88,
  '‰': 0x89,
  'Š': 0x8a,
  '‹': 0x8b,
  'Œ': 0x8c,
  'Ž': 0x8e,
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
  '˜': 0x98,
  '™': 0x99,
  'š': 0x9a,
  '›': 0x9b,
  'œ': 0x9c,
  'ž': 0x9e,
  'Ÿ': 0x9f,
};

const COMMON_SEQUENCE_FIXES: Array<[string, string]> = [
  ['Ä…', 'ą'],
  ['Ä‡', 'ć'],
  ['Ä™', 'ę'],
  ['Ä„', 'Ą'],
  ['Ä†', 'Ć'],
  ['Ä', 'Ę'],
  ['Å‚', 'ł'],
  ['Å', 'Ł'],
  ['Å„', 'ń'],
  ['Åƒ', 'Ń'],
  ['Å›', 'ś'],
  ['Åš', 'Ś'],
  ['Åº', 'ź'],
  ['Å¹', 'Ź'],
  ['Å¼', 'ż'],
  ['Å»', 'Ż'],
  ['Ã³', 'ó'],
  ['Ã“', 'Ó'],
  ['Ăł', 'ó'],
  ['Ă“', 'Ó'],
  ['Ă„â€¦', 'ą'],
  ['Ă„â„˘', 'ę'],
  ['Ä‚Ĺ‚', 'ó'],
  ['Â', ''],
];

const scoreText = (value: string): number => {
  const polishLetters = (value.match(POLISH_LETTERS_RE) || []).length;
  const garbage = (value.match(GARBAGE_RE) || []).length;
  const replacementChars = (value.match(/�/g) || []).length;
  return polishLetters * 3 - garbage * 4 - replacementChars * 8;
};

const decodeUtf8FromLatinBytes = (value: string): string => {
  const bytes: number[] = [];
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }

    const cp1252Byte = CP1252_BYTE_MAP[ch];
    if (cp1252Byte !== undefined) {
      bytes.push(cp1252Byte);
      continue;
    }

    return value;
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bytes));
  } catch {
    return value;
  }
};

const replaceCp1250Singles = (value: string): string =>
  Array.from(value, (ch) => CP1250_CHAR_MAP[ch] || ch).join('');

const replaceCommonSequences = (value: string): string => {
  let out = value;
  let changed = true;
  while (changed) {
    changed = false;
    for (const [bad, good] of COMMON_SEQUENCE_FIXES) {
      if (!out.includes(bad)) {
        continue;
      }
      out = out.split(bad).join(good);
      changed = true;
    }
  }
  return out;
};

export const fixMojibake = (value: string): string => {
  if (!value || !MOJIBAKE_HINT_RE.test(value)) {
    return value;
  }

  let out = value;
  for (let i = 0; i < 3; i += 1) {
    const decoded = decodeUtf8FromLatinBytes(out);
    if (decoded === out) {
      break;
    }
    if (scoreText(decoded) < scoreText(out)) {
      break;
    }
    out = decoded;
  }

  out = replaceCp1250Singles(out);
  out = replaceCommonSequences(out);
  return out;
};

const fixMaybe = (value?: string): string | undefined =>
  value ? fixMojibake(value) : value;

export const fixTrainerProfileText = (profile: TrainerProfile): TrainerProfile => ({
  ...profile,
  fullName: fixMojibake(profile.fullName),
  brandName: fixMojibake(profile.brandName),
  navName: fixMojibake(profile.navName),
  brandTagline: fixMojibake(profile.brandTagline),
  city: fixMojibake(profile.city),
  address: fixMojibake(profile.address),
  category: fixMojibake(profile.category),
  phone: fixMojibake(profile.phone),
  email: fixMojibake(profile.email),
  website: fixMojibake(profile.website),
  instagram: fixMojibake(profile.instagram),
  facebook: fixMojibake(profile.facebook),
  heroTitleTop: fixMojibake(profile.heroTitleTop),
  heroTitleAccent: fixMojibake(profile.heroTitleAccent),
  heroText: fixMojibake(profile.heroText),
  aboutHeading: fixMojibake(profile.aboutHeading),
  aboutText: fixMojibake(profile.aboutText),
  nicheLabel: fixMaybe(profile.nicheLabel),
  quickWin: fixMaybe(profile.quickWin),
  researchCue: fixMaybe(profile.researchCue),
  researchSource: fixMaybe(profile.researchSource),
  researchConfidence: fixMaybe(profile.researchConfidence),
  leadMagnetTitle: fixMaybe(profile.leadMagnetTitle),
  leadMagnetText: fixMaybe(profile.leadMagnetText),
  valueProps: profile.valueProps?.map((item) => ({
    title: fixMojibake(item.title),
    desc: fixMojibake(item.desc),
  })),
  pricingPlans: profile.pricingPlans?.map((plan) => ({
    ...plan,
    name: fixMojibake(plan.name),
    subtitle: fixMojibake(plan.subtitle),
    price: fixMojibake(plan.price),
    period: fixMojibake(plan.period),
    features: plan.features.map((feature) => fixMojibake(feature)),
    ctaLabel: fixMojibake(plan.ctaLabel),
  })),
  faqItems: profile.faqItems?.map((item) => ({
    q: fixMojibake(item.q),
    a: fixMojibake(item.a),
  })),
});
