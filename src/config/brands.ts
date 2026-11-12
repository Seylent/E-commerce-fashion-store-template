import { catalog } from "./catalog";
import type { BrandConfig } from "./types";

const base: BrandConfig = {
  id: "atelier",
  name: "Atelier",
  logo: { text: "ATELIER" },
  favicon: "/favicon.svg",
  tagline: "A study in everyday form.",
  announcement: "COMPLIMENTARY SHIPPING ON ORDERS OVER $200",
  colors: { background: "#FFFFFF", surface: "#FFFFFF", text: "#0A0A0A", muted: "#6E6E6E", border: "#E5E5E5", accent: "#0A0A0A" },
  typography: { body: "\"Futura PT\", Futura, \"Century Gothic\", \"Apple Gothic\", sans-serif", display: "\"Futura PT\", Futura, \"Century Gothic\", \"Apple Gothic\", sans-serif" },
  currency: "USD",
  locale: "en-US",
  seo: { title: "Atelier — Considered clothing for every day", description: "Explore modern essentials, relaxed tailoring and considered layers. An original fashion storefront demo.", keywords: ["contemporary clothing", "modern essentials", "fashion"] },
  hero: { eyebrow: "THE ART OF EVERYDAY", title: "A quieter\nkind of presence.", image: "/images/hero-bg2.png", cta: "EXPLORE THE COLLECTION", caption: "FORM, FEELING, AND THE SPACE BETWEEN." },
  home: {
    newArrivalsTitle: "The latest, considered.",
    editorialEyebrow: "THE EDIT",
    editorialTitle: "Made for the moments in between.",
    editorialCopy: "Clothes with room to live in. A wardrobe shaped by thoughtful details, quiet confidence and the ease of being yourself.",
    editorialImage: "/images/editorial-espresso.png",
    storyEyebrow: "OUR POINT OF VIEW",
    storyTitle: "Less, but more meaningful.",
    storyCopy: "We believe getting dressed should feel instinctive. Our pieces balance a deliberate silhouette with the freedom to make it your own.",
    newsletterTitle: "A note from Atelier.",
    newsletterCopy: "New pieces, stories and a little inspiration. Delivered occasionally.",
    featuredSections: ["arrivals", "editorial", "collections", "story", "newsletter"],
  },
  collections: [
    { slug: "essentials", title: "The Essentials", eyebrow: "EVERYDAY OBJECTS", description: "Foundations made to find their place in every wardrobe.", image: "/images/product-shirt.png" },
    { slug: "form-study", title: "A Study in Form", eyebrow: "NEW PERSPECTIVES", description: "Expressive layers, subtle structure, endless possibility.", image: "/images/editorial-espresso.png" },
  ],
  products: catalog,
  social: { instagram: "https://instagram.com", pinterest: "https://pinterest.com" },
  contact: { email: "hello@example.com", location: "Online, everywhere", hours: "Monday–Friday, 9am–5pm" },
  shipping: { summary: "Complimentary standard delivery on orders over $200.", delivery: "Demo delivery estimate: 3–7 business days. Replace this text with your brand's actual rates and regions.", returns: "Demo return policy: request a return within 30 days of delivery. Replace this text with your actual policy before launch." },
};

const form: BrandConfig = {
  ...base,
  id: "form", name: "Form Studio", logo: { text: "FORM STUDIO" }, tagline: "Clothing for considered living.",
  colors: { ...base.colors, background: "#FFFFFF", text: "#0A0A0A", accent: "#0A0A0A" },
  seo: { ...base.seo, title: "Form Studio — Clothing for considered living" },
  hero: { ...base.hero, eyebrow: "FORM STUDIO / SEASON ONE", title: "Room to\nbe yourself.", cta: "DISCOVER THE EDIT" },
  home: { ...base.home, newArrivalsTitle: "Pieces to live in.", editorialTitle: "The beauty of everyday ritual.", storyTitle: "Designed with intention.", newsletterTitle: "Letters from Form." },
};

const object: BrandConfig = {
  ...base,
  id: "object", name: "Object / 01", logo: { text: "OBJECT / 01" }, tagline: "The uniform, reconsidered.",
  colors: { ...base.colors, background: "#FFFFFF", text: "#0A0A0A", accent: "#0A0A0A" },
  seo: { ...base.seo, title: "Object / 01 — The uniform, reconsidered" },
  hero: { ...base.hero, eyebrow: "CURRENT ISSUE", title: "Shape your\nown narrative.", cta: "VIEW CURRENT ISSUE" },
  home: { ...base.home, newArrivalsTitle: "The current issue.", editorialTitle: "A new language of dressing.", storyTitle: "Every detail earns its place.", newsletterTitle: "The Object dispatch." },
};

export const brandPresets = { atelier: base, form, object } satisfies Record<string, BrandConfig>;
export type BrandPreset = keyof typeof brandPresets;
export const activeBrand: BrandConfig = brandPresets[(process.env.NEXT_PUBLIC_BRAND_PRESET as BrandPreset) || "atelier"] ?? brandPresets.atelier;
