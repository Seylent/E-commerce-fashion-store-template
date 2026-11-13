"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, Search, ShoppingBag, Shapes, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useBrand } from "@/store/config";
import { useCart } from "@/store/cart";
import { BrandLogo } from "./BrandLogo";
import { SmartImage } from "./SmartImage";
import { searchProducts } from "@/lib/searchProducts";

const links = [
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/collections", label: "Collections", icon: Shapes },
  { href: "/lookbook", label: "Lookbook", icon: BookOpen },
  { href: "/about", label: "Our story", icon: Sparkles },
];

export function Header() {
  const brand = useBrand();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const count = useCart((state) => state.lines.reduce((sum, line) => sum + line.quantity, 0));
  const openCart = useCart((state) => state.open);
  const searchResults = searchProducts(brand.products, search);
  useEffect(() => setMounted(true), []);
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);
  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  return <>
    <header className="site-header">
      <div className="header-inner">
        <button className="menu-toggle mobile-only" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        <div className="header-brand">
          <BrandLogo />
          <span className="sidebar-tagline">{brand.tagline}</span>
        </div>
        <nav className="desktop-nav" aria-label="Main navigation">
          <span className="sidebar-section-label">Explore</span>
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return <Link className={active ? "active" : ""} href={link.href} key={link.href} aria-label={link.label} aria-current={active ? "page" : undefined}><Icon size={17} strokeWidth={1.65} /><span className="nav-label">{link.label}</span></Link>;
          })}
        </nav>
        <div className="sidebar-support">
          <span className="sidebar-section-label">Need a hand?</span>
          <Link href="/contact">Contact our studio <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="header-actions">
          <button ref={searchButtonRef} type="button" className="nav-action" aria-label="Search products" aria-expanded={searchOpen} aria-controls="site-search-panel" onClick={() => { setMenuOpen(false); setSearchOpen((open) => !open); }}><Search size={18} strokeWidth={1.65} /><span className="nav-action-label">Search</span></button>
          <button className="nav-action cart-trigger" aria-label={`Open cart, ${mounted ? count : 0} items`} onClick={openCart}><ShoppingBag size={18} strokeWidth={1.65} /><span className="nav-action-label">Shopping bag</span><span className="cart-count">{mounted ? count : 0}</span></button>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="search-layer" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <button type="button" className="search-backdrop" aria-label="Close search" onClick={() => setSearchOpen(false)} />
          <form id="site-search-panel" className="search-panel" action="/shop" method="get" role="search">
            <label htmlFor="site-search">SEARCH THE COLLECTION</label>
            <div className="search-input-row">
              <input id="site-search" autoFocus type="search" name="search" placeholder="What are you looking for?" value={search} onChange={(event) => setSearch(event.target.value)} />
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={21} /></button>
            </div>
            <div className="search-results" aria-live="polite">
              {search.trim() ? searchResults.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} onClick={() => setSearchOpen(false)} className="search-result">
                  <span className="search-result-image"><SmartImage src={product.customImage ?? product.images[0]} alt="" fill sizes="48px" /></span>
                  <span><span>{product.name}</span><small>{product.category}</small></span>
                </Link>
              )) : <p className="search-hint">Start typing to find pieces.</p>}
              {search.trim() && searchResults.length === 0 && <p className="search-hint">No matching products found.</p>}
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
    <AnimatePresence>{menuOpen && <motion.div id="mobile-navigation" className="mobile-menu" initial={reduced ? false : { opacity: 0, x: "-100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "-100%" }} transition={{ duration: 0.3 }}><nav aria-label="Mobile navigation">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} aria-current={pathname === link.href ? "page" : undefined}>{link.label}<span aria-hidden="true">↗</span></Link>)}</nav><div className="mobile-menu-bottom"><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link><span>{brand.tagline}</span></div></motion.div>}</AnimatePresence>
  </>;
}
