import type { Product } from "./types";

const createVariants = (id: string, colors: string[], sizes: string[]) =>
  colors.flatMap((color, colorIndex) =>
    sizes.map((size, sizeIndex) => ({
      id: `${id}-${color.toLowerCase().replaceAll(" ", "-")}-${size.toLowerCase()}`,
      color,
      size,
      inventory: colorIndex === 1 && sizeIndex === sizes.length - 1 ? 0 : 3 + ((colorIndex + sizeIndex) % 5),
    })),
  );

const item = (product: Omit<Product, "variants">): Product => ({
  ...product,
  variants: createVariants(product.id, product.colors.map((color) => color.name), product.sizes),
});

export const catalog: Product[] = [
  item({ id: "p01", slug: "form-poplin-shirt", name: "Form Poplin Shirt", category: "Tops", collection: "essentials", price: 145, badge: "NEW", description: "A considered silhouette in crisp, substantial cotton. Cut generously to move with you.", details: ["100% cotton poplin", "Relaxed, oversized fit", "Dropped shoulder and curved hem", "Machine wash cold"], images: ["/images/product-shirt.png", "/images/editorial-espresso.png"], colors: [{ name: "White", hex: "#f4f4f4" }, { name: "Black", hex: "#111111" }], sizes: ["XS", "S", "M", "L"] }),
  item({ id: "p02", slug: "heavyweight-tee", name: "Heavyweight Tee", category: "Tops", collection: "essentials", price: 88, badge: "BESTSELLER", description: "The daily uniform, reimagined in a dense cotton jersey with a naturally structured drape.", details: ["Premium heavyweight cotton jersey", "Relaxed boxy fit", "Ribbed neckline", "Machine wash cold"], images: ["/images/product-tee.png", "/images/editorial-hero.png"], colors: [{ name: "Charcoal", hex: "#3a3a3a" }, { name: "White", hex: "#f4f4f4" }], sizes: ["S", "M", "L", "XL"] }),
  item({ id: "p03", slug: "the-city-trench", name: "The City Trench", category: "Outerwear", collection: "form-study", price: 325, badge: "LIMITED", description: "An architectural layer for the in-between season. Soft structure, effortless movement.", details: ["Cotton blend twill", "Fully lined", "Removable belt", "Dry clean recommended"], images: ["/images/product-trench.png", "/images/editorial-hero.png"], colors: [{ name: "White", hex: "#f4f4f4" }, { name: "Black", hex: "#111111" }], sizes: ["XS", "S", "M", "L"] }),
  item({ id: "p04", slug: "studio-bomber", name: "Studio Bomber", category: "Outerwear", collection: "form-study", price: 260, description: "A softened take on the classic bomber, with volume through the body and a precise finish.", details: ["Soft technical shell", "Two-way zip closure", "Relaxed shape", "Dry clean recommended"], images: ["/images/product-bomber.png", "/images/editorial-espresso.png"], colors: [{ name: "Black", hex: "#111111" }, { name: "Grey", hex: "#8a8a8a" }], sizes: ["S", "M", "L", "XL"] }),
  item({ id: "p05", slug: "tailored-wide-trouser", name: "Tailored Wide Trouser", category: "Bottoms", collection: "essentials", price: 185, description: "Easy volume meets a clean tailored line. An everyday piece that holds its shape.", details: ["Mid-weight suiting fabric", "Wide leg", "Concealed hook closure", "Dry clean recommended"], images: ["/images/product-trouser.png", "/images/product-shirt.png"], colors: [{ name: "Black", hex: "#111111" }, { name: "Light Grey", hex: "#b0b0b0" }], sizes: ["XS", "S", "M", "L"] }),
  item({ id: "p06", slug: "everyday-layer", name: "Everyday Layer", category: "Knitwear", collection: "form-study", price: 175, description: "Quietly essential knitwear with a soft hand feel and relaxed shape.", details: ["Soft cotton blend yarn", "Relaxed fit", "Ribbed cuffs and hem", "Hand wash cold"], images: ["/images/product-knit.png", "/images/editorial-espresso.png"], colors: [{ name: "White", hex: "#f4f4f4" }, { name: "Black", hex: "#111111" }], sizes: ["S", "M", "L", "XL"] }),
];
