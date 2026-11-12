"use client";

import { SmartImage } from "./SmartImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useBrand } from "@/store/config";

export function LookbookView() {
  const brand = useBrand();
  return <div className="lookbook-page"><div className="page-intro section-shell"><h1>Ways of seeing.</h1><p>An editorial study of shape, light and the everyday.</p></div><div className="lookbook-hero"><SmartImage src={brand.hero.image} alt="Models in a stone courtyard" fill priority sizes="100vw" /><span>01 / A STUDY IN FORM</span></div><div className="lookbook-grid section-shell"><div><h2>Everything in its place.</h2><p>{brand.home.editorialCopy}</p><Link href="/shop" className="underlined-link">SHOP THE EDIT <ArrowUpRight size={16} /></Link></div><div className="lookbook-portrait"><SmartImage src={brand.home.editorialImage} alt="Editorial portrait in a city courtyard" fill sizes="(max-width: 800px) 100vw, 50vw" /></div></div></div>;
}
