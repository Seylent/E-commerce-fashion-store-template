"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useBrand } from "@/store/config";
import { useCart } from "@/store/cart";
import { BrandLogo } from "./BrandLogo";
import { SmartImage } from "./SmartImage";

const links = [{ href: "/shop", label: "SHOP" }, { href: "/collections", label: "COLLECTIONS" }, { href: "/lookbook", label: "LOOKBOOK" }, { href: "/about", label: "OUR STORY" }];

export function Header() {
  const brand = useBrand();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0));
  const openCart = useCart((state) => state.open);
  useEffect(() => setMounted(true), []);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  return <>
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <button className="icon-button mobile-only" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          <nav className="desktop-nav" aria-label="Main navigation">{links.map((link) => <Link className={pathname === link.href ? "active" : ""} href={link.href} key={link.href}>{link.label}</Link>)}</nav>
        </div>
        <BrandLogo />
        <div className="header-actions">
          <button className="icon-button" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={20} strokeWidth={1.5} /></button>
          <button className="cart-trigger" aria-label={`Open cart, ${mounted ? count : 0} items`} onClick={openCart}><ShoppingBag size={20} strokeWidth={1.5} /><span className="cart-count">{mounted ? count : 0}</span></button>
        </div>
      </div>
    </header>
    <AnimatePresence>{searchOpen && <motion.form initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="search-panel" action="/shop" method="get" onClick={() => setSearchOpen(false)}><label htmlFor="site-search">SEARCH THE COLLECTION</label><div><input id="site-search" autoFocus type="search" name="search" placeholder="What are you looking for?" value={search} onChange={(event) => setSearch(event.target.value)} /><button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={21} /></button></div><div className="search-results">{search.trim() ? brand.products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 6).map((product) => <Link key={product.id} href={`/products/${product.slug}`} onClick={() => setSearchOpen(false)} className="search-result"><SmartImage src={product.images[0]} alt={product.name} fill sizes="64px" /><div><span>{product.name}</span><small>{product.category}</small></div></Link>) : <p className="search-hint">Start typing to find pieces.</p>}</div></motion.form>}</AnimatePresence>
    <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={reduced ? false : { opacity: 0, x: "-100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "-100%" }} transition={{ duration: 0.3 }}><nav aria-label="Mobile navigation">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}</nav><div className="mobile-menu-bottom"><Link href="/contact" onClick={() => setMenuOpen(false)}>CONTACT</Link><span>{brand.tagline}</span></div></motion.div>}</AnimatePresence>
  </>;
}
