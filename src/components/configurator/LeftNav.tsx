"use client";

import { useEffect, useRef, useState } from "react";
import {
  Eye,
  EyeOff,
  FileText,
  Layers,
  Palette,
  Plus,
  Settings,
  Tag,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useBrand, useConfigStore } from "@/store/config";
import { useEditor, type EditorTab } from "@/store/editor";
import { activeTemplate } from "@/config/templates";
import {
  moveFeaturedSection,
  orderFeaturedSections,
  patchHome,
  toggleFeaturedSection,
  type FeaturedSection,
} from "@/store/configMutations";
import { cx } from "./editable";

const NAV_ITEMS: Array<{ id: EditorTab; icon: typeof Layers; label: string }> = [
  { id: "sections", icon: Layers, label: "Секції" },
  { id: "styles", icon: Palette, label: "Стилі" },
  { id: "brand", icon: Tag, label: "Бренд" },
  { id: "content", icon: FileText, label: "Контент" },
  { id: "settings", icon: Settings, label: "Налаштування" },
];

function scrollToSection(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function LeftNav() {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const tab = useEditor((state) => state.tab);
  const setTab = useEditor((state) => state.setTab);
  const activeSection = useEditor((state) => state.activeSection);
  const setActiveSection = useEditor((state) => state.setActiveSection);
  const select = useEditor((state) => state.select);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const enabledSections = orderFeaturedSections(activeTemplate.sections.home, config.home.featuredSections);
  const availableSections = activeTemplate.sections.home.filter(({ id }) => !config.home.featuredSections.includes(id));

  const activateSection = (id: string) => {
    setActiveSection(id);
    setTab("sections");
    select(null);
    scrollToSection(id);
  };

  const toggleSection = (id: FeaturedSection) => {
    const isVisible = config.home.featuredSections.includes(id);
    patchHome(commit, {
      featuredSections: toggleFeaturedSection(config.home.featuredSections, id),
    });
    if (isVisible && activeSection === id) {
      setActiveSection("hero");
      setTab("sections");
      scrollToSection("hero");
    }
  };

  const reorderSection = (id: FeaturedSection, direction: -1 | 1) => {
    patchHome(commit, {
      featuredSections: moveFeaturedSection(config.home.featuredSections, id, direction),
    });
  };

  return (
    <nav className="studio-left-nav" aria-label="Розділи редактора">
      <ul className="studio-nav-list">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
          <li key={id}>
            <button
              type="button"
              aria-pressed={tab === id}
              className={cx("studio-nav-link", tab === id && "active")}
              onClick={() => setTab(id)}
              title={label}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="studio-structure">
        <div className="studio-structure-heading">
          <span>Структура сторінки</span>
          <span className="studio-structure-count">{enabledSections.length + 1}</span>
        </div>

        <div className="studio-structure-list">
          <button
            type="button"
            aria-pressed={activeSection === "hero"}
            className={cx("studio-section-card", activeSection === "hero" && "active")}
            onClick={() => activateSection("hero")}
          >
            <span className="studio-section-thumbnail" style={{ backgroundImage: `url(${activeTemplate.hero.thumbnail})` }} />
            <span className="studio-section-name">{activeTemplate.hero.label}</span>
            <span className="studio-section-index">01</span>
          </button>

          {enabledSections.map((section, index) => (
            <div
              key={section.id}
              className={cx("studio-section-card", activeSection === section.id && "active")}
            >
              <button
                type="button"
                className="studio-section-select"
                aria-pressed={activeSection === section.id}
                onClick={() => activateSection(section.id)}
              >
                <span className="studio-section-thumbnail" style={{ backgroundImage: `url(${section.thumbnail})` }} />
                <span className="studio-section-name">{section.label}</span>
              </button>
              <span className="studio-section-actions">
                <button
                  type="button"
                  aria-label={`Перемістити «${section.label}» вище`}
                  disabled={index === 0}
                  onClick={() => reorderSection(section.id, -1)}
                >
                  <ChevronUp size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Перемістити «${section.label}» нижче`}
                  disabled={index === enabledSections.length - 1}
                  onClick={() => reorderSection(section.id, 1)}
                >
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={`Приховати секцію «${section.label}»`}
                  onClick={() => toggleSection(section.id)}
                >
                  <Eye size={13} aria-hidden="true" />
                </button>
              </span>
              <span className="studio-section-index">{String(index + 2).padStart(2, "0")}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="studio-add-section"
          aria-expanded={addMenuOpen}
          aria-controls="studio-add-section-menu"
          disabled={availableSections.length === 0}
          onClick={() => setAddMenuOpen((open) => !open)}
        >
          <Plus size={15} aria-hidden="true" />
          Додати секцію
        </button>
        <div className="studio-add-section-menu" id="studio-add-section-menu" hidden={!addMenuOpen}>
            {availableSections.length ? availableSections.map((section) => (
              <button
                type="button"
                key={section.id}
                onClick={() => {
                  toggleSection(section.id);
                  setAddMenuOpen(false);
                  activateSection(section.id);
                }}
              >
                <Plus size={13} aria-hidden="true" />
                {section.label}
              </button>
            )) : (
              <p>Усі секції вже додані</p>
            )}
        </div>
      </div>

      <div className="studio-left-footer">
        <FileText size={13} aria-hidden="true" />
        <span>Шаблон: {activeTemplate.name}</span>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const tab = useEditor((state) => state.tab);
  const setTab = useEditor((state) => state.setTab);
  const activeSection = useEditor((state) => state.activeSection);
  const setActiveSection = useEditor((state) => state.setActiveSection);
  const select = useEditor((state) => state.select);
  const setPanelOpen = useEditor((state) => state.setPanelOpen);
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const enabledSections = orderFeaturedSections(activeTemplate.sections.home, config.home.featuredSections);
  const availableSections = activeTemplate.sections.home.filter(({ id }) => !config.home.featuredSections.includes(id));

  const openPanel = (nextTab: EditorTab) => {
    setTab(nextTab);
    setPanelOpen(true);
  };

  const chooseSection = (id: string) => {
    setActiveSection(id);
    setTab("sections");
    select(null);
    setSectionsOpen(false);
    setPanelOpen(true);
    scrollToSection(id);
  };

  const toggleSection = (id: FeaturedSection) => {
    const isVisible = config.home.featuredSections.includes(id);
    patchHome(commit, {
      featuredSections: toggleFeaturedSection(config.home.featuredSections, id),
    });
    if (isVisible && activeSection === id) {
      setActiveSection("hero");
      setTab("sections");
      scrollToSection("hero");
    }
  };

  const moveSection = (id: FeaturedSection, direction: -1 | 1) => patchHome(commit, {
    featuredSections: moveFeaturedSection(config.home.featuredSections, id, direction),
  });

  useEffect(() => {
    if (!sectionsOpen) return;
    const returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSectionsOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled)");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      returnFocus?.focus();
    };
  }, [sectionsOpen]);

  return (
    <>
      {sectionsOpen && (
        <div className="studio-mobile-sections-layer">
          <button
            type="button"
            className="studio-mobile-sections-backdrop"
            aria-label="Закрити список секцій"
            onClick={() => setSectionsOpen(false)}
          />
          <section ref={dialogRef} className="studio-mobile-sections" role="dialog" aria-modal="true" aria-label="Секції сторінки">
            <div className="studio-mobile-sections-heading">
              <h2>Секції сторінки</h2>
              <button ref={closeRef} type="button" aria-label="Закрити" onClick={() => setSectionsOpen(false)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className={`studio-mobile-section-row${activeSection === "hero" ? " active" : ""}`}>
              <button type="button" className="studio-mobile-section-select" aria-pressed={activeSection === "hero"} onClick={() => chooseSection("hero")}>
                <span className="studio-section-thumbnail" style={{ backgroundImage: `url(${activeTemplate.hero.thumbnail})` }} />
                {activeTemplate.hero.label}
              </button>
            </div>
            {enabledSections.map((section, index) => (
              <div className={`studio-mobile-section-row${activeSection === section.id ? " active" : ""}`} key={section.id}>
                <button type="button" className="studio-mobile-section-select" aria-pressed={activeSection === section.id} onClick={() => chooseSection(section.id)}>
                  <span className="studio-section-thumbnail" style={{ backgroundImage: `url(${section.thumbnail})` }} />
                  {section.label}
                </button>
                <div className="studio-mobile-section-actions">
                  <button type="button" aria-label={`Перемістити «${section.label}» вище`} disabled={index === 0} onClick={() => moveSection(section.id, -1)}><ChevronUp size={14} /></button>
                  <button type="button" aria-label={`Перемістити «${section.label}» нижче`} disabled={index === enabledSections.length - 1} onClick={() => moveSection(section.id, 1)}><ChevronDown size={14} /></button>
                  <button type="button" aria-label={`Приховати «${section.label}»`} onClick={() => toggleSection(section.id)}><Eye size={14} /></button>
                </div>
              </div>
            ))}
            {availableSections.length > 0 && (
              <>
                <h3 className="studio-mobile-section-subtitle">Додати секцію</h3>
                {availableSections.map((section) => (
                  <button type="button" className="studio-mobile-add-section" key={section.id} onClick={() => { toggleSection(section.id); chooseSection(section.id); }}>
                    <Plus size={14} aria-hidden="true" />{section.label}
                  </button>
                ))}
              </>
            )}
          </section>
        </div>
      )}

      <nav className="studio-mobile-nav" aria-label="Навігація редактора">
        <button ref={triggerRef} type="button" aria-expanded={sectionsOpen} onClick={() => setSectionsOpen((open) => !open)}>
          <Layers size={17} aria-hidden="true" />
          <span>Секції</span>
        </button>
        {NAV_ITEMS.filter(({ id }) => id !== "sections").map(({ id, icon: Icon, label }) => (
          <button type="button" key={id} aria-pressed={tab === id}
            className={tab === id ? "active" : ""}
            onClick={() => openPanel(id)}>
            <Icon size={17} aria-hidden="true" />
            <span>{id === "settings" ? "Налашт." : label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
