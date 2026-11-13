import type { Product } from "@/config/types";

type SearchableProduct = Pick<Product, "name" | "category" | "description" | "hidden">;

export function searchProducts<T extends SearchableProduct>(products: readonly T[], query: string): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) return [];

  return products
    .filter((product) => !product.hidden &&
      `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase().includes(normalizedQuery))
    .slice(0, 6);
}
