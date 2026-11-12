"use client";

import { create } from "zustand";

export type EditorDevice = "desktop" | "mobile";
export type EditorTab = "brand" | "hero" | "products";

type EditorState = {
  /** true only while the configurator is mounted (public pages stay untouched). */
  active: boolean;
  /** false = preview mode: the store looks exactly like the live site. */
  editMode: boolean;
  device: EditorDevice;
  tab: EditorTab;
  /** id of the element selected by clicking in the preview. */
  selected: string | null;
  /** mobile bottom sheet visibility */
  panelOpen: boolean;
  submissionOpen: boolean;
  setActive: (active: boolean) => void;
  setEditMode: (editMode: boolean) => void;
  setDevice: (device: EditorDevice) => void;
  setTab: (tab: EditorTab) => void;
  select: (id: string | null) => void;
  setPanelOpen: (panelOpen: boolean) => void;
  openSubmission: () => void;
  closeSubmission: () => void;
};

export const useEditor = create<EditorState>((set) => ({
  active: false,
  editMode: true,
  device: "desktop",
  tab: "brand",
  selected: null,
  panelOpen: true,
  submissionOpen: false,
  setActive: (active) => set({ active }),
  setEditMode: (editMode) => set({ editMode, selected: null }),
  setDevice: (device) => set({ device }),
  setTab: (tab) => set({ tab }),
  select: (id) => {
    if (!id) return set({ selected: null });
    const tab: EditorTab = id.startsWith("hero") ? "hero" : id.startsWith("product") || id === "home.newArrivalsTitle" ? "products" : "brand";
    set({ selected: id, tab, panelOpen: true });
  },
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  openSubmission: () => set({ submissionOpen: true }),
  closeSubmission: () => set({ submissionOpen: false }),
}));
