import { describe, expect, it } from "vitest";
import { activeTemplate } from "./templates";

describe("active site template", () => {
  it("defines the available home sections once, in page order", () => {
    const ids = activeTemplate.sections.home.map((section) => section.id);

    expect(ids).toEqual(["arrivals", "editorial", "collections", "story", "newsletter"]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
