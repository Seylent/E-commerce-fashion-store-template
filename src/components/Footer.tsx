"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useBrand } from "@/store/config";
import { BrandLogo } from "./BrandLogo";
import { getSafeExternalUrl } from "@/lib/externalUrl";

export function Footer() {
  const brand = useBrand();
  return <footer className="footer"><div className="footer-main"><div className="footer-brand"><BrandLogo /><p>{brand.tagline}</p></div><div className="footer-links"><div><h2>Explore</h2><Link href="/shop">Shop all</Link><Link href="/collections">Collections</Link><Link href="/lookbook">Lookbook</Link><Link href="/about">Our story</Link></div><div><h2>Information</h2><Link href="/contact">Contact</Link><Link href="/shipping-returns">Shipping & returns</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><div><h2>Follow</h2>{Object.entries(brand.social).map(([name, url]) => { const safeUrl = getSafeExternalUrl(url); return safeUrl && <a key={name} href={safeUrl} target="_blank" rel="noopener noreferrer">{name[0].toUpperCase() + name.slice(1)} <ArrowUpRight size={13} /></a>; })}</div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {brand.name.toUpperCase()}</span><span>DESIGNED FOR THE EVERYDAY.</span><Link href="/">BACK TO TOP ↑</Link></div></footer>;
}
