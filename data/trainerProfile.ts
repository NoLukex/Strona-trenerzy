export interface TrainerTheme {
  accent: string;
  accentDark: string;
  accentSoft: string;
  bg: string;
  bgSoft: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  textMuted: string;
}

export interface TrainerProfile {
  slug: string;
  fullName: string;
  brandName: string;
  navName: string;
  brandTagline: string;
  city: string;
  address: string;
  category: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  rating: number;
  heroTitleTop: string;
  heroTitleAccent: string;
  heroText: string;
  aboutHeading: string;
  aboutText: string;
  theme: TrainerTheme;
}
