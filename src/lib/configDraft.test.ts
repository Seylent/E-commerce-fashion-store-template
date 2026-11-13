import { describe, expect, it } from "vitest";
import { defaultConfig } from "@/store/config";
import { isBrandConfig } from "./configDraft";

describe("local configurator draft validation", () => {
  it("accepts a complete brand configuration", () => {
    expect(isBrandConfig(structuredClone(defaultConfig))).toBe(true);
  });

  it("rejects incomplete or malformed stored values", () => {
    expect(isBrandConfig({ ...defaultConfig, products: null })).toBe(false);
    expect(isBrandConfig(null)).toBe(false);
  });
});
