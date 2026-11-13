"use client";

import { useRef, useState } from "react";
import { ImagePlus, RotateCcw, Trash2 } from "lucide-react";
import { ImageUploadError, fileToDataUrl } from "@/lib/image";
import { useConfigStore } from "@/store/config";
import { SmartImage } from "@/components/SmartImage";
import { OrbLoader } from "./OrbLoader";

type ImagePickerProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  group: "hero" | "product";
  aspect?: string;
  id?: string;
  /** Reset to demo photo */
  onClear?: () => void;
  /** Remove custom upload entirely (product images) */
  onDelete?: () => void;
};

export function ImagePicker({ label, value, onChange, group, aspect = "16 / 9", id, onClear, onDelete }: ImagePickerProps) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const begin = useConfigStore((state) => state.beginEdit);

  const applyEdit = (change: () => void) => {
    begin();
    try {
      change();
    } finally {
      useConfigStore.getState().endEdit();
    }
  };

  const apply = (next: string) => applyEdit(() => onChange(next));

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const dataUrl = await fileToDataUrl(file, group === "hero" ? 1800 : 1400);
      apply(dataUrl);
    } catch (cause) {
      setError(cause instanceof ImageUploadError ? cause.message : "Не вдалося обробити зображення.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="cfg-field" data-picker-id={id}>
      <span className="cfg-label">{label}</span>

      {/* preview */}
      <div className="cfg-image-picker" style={{ aspectRatio: aspect }}>
        {value
          ? <SmartImage src={value} alt={label} fill sizes="320px" />
          : <span className="cfg-image-empty">Фото не вибрано</span>}
        {busy && (
          <div className="cfg-busy-overlay">
            <OrbLoader state="working" size={32} theme="dark" />
            <span>Обробка…</span>
          </div>
        )}
      </div>

      {/* actions row */}
      <div className="cfg-picker-actions">
        <label className="cfg-upload" aria-disabled={busy}>
          <ImagePlus size={14} />
          {busy ? "Обробка…" : "Завантажити фото"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            disabled={busy}
            onChange={(e) => upload(e.target.files?.[0])}
          />
        </label>
        {onClear && (
          <button
            type="button"
            className="cfg-ghost-button"
            disabled={busy}
            onClick={() => applyEdit(onClear)}
          >
            <RotateCcw size={12} /> Демо
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="cfg-ghost-button cfg-ghost-danger"
            disabled={busy}
            aria-label="Видалити фото"
            onClick={() => applyEdit(onDelete)}
          >
            <Trash2 size={12} /> Видалити
          </button>
        )}
      </div>

      {error && <span className="cfg-error" role="alert">{error}</span>}
    </div>
  );
}
