"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useBrand } from "@/store/config";
import { useEditable } from "@/components/configurator/editable";
import { SmartImage } from "@/components/SmartImage";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { visibleProducts } from "@/store/configMutations";
import { activeTemplate } from "@/config/templates";

function Hero() {
  const brand = useBrand();
  const title = useEditable("hero.title", "Заголовок головної", false);
  const cta = useEditable("hero.cta", "Текст кнопки головної");
  const image = useEditable("hero.image", "Фото головної");
  const headingStyle = brand.textStyles?.["hero.title"];
  const titleStyle: React.CSSProperties = {
    ...(headingStyle?.family ? { fontFamily: headingStyle.family } : {}),
    ...(headingStyle?.size ? { fontSize: `clamp(32px, ${headingStyle.size / 10}cqw, ${headingStyle.size}px)` } : {}),
    ...(headingStyle?.weight ? { fontWeight: headingStyle.weight } : {}),
    ...(headingStyle?.lineHeight ? { lineHeight: headingStyle.lineHeight / 100 } : {}),
    ...(headingStyle?.color ? { color: headingStyle.color } : {}),
    ...(headingStyle?.opacity !== undefined ? { opacity: headingStyle.opacity / 100 } : {}),
    ...(headingStyle?.align ? { textAlign: headingStyle.align } : {}),
    ...(headingStyle?.shadow ? { textShadow: "0 3px 24px rgba(0, 0, 0, .5)" } : {}),
    ...(headingStyle?.outline ? { WebkitTextStroke: "1px currentColor" } : {}),
    ...(headingStyle?.animation === "fade" ? { animation: "studio-fade-in .55s ease both" } : {}),
    ...(headingStyle?.animation === "rise" ? { animation: "studio-rise-in .65s cubic-bezier(.22, 1, .36, 1) both" } : {}),
  };
  return (
    <section id="hero" {...image} className={`hero ${image.className ?? ""}`}>
      <SmartImage src={brand.hero.image} alt="Fashion editorial in a warm stone setting" fill priority sizes="100vw" className="hero-image" />
      <div className="hero-shade" style={{ opacity: brand.hero.shade ?? 1 }} />
      <div className="hero-bottom">
        <div>
          <h1 {...title} style={titleStyle}>{brand.hero.title}</h1>
          <Link href="/shop" {...cta} className={`hero-button ${cta.className ?? ""}`}>{brand.hero.cta}<ArrowRight size={18} /></Link>
        </div>
      </div>
    </section>
  );
}

function MarqueeLine() {
  return <div id="discover" className="marquee-line"><span>THE ART OF GETTING DRESSED</span><span>—</span><span>AN EVERYDAY EDITION</span><span>—</span><span>FORM FOLLOWS FEELING</span></div>;
}

function Arrivals({ id }: { id: string }) {
  const brand = useBrand();
  const heading = useEditable("home.newArrivalsTitle", "Назва секції New Arrivals", false);
  const products = visibleProducts(brand).slice(0, brand.home.homepageProductCount ?? 4);
  const gridStyle = { "--product-columns": brand.home.desktopColumns ?? 4, "--product-columns-mobile": brand.home.mobileColumns ?? 2 } as React.CSSProperties;
  return (
    <section id={id} className="arrivals section-shell">
      <Reveal className="section-heading">
        <div><h2 {...heading}>{brand.home.newArrivalsTitle}</h2></div>
        <Link href="/shop" className="underlined-link">SHOP ALL <ArrowUpRight size={16} /></Link>
      </Reveal>
      <div className="product-grid home-grid" style={gridStyle}>
        {products.map((product, index) => <Reveal key={product.id} delay={index * 0.07}><ProductCard product={product} /></Reveal>)}
      </div>
    </section>
  );
}

function Editorial({ id }: { id: string }) {
  const brand = useBrand();
  return (
    <section id={id} className="editorial-section">
      <div className="editorial-image"><SmartImage src={brand.home.editorialImage} alt="Model wearing a considered seasonal look" fill sizes="(max-width: 800px) 100vw, 55vw" /></div>
      <Reveal className="editorial-content">
        <h2>{brand.home.editorialTitle}</h2>
        <p>{brand.home.editorialCopy}</p>
        <Link href="/lookbook" className="underlined-link">VIEW THE LOOKBOOK <ArrowUpRight size={16} /></Link>
      </Reveal>
    </section>
  );
}

function Collections({ id }: { id: string }) {
  const brand = useBrand();
  return (
    <section id={id} className="collections-section section-shell">
      <Reveal className="section-heading">
        <div><h2>Explore the collections.</h2></div>
        <Link href="/collections" className="underlined-link">VIEW ALL <ArrowUpRight size={16} /></Link>
      </Reveal>
      <div className="collection-grid">
        {brand.collections.map((collection, index) => (
          <Reveal key={collection.slug} delay={index * 0.1}>
            <Link className="collection-card" href={`/collections/${collection.slug}`}>
              <div className="collection-image"><SmartImage src={collection.image} alt={collection.title} fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
              <div className="collection-copy"><div><h3>{collection.title}</h3><ArrowUpRight size={22} /></div></div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Story({ id }: { id: string }) {
  const brand = useBrand();
  return (
    <section id={id} className="story-section section-shell">
      <Reveal>
        <h2>{brand.home.storyTitle}</h2>
        <p>{brand.home.storyCopy}</p>
        <Link href="/about" className="underlined-link">DISCOVER OUR STORY <ArrowUpRight size={16} /></Link>
      </Reveal>
    </section>
  );
}

const sections = { arrivals: Arrivals, editorial: Editorial, collections: Collections, story: Story, newsletter: Newsletter };

export function HomeView() {
  const brand = useBrand();
  const supportedSections = new Set(activeTemplate.sections.home.map((section) => section.id));
  const visibleSections = brand.home.featuredSections.filter((section) => supportedSections.has(section));
  return <><Hero /><MarqueeLine />{visibleSections.map((section) => { const Section = sections[section]; return <Section key={section} id={section} />; })}</>;
}
