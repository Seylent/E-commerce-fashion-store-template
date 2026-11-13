import { describe, expect, it } from "vitest";
import { catalog } from "@/config/catalog";
import { createDraftProduct, moveFeaturedSection, orderFeaturedSections, removeProduct, toggleFeaturedSection, type FeaturedSection } from "./configMutations";
import { defaultConfig } from "@/store/config";

describe("featured section editing", () => {
  it("moves a section one position without mutating the source", () => {
    const sections: FeaturedSection[] = ["arrivals", "editorial", "story"];

    expect(moveFeaturedSection([...sections], "story", -1)).toEqual([
      "arrivals",
      "story",
      "editorial",
    ]);
    expect(sections).toEqual(["arrivals", "editorial", "story"]);
  });

  it("does not move a missing or out-of-bounds section", () => {
    const sections: FeaturedSection[] = ["arrivals", "editorial"];

    expect(moveFeaturedSection([...sections], "missing", 1)).toEqual(sections);
    expect(moveFeaturedSection([...sections], "arrivals", -1)).toEqual(sections);
  });

  it("toggles section visibility without duplicates", () => {
    expect(toggleFeaturedSection(["arrivals"], "story")).toEqual(["arrivals", "story"]);
    expect(toggleFeaturedSection(["arrivals", "story"], "story")).toEqual(["arrivals"]);
  });

  it("shows enabled sections in the same order as the preview", () => {
    const sections = [
      { id: "arrivals", label: "Новинки" },
      { id: "editorial", label: "Добірка" },
      { id: "story", label: "Історія" },
    ];

    expect(orderFeaturedSections(sections, ["story", "arrivals", "unknown"]))
      .toEqual([sections[2], sections[0]]);
  });
});

describe("new product drafts", () => {
  it("creates a hidden independent copy with fresh product and variant ids", () => {
    const source = catalog[0];
    const draft = createDraftProduct(source, "draft-1", "new-item-1", "Новий товар 1");

    expect(draft).toMatchObject({ id: "draft-1", slug: "new-item-1", name: "Новий товар 1", price: 0, hidden: true });
    expect(draft.variants).not.toBe(source.variants);
    expect(draft.variants[0].id).toBe("draft-1-variant-1");
    expect(source.name).not.toBe(draft.name);
  });

  it("removes only the chosen product and leaves an unknown id untouched", () => {
    let config = { ...defaultConfig, products: [catalog[0], catalog[1]] };
    const commit = (update: (current: typeof config) => typeof config) => { config = update(config); };

    removeProduct(commit, catalog[0].id);
    expect(config.products.map((product) => product.id)).toEqual([catalog[1].id]);

    const before = config;
    removeProduct(commit, "missing-product");
    expect(config).toBe(before);
  });
});
