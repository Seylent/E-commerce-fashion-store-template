import type { BrandConfig, Product, ProductVariant } from "@/config/types";

export function formatPrice(amount: number, brand: Pick<BrandConfig, "currency" | "locale">) {
  return new Intl.NumberFormat(brand.locale, { style: "currency", currency: brand.currency, maximumFractionDigits: 0 }).format(amount);
}

export function findProduct(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getVariant(product: Product, color: string, size: string): ProductVariant | undefined {
  return product.variants.find((variant) => variant.color === color && variant.size === size);
}

export function filterProducts(products: Product[], filters: { search?: string; category?: string; size?: string; color?: string; collection?: string; sort?: string }) {
  const search = filters.search?.trim().toLowerCase();
  const result = products.filter((product) =>
    (!search || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search)) &&
    (!filters.category || product.category === filters.category) &&
    (!filters.collection || product.collection === filters.collection) &&
    (!filters.size || product.variants.some((variant) => variant.size === filters.size && variant.inventory > 0)) &&
    (!filters.color || product.colors.some((color) => color.name === filters.color)),
  );
  if (filters.sort === "price-asc") return result.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") return result.sort((a, b) => b.price - a.price);
  if (filters.sort === "name") return result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}
