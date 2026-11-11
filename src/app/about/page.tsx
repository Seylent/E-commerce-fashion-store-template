import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { activeBrand } from "@/config/brands";
export const metadata: Metadata = { title: "Our story" };
export default function AboutPage() { return <div className="about-page"><div className="about-intro section-shell"><span className="eyebrow">ABOUT {activeBrand.name.toUpperCase()}</span><h1>{activeBrand.home.storyTitle}</h1><p>{activeBrand.home.storyCopy}</p></div><div className="about-image"><Image src={activeBrand.hero.image} alt="Contemporary fashion editorial" fill priority sizes="100vw" /></div><div className="about-manifesto section-shell"><span className="eyebrow">OUR APPROACH</span><div><h2>Pieces that make space for your life.</h2><p>{activeBrand.home.editorialCopy}</p><p>This is sample brand storytelling for the template. Replace it with your own materials, origin and point of view before launch.</p><Link href="/shop" className="underlined-link">EXPLORE THE COLLECTION <ArrowUpRight size={16} /></Link></div></div></div>; }
