"use client";

import { create } from "zustand";
import { activeBrand } from "@/config/brands";
import type { BrandConfig } from "@/config/types";

/** Snapshot of the shipped template configuration. Used as the initial state,
 *  as the target of "reset", and as the source of truth for the static site. */
export const defaultConfig: BrandConfig = structuredClone(activeBrand);

const HISTORY_LIMIT = 50;

type ConfigStore = {
  /** The live configuration. Storefront components read this instead of `activeBrand`. */
  config: BrandConfig;
  past: BrandConfig[];
  future: BrandConfig[];
  /** Snapshot captured on field focus, recorded on blur as a single undo step. */
  pendingSnapshot?: BrandConfig;
  /** Functional update recorded in undo/redo history. */
  commit: (update: (current: BrandConfig) => BrandConfig) => void;
  /** Replace the configuration without touching history (e.g. keystrokes while typing). */
  replace: (next: BrandConfig) => void;
  /** Capture a snapshot when a text field gains focus; `endEdit` records it once. */
  beginEdit: () => void;
  endEdit: () => void;
  undo: () => void;
  redo: () => void;
  /** Back to the shipped template. Recorded in history so it can be undone. */
  reset: () => void;
};

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: defaultConfig,
  past: [],
  future: [],
  pendingSnapshot: undefined,
  commit: (update) =>
    set((state) => {
      const next = update(state.config);
      if (next === state.config) return state;
      return {
        config: next,
        past: state.pendingSnapshot
          ? state.past
          : [...state.past, state.config].slice(-HISTORY_LIMIT),
        future: [],
      };
    }),
  replace: (next) => set({ config: next }),
  beginEdit: () => set({ pendingSnapshot: get().config }),
  endEdit: () =>
    set((state) => {
      if (state.pendingSnapshot === undefined || state.pendingSnapshot === state.config) return { pendingSnapshot: undefined };
      return {
        pendingSnapshot: undefined,
        past: [...state.past, state.pendingSnapshot].slice(-HISTORY_LIMIT),
        future: [],
      };
    }),
  undo: () => {
    const { past, config, future } = get();
    if (!past.length) return;
    set({
      config: past[past.length - 1],
      past: past.slice(0, -1),
      future: [config, ...future].slice(0, HISTORY_LIMIT),
    });
  },
  redo: () => {
    const { future, config, past } = get();
    if (!future.length) return;
    set({
      config: future[0],
      future: future.slice(1),
      past: [...past, config].slice(-HISTORY_LIMIT),
    });
  },
  reset: () => get().commit(() => defaultConfig),
}));

/** Reactive brand configuration shared by the editor and storefront preview. */
export function useBrand(): BrandConfig {
  return useConfigStore((state) => state.config);
}
