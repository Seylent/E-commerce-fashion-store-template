"use client";

import type { BrandConfig, Product } from "@/config/types";
import { useConfigStore } from "@/store/config";

type Commit = (update: (current: BrandConfig) => BrandConfig) => void;
export type FeaturedSection = BrandConfig["home"]["featuredSections"][number];

export function useConfigCommit(): Commit {
  return useConfigStore((state) => state.commit);
}

/** Shallow patch of the top-level brand fields. */
export function patchBrand(commit: Commit, patch: Partial<BrandConfig>) {
  commit((current) => ({ ...current, ...patch }));
}

export function patchHero(commit: Commit, patch: Partial<BrandConfig["hero"]>) {
  commit((current) => ({ ...current, hero: { ...current.hero, ...patch } }));
}

export function patchHome(commit: Commit, patch: Partial<BrandConfig["home"]>) {
  commit((current) => ({ ...current, home: { ...current.home, ...patch } }));
}

export function patchColors(commit: Commit, patch: Partial<BrandConfig["colors"]>) {
  commit((current) => ({ ...current, colors: { ...current.colors, ...patch } }));
}

export function patchContact(commit: Commit, patch: Partial<BrandConfig["contact"]>) {
  commit((current) => ({ ...current, contact: { ...current.contact, ...patch } }));
}

export function toggleFeaturedSection(sections: FeaturedSection[], id: FeaturedSection) {
  return sections.includes(id)
    ? sections.filter((section) => section !== id)
    : [...sections, id];
}

export function moveFeaturedSection(sections: FeaturedSection[], id: string, direction: -1 | 1) {
  const index = sections.findIndex((section) => section === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= sections.length) return sections;

  const next = [...sections];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function orderFeaturedSections<T extends { id: string }>(sections: T[], order: readonly string[]) {
  const sectionsById = new Map(sections.map((section) => [section.id, section]));
  return order.flatMap((id) => {
    const section = sectionsById.get(id);
    return section ? [section] : [];
  });
}

export function patchProduct(commit: Commit, id: string, patch: Partial<Product>) {
  commit((current) => ({
    ...current,
    products: current.products.map((product) => (product.id === id ? { ...product, ...patch } : product)),
  }));
}

export function createDraftProduct(source: Product, id: string, slug: string, name: string): Product {
  const product = structuredClone(source);
  return {
    ...product,
    id,
    slug,
    name,
    price: 0,
    badge: undefined,
    customImage: undefined,
    hidden: true,
    variants: product.variants.map((variant, index) => ({
      ...variant,
      id: `${id}-variant-${index + 1}`,
    })),
  };
}

export function moveProduct(commit: Commit, id: string, direction: -1 | 1) {
  commit((current) => {
    const products = [...current.products];
    const index = products.findIndex((product) => product.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= products.length) return current;
    [products[index], products[target]] = [products[target], products[index]];
    return { ...current, products };
  });
}

export function removeProduct(commit: Commit, id: string) {
  commit((current) => {
    const products = current.products.filter((product) => product.id !== id);
    return products.length === current.products.length ? current : { ...current, products };
  });
}

export function visibleProducts(config: BrandConfig) {
  return config.products.filter((product) => !product.hidden);
}

/** Image actually displayed for a product (upload overrides the demo photo). */
export function productImage(product: Product, fallbackIndex = 0) {
  return product.customImage ?? product.images[fallbackIndex];
}
