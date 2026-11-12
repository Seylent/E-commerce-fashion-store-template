"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useBrand } from "@/store/config";
import { formatPrice } from "@/lib/commerce";
import { useCart } from "@/store/cart";
import { SmartImage } from "./SmartImage";

export function CartPageView() {
  const brand = useBrand();
  const [mounted, setMounted] = useState(false);
  const { lines, update, remove } = useCart();
  useEffect(() => setMounted(true), []);
  const entries = mounted ? lines.map((line) => ({ line, product: brand.products.find((item) => item.id === line.productId) })).filter((entry) => entry.product) : [];
  const subtotal = entries.reduce((sum, entry) => sum + (entry.product?.price ?? 0) * entry.line.quantity, 0);
  return <div className="cart-page section-shell"><div className="page-intro"><h1>Shopping bag.</h1></div>{entries.length ? <div className="cart-page-layout"><div className="cart-page-items">{entries.map(({ line, product }) => { if (!product) return null; const variant = product.variants.find((item) => item.id === line.variantId); return <div className="cart-page-item" key={line.key}><Link href={`/products/${product.slug}`} className="cart-page-image"><SmartImage src={product.customImage ?? product.images[0]} alt={product.name} fill sizes="(max-width: 600px) 110px, 170px" /></Link><div className="cart-page-item-info"><div><Link href={`/products/${product.slug}`}>{product.name}</Link><p>{variant?.color} / {variant?.size}</p><span>{formatPrice(product.price, brand)}</span></div><div className="cart-page-item-actions"><div className="quantity-control"><button aria-label={`Remove one ${product.name}`} onClick={() => line.quantity === 1 ? remove(line.key) : update(line.key, line.quantity - 1, variant?.inventory ?? 1)}><Minus size={14} /></button><span>{line.quantity}</span><button aria-label={`Add one ${product.name}`} disabled={line.quantity >= (variant?.inventory ?? 0)} onClick={() => update(line.key, line.quantity + 1, variant?.inventory ?? 1)}><Plus size={14} /></button></div><button aria-label={`Remove ${product.name}`} onClick={() => remove(line.key)}><X size={18} /></button></div></div><strong>{formatPrice(product.price * line.quantity, brand)}</strong></div>; })}</div><aside className="order-summary"><h2>Order summary</h2><div><span>SUBTOTAL</span><strong>{formatPrice(subtotal, brand)}</strong></div><p>Shipping and taxes calculated at checkout.</p><Link href="/checkout" className="button-dark">CONTINUE TO CHECKOUT ↗</Link><Link href="/shop" className="underlined-link">CONTINUE SHOPPING →</Link></aside></div> : <div className="cart-empty"><p>Your bag is empty.</p><Link href="/shop" className="button-dark">EXPLORE THE COLLECTION</Link></div>}</div>;
}
