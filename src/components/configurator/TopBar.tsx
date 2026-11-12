"use client";

import { Eye, EyeOff, Monitor, Pencil, RotateCcw, Send, Smartphone, Undo2, Redo2, SlidersHorizontal } from "lucide-react";
import { useBrand, useConfigStore } from "@/store/config";
import { useEditor } from "@/store/editor";
import { cx } from "./editable";

export function TopBar() {
  const config = useBrand();
  const editMode = useEditor((state) => state.editMode);
  const setEditMode = useEditor((state) => state.setEditMode);
  const device = useEditor((state) => state.device);
  const setDevice = useEditor((state) => state.setDevice);
  const panelOpen = useEditor((state) => state.panelOpen);
  const setPanelOpen = useEditor((state) => state.setPanelOpen);
  const openSubmission = useEditor((state) => state.openSubmission);
  const undo = useConfigStore((state) => state.undo);
  const redo = useConfigStore((state) => state.redo);
  const reset = useConfigStore((state) => state.reset);
  const canUndo = useConfigStore((state) => state.past.length > 0);
  const canRedo = useConfigStore((state) => state.future.length > 0);

  const handleReset = () => {
    if (window.confirm("Повернути стандартний шаблон? Усі зміни буде скинуто (але їх можна скасувати).")) reset();
  };

  return <header className="config-topbar">
    <div className="topbar-left">
      <span className="topbar-logo">ATELIER</span>
      <span className="topbar-badge desktop-editor-only">Демонстраційний режим</span>
    </div>
    <div className="topbar-center">
      <div className="topbar-segmented" role="radiogroup" aria-label="Пристрій перегляду">
        <button type="button" role="radio" aria-checked={device === "desktop"} aria-label="Десктопна версія" className={cx(device === "desktop" && "selected")} onClick={() => setDevice("desktop")}><Monitor size={16} /></button>
        <button type="button" role="radio" aria-checked={device === "mobile"} aria-label="Мобільна версія" className={cx(device === "mobile" && "selected")} onClick={() => setDevice("mobile")}><Smartphone size={16} /></button>
      </div>
      <span className="topbar-divider" />
      <div className="topbar-actions">
        <button type="button" aria-label="Скасувати останню дію" disabled={!canUndo} onClick={undo}><Undo2 size={16} /></button>
        <button type="button" aria-label="Повторити дію" disabled={!canRedo} onClick={redo}><Redo2 size={16} /></button>
        <button type="button" aria-label="Скинути зміни" onClick={handleReset}><RotateCcw size={16} /></button>
      </div>
      <span className="topbar-divider" />
      <button type="button" className="topbar-mode" aria-pressed={editMode} onClick={() => setEditMode(!editMode)}>
        {editMode ? <><EyeOff size={16} /> <span className="desktop-editor-only">Перегляд</span></> : <><Pencil size={16} /> <span className="desktop-editor-only">Редагування</span></>}
      </button>
    </div>
    <div className="topbar-right">
      <button type="button" className="topbar-panel-toggle mobile-editor-only" aria-label={panelOpen ? "Приховати налаштування" : "Показати налаштування"} aria-expanded={panelOpen} onClick={() => setPanelOpen(!panelOpen)}><SlidersHorizontal size={16} /></button>
      <button type="button" className="topbar-submit" onClick={openSubmission}><Send size={14} /> <span className="mobile-editor-only-text">Макет</span><span className="desktop-editor-only">Надіслати макет</span></button>
    </div>
  </header>;
}
