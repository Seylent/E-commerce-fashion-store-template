"use client";

import { useEffect, useRef, useState } from "react";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Check, ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, ImageIcon, Plus, Trash2 } from "lucide-react";
import { catalog } from "@/config/catalog";
import type { Product, TextStyle } from "@/config/types";
import { useBrand } from "@/store/config";
import { useConfigStore } from "@/store/config";
import { createDraftProduct, moveProduct, patchHome, patchHero, patchProduct, productImage, removeProduct } from "@/store/configMutations";
import { ColorField, FieldGroup, NumberField, RangeField, Segmented, TextArea, TextField } from "./fields";
import { ImagePicker } from "./ImagePicker";
import { SmartImage } from "@/components/SmartImage";
import { cx } from "./editable";

const HERO_FONTS = [
  { label: "Шрифт бренду", family: undefined, sample: "Ag" },
  { label: "Futura", family: '"Futura PT", Futura, "Century Gothic", sans-serif', sample: "Ag" },
  { label: "Grotesk", family: "Arial, Helvetica, sans-serif", sample: "Ag" },
  { label: "Editorial serif", family: 'Georgia, "Times New Roman", serif', sample: "Ag" },
  { label: "Mono", family: 'ui-monospace, "SFMono-Regular", monospace', sample: "Ag" },
] as const;

export function HeroPanel() {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const replace = useConfigStore((state) => state.replace);
  const hero = config.hero;
  const titleStyle = config.textStyles?.["hero.title"] ?? {};
  const fontMenuRef = useRef<HTMLDetailsElement>(null);
  const selectedFont = HERO_FONTS.find((font) => (font.family ?? "") === (titleStyle.family ?? ""));

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      const menu = fontMenuRef.current;
      if (menu && !menu.contains(event.target as Node)) menu.open = false;
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && fontMenuRef.current?.open) {
        fontMenuRef.current.open = false;
        event.preventDefault();
      }
    };
    document.addEventListener("pointerdown", closeOnOutside);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const updateTitleStyle = (patch: Partial<TextStyle>) => commit((current) => ({
    ...current,
    textStyles: {
      ...current.textStyles,
      "hero.title": { ...current.textStyles?.["hero.title"], ...patch },
    },
  }));

  return <>
    <FieldGroup title="Тексти">
      <TextField label="Надзаголовок" id="hero.eyebrow" value={hero.eyebrow} maxLength={60} onChange={(next) => replace({ ...config, hero: { ...hero, eyebrow: next } })} />
      <TextArea label="Заголовок" id="hero.title" value={hero.title} rows={3} maxLength={90} hint="Enter — перенесення рядка" onChange={(next) => replace({ ...config, hero: { ...hero, title: next } })} />
      <TextField label="Текст кнопки" id="hero.cta" value={hero.cta} maxLength={40} onChange={(next) => replace({ ...config, hero: { ...hero, cta: next } })} />
    </FieldGroup>
    <FieldGroup title="Стиль заголовка">
      <div className="cfg-field">
        <span className="cfg-label">Шрифт заголовка головної</span>
        <details className="cfg-dropdown" ref={fontMenuRef}>
          <summary>
            <span style={{ fontFamily: selectedFont?.family ?? config.typography.display }}>
              {selectedFont?.label ?? "Власний шрифт"}
            </span>
            <ChevronDown size={14} aria-hidden="true" />
          </summary>
          <div className="cfg-dropdown-menu" role="group" aria-label="Виберіть шрифт заголовка">
            {HERO_FONTS.map((font) => {
              const selected = (titleStyle.family ?? "") === (font.family ?? "");
              return (
                <button
                  type="button"
                  key={font.label}
                  aria-pressed={selected}
                  className={selected ? "selected" : ""}
                  onClick={() => {
                    updateTitleStyle({ family: font.family });
                    if (fontMenuRef.current) fontMenuRef.current.open = false;
                  }}
                >
                  <span className="cfg-dropdown-sample" style={{ fontFamily: font.family ?? config.typography.display }}>{font.sample}</span>
                  <span>{font.label}</span>
                  {selected && <Check size={14} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </details>
      </div>
      <div className="cfg-style-weight" role="group" aria-label="Насиченість шрифту">
        {[400, 500, 700, 900].map((weight) => (
          <button
            type="button"
            key={weight}
            className={cx(titleStyle.weight === weight && "selected")}
            aria-pressed={titleStyle.weight === weight}
            onClick={() => updateTitleStyle({ weight })}
          >
            {weight === 400 ? "Regular" : weight === 500 ? "Medium" : weight === 700 ? "Bold" : "Black"}
          </button>
        ))}
      </div>
      <RangeField label="Розмір" value={titleStyle.size ?? 72} min={32} max={120} step={1} format={(value) => `${value} px`} onChange={(size) => updateTitleStyle({ size })} />
      <RangeField label="Міжрядковий інтервал" value={titleStyle.lineHeight ?? 95} min={80} max={140} step={1} format={(value) => `${value}%`} onChange={(lineHeight) => updateTitleStyle({ lineHeight })} />
      <ColorField label="Колір" value={titleStyle.color ?? "#FFFFFF"} onChange={(color) => updateTitleStyle({ color })} />
      <RangeField label="Непрозорість" value={titleStyle.opacity ?? 100} min={10} max={100} step={1} format={(value) => `${value}%`} onChange={(opacity) => updateTitleStyle({ opacity })} />
      <div className="cfg-style-align" role="group" aria-label="Вирівнювання заголовка">
        {([
          { align: "left", Icon: AlignLeft },
          { align: "center", Icon: AlignCenter },
          { align: "right", Icon: AlignRight },
          { align: "justify", Icon: AlignJustify },
        ] as const).map(({ align, Icon }) => (
          <button
            type="button"
            key={align}
            aria-label={align === "left" ? "Ліворуч" : align === "center" ? "По центру" : align === "right" ? "Праворуч" : "За шириною"}
            aria-pressed={(titleStyle.align ?? "left") === align}
            className={cx((titleStyle.align ?? "left") === align && "selected")}
            onClick={() => updateTitleStyle({ align })}
          >
            <Icon size={14} aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="cfg-style-toggles">
        <label><input type="checkbox" checked={Boolean(titleStyle.shadow)} onChange={(event) => updateTitleStyle({ shadow: event.target.checked })} /> Тінь</label>
        <label><input type="checkbox" checked={Boolean(titleStyle.outline)} onChange={(event) => updateTitleStyle({ outline: event.target.checked })} /> Обводка</label>
      </div>
      <Segmented
        label="Анімація появи"
        value={titleStyle.animation ?? "none"}
        options={[{ value: "none", label: "Без" }, { value: "fade", label: "Fade" }, { value: "rise", label: "Rise" }]}
        onChange={(animation) => updateTitleStyle({ animation: animation as TextStyle["animation"] })}
      />
    </FieldGroup>
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
  </>;
}

type ProductRowProps = {
  product: Product;
  index: number;
  count: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
  dragOver: boolean;
};

function ProductRow({ product, index, count, onDragStart, onDragOver, onDrop, onDragEnd, onMove, onDelete, dragOver }: ProductRowProps) {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const replace = useConfigStore((state) => state.replace);
  const [expanded, setExpanded] = useState(false);
  const setField = (patch: Partial<Product>) => replace({ ...config, products: config.products.map((item) => (item.id === product.id ? { ...item, ...patch } : item)) });
  return (
    <li
      className={cx("cfg-product-row", dragOver && "cfg-product-row--drag-over")}
      onDragOver={(e) => { e.preventDefault(); onDragOver(index); }}
      onDrop={onDrop}
    >
      <div className="cfg-product-main">
        <span
          className="cfg-product-drag"
          draggable
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", product.id);
            onDragStart(index);
          }}
          onDragEnd={onDragEnd}
          aria-hidden="true"
        ><GripVertical size={14} /></span>
        <button type="button" className="cfg-product-thumb" aria-label={`Замінити фото товару «${product.name}»`} onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          <SmartImage src={productImage(product)} alt="" fill sizes="56px" />
          <ImageIcon size={13} />
        </button>
        <div className="cfg-product-fields">
          <input className="cfg-inline-input" value={product.name} maxLength={40} aria-label={`Назва товару ${index + 1}`} onFocus={useConfigStore.getState().beginEdit} onBlur={useConfigStore.getState().endEdit} onChange={(event) => setField({ name: event.target.value })} />
          <div className="cfg-product-meta">
            <NumberField label="Ціна" value={product.price} onChange={(next) => setField({ price: next })} />
            <span className={`cfg-product-status${product.hidden ? " is-hidden" : ""}`}>{product.hidden ? "Прихований" : "У вітрині"}</span>
            <span className="cfg-product-index">{index + 1}/{count}</span>
          </div>
        </div>
        <div className="cfg-product-actions">
          <button type="button" aria-label={`Перемістити «${product.name}» вище`} disabled={index === 0} onClick={() => onMove(-1)}><ChevronUp size={13} /></button>
          <button type="button" aria-label={`Перемістити «${product.name}» нижче`} disabled={index === count - 1} onClick={() => onMove(1)}><ChevronDown size={13} /></button>
          <button type="button" aria-label={product.hidden ? `Показати «${product.name}»` : `Приховати «${product.name}»`} aria-pressed={Boolean(product.hidden)} className={product.hidden ? "muted" : ""} onClick={() => patchProduct(commit, product.id, { hidden: !product.hidden })}>
            {product.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button type="button" aria-label={expanded ? "Згорнути редактор товару" : "Редагувати товар"} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
          <button type="button" aria-label={`Видалити товар «${product.name}»`} onClick={onDelete}><Trash2 size={13} /></button>
        </div>
      </div>
      {expanded && <div className="cfg-product-editor">
        <TextField label="Категорія" value={product.category} maxLength={40} onChange={(category) => setField({ category })} />
        <TextField label="Колекція" value={product.collection} maxLength={40} onChange={(collection) => setField({ collection })} />
        <TextField label="Позначка" value={product.badge ?? ""} maxLength={30} placeholder="Наприклад: Новинка" onChange={(badge) => setField({ badge: badge || undefined })} />
        <TextArea label="Опис товару" value={product.description} rows={3} maxLength={600} onChange={(description) => setField({ description })} />
        <div className="cfg-product-variants">
          <span className="cfg-label">Наявність за варіантами</span>
          {product.variants.map((variant) => (
            <div className="cfg-product-variant" key={variant.id}>
              <span>{variant.color} / {variant.size}</span>
              <NumberField label={`Залишок ${variant.color}, ${variant.size}`} value={variant.inventory} min={0} max={9999}
                onChange={(inventory) => setField({ variants: product.variants.map((item) => item.id === variant.id ? { ...item, inventory } : item) })} />
            </div>
          ))}
        </div>
        <ImagePicker
          label="Фото товару"
          value={productImage(product)}
          aspect="3 / 4"
          group="product"
          onChange={(next) => setField({ customImage: next })}
          onClear={() => setField({ customImage: undefined })}
          onDelete={product.customImage ? () => setField({ customImage: undefined }) : undefined}
        />
      </div>}
    </li>
  );
}

export function ProductsPanel() {
  const config = useBrand();
  const commit = useConfigStore((state) => state.commit);
  const replace = useConfigStore((state) => state.replace);

  const dragFrom = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const addProduct = () => {
    const source = config.products[0] ?? catalog[0];
    if (!source) return;
    const id = crypto.randomUUID();
    const product = createDraftProduct(source, id, `new-product-${id.slice(0, 8)}`, `Новий товар ${config.products.length + 1}`);
    commit((current) => ({ ...current, products: [...current.products, product] }));
  };

  const handleDrop = () => {
    const from = dragFrom.current;
    const to = dragOver;
    if (from !== null && to !== null && from !== to) {
      commit((current) => {
        const products = [...current.products];
        const [moved] = products.splice(from, 1);
        if (!moved) return current;
        products.splice(to, 0, moved);
        return { ...current, products };
      });
    }
    dragFrom.current = null;
    setDragOver(null);
  };

  return <>
    <FieldGroup title="Секція New Arrivals">
      <TextField label="Заголовок секції" id="home.newArrivalsTitle" value={config.home.newArrivalsTitle} maxLength={48} onChange={(next) => replace({ ...config, home: { ...config.home, newArrivalsTitle: next } })} />
      <Segmented label="Товарів у ряді — десктоп" value={config.home.desktopColumns ?? 4} options={[{ value: 2, label: "2" }, { value: 3, label: "3" }, { value: 4, label: "4" }]} onChange={(next) => patchHome(commit, { desktopColumns: next })} />
      <Segmented label="Товарів у ряді — телефон" value={config.home.mobileColumns ?? 2} options={[{ value: 1, label: "1" }, { value: 2, label: "2" }]} onChange={(next) => patchHome(commit, { mobileColumns: next })} />
      <Segmented label="Кількість товарів на головній" value={config.home.homepageProductCount ?? 4} options={[{ value: 4, label: "4" }, { value: 8, label: "8" }, { value: 12, label: "12" }]} onChange={(next) => patchHome(commit, { homepageProductCount: next })} />
    </FieldGroup>
    <FieldGroup title={`Товари (${config.products.length})`}>
      <p className="cfg-note">Додайте товар, налаштуйте опис і залишки. Нові товари створюються прихованими, доки ви їх не опублікуєте у вітрині.</p>
      <button type="button" className="cfg-add-product" onClick={addProduct}><Plus size={14} aria-hidden="true" /> Додати товар</button>
      <ul className="cfg-product-list">
        {config.products.map((product, index) => (
          <ProductRow
            key={product.id}
            product={product}
            index={index}
            count={config.products.length}
            onDragStart={(i) => { dragFrom.current = i; }}
            onDragOver={setDragOver}
            onDrop={handleDrop}
            onDragEnd={() => { dragFrom.current = null; setDragOver(null); }}
            onMove={(direction) => moveProduct(commit, product.id, direction)}
            onDelete={() => {
              if (window.confirm(`Видалити товар «${product.name}»? Дію можна скасувати кнопкою Undo.`)) removeProduct(commit, product.id);
            }}
            dragOver={dragOver === index}
          />
        ))}
      </ul>
    </FieldGroup>
  </>;
}
