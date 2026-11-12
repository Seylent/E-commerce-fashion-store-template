"use client";

import { useEffect, useRef } from "react";
import { useConfigStore } from "@/store/config";
import { useEditor } from "@/store/editor";

/** Autofocuses the field when its element is clicked in the preview. */
function useFieldRef(id?: string) {
  const ref = useRef<HTMLInputElement | null>(null);
  const selected = useEditor((state) => state.selected);
  useEffect(() => {
    if (id && selected === id) ref.current?.focus();
  }, [id, selected]);
  return ref;
}

function useEditSpan() {
  const begin = useConfigStore((state) => state.beginEdit);
  const end = useConfigStore((state) => state.endEdit);
  return { onFocus: begin, onBlur: end };
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  /** Preview element id — focuses this field when that element is clicked. */
  id?: string;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  hint?: string;
  type?: "text" | "email";
};

export function TextField({ label, value, onChange, id, placeholder, maxLength, error, hint, type = "text" }: TextFieldProps) {
  const ref = useFieldRef(id);
  const span = useEditSpan();
  return <label className="cfg-field">
    <span className="cfg-label">{label}{maxLength && value.length > maxLength * 0.85 && <em className="cfg-counter">{value.length}/{maxLength}</em>}</span>
    <input ref={ref} type={type} value={value} placeholder={placeholder} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} {...span} />
    {error && <span className="cfg-error" role="alert">{error}</span>}
    {hint && <span className="cfg-hint">{hint}</span>}
  </label>;
}

type TextAreaProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  id?: string;
  rows?: number;
  maxLength?: number;
  hint?: string;
};

export function TextArea({ label, value, onChange, id, rows = 2, maxLength, hint }: TextAreaProps) {
  const ref = useFieldRef(id);
  const span = useEditSpan();
  return <label className="cfg-field">
    <span className="cfg-label">{label}</span>
    <textarea ref={ref as unknown as React.Ref<HTMLTextAreaElement>} rows={rows} value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} {...span} />
    {hint && <span className="cfg-hint">{hint}</span>}
  </label>;
}

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
};

export function NumberField({ label, value, onChange, min = 0, max = 1_000_000 }: NumberFieldProps) {
  const span = useEditSpan();
  return <label className="cfg-field cfg-field-number">
    <span className="cfg-label">{label}</span>
    <input type="number" value={value} min={min} max={max} onChange={(event) => { const next = Number(event.target.value); if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next))); }} {...span} />
  </label>;
}

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (next: string) => void;
};

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const span = useEditSpan();
  return <label className="cfg-color">
    <input type="color" value={value} onInput={(event) => onChange(event.currentTarget.value)} {...span} />
    <span className="cfg-color-name">{label}</span>
    <code>{value.toUpperCase()}</code>
  </label>;
}

type SegmentedProps<T extends string | number> = {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (next: T) => void;
};

export function Segmented<T extends string | number>({ label, value, options, onChange }: SegmentedProps<T>) {
  return <div className="cfg-field">
    <span className="cfg-label">{label}</span>
    <div className="cfg-segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button key={String(option.value)} type="button" role="radio" aria-checked={value === option.value} className={value === option.value ? "selected" : ""} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  </div>;
}

type RangeFieldProps = {
  label: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string;
};

export function RangeField({ label, value, onChange, min = 0, max = 1, step = 0.05, format }: RangeFieldProps) {
  const span = useEditSpan();
  return <label className="cfg-field">
    <span className="cfg-label">{label}<em className="cfg-counter">{format ? format(value) : value}</em></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} {...span} />
  </label>;
}

export function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="cfg-group"><h3>{title}</h3>{children}</section>;
}
