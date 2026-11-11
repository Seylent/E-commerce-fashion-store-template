import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { activeBrand } from "@/config/brands";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { Newsletter } from "@/components/Newsletter";

const brand = activeBrand;

function Arrivals() {
  return <section className="arrivals section-shell"><Reveal className="section-heading"><div><span className="eyebrow">NEW SEASON / NEW FORMS</span><h2>{brand.home.newArrivalsTitle}</h2></div><Link href="/shop" className="underlined-link">SHOP ALL <ArrowUpRight size={16} /></Link></Reveal><div className="product-grid home-grid">{brand.products.slice(0, 4).map((product, index) => <Reveal key={product.id} delay={index * 0.07}><ProductCard product={product} /></Reveal>)}</div></section>;
}
function Editorial() {
  return <section className="editorial-section"><div className="editorial-image"><Image src={brand.home.editorialImage} alt="Model wearing a considered seasonal look" fill sizes="(max-width: 800px) 100vw, 55vw" /></div><Reveal className="editorial-content"><span className="eyebrow">{brand.home.editorialEyebrow}</span><h2>{brand.home.editorialTitle}</h2><p>{brand.home.editorialCopy}</p><Link href="/lookbook" className="underlined-link">VIEW THE LOOKBOOK <ArrowUpRight size={16} /></Link><span className="editorial-index">01 — 02</span></Reveal></section>;
}
function Collections() {
  return <section className="collections-section section-shell"><Reveal className="section-heading"><div><span className="eyebrow">CURATED FOR YOU</span><h2>Explore the collections.</h2></div><Link href="/collections" className="underlined-link">VIEW ALL <ArrowUpRight size={16} /></Link></Reveal><div className="collection-grid">{brand.collections.map((collection, index) => <Reveal key={collection.slug} delay={index * 0.1}><Link className="collection-card" href={`/collections/${collection.slug}`}><div className="collection-image"><Image src={collection.image} alt={collection.title} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="collection-copy"><span className="eyebrow">{collection.eyebrow}</span><div><h3>{collection.title}</h3><ArrowUpRight size={22} /></div></div></Link></Reveal>)}</div></section>;
}
function Story() {
  return <section className="story-section section-shell"><span className="eyebrow">{brand.home.storyEyebrow}</span><Reveal><h2>{brand.home.storyTitle}</h2><p>{brand.home.storyCopy}</p><Link href="/about" className="underlined-link">DISCOVER OUR STORY <ArrowUpRight size={16} /></Link></Reveal><span className="story-mark">A / 01</span></section>;
}

const sections = { arrivals: Arrivals, editorial: Editorial, collections: Collections, story: Story, newsletter: Newsletter };

export default function HomePage() {
  return <><section className="hero"><Image src={brand.hero.image} alt="Fashion editorial in a warm stone setting" fill priority sizes="100vw" className="hero-image" /><div className="hero-shade" /><div className="hero-top"><span>{brand.hero.eyebrow}</span><span>EST. FOR EVERY DAY</span></div><div className="hero-bottom"><div><span className="eyebrow">THE NEW PERSPECTIVE</span><h1>{brand.hero.title}</h1><Link href="/shop" className="hero-button">{brand.hero.cta}<ArrowRight size={18} /></Link></div><p>{brand.hero.caption}</p></div><a className="hero-scroll" href="#discover" aria-label="Scroll to discover"><ArrowDown size={18} /></a></section><div id="discover" className="marquee-line"><span>THE ART OF GETTING DRESSED</span><span>—</span><span>AN EVERYDAY EDITION</span><span>—</span><span>FORM FOLLOWS FEELING</span></div>{brand.home.featuredSections.map((section) => { const Section = sections[section]; return <Section key={section} />; })}</>;
}
