"use client";

import { useEditor, type EditorTab } from "@/store/editor";
import { BrandPanel, HeroPanel, ProductsPanel } from "./PropertyPanels";
import { cx } from "./editable";

const tabs: Array<{ id: EditorTab; label: string }> = [
  { id: "brand", label: "Бренд" },
  { id: "hero", label: "Hero" },
  { id: "products", label: "Каталог" },
];

export function Sidebar() {
  const tab = useEditor((state) => state.tab);
  const setTab = useEditor((state) => state.setTab);
  const panelOpen = useEditor((state) => state.panelOpen);
  const setPanelOpen = useEditor((state) => state.setPanelOpen);
  return <aside className={cx("config-sidebar", !panelOpen && "is-closed")} aria-label="Панель налаштувань">
    <div className="cfg-tabs" role="tablist" aria-label="Розділи налаштувань">
      {tabs.map((item) => (
        <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "selected" : ""} onClick={() => setTab(item.id)}>
          {item.label}
        </button>
      ))}
      <button type="button" className="cfg-tabs-close mobile-editor-only" aria-label="Приховати панель налаштувань" onClick={() => setPanelOpen(false)}>Готово</button>
    </div>
    <div className="cfg-tab-content">{tab === "brand" ? <BrandPanel /> : tab === "hero" ? <HeroPanel /> : <ProductsPanel />}</div>
  </aside>;
}
