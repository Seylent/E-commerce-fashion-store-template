import { describe, expect, it } from "vitest";
import { searchProducts } from "./searchProducts";

const products = [
  { id: "tee", name: "Heavyweight Tee", category: "Tops", description: "Cotton layer", hidden: false },
  { id: "shirt", name: "Poplin Shirt", category: "Shirts", description: "Relaxed cotton" },
  { id: "hidden", name: "Hidden Jacket", category: "Outerwear", description: "Not for sale", hidden: true },
];

describe("searchProducts", () => {
  it("matches trimmed, case-insensitive text across product fields", () => {
    expect(searchProducts(products, "  COTTON ").map(({ id }) => id)).toEqual(["tee", "shirt"]);
  });

  it("does not show hidden products or results for an empty query", () => {
    expect(searchProducts(products, "hidden")).toEqual([]);
    expect(searchProducts(products, "   ")).toEqual([]);
  });
});
