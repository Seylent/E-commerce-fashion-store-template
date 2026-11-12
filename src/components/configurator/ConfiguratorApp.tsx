"use client";

import { useEffect, useMemo } from "react";
import { Pencil } from "lucide-react";
import { useBrand } from "@/store/config";
import { useEditor } from "@/store/editor";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { HomeView } from "@/components/HomeView";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { SubmissionModal } from "./SubmissionModal";
import "./configurator.css";

export function ConfiguratorApp() {
  const config = useBrand();
  const editMode = useEditor((state) => state.editMode);
  const device = useEditor((state) => state.device);
  const setEditMode = useEditor((state) => state.setEditMode);
  const setActive = useEditor((state) => state.setActive);
  const submissionOpen = useEditor((state) => state.submissionOpen);

  // Edit affordances exist only while the configurator is mounted.
  useEffect(() => {
    setActive(true);
    return () => {
      setActive(false);
      useEditor.setState({ selected: null, submissionOpen: false });
    };
  }, [setActive]);

  const themeStyle = useMemo(() => ({
    "--background": config.colors.background,
    "--surface": config.colors.surface,
    "--text": config.colors.text,
    "--muted": config.colors.muted,
    "--border": config.colors.border,
    "--accent": config.colors.accent,
    "--font-body": config.typography.body,
    "--font-display": config.typography.display,
    "--product-columns": config.home.desktopColumns ?? 4,
    "--product-columns-mobile": config.home.mobileColumns ?? 2,
  }) as React.CSSProperties, [config]);

  return (
    <div className={editMode ? "configurator" : "configurator is-preview"}>
      {editMode && <TopBar />}
      <div className="configurator-body">
        {editMode && <Sidebar />}
        <div className={`preview-area ${editMode ? "" : "is-full"}`}>
          <div className={`preview-frame device-${device}`}>
            <div id="configurator-preview" className="storefront preview-store" style={themeStyle}>
              <Header />
              <main aria-label="Попередній перегляд магазину"><HomeView /></main>
              <Footer />
              <CartDrawer />
            </div>
          </div>
        </div>
      </div>
      {!editMode && (
        <button type="button" className="preview-return" onClick={() => setEditMode(true)}>
          <Pencil size={14} /> Режим редагування
        </button>
      )}
      {submissionOpen && <SubmissionModal />}
    </div>
  );
}
