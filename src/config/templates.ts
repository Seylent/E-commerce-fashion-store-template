import type { HomeSectionId } from "./types";

export type TemplatePanel = "hero" | "products" | "editorial" | "collections" | "story" | "newsletter";

export type TemplateSection = {
  id: HomeSectionId;
  label: string;
  hint: string;
  thumbnail: string;
  panel: TemplatePanel;
};

export type SiteTemplate = {
  id: string;
  name: string;
  hero: { label: string; thumbnail: string; panel: "hero" };
  sections: { home: TemplateSection[] };
};

const templates = {
  fashion: {
    id: "fashion",
    name: "Atelier Fashion",
  hero: { label: "Головна", thumbnail: "/images/hero-bg2.png", panel: "hero" },
    sections: {
      home: [
        { id: "arrivals", label: "Новинки", hint: "Сітка товарів", thumbnail: "/images/product-tee.png", panel: "products" },
        { id: "editorial", label: "Редакційна добірка", hint: "Фото + лукбук", thumbnail: "/images/editorial-espresso.png", panel: "editorial" },
        { id: "collections", label: "Колекції", hint: "Картки колекцій", thumbnail: "/images/product-trench.png", panel: "collections" },
        { id: "story", label: "Історія бренду", hint: "Текстовий блок", thumbnail: "/images/editorial-hero.png", panel: "story" },
        { id: "newsletter", label: "Розсилка", hint: "Форма підписки", thumbnail: "/images/product-knit.png", panel: "newsletter" },
      ],
    },
  },
} satisfies Record<string, SiteTemplate>;

export type SiteTemplateId = keyof typeof templates;

export const activeTemplate: SiteTemplate = templates[
  (process.env.NEXT_PUBLIC_TEMPLATE_ID as SiteTemplateId) || "fashion"
] ?? templates.fashion;
