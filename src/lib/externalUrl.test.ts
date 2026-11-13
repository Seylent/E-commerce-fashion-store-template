import { describe, expect, it } from "vitest";
import { getSafeExternalUrl } from "./externalUrl";

describe("external links", () => {
  it("allows HTTPS URLs and rejects unsafe or malformed schemes", () => {
    expect(getSafeExternalUrl("https://instagram.com/atelier")).toBe("https://instagram.com/atelier");
    expect(getSafeExternalUrl("javascript:alert(1)")).toBeUndefined();
    expect(getSafeExternalUrl("not a URL")).toBeUndefined();
  });
});
