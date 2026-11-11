import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { activeBrand } from "@/config/brands";
export const metadata: Metadata = { title: "Lookbook" };
export default function LookbookPage() { return <div className="lookbook-page"><div className="page-intro section-shell"><span className="eyebrow">SEASON 01 / VISUAL NOTES</span><h1>Ways of seeing.</h1><p>An editorial study of shape, light and the everyday.</p></div><div className="lookbook-hero"><Image src={activeBrand.hero.image} alt="Models in a stone courtyard" fill priority sizes="100vw" /><span>01 / A STUDY IN FORM</span></div><div className="lookbook-grid section-shell"><div><span className="eyebrow">THE EDIT / 001</span><h2>Everything in its place.</h2><p>{activeBrand.home.editorialCopy}</p><Link href="/shop" className="underlined-link">SHOP THE EDIT <ArrowUpRight size={16} /></Link></div><div className="lookbook-portrait"><Image src={activeBrand.home.editorialImage} alt="Editorial portrait in a city courtyard" fill sizes="(max-width: 800px) 100vw, 50vw" /></div></div></div>; }
