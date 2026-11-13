"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useEditor, type EditorTab } from "@/store/editor";
import { useBrand, useConfigStore } from "@/store/config";
import { patchBrand, patchColors, patchContact } from "@/store/configMutations";
import { ImagePicker } from "./ImagePicker";
import { Segmented, TextArea, TextField } from "./fields";
import { cx } from "./editable";
import { OrbLoader, type OrbState } from "./OrbLoader";
import { activeTemplate } from "@/config/templates";
import type { BrandConfig } from "@/config/types";
import { TemplateSectionPanel } from "./TemplateSectionPanel";
import { ProductsPanel } from "./PropertyPanels";
import { getSafeExternalUrl } from "@/lib/externalUrl";

/* ------------------------------------------------------------------ */
/* Design (Стилі) tab                                                   */
/* ------------------------------------------------------------------ */
type PalettePreset = { id: string; label: string; bg: string; colors: BrandConfig["colors"] };
const PALETTES: PalettePreset[] = [
  { id: "black", label: "Ніч",   bg: "#111",    colors: { background: "#0A0A0A", surface: "#141414", text: "#FFFFFF", muted: "#A3A3A3", border: "#2A2A2A", accent: "#FFFFFF" } },
  { id: "white", label: "Білий", bg: "#F5F5F5", colors: { background: "#FFFFFF", surface: "#FFFFFF", text: "#0A0A0A", muted: "#6E6E6E", border: "#E5E5E5", accent: "#0A0A0A" } },
  { id: "grey",  label: "Сірий", bg: "#888",    colors: { background: "#F5F5F5", surface: "#FFFFFF", text: "#111111", muted: "#737373", border: "#E5E5E5", accent: "#111111" } },
  { id: "warm",  label: "Тепло", bg: "#C8A97E", colors: { background: "#FAF6F0", surface: "#FFFFFF", text: "#2C1A0E", muted: "#8A7060", border: "#E8DDD0", accent: "#2C1A0E" } },
  { id: "sage",  label: "Sage",  bg: "#8A9E85", colors: { background: "#F4F5F0", surface: "#FFFFFF", text: "#1E2820", muted: "#6B7A68", border: "#D8DDD5", accent: "#1E2820" } },
  { id: "slate", label: "Slate", bg: "#5B7A99", colors: { background: "#F0F4F8", surface: "#FFFFFF", text: "#0F2236", muted: "#5B7A99", border: "#D0DCE8", accent: "#0F2236" } },
  { id: "rose",  label: "Rose",  bg: "#D4A5A5", colors: { background: "#FDF8F7", surface: "#FFFFFF", text: "#2D1515", muted: "#9A6E6E", border: "#EDD8D8", accent: "#2D1515" } },
  { id: "sand",  label: "Sand",  bg: "#C4B49A", colors: { background: "#F9F5EE", surface: "#FFFFFF", text: "#231F18", muted: "#8A7E6A", border: "#E5DDD0", accent: "#231F18" } },
];

type FontPreset = { id: string; label: string; family: string };
const FONTS: FontPreset[] = [
  { id: "futura", label: "Futura", family: "\"Futura PT\", Futura, \"Century Gothic\", sans-serif" },
  { id: "serif",  label: "Serif",  family: "\"Playfair Display\", Georgia, \"Times New Roman\", serif" },
  { id: "mono",   label: "Mono",   family: "\"JetBrains Mono\", \"Fira Code\", \"Courier New\", monospace" },
];

function DesignPanel() {
  const config  = useBrand();
  const commit  = useConfigStore((s) => s.commit);

  const activePalette = PALETTES.find(
    (p) => JSON.stringify(p.colors) === JSON.stringify(config.colors),
  )?.id ?? null;
  const activeFont = FONTS.find((f) => f.family === config.typography.body)?.id ?? null;

  return (
    <>
      <div className="rp-section">
        <div className="rp-section-label">Тема магазину</div>
        <p className="cfg-style-description">Оберіть основу — фон, текст і картки зміняться у попередньому перегляді.</p>
        <div className="cfg-theme-grid">
          {PALETTES.slice(0, 2).map((palette) => (
            <button key={palette.id} type="button" aria-pressed={activePalette === palette.id}
              className={cx("cfg-theme-card", activePalette === palette.id && "selected")}
              onClick={() => patchColors(commit, palette.colors)}>
              <span className="cfg-theme-preview" style={{ background: palette.colors.background, color: palette.colors.text, borderColor: palette.colors.border }}>
                <i style={{ background: palette.colors.text }} />
                <i style={{ background: palette.colors.accent }} />
                <i style={{ background: palette.colors.muted }} />
              </span>
              <span className="cfg-theme-name">{palette.id === "black" ? "Чорна" : "Біла"}</span>
              <span className="cfg-theme-hint">{palette.id === "black" ? "Темний мінімалізм" : "Світла класика"}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rp-section cfg-more-palettes">
        <details>
          <summary>Інші палітри</summary>
          <div className="cfg-palette-list">
            {PALETTES.slice(2).map((palette) => (
              <button key={palette.id} type="button" aria-pressed={activePalette === palette.id}
                className={cx("cfg-palette-option", activePalette === palette.id && "selected")}
                onClick={() => patchColors(commit, palette.colors)}>
                <i style={{ background: palette.bg }} />{palette.label}
              </button>
            ))}
          </div>
        </details>
      </div>

      <div className="rp-divider" />

      <div className="rp-section">
        <div className="rp-section-label">Шрифти всього сайту</div>
        <p className="cfg-style-description">Змінює шрифт заголовків і основного тексту у попередньому перегляді.</p>
        <div className="cfg-font-row">
          {FONTS.map((f) => (
            <button key={f.id} type="button" aria-pressed={activeFont === f.id}
              className={cx("cfg-font-btn", activeFont === f.id && "selected")}
              style={{ fontFamily: f.family }}
              onClick={() => commit((c) => ({ ...c, typography: { body: f.family, display: f.family } }))}>
              <span className="cfg-font-preview">{config.name || "Atelier"}</span>
              <span className="cfg-font-name">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

    </>
  );
}

/* ------------------------------------------------------------------ */
/* Brand and site settings                                              */
/* ------------------------------------------------------------------ */
function BrandPanel() {
  const config  = useBrand();
  const commit  = useConfigStore((s) => s.commit);
  const replace = useConfigStore((s) => s.replace);

  return (
    <div className="rp-section">
        <div className="rp-section-label">Ідентичність бренду</div>
        <TextField label="Назва бренду" id="brand.name" value={config.name} maxLength={26}
          error={config.name.trim() ? undefined : "Не може бути порожнім"}
          onChange={(next) => replace({ ...config, name: next })} />
        <TextField label="Короткий опис бренду" value={config.tagline} maxLength={90}
          onChange={(tagline) => replace({ ...config, tagline })} />
        <TextField label="Текст логотипа" id="brand.logo" value={config.logo.text} maxLength={30}
          hint="Показується у шапці без зображення"
          onChange={(next) => replace({ ...config, logo: { ...config.logo, text: next } })} />
        <ImagePicker
          label="Логотип-зображення (необов'язково)"
          value={config.logo.image ?? ""}
          aspect="5 / 2"
          group="product"
          id="brand.logoImage"
          onChange={(next) => patchBrand(commit, { logo: { ...config.logo, image: next } })}
          onClear={config.logo.image ? () => patchBrand(commit, { logo: { ...config.logo, image: undefined } }) : undefined}
        />
        <TextField label="Instagram URL" value={config.social.instagram ?? ""} maxLength={200} hint="Посилання має починатися з https://"
          error={config.social.instagram && !getSafeExternalUrl(config.social.instagram) ? "Введіть коректне HTTPS-посилання." : undefined}
          onChange={(instagram) => replace({ ...config, social: { ...config.social, instagram: instagram || undefined } })} />
        <TextField label="Pinterest URL" value={config.social.pinterest ?? ""} maxLength={200} hint="Посилання має починатися з https://"
          error={config.social.pinterest && !getSafeExternalUrl(config.social.pinterest) ? "Введіть коректне HTTPS-посилання." : undefined}
          onChange={(pinterest) => replace({ ...config, social: { ...config.social, pinterest: pinterest || undefined } })} />
        <TextField label="TikTok URL" value={config.social.tiktok ?? ""} maxLength={200} hint="Посилання має починатися з https://"
          error={config.social.tiktok && !getSafeExternalUrl(config.social.tiktok) ? "Введіть коректне HTTPS-посилання." : undefined}
          onChange={(tiktok) => replace({ ...config, social: { ...config.social, tiktok: tiktok || undefined } })} />
    </div>
  );
}

function SettingsPanel() {
  const config = useBrand();
  const commit = useConfigStore((s) => s.commit);
  const replace = useConfigStore((s) => s.replace);

  return <>
    <div className="rp-section">
      <div className="rp-section-label">Контакти</div>
      <TextField label="Email" value={config.contact.email} type="email" onChange={(email) => patchContact(commit, { email })} />
      <TextField label="Локація" value={config.contact.location} onChange={(location) => patchContact(commit, { location })} />
      <TextField label="Години роботи" value={config.contact.hours} onChange={(hours) => patchContact(commit, { hours })} />
    </div>
    <div className="rp-divider" />
    <div className="rp-section">
      <div className="rp-section-label">Пошукова оптимізація</div>
      <TextField label="Заголовок сторінки" value={config.seo.title} maxLength={70}
        onChange={(title) => replace({ ...config, seo: { ...config.seo, title } })} />
      <TextArea label="Опис" value={config.seo.description} rows={3} maxLength={180}
        onChange={(description) => replace({ ...config, seo: { ...config.seo, description } })} />
      <p className="cfg-hint">SEO-дані потраплять до конфігурації експорту; у демо-прев’ю вони не видимі.</p>
    </div>
    <div className="rp-divider" />
    <div className="rp-section">
      <div className="rp-section-label">Мова та валюта</div>
      <Segmented label="Валюта" value={config.currency}
        options={[{ value: "UAH", label: "Гривня ₴" }, { value: "EUR", label: "Євро €" }, { value: "USD", label: "Долар $" }]}
        onChange={(currency) => replace({ ...config, currency })} />
      <Segmented label="Мова магазину" value={config.locale}
        options={[{ value: "uk-UA", label: "Українська" }, { value: "en-US", label: "English" }]}
        onChange={(locale) => replace({ ...config, locale })} />
    </div>
  </>;
}

/* ------------------------------------------------------------------ */
/* Orb state hook                                                       */
/* ------------------------------------------------------------------ */
function useOrbState(): OrbState {
  const past = useConfigStore((s) => s.past);
  const [orb, setOrb] = useState<OrbState>("breathing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevLen = useRef(past.length);

  useEffect(() => {
    if (past.length !== prevLen.current) {
      prevLen.current = past.length;
      setOrb("working");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setOrb("breathing"), 1800);
    }
  }, [past.length]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  return orb;
}

const WORKSPACE_LABELS: Record<EditorTab, string> = {
  sections: "Секції",
  styles: "Стилі",
  brand: "Бренд",
  content: "Контент",
  settings: "Налаштування",
};

function PanelContent({ tab, activeSection }: { tab: EditorTab; activeSection: string }) {
  if (tab === "styles") return <DesignPanel />;
  if (tab === "brand") return <BrandPanel />;
  if (tab === "content") return <ProductsPanel />;
  if (tab === "settings") return <SettingsPanel />;

  const homeSection = activeTemplate.sections.home.find((section) => section.id === activeSection);
  const panel = activeSection === "hero" ? "hero" : homeSection?.panel ?? "hero";
  return <TemplateSectionPanel panel={panel} />;
}

/* ------------------------------------------------------------------ */
/* Right panel                                                          */
/* ------------------------------------------------------------------ */
export function RightPanel() {
  const tab    = useEditor((s) => s.tab);
  const activeSection = useEditor((s) => s.activeSection);
  const panelOpen = useEditor((s) => s.panelOpen);
  const setPanelOpen = useEditor((s) => s.setPanelOpen);
  const changeCount = useConfigStore((s) => s.past.length);
  const orbState    = useOrbState();

  const sectionTitle = activeSection === "hero"
    ? activeTemplate.hero.label
    : activeTemplate.sections.home.find((section) => section.id === activeSection)?.label;

  return (
    <>
      {panelOpen && <button type="button" className="studio-panel-backdrop" aria-label="Закрити панель властивостей" onClick={() => setPanelOpen(false)} />}
      <aside className={`studio-right-panel${panelOpen ? " is-open" : ""}`} role="complementary" aria-label="Властивості">
        <div className="rp-header">
          <span className="rp-orb" aria-hidden="true"><OrbLoader state={orbState} size={20} theme="dark" /></span>
          <span className="rp-title">{tab === "sections" ? sectionTitle ?? "Секції" : WORKSPACE_LABELS[tab]}</span>
          <button type="button" className="rp-close" aria-label="Закрити панель" onClick={() => setPanelOpen(false)}>
            <X size={16} aria-hidden="true" />
          </button>
          {changeCount > 0 && <span className="rp-change-badge" aria-label={`${changeCount} змін`}>{changeCount}</span>}
        </div>
        <div className="rp-body">
          <PanelContent tab={tab} activeSection={activeSection} />
        </div>
      </aside>
    </>
  );
}
