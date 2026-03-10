export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontDisplay: string;
  fontBody: string;
}

export interface StudioConfig {
  studioName: string;
  defaultLocale: string;
  supportedLocales: string[];
  tagline: string;
  description: string;
  socialLinks: Record<string, string>;
  contactEmail: string;
  newsletter: { enabled: boolean; provider: string; actionUrl: string };
  theme: ThemeConfig;
}

export interface PresskitInfo {
  available: boolean;
  downloadUrl: string;
  updatedAt: string;
}

export interface TrailerInfo {
  available: boolean;
  youtubeId: string;
  label: string;
}

export interface GameDto {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  description: string;
  status: 'released' | 'early-access' | 'announced' | 'wip' | 'coming-soon';
  releaseDate: string;
  heroImage: string;
  logoImage: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
  platforms: string[];
  purchaseLinks: Record<string, string>;
  presskit: PresskitInfo;
  trailer: TrailerInfo;
  featured: boolean;
  order: number;
}

export interface PostDto {
  slug: string;
  title: string;
  publishedAt: string;
  coverImage: string;
  excerpt: string;
  body: string;
  tags: string[];
  relatedGame: string;
  published: boolean;
}
