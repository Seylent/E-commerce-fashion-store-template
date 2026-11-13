"use client";

import { useEffect, useRef, useState } from "react";
import { Archive, Send, X } from "lucide-react";
import { useBrand } from "@/store/config";
import { useEditor } from "@/store/editor";
import { createConfigArchive, type ExportRequest } from "@/lib/configArchive";
import type { BrandConfig } from "@/config/types";
import { activeTemplate } from "@/config/templates";
import { OrbLoader } from "./OrbLoader";

const features = [
  { id: "telegram-orders", label: "Замовлення через Telegram" },
  { id: "online-payment", label: "Онлайн-оплата" },
  { id: "admin-panel", label: "Адмінпанель" },
  { id: "delivery", label: "Інтеграція доставки" },
  { id: "other", label: "Інші побажання" },
];

type SubmissionStatus = "idle" | "sending" | "success" | "error";

function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(name || "seltivo").toLowerCase().replace(/[\\/:*?"<>|\s]+/g, "-")}-config.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function downloadArchive(name: string, config: BrandConfig, request: ExportRequest) {
  const data = createConfigArchive(config, request);
  const blob = new Blob([data], { type: "application/zip" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(name || "seltivo").toLowerCase().replace(/[\\/:*?"<>|\s]+/g, "-")}-site-request.zip`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
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
  const [exportMessage, setExportMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const successButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    firstFieldRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!modalRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnFocus?.focus();
    };
  }, [close]);

  useEffect(() => {
    if (status === "success") successButtonRef.current?.focus();
  }, [status]);

  const brandName = config.name.trim() || "Без назви";
  const canSubmit = name.trim().length > 1 && contact.trim().length > 3;
  const exportRequest: ExportRequest = {
    submittedAt: new Date().toISOString(),
    brandName,
    template: { id: activeTemplate.id, name: activeTemplate.name },
    contact: { name: name.trim(), contact: contact.trim(), comment: comment.trim(), features: selectedFeatures },
  };

  const exportDraft = () => {
    try {
      downloadArchive(brandName, config, exportRequest);
      setExportMessage("ZIP-архів завантажено. У ньому є конфігурація та завантажені зображення.");
    } catch {
      setExportMessage("Не вдалося створити ZIP. Спробуйте JSON-резервну копію.");
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || status === "sending") return;
    setStatus("sending");
    const payload = {
      submittedAt: new Date().toISOString(),
      contact: { name: name.trim(), contact: contact.trim(), comment: comment.trim(), features: selectedFeatures },
      brandName,
      template: { id: activeTemplate.id, name: activeTemplate.name },
      config,
    };
    setMessage("");
    try {
      const response = await fetch("/api/configurator/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Submission failed");
      setStatus("success");
      setMessage("Заявку надіслано. Ми зв'яжемося з вами найближчим часом.");
    } catch {
      setStatus("error");
      setMessage("Не вдалося надіслати заявку. Спробуйте ще раз або збережіть конфігурацію файлом.");
    }
  };

  const toggleFeature = (id: string) => setSelectedFeatures((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  return <div className="cfg-modal-backdrop" onClick={close}>
    <div ref={modalRef} className="cfg-modal" role="dialog" aria-modal="true" aria-labelledby="submission-title" onClick={(event) => event.stopPropagation()}>
      <button type="button" className="cfg-modal-close" aria-label="Закрити" onClick={close}><X size={20} /></button>
      <span className="eyebrow">КРОК ОСТАННІЙ</span>
      <h2 id="submission-title">Надіслати мій макет</h2>
      {status === "success" ? (
        <div className="cfg-modal-success">
          <p>{message}</p>
          <button ref={successButtonRef} type="button" className="cfg-primary-button" onClick={close}>Готово</button>
        </div>
      ) : status === "sending" ? (
        <div className="cfg-loading-state">
          <OrbLoader state="connecting" size={64} theme="light" />
          <p>Надсилаємо заявку…</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <label className="cfg-field"><span className="cfg-label">Ім&apos;я *</span><input ref={firstFieldRef} value={name} maxLength={60} autoComplete="name" onChange={(event) => setName(event.target.value)} placeholder="Ваше ім&apos;я" /></label>
          <label className="cfg-field"><span className="cfg-label">Telegram або спосіб зв&apos;язку *</span><input value={contact} maxLength={80} onChange={(event) => setContact(event.target.value)} placeholder="@username або телефон" /></label>
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
          <button type="submit" className="cfg-primary-button" disabled={!canSubmit}>
            <Send size={14} /> Надіслати заявку
          </button>
          {status === "error" && <p className="cfg-error" role="alert">{message} <button type="button" className="cfg-text-button" onClick={() => downloadJson(brandName, { template: activeTemplate, contact: { name, contact, comment, features: selectedFeatures }, config })}>Завантажити JSON</button></p>}
          <button type="button" className="cfg-secondary-button" onClick={exportDraft}><Archive size={14} aria-hidden="true" /> Експортувати ZIP</button>
          {exportMessage && <p className="cfg-export-message" role="status">{exportMessage}</p>}
          <p className="cfg-hint">Ми отримаємо ваші налаштування, кольори, фото та побажання. Магазин публікується після узгодження замовлення.</p>
        </form>
      )}
    </div>
  </div>;
}
