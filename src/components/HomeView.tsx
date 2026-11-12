"use client";

import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { useBrand } from "@/store/config";
import { useEditable } from "@/components/configurator/editable";
import { SmartImage } from "@/components/SmartImage";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";
import { visibleProducts } from "@/store/configMutations";

function Hero() {
  const brand = useBrand();
  const title = useEditable("hero.title", "Заголовок Hero");
  const cta = useEditable("hero.cta", "Текст кнопки Hero");
  const caption = useEditable("hero.caption", "Підпис Hero");
  const image = useEditable("hero.image", "Фото Hero");
  return (
    <section {...image} className={`hero ${image.className ?? ""}`}>
      <SmartImage src={brand.hero.image} alt="Fashion editorial in a warm stone setting" fill priority sizes="100vw" className="hero-image" />
      <div className="hero-shade" style={{ opacity: brand.hero.shade ?? 1 }} />
      <div className="hero-bottom">
        <div>
          <h1 {...title}>{brand.hero.title}</h1>
          <Link href="/shop" {...cta} className={`hero-button ${cta.className ?? ""}`}>{brand.hero.cta}<ArrowRight size={18} /></Link>
        </div>
        <p {...caption}>{brand.hero.caption}</p>
      </div>
      <a className="hero-scroll" href="#discover" aria-label="Scroll to discover"><ArrowDown size={18} /></a>
    </section>
  );
}

function MarqueeLine() {
  return <div id="discover" className="marquee-line"><span>THE ART OF GETTING DRESSED</span><span>—</span><span>AN EVERYDAY EDITION</span><span>—</span><span>FORM FOLLOWS FEELING</span></div>;
}

function Arrivals() {
  const brand = useBrand();
  const heading = useEditable("home.newArrivalsTitle", "Назва секції New Arrivals");
  const products = visibleProducts(brand).slice(0, 4);
  const gridStyle = { "--product-columns": brand.home.desktopColumns ?? 4, "--product-columns-mobile": brand.home.mobileColumns ?? 2 } as React.CSSProperties;
  return (
    <section className="arrivals section-shell">
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

function Editorial() {
  const brand = useBrand();
  return (
    <section className="editorial-section">
      <div className="editorial-image"><SmartImage src={brand.home.editorialImage} alt="Model wearing a considered seasonal look" fill sizes="(max-width: 800px) 100vw, 55vw" /></div>
      <Reveal className="editorial-content">
        <h2>{brand.home.editorialTitle}</h2>
        <p>{brand.home.editorialCopy}</p>
        <Link href="/lookbook" className="underlined-link">VIEW THE LOOKBOOK <ArrowUpRight size={16} /></Link>
      </Reveal>
    </section>
  );
}

function Collections() {
  const brand = useBrand();
  return (
    <section className="collections-section section-shell">
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

function Story() {
  const brand = useBrand();
  return (
    <section className="story-section section-shell">
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
  return <><Hero /><MarqueeLine />{brand.home.featuredSections.map((section) => { const Section = sections[section]; return <Section key={section} />; })}</>;
}
