"use client";

import { useBrand, useConfigStore } from "@/store/config";
import { activeBrand } from "@/config/brands";
import type { TemplatePanel } from "@/config/templates";
import { FieldGroup, TextArea, TextField } from "./fields";
import { ImagePicker } from "./ImagePicker";
import { HeroPanel, ProductsPanel } from "./PropertyPanels";

function useHomeEditor() {
  const config = useBrand();
  const replace = useConfigStore((state) => state.replace);
  const updateHome = (patch: Partial<typeof config.home>) =>
    replace({ ...config, home: { ...config.home, ...patch } });
  return { config, replace, updateHome };
}

function EditorialPanel() {
  const { config, updateHome } = useHomeEditor();
  const home = config.home;

  return (
    <>
      <FieldGroup title="Тексти">
        <TextField label="Надзаголовок" id="home.editorialEyebrow" value={home.editorialEyebrow} maxLength={60} onChange={(editorialEyebrow) => updateHome({ editorialEyebrow })} />
        <TextField label="Заголовок" id="home.editorialTitle" value={home.editorialTitle} maxLength={90} onChange={(editorialTitle) => updateHome({ editorialTitle })} />
        <TextArea label="Опис" id="home.editorialCopy" value={home.editorialCopy} rows={4} maxLength={500} onChange={(editorialCopy) => updateHome({ editorialCopy })} />
      </FieldGroup>
      <FieldGroup title="Зображення">
        <ImagePicker
          label="Фото редакційної добірки"
          value={home.editorialImage}
          group="product"
          onChange={(editorialImage) => updateHome({ editorialImage })}
          onClear={() => updateHome({ editorialImage: activeBrand.home.editorialImage })}
        />
      </FieldGroup>
    </>
  );
}

function CollectionsPanel() {
  const { config, replace } = useHomeEditor();
  const updateCollection = (slug: string, patch: Partial<(typeof config.collections)[number]>) =>
    replace({
      ...config,
      collections: config.collections.map((collection) =>
        collection.slug === slug ? { ...collection, ...patch } : collection,
      ),
    });

  return (
    <>
      {config.collections.map((collection, index) => (
        <FieldGroup key={collection.slug} title={`Колекція ${String(index + 1).padStart(2, "0")}`}>
          <TextField label="Назва" value={collection.title} maxLength={48} onChange={(title) => updateCollection(collection.slug, { title })} />
          <TextField label="Надзаголовок" value={collection.eyebrow} maxLength={48} onChange={(eyebrow) => updateCollection(collection.slug, { eyebrow })} />
          <TextArea label="Опис" value={collection.description} rows={3} maxLength={300} onChange={(description) => updateCollection(collection.slug, { description })} />
          <ImagePicker
            label="Обкладинка"
            value={collection.image}
            aspect="4 / 3"
            group="product"
            onChange={(image) => updateCollection(collection.slug, { image })}
          />
        </FieldGroup>
      ))}
      {config.collections.length === 0 && <p className="cfg-empty-state">У цьому шаблоні ще немає колекцій.</p>}
    </>
  );
}

function StoryPanel() {
  const { config, updateHome } = useHomeEditor();
  const home = config.home;

  return (
    <FieldGroup title="Тексти">
      <TextField label="Надзаголовок" id="home.storyEyebrow" value={home.storyEyebrow} maxLength={60} onChange={(storyEyebrow) => updateHome({ storyEyebrow })} />
      <TextField label="Заголовок" id="home.storyTitle" value={home.storyTitle} maxLength={90} onChange={(storyTitle) => updateHome({ storyTitle })} />
      <TextArea label="Опис" id="home.storyCopy" value={home.storyCopy} rows={4} maxLength={500} onChange={(storyCopy) => updateHome({ storyCopy })} />
    </FieldGroup>
  );
}

function NewsletterPanel() {
  const { config, updateHome } = useHomeEditor();
  const home = config.home;

  return (
    <FieldGroup title="Розсилка">
      <TextField label="Заголовок" id="home.newsletterTitle" value={home.newsletterTitle} maxLength={70} onChange={(newsletterTitle) => updateHome({ newsletterTitle })} />
      <TextArea label="Опис" id="home.newsletterCopy" value={home.newsletterCopy} rows={3} maxLength={300} onChange={(newsletterCopy) => updateHome({ newsletterCopy })} />
      <p className="cfg-hint">Форма підписки зараз демонстраційна. Підключіть email-сервіс перед запуском.</p>
    </FieldGroup>
  );
}

export function TemplateSectionPanel({ panel }: { panel: TemplatePanel }) {
  if (panel === "hero") return <HeroPanel />;
  if (panel === "products") return <ProductsPanel />;
  if (panel === "editorial") return <EditorialPanel />;
  if (panel === "collections") return <CollectionsPanel />;
  if (panel === "story") return <StoryPanel />;
  return <NewsletterPanel />;
}
