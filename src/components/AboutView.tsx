"use client";

import { SmartImage } from "./SmartImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useBrand } from "@/store/config";

export function AboutView() {
  const brand = useBrand();
  return <div className="about-page"><div className="about-intro section-shell"><h1>{brand.home.storyTitle}</h1><p>{brand.home.storyCopy}</p></div><div className="about-image"><SmartImage src={brand.hero.image} alt="Contemporary fashion editorial" fill priority sizes="100vw" /></div><div className="about-manifesto section-shell"><div><h2>Pieces that make space for your life.</h2><p>{brand.home.editorialCopy}</p><p>This is sample brand storytelling for the template. Replace it with your own materials, origin and point of view before launch.</p><Link href="/shop" className="underlined-link">EXPLORE THE COLLECTION <ArrowUpRight size={16} /></Link></div></div></div>;
}
