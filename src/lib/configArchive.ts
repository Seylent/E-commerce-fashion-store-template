import { strToU8, zipSync } from "fflate";
import type { BrandConfig } from "@/config/types";

export type ExportRequest = {
  submittedAt: string;
  brandName: string;
  template: { id: string; name: string };
  contact: { name: string; contact: string; comment: string; features: string[] };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function decodeImageDataUrl(value: string) {
  const match = /^data:(image\/[a-z0-9.+-]+);base64,([\s\S]+)$/i.exec(value);
  if (!match) return null;

  try {
    const binary = atob(match[2].replace(/\s/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    const subtype = match[1].slice("image/".length).toLowerCase();
    const extension = subtype === "jpeg" ? "jpg" : subtype === "svg+xml" ? "svg" : subtype.split("+")[0];
    return { bytes, extension };
  } catch {
    return null;
  }
}

export function createConfigArchive(config: BrandConfig, request: ExportRequest, screenshot?: string | null) {
  const files: Record<string, Uint8Array> = {};
  const assetPaths = new Map<string, string>();
  let assetIndex = 0;

  const rewriteImages = (value: unknown): unknown => {
    if (typeof value === "string" && value.startsWith("data:image/")) {
      const existingPath = assetPaths.get(value);
      if (existingPath) return existingPath;
      const asset = decodeImageDataUrl(value);
      if (!asset) return value;

      assetIndex += 1;
      const path = `./assets/image-${String(assetIndex).padStart(3, "0")}.${asset.extension}`;
      assetPaths.set(value, path);
      files[path.slice(2)] = asset.bytes;
      return path;
    }
    if (Array.isArray(value)) return value.map(rewriteImages);
    if (isRecord(value)) {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, rewriteImages(entry)]));
    }
    return value;
  };

  const exportConfig = rewriteImages(config);
  const preview = screenshot ? decodeImageDataUrl(screenshot) : null;
  if (preview) files["preview.jpg"] = preview.bytes;
  files["config.json"] = strToU8(JSON.stringify(exportConfig, null, 2));
  files["template.json"] = strToU8(JSON.stringify(request.template, null, 2));
  files["request.json"] = strToU8(JSON.stringify({ ...request, preview: preview ? "preview.jpg" : null }, null, 2));

  return zipSync(files, { level: 1 });
}
