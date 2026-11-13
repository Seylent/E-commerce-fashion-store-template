export type ProductColor = { name: string; hex: string };
export type ProductVariant = {
  id: string;
  color: string;
  size: string;
  inventory: number;
};
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection: string;
  price: number;
  badge?: string;
  description: string;
  details: string[];
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
  /** Configurator overrides (demo only). */
  customImage?: string;
  hidden?: boolean;
};
export type Collection = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  image: string;
};
export type HomeSectionId = "arrivals" | "editorial" | "collections" | "story" | "newsletter";
/** Per-element typography overrides set in the configurator's «Текст» panel. */
export type TextStyle = {
  /** Full CSS font stack (omit = inherit the brand font). */
  family?: string;
  /** 300 Light / 400 Regular / 500 Medium / 700 Bold / 900 Black. */
  weight?: number;
  /** Font size in px. */
  size?: number;
  /** Line height in percent (110 = 110%). */
  lineHeight?: number;
  color?: string;
  /** Text opacity in percent. */
  opacity?: number;
  align?: "left" | "center" | "right" | "justify";
  shadow?: boolean;
  outline?: boolean;
  animation?: "none" | "fade" | "rise";
};

export type BrandConfig = {
  id: string;
  name: string;
  logo: { text: string; image?: string };
  favicon: string;
  tagline: string;
  announcement: string;
  colors: { background: string; surface: string; text: string; muted: string; border: string; accent: string };
  typography: { body: string; display: string };
  currency: string;
  locale: string;
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; title: string; image: string; mobileImage?: string; cta: string; caption: string; /** Photo darkening multiplier (configurator). 1 = template default. */ shade?: number };
  home: {
    newArrivalsTitle: string;
    editorialEyebrow: string;
    editorialTitle: string;
    editorialCopy: string;
    editorialImage: string;
    storyEyebrow: string;
    storyTitle: string;
    storyCopy: string;
    newsletterTitle: string;
    newsletterCopy: string;
    featuredSections: HomeSectionId[];
    /** Catalog grid density (configurator). Defaults: 4 desktop / 2 mobile. */
    desktopColumns?: 2 | 3 | 4;
    mobileColumns?: 1 | 2;
    homepageProductCount?: 4 | 8 | 12;
  };
  /** Per-element text styles, keyed by editable element id (e.g. "hero.title"). */
  textStyles?: Record<string, TextStyle>;
  collections: Collection[];
  products: Product[];
  social: { instagram?: string; pinterest?: string; tiktok?: string };
  contact: { email: string; location: string; hours: string };
  shipping: { summary: string; delivery: string; returns: string };
};
