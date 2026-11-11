"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { activeBrand } from "@/config/brands";
import { formatPrice } from "@/lib/commerce";
import { useCart } from "@/store/cart";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const { lines, isOpen, close, update, remove } = useCart();
  useEffect(() => setMounted(true), []);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isOpen]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [close]);
  if (!mounted) return null;
  const items = lines.map((line) => ({ line, product: activeBrand.products.find((product) => product.id === line.productId) })).filter((item) => item.product);
  const total = items.reduce((sum, { line, product }) => sum + (product?.price ?? 0) * line.quantity, 0);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  return <AnimatePresence>{isOpen && <div className="cart-overlay"><motion.button className="cart-backdrop" aria-label="Close cart" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /><motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" initial={reduced ? false : { x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}><div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Shopping bag <small>({count})</small></h2></div><button className="icon-button" aria-label="Close cart" onClick={close}><X size={22} /></button></div><div className="drawer-items">{items.length ? items.map(({ line, product }) => { if (!product) return null; const variant = product.variants.find((option) => option.id === line.variantId); return <div className="drawer-item" key={line.key}><Link onClick={close} href={`/products/${product.slug}`} className="drawer-image"><Image src={product.images[0]} alt={product.name} fill sizes="110px" /></Link><div className="drawer-item-body"><div><Link onClick={close} href={`/products/${product.slug}`}>{product.name}</Link><p>{variant?.color} / {variant?.size}</p></div><div className="drawer-item-bottom"><span>{formatPrice(product.price * line.quantity, activeBrand)}</span><div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => line.quantity === 1 ? remove(line.key) : update(line.key, line.quantity - 1, variant?.inventory ?? 1)}><Minus size={14} /></button><span>{line.quantity}</span><button aria-label={`Add one ${product.name}`} disabled={line.quantity >= (variant?.inventory ?? 0)} onClick={() => update(line.key, line.quantity + 1, variant?.inventory ?? 1)}><Plus size={14} /></button></div></div></div></div>; }) : <div className="drawer-empty"><p>Your bag is waiting.</p><span>Discover pieces made for the everyday.</span><Link href="/shop" onClick={close} className="button-dark">EXPLORE THE COLLECTION</Link></div>}</div>{items.length > 0 && <div className="drawer-footer"><div className="subtotal"><span>SUBTOTAL</span><strong>{formatPrice(total, activeBrand)}</strong></div><p>Shipping and taxes calculated at checkout.</p><Link href="/checkout" onClick={close} className="button-dark">CONTINUE TO CHECKOUT <span>↗</span></Link><Link href="/cart" onClick={close} className="text-link">VIEW BAG</Link></div>}</motion.aside></div>}</AnimatePresence>;
}
