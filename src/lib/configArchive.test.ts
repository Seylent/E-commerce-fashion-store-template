import { describe, expect, it } from "vitest";
import { unzipSync, strFromU8 } from "fflate";
import { defaultConfig } from "@/store/config";
import { createConfigArchive } from "./configArchive";

describe("config archive export", () => {
  it("packages config, request details, and uploaded image assets", () => {
    const config = structuredClone(defaultConfig);
    config.hero.image = "data:image/png;base64,aGVsbG8=";
    const archive = createConfigArchive(config, {
      submittedAt: "2026-11-12T12:00:00.000Z",
      brandName: "Atelier",
      template: { id: "fashion", name: "Atelier Fashion" },
      contact: { name: "Alex", contact: "@atelier", comment: "Ready", features: ["delivery"] },
    });
    const files = unzipSync(archive);
    const exportedConfig = JSON.parse(strFromU8(files["config.json"]));
    const request = JSON.parse(strFromU8(files["request.json"]));

    expect(exportedConfig.hero.image).toBe("./assets/image-001.png");
    expect(strFromU8(files["assets/image-001.png"])).toBe("hello");
    expect(request.contact.name).toBe("Alex");
    expect(JSON.parse(strFromU8(files["template.json"]))).toEqual({ id: "fashion", name: "Atelier Fashion" });
  });

  it("keeps ordinary template image paths unchanged", () => {
    const config = structuredClone(defaultConfig);
    expect(config.hero.image).toMatch(/^\//);
    const files = unzipSync(createConfigArchive(config, {
      submittedAt: "2026-11-12T12:00:00.000Z",
      brandName: "Atelier",
      template: { id: "fashion", name: "Atelier Fashion" },
      contact: { name: "Alex", contact: "@atelier", comment: "", features: [] },
    }));
    expect(JSON.parse(strFromU8(files["config.json"])).hero.image).toBe(config.hero.image);
  });
});
