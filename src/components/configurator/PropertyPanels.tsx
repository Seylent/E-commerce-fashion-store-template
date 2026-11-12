"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Eye, EyeOff, ImageIcon } from "lucide-react";
import type { BrandConfig, Product } from "@/config/types";
import { useBrand } from "@/store/config";
import { useConfigStore } from "@/store/config";
import { moveProduct, patchBrand, patchColors, patchContact, patchHome, patchHero, patchProduct, productImage } from "@/store/configMutations";
import { ColorField, FieldGroup, NumberField, RangeField, Segmented, TextArea, TextField } from "./fields";
import { ImagePicker } from "./ImagePicker";
import { SmartImage } from "@/components/SmartImage";
import { cx } from "./editable";

const palettePresets: Array<{ name: string; colors: BrandConfig["colors"] }> = [
  { name: "Білий", colors: { background: "#FFFFFF", surface: "#FFFFFF", text: "#0A0A0A", muted: "#6E6E6E", border: "#E5E5E5", accent: "#0A0A0A" } },
  { name: "Ніч", colors: { background: "#0A0A0A", surface: "#141414", text: "#FFFFFF", muted: "#A3A3A3", border: "#2A2A2A", accent: "#FFFFFF" } },
  { name: "Сірий", colors: { background: "#F5F5F5", surface: "#FFFFFF", text: "#111111", muted: "#737373", border: "#E5E5E5", accent: "#111111" } },
];

export function BrandPanel() {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const replace = useConfigStore((state) => state.replace);
  return <>
    <FieldGroup title="Основне">
      <TextField label="Назва бренду" id="brand.name" value={config.name} maxLength={26} error={config.name.trim() ? undefined : "Назва не може бути порожньою"} onChange={(next) => replace({ ...config, name: next })} />
      <TextField label="Текст логотипа" id="brand.logo" value={config.logo.text} maxLength={30} hint="Показується у шапці, якщо не завантажено зображення" onChange={(next) => replace({ ...config, logo: { ...config.logo, text: next } })} />
      <ImagePicker
        label="Логотип-зображення (необов'язково)"
        value={config.logo.image ?? ""}
        aspect="5 / 2"
        group="product"
        id="brand.logoImage"
        onChange={(next) => patchBrand(commit, { logo: { ...config.logo, image: next } })}
        onClear={config.logo.image ? () => patchBrand(commit, { logo: { ...config.logo, image: undefined } }) : undefined}
      />
    </FieldGroup>
    <FieldGroup title="Кольори">
      <div className="cfg-palettes">
        {palettePresets.map((preset) => {
          const active = JSON.stringify(preset.colors) === JSON.stringify(config.colors);
          return <button key={preset.name} type="button" className={cx("cfg-palette", active && "selected")} onClick={() => patchColors(commit, preset.colors)} aria-pressed={active}>
            <span className="cfg-palette-swatches">{[preset.colors.background, preset.colors.text, preset.colors.accent].map((color, colorIndex) => <i key={colorIndex} style={{ backgroundColor: color }} />)}</span>
            {preset.name}
          </button>;
        })}
      </div>
      <div className="cfg-colors">
        <ColorField label="Фон" value={config.colors.background} onChange={(next) => patchColors(commit, { background: next })} />
        <ColorField label="Поверхня" value={config.colors.surface} onChange={(next) => patchColors(commit, { surface: next })} />
        <ColorField label="Текст" value={config.colors.text} onChange={(next) => patchColors(commit, { text: next })} />
        <ColorField label="Приглушений" value={config.colors.muted} onChange={(next) => patchColors(commit, { muted: next })} />
        <ColorField label="Рамки" value={config.colors.border} onChange={(next) => patchColors(commit, { border: next })} />
        <ColorField label="Акцент" value={config.colors.accent} onChange={(next) => patchColors(commit, { accent: next })} />
      </div>
    </FieldGroup>
    <FieldGroup title="Контакти">
      <TextField label="Електронна пошта" value={config.contact.email} type="email" onChange={(next) => patchContact(commit, { email: next })} />
      <TextField label="Локація" value={config.contact.location} onChange={(next) => patchContact(commit, { location: next })} />
      <TextField label="Години роботи" value={config.contact.hours} onChange={(next) => patchContact(commit, { hours: next })} />
    </FieldGroup>
  </>;
}

export function HeroPanel() {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const replace = useConfigStore((state) => state.replace);
  const hero = config.hero;
  return <>
    <FieldGroup title="Фото">
      <ImagePicker
        label="Головне фото"
        value={hero.image}
        group="hero"
        id="hero.image"
        onChange={(next) => patchHero(commit, { image: next })}
        onClear={() => patchHero(commit, { image: "/images/editorial-hero.png" })}
      />
      <RangeField label="Затемнення фото" value={hero.shade ?? 1} min={0} max={1} step={0.05} format={(value) => `${Math.round(value * 100)}%`} onChange={(next) => patchHero(commit, { shade: next })} />
    </FieldGroup>
    <FieldGroup title="Тексти">
      <TextField label="Надзаголовок" id="hero.eyebrow" value={hero.eyebrow} maxLength={60} onChange={(next) => replace({ ...config, hero: { ...hero, eyebrow: next } })} />
      <TextArea label="Заголовок" id="hero.title" value={hero.title} rows={3} maxLength={90} hint="Enter — перенесення рядка" onChange={(next) => replace({ ...config, hero: { ...hero, title: next } })} />
      <TextField label="Текст кнопки" id="hero.cta" value={hero.cta} maxLength={40} onChange={(next) => replace({ ...config, hero: { ...hero, cta: next } })} />
      <TextField label="Підпис (праворуч знизу)" id="hero.caption" value={hero.caption} maxLength={80} onChange={(next) => replace({ ...config, hero: { ...hero, caption: next } })} />
    </FieldGroup>
  </>;
}

type ProductRowProps = { product: Product; index: number; count: number };

function ProductRow({ product, index, count }: ProductRowProps) {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const replace = useConfigStore((state) => state.replace);
  const [expanded, setExpanded] = useState(false);
  const setField = (patch: Partial<Product>) => replace({ ...config, products: config.products.map((item) => (item.id === product.id ? { ...item, ...patch } : item)) });
  return <li className="cfg-product-row">
    <div className="cfg-product-main">
      <button type="button" className="cfg-product-thumb" aria-label={`Замінити фото товару «${product.name}»`} onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <SmartImage src={productImage(product)} alt="" fill sizes="56px" />
        <ImageIcon size={13} />
      </button>
      <div className="cfg-product-fields">
        <input className="cfg-inline-input" value={product.name} maxLength={40} aria-label={`Назва товару ${index + 1}`} onFocus={useConfigStore.getState().beginEdit} onBlur={useConfigStore.getState().endEdit} onChange={(event) => setField({ name: event.target.value })} />
        <div className="cfg-product-meta">
          <NumberField label="Ціна" value={product.price} onChange={(next) => setField({ price: next })} />
          <span className="cfg-product-index">{index + 1}/{count}</span>
        </div>
      </div>
      <div className="cfg-product-actions">
        <button type="button" aria-label={`Пересунути «${product.name}» вгору`} disabled={index === 0} onClick={() => moveProduct(commit, product.id, -1)}><ArrowUp size={14} /></button>
        <button type="button" aria-label={`Пересунути «${product.name}» вниз`} disabled={index === count - 1} onClick={() => moveProduct(commit, product.id, 1)}><ArrowDown size={14} /></button>
        <button type="button" aria-label={product.hidden ? `Показати «${product.name}»` : `Приховати «${product.name}»`} aria-pressed={Boolean(product.hidden)} className={product.hidden ? "muted" : ""} onClick={() => patchProduct(commit, product.id, { hidden: !product.hidden })}>
          {product.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button type="button" aria-label={expanded ? "Згорнути" : "Розгорнути фото"} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
      </div>
    </div>
    {expanded && <div className="cfg-product-picker">
      <ImagePicker label="Фото товару" value={productImage(product)} aspect="3 / 4" group="product" onChange={(next) => { setField({ customImage: next }); }} onClear={() => setField({ customImage: undefined })} />
    </div>}
  </li>;
}

export function ProductsPanel() {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const replace = useConfigStore((state) => state.replace);
  return <>
    <FieldGroup title="Секція New Arrivals">
      <TextField label="Заголовок секції" id="home.newArrivalsTitle" value={config.home.newArrivalsTitle} maxLength={48} onChange={(next) => replace({ ...config, home: { ...config.home, newArrivalsTitle: next } })} />
      <Segmented label="Товарів у ряді — десктоп" value={config.home.desktopColumns ?? 4} options={[{ value: 2, label: "2" }, { value: 3, label: "3" }, { value: 4, label: "4" }]} onChange={(next) => patchHome(commit, { desktopColumns: next })} />
      <Segmented label="Товарів у ряді — телефон" value={config.home.mobileColumns ?? 2} options={[{ value: 1, label: "1" }, { value: 2, label: "2" }]} onChange={(next) => patchHome(commit, { mobileColumns: next })} />
    </FieldGroup>
    <FieldGroup title={`Товари (${config.products.length})`}>
      <p className="cfg-note">Перший показ у секції «New Arrivals» — перші чотири видимі товари. Приховані товари зникають із магазину.</p>
      <ul className="cfg-product-list">
        {config.products.map((product, index) => <ProductRow key={product.id} product={product} index={index} count={config.products.length} />)}
      </ul>
    </FieldGroup>
  </>;
}
