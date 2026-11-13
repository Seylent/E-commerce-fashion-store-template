const MAX_BODY_BYTES = 8 * 1024 * 1024;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const requestsByIp = new Map<string, number[]>();

const featureIds = new Set(["telegram-orders", "online-payment", "admin-panel", "delivery", "other"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length <= maxLength ? value.trim() : null;
}

function allowed(ip: string, now: number) {
  const recent = (requestsByIp.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= 3) {
    requestsByIp.set(ip, recent);
    return false;
  }
  requestsByIp.set(ip, [...recent, now]);
  return true;
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return Response.json({ error: "Telegram is not configured." }, { status: 503 });

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) return Response.json({ error: "Request is too large." }, { status: 413 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowed(ip, Date.now())) return Response.json({ error: "Too many requests." }, { status: 429 });

  let payload: unknown;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return Response.json({ error: "Request is too large." }, { status: 413 });
    }
    payload = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!isRecord(payload) || !isRecord(payload.contact) || !isRecord(payload.template) || !isRecord(payload.config)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = text(payload.contact.name, 60);
  const contact = text(payload.contact.contact, 80);
  const comment = text(payload.contact.comment, 600);
  const brandName = text(payload.brandName, 60);
  const templateName = text(payload.template.name, 80);
  const templateId = text(payload.template.id, 60);
  const features = payload.contact.features;
  if (!name || name.length < 2 || !contact || contact.length < 4 || comment === null || !brandName || !templateName || !templateId ||
      !Array.isArray(features) || features.length > featureIds.size || features.some((feature) => typeof feature !== "string" || !featureIds.has(feature))) {
    return Response.json({ error: "Please check the submitted fields." }, { status: 422 });
  }

  const document = JSON.stringify({
    submittedAt: new Date().toISOString(),
    contact: { name, contact, comment, features },
    brandName,
    template: { id: templateId, name: templateName },
    config: payload.config,
  }, null, 2);
  if (new TextEncoder().encode(document).byteLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Configuration is too large to send." }, { status: 413 });
  }

  const caption = [
    `Нова заявка на макет: ${brandName}`,
    `Ім'я: ${name}`,
    `Контакт: ${contact}`,
    `Шаблон: ${templateName}`,
    features.length ? `Функції: ${features.join(", ")}` : "",
    comment ? `Побажання: ${comment}` : "",
  ].filter(Boolean).join("\n").slice(0, 1024);
  const form = new FormData();
  form.set("chat_id", chatId);
  form.set("caption", caption);
  form.set("document", new Blob([document], { type: "application/json" }), `${brandName.replace(/[\\/:*?"<>|]/g, "-")}-config.json`);

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) return Response.json({ error: "Unable to send the request." }, { status: 502 });
    const result: unknown = await response.json();
    if (!isRecord(result) || result.ok !== true) return Response.json({ error: "Unable to send the request." }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unable to send the request." }, { status: 502 });
  }
}
