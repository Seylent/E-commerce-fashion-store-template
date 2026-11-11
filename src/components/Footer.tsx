import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { activeBrand } from "@/config/brands";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  const brand = activeBrand;
  return <footer className="footer"><div className="footer-main"><div className="footer-brand"><BrandLogo /><p>{brand.tagline}</p></div><div className="footer-links"><div><span className="eyebrow">EXPLORE</span><Link href="/shop">Shop all</Link><Link href="/collections">Collections</Link><Link href="/lookbook">Lookbook</Link><Link href="/about">Our story</Link></div><div><span className="eyebrow">INFORMATION</span><Link href="/contact">Contact</Link><Link href="/shipping-returns">Shipping & returns</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><div><span className="eyebrow">FOLLOW</span>{Object.entries(brand.social).map(([name, url]) => url && <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name[0].toUpperCase() + name.slice(1)} <ArrowUpRight size={13} /></a>)}</div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {brand.name.toUpperCase()}</span><span>DESIGNED FOR THE EVERYDAY.</span><Link href="/">BACK TO TOP ↑</Link></div></footer>;
}
