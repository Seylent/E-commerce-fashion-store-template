import type { BrandConfig } from "@/config/types";

const DATABASE_NAME = "atelier-configurator";
const STORE_NAME = "drafts";
const DRAFT_KEY = "brand-config-v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isBrandConfig(value: unknown): value is BrandConfig {
  if (!isRecord(value) || !isRecord(value.colors) || !isRecord(value.typography) || !isRecord(value.hero) || !isRecord(value.home) || !isRecord(value.seo) || !isRecord(value.contact) || !isRecord(value.shipping) || !isRecord(value.logo) || !isRecord(value.social)) return false;
  return typeof value.id === "string" && typeof value.name === "string" &&
    typeof value.favicon === "string" && typeof value.currency === "string" && typeof value.locale === "string" &&
    typeof value.colors.background === "string" && typeof value.colors.surface === "string" &&
    typeof value.colors.text === "string" && typeof value.colors.muted === "string" &&
    typeof value.colors.border === "string" && typeof value.colors.accent === "string" &&
    typeof value.typography.body === "string" && typeof value.typography.display === "string" &&
    typeof value.hero.title === "string" && typeof value.hero.image === "string" &&
    Array.isArray(value.home.featuredSections) && Array.isArray(value.products) &&
    Array.isArray(value.collections) && typeof value.contact.email === "string";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Локальне сховище недоступне в цьому браузері."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Не вдалося відкрити локальне сховище."));
  });
}

export async function loadConfigDraft(): Promise<BrandConfig | null> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(DRAFT_KEY);
    let draft: unknown;
    request.onsuccess = () => { draft = request.result; };
    transaction.oncomplete = () => {
      database.close();
      resolve(isBrandConfig(draft) ? draft : null);
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Не вдалося прочитати чернетку."));
    };
  });
}

export async function saveConfigDraft(config: BrandConfig): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(config, DRAFT_KEY);
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error("Не вдалося зберегти чернетку."));
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error("Збереження чернетки скасовано."));
    };
  });
}
