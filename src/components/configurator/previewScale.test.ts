import { describe, expect, it } from "vitest";
import { getPreviewScale } from "./previewScale";

describe("getPreviewScale", () => {
  it("fits the full Pro Max frame within the available canvas", () => {
    expect(getPreviewScale(390, 700)).toBeCloseTo((700 - 16) / 956);
  });

  it("does not enlarge the frame when the canvas is larger", () => {
    expect(getPreviewScale(1200, 1100)).toBe(1);
  });

  it("returns zero when there is no space for the frame", () => {
    expect(getPreviewScale(8, 8)).toBe(0);
  });
});
