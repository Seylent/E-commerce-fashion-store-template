"use client";

import { create } from "zustand";

export type EditorDevice = "desktop" | "mobile-max";
export type EditorTab = "sections" | "styles" | "brand" | "content" | "settings";

type EditorState = {
  active: boolean;
  editMode: boolean;
  device: EditorDevice;
  tab: EditorTab;
  selected: string | null;
  activeSection: string;
  panelOpen: boolean;
  submissionOpen: boolean;
  setActive: (active: boolean) => void;
  setEditMode: (editMode: boolean) => void;
  setDevice: (device: EditorDevice) => void;
  setTab: (tab: EditorTab) => void;
  select: (id: string | null) => void;
  setActiveSection: (id: string) => void;
  setPanelOpen: (panelOpen: boolean) => void;
  openSubmission: () => void;
  closeSubmission: () => void;
};

export const useEditor = create<EditorState>((set) => ({
  active: false,
  editMode: true,
  device: "desktop",
  tab: "sections",
  selected: null,
  activeSection: "hero",
  panelOpen: false,
  submissionOpen: false,
  setActive: (active) => set({ active }),
  setEditMode: (editMode) => set({ editMode, selected: null }),
  setDevice: (device) => set({ device }),
  setTab: (tab) => set({ tab }),
  setActiveSection: (activeSection) => set({ activeSection }),
  select: (id) => {
    if (!id) return set({ selected: null });
    const tab: EditorTab = id.startsWith("hero")
      ? "sections"
      : id.startsWith("product") || id === "home.newArrivalsTitle"
      ? "content"
      : id.startsWith("brand")
      ? "brand"
      : "styles";
    const activeSection = id.startsWith("hero")
      ? "hero"
      : id === "home.newArrivalsTitle" || id.startsWith("product")
      ? "arrivals"
      : "hero";
    set({ selected: id, tab, activeSection, panelOpen: true });
  },
  setPanelOpen: (panelOpen) => set({ panelOpen }),
  openSubmission: () => set({ submissionOpen: true }),
  closeSubmission: () => set({ submissionOpen: false }),
}));
