import { beforeEach, describe, expect, it } from "vitest";
import { catalog } from "@/config/catalog";
import { filterProducts, getVariant } from "./commerce";
import { useCart } from "@/store/cart";

describe("storefront shopping flow", () => {
  beforeEach(() => useCart.getState().clear());

  it("finds matching products and excludes unavailable sizes", () => {
    expect(filterProducts(catalog, { search: "trench" }).map((product) => product.slug)).toEqual(["the-city-trench"]);
    const unavailable = getVariant(catalog[0], "Black", "L");
    expect(unavailable?.inventory).toBe(0);
    expect(filterProducts([catalog[0]], { size: "L" })).toHaveLength(1);
  });

  it("keeps cart quantity within the selected variant inventory", () => {
    const product = catalog[0];
    const variant = getVariant(product, "White", "S")!;
    useCart.getState().add(product, variant, variant.inventory + 4);
    expect(useCart.getState().lines[0].quantity).toBe(variant.inventory);
    useCart.getState().update(useCart.getState().lines[0].key, 0, variant.inventory);
    expect(useCart.getState().lines[0].quantity).toBe(1);
    useCart.getState().remove(useCart.getState().lines[0].key);
    expect(useCart.getState().lines).toHaveLength(0);
  });

  it("refuses to add an unavailable variant", () => {
    const product = catalog[0];
    useCart.getState().add(product, getVariant(product, "Black", "L")!);
    expect(useCart.getState().lines).toHaveLength(0);
  });
});
