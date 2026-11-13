"use client";

import { ChevronRight, Eye, EyeOff, Monitor, RotateCcw, SlidersHorizontal, Smartphone, Undo2, Redo2 } from "lucide-react";
import { useBrand, useConfigStore } from "@/store/config";
import { useEditor } from "@/store/editor";

export function StudioTopBar({ draftStatus }: { draftStatus: "loading" | "saving" | "saved" | "error" }) {
  const config       = useBrand();
  const editMode     = useEditor((s) => s.editMode);
  const setEditMode  = useEditor((s) => s.setEditMode);
  const device       = useEditor((s) => s.device);
  const setDevice    = useEditor((s) => s.setDevice);
  const panelOpen    = useEditor((s) => s.panelOpen);
  const setPanelOpen = useEditor((s) => s.setPanelOpen);
  const openSubmission = useEditor((s) => s.openSubmission);

  const undo    = useConfigStore((s) => s.undo);
  const redo    = useConfigStore((s) => s.redo);
  const reset   = useConfigStore((s) => s.reset);
  const canUndo = useConfigStore((s) => s.past.length > 0);
  const canRedo = useConfigStore((s) => s.future.length > 0);

  const handleReset = () => {
    if (window.confirm("Повернути стандартний шаблон? Усі зміни буде скинуто (але їх можна скасувати).")) {
      reset();
    }
  };

  return (
    <header className="studio-topbar">
      {/* Left: logo + project name */}
      <div className="studio-topbar-left">
        <span className="studio-topbar-logo" aria-hidden="true">
          {/* simple dot logo */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="4" fill="currentColor" />
          </svg>
        </span>
        <span className="studio-topbar-project">{config.name || "Atelier"}</span>
      </div>

      <span className={`studio-save-status is-${draftStatus}`} role="status" aria-live="polite">
        <i aria-hidden="true" />
        {draftStatus === "saving" ? "Зберігаємо…" : draftStatus === "error" ? "Не збережено" : "Збережено локально"}
      </span>

      {/* Center: device switcher + history + preview toggle */}
      <div className="studio-topbar-center">
        {/* Back / Forward (undo / redo) */}
        <div className="studio-topbar-group">
          <button type="button" className="studio-topbar-icon-btn" aria-label="Скасувати" disabled={!canUndo} onClick={undo}>
            <Undo2 size={15} />
          </button>
          <button type="button" className="studio-topbar-icon-btn" aria-label="Повторити" disabled={!canRedo} onClick={redo}>
            <Redo2 size={15} />
          </button>
        </div>

        <span className="studio-topbar-divider" />

        {/* Device switcher */}
        <div className="studio-topbar-devices" role="group" aria-label="Розмір попереднього перегляду">
          <button
            type="button"
            aria-pressed={device === "desktop"}
            aria-label="Десктоп"
            className={device === "desktop" ? "active" : ""}
            onClick={() => setDevice("desktop")}
          >
            <Monitor size={15} />
          </button>
          <button
            type="button"
            aria-pressed={device === "mobile-max"}
            aria-label="iPhone Pro Max"
            className={device === "mobile-max" ? "active" : ""}
            onClick={() => setDevice("mobile-max")}
          >
            <Smartphone size={15} />
          </button>
        </div>

        <span className="studio-topbar-divider" />

        {/* Preview / Edit toggle */}
        <button
          type="button"
          className={`studio-topbar-icon-btn studio-topbar-preview-btn${!editMode ? " active" : ""}`}
          aria-pressed={!editMode}
          onClick={() => setEditMode(!editMode)}
          title={editMode ? "Попередній перегляд" : "Режим редагування"}
        >
          {editMode
            ? <><Eye size={15} /><span>Попередній перегляд</span></>
            : <><EyeOff size={15} /><span>Редагування</span></>}
        </button>
        <button
          type="button"
          className="studio-topbar-icon-btn studio-topbar-inspector-btn"
          aria-label={panelOpen ? "Закрити панель властивостей" : "Відкрити панель властивостей"}
          aria-expanded={panelOpen}
          onClick={() => {
            if (!editMode) setEditMode(true);
            setPanelOpen(!panelOpen);
          }}
        >
          <SlidersHorizontal size={15} />
        </button>
      </div>

      {/* Right: reset + publish */}
      <div className="studio-topbar-right">
        <button
          type="button"
          className="studio-topbar-icon-btn"
          aria-label="Скинути зміни"
          title="Скинути до шаблону"
          onClick={handleReset}
        >
          <RotateCcw size={15} />
        </button>
        <button
          type="button"
          className="studio-topbar-publish-btn"
          aria-label="Надіслати макет"
          onClick={openSubmission}
        >
          <span>Надіслати</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </header>
  );
}
