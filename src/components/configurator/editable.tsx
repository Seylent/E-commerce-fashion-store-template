"use client";

import { useCallback } from "react";
import { useEditor } from "@/store/editor";

/** Merges class names, skipping falsy values. */
export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type EditableProps = {
  className?: string;
  "data-editable"?: string;
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
  "aria-label"?: string;
};

/**
 * Click-to-edit affordance for storefront elements. Spread the result onto an
 * existing element; outside the configurator (or in preview mode) every prop is
 * undefined, so the public site renders and behaves exactly as before.
 */
export function useEditable(id: string, label: string): EditableProps {
  const isActive = useEditor((state) => state.active && state.editMode);
  const selected = useEditor((state) => state.selected);
  const select = useEditor((state) => state.select);
  const active = isActive && Boolean(id);
  return {
    className: active ? cx("editable", selected === id && "is-selected") : undefined,
    "data-editable": active ? id : undefined,
    onClick: active
      ? (event) => {
          event.preventDefault();
          event.stopPropagation();
          select(id);
        }
      : undefined,
    onKeyDown: active
      ? (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            select(id);
          }
        }
      : undefined,
    role: active ? "button" : undefined,
    tabIndex: active ? 0 : undefined,
    "aria-label": active ? `Редагувати: ${label}` : undefined,
  };
}
