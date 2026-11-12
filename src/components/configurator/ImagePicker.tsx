"use client";

import { useRef, useState } from "react";
import { ImagePlus, RotateCcw } from "lucide-react";
import { demoImages } from "@/config/demoImages";
import { ImageUploadError, fileToDataUrl } from "@/lib/image";
import { useConfigStore } from "@/store/config";
import { SmartImage } from "@/components/SmartImage";

type ImagePickerProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  group: keyof typeof demoImages;
  aspect?: string;
  /** Preview element id — focuses/opens when that element is clicked. */
  id?: string;
  onClear?: () => void;
};

/** Upload (compressed to a data URL) or pick one of the template's demo photos. */
export function ImagePicker({ label, value, onChange, group, aspect = "16 / 9", id, onClear }: ImagePickerProps) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const begin = useConfigStore((state) => state.beginEdit);
  const end = useConfigStore((state) => state.endEdit);

  const apply = (next: string) => {
    begin();
    onChange(next);
    // endEdit on the next tick so the blur of a focused field does not race.
    requestAnimationFrame(() => useConfigStore.getState().endEdit());
  };

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

  return <div className="cfg-field" data-picker-id={id}>
    <span className="cfg-label">{label}</span>
    <div className="cfg-image-picker" style={{ aspectRatio: aspect }}>
      {value
        ? <SmartImage src={value} alt={label} fill sizes="320px" />
        : <span className="cfg-image-empty">Фото не вибрано</span>}
    </div>
    <div className="cfg-picker-actions">
      <label className="cfg-upload">
        <ImagePlus size={15} /> {busy ? "Обробка…" : "Завантажити фото"}
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => upload(event.target.files?.[0])} />
      </label>
      {onClear && <button type="button" className="cfg-ghost-button" onClick={() => { begin(); onClear(); requestAnimationFrame(() => useConfigStore.getState().endEdit()); }}><RotateCcw size={13} /> Демо-фото</button>}
    </div>
    <div className="cfg-picker-grid" aria-label="Демонстраційні фотографії">
      {demoImages[group].map((image) => (
        <button key={image.src} type="button" title={image.label} aria-label={`Вибрати демо-фото: ${image.label}`} className={value === image.src ? "selected" : ""} style={{ backgroundImage: `url(${image.src})` }} onClick={() => apply(image.src)} />
      ))}
    </div>
    {error && <span className="cfg-error" role="alert">{error}</span>}
  </div>;
}
