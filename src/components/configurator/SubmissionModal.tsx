"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { useBrand } from "@/store/config";
import { useEditor } from "@/store/editor";

const features = [
  { id: "telegram-orders", label: "Замовлення через Telegram" },
  { id: "online-payment", label: "Онлайн-оплата" },
  { id: "admin-panel", label: "Адмінпанель" },
  { id: "delivery", label: "Інтеграція доставки" },
  { id: "other", label: "Інші побажання" },
];

type SubmissionStatus = "idle" | "capturing" | "sending" | "success" | "error";

function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(name || "store").toLowerCase().replace(/\s+/g, "-")}-config.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function capturePreview(): Promise<string | null> {
  try {
    const { toJpeg } = await import("html-to-image");
    const node = document.getElementById("configurator-preview");
    if (!node) return null;
    return await toJpeg(node, { quality: 0.72, filter: (element) => !(element instanceof HTMLElement && element.dataset && element.dataset.editable) });
  } catch {
    return null;
  }
}

export function SubmissionModal() {
  const config = useBrand();
  const close = useEditor((state) => state.closeSubmission);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [comment, setComment] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [message, setMessage] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const endpoint = process.env.NEXT_PUBLIC_SUBMIT_ENDPOINT;

  useEffect(() => firstFieldRef.current?.focus(), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const brandName = config.name.trim() || "Без назви";
  const canSubmit = name.trim().length > 1 && contact.trim().length > 3;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || status === "sending" || status === "capturing") return;
    setStatus("capturing");
    const screenshot = await capturePreview();
    const payload = {
      submittedAt: new Date().toISOString(),
      contact: { name: name.trim(), contact: contact.trim(), comment: comment.trim(), features: selectedFeatures },
      brandName,
      screenshot,
      config,
    };
    if (!endpoint) {
      downloadJson(brandName, payload);
      setMessage("Endpoint не налаштовано, тому конфігурацію завантажено JSON-файлом. Надішліть його розробнику будь-яким зручним способом.");
      setStatus("success");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus("success");
      setMessage("Заявку надіслано. Ми зв'яжемося з вами найближчим часом.");
    } catch {
      setStatus("error");
      setMessage("Не вдалося надіслати заявку. Спробуйте ще раз або збережіть конфігурацію файлом.");
    }
  };

  const toggleFeature = (id: string) => setSelectedFeatures((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return <div className="cfg-modal-backdrop" onClick={close}>
    <div className="cfg-modal" role="dialog" aria-modal="true" aria-labelledby="submission-title" onClick={(event) => event.stopPropagation()}>
      <button type="button" className="cfg-modal-close" aria-label="Закрити" onClick={close}><X size={20} /></button>
      <span className="eyebrow">КРОК ОСТАННІЙ</span>
      <h2 id="submission-title">Надіслати мій макет</h2>
      {status === "success" ? (
        <div className="cfg-modal-success">
          <p>{message}</p>
          <button type="button" className="cfg-primary-button" onClick={close}>Готово</button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <label className="cfg-field"><span className="cfg-label">Ім'я *</span><input ref={firstFieldRef} value={name} maxLength={60} autoComplete="name" onChange={(event) => setName(event.target.value)} placeholder="Ваше ім'я" /></label>
          <label className="cfg-field"><span className="cfg-label">Telegram або спосіб зв'язку *</span><input value={contact} maxLength={80} onChange={(event) => setContact(event.target.value)} placeholder="@username або телефон" /></label>
          <label className="cfg-field"><span className="cfg-label">Назва бренду</span><input value={brandName} readOnly /></label>
          <div className="cfg-field">
            <span className="cfg-label">Додаткові функції</span>
            <div className="cfg-features">
              {features.map((feature) => (
                <label key={feature.id} className="cfg-feature">
                  <input type="checkbox" checked={selectedFeatures.includes(feature.id)} onChange={() => toggleFeature(feature.id)} />
                  <span>{feature.label}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="cfg-field"><span className="cfg-label">Побажання</span><textarea rows={3} maxLength={600} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Розкажіть, яким має бути ваш магазин" /></label>
          <button type="submit" className="cfg-primary-button" disabled={!canSubmit || status === "sending" || status === "capturing"}>
            <Send size={14} /> {status === "capturing" ? "Готуємо прев'ю…" : status === "sending" ? "Надсилаємо…" : "Надіслати заявку"}
          </button>
          {status === "error" && <p className="cfg-error" role="alert">{message} <button type="button" className="cfg-text-button" onClick={() => downloadJson(brandName, { contact: { name, contact, comment }, config })}>Завантажити JSON</button></p>}
          <p className="cfg-hint">Ми отримаємо ваші налаштування, кольори, фото та побажання. Магазин публікується після узгодження замовлення.</p>
        </form>
      )}
    </div>
  </div>;
}
