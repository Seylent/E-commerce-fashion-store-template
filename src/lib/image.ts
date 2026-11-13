/** Client-side image preparation: uploads become compact data URLs for preview
 *  and JSON export (next/image cannot optimize inline data). */

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export class ImageUploadError extends Error {}

export async function fileToDataUrl(file: File, maxDimension = 1600, quality = 0.85): Promise<string> {
  if (!file.type.startsWith("image/")) throw new ImageUploadError("Файл не є зображенням.");
  if (file.size > MAX_FILE_BYTES) throw new ImageUploadError("Файл завеликий (максимум 10 МБ).");

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new ImageUploadError("Не вдалося обробити зображення.");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = canvas.toDataURL("image/webp", quality);
  if (webp.startsWith("data:image/webp")) return webp;
  return canvas.toDataURL("image/jpeg", quality);
}
