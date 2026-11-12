"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBrand } from "@/store/config";
import { checkoutRequest, demoCheckoutAdapter } from "@/lib/checkout";
import { formatPrice } from "@/lib/commerce";
import { useCart } from "@/store/cart";

export function CheckoutView() {
  const brand = useBrand();
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const lines = useCart((state) => state.lines);
  useEffect(() => setMounted(true), []);
  const entries = mounted ? lines.map((line) => ({ line, product: brand.products.find((item) => item.id === line.productId) })).filter((entry) => entry.product) : [];
  const subtotal = entries.reduce((sum, entry) => sum + (entry.product?.price ?? 0) * entry.line.quantity, 0);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const result = await demoCheckoutAdapter.createCheckout(checkoutRequest(brand, lines.map(({ productId, variantId, quantity }) => ({ productId, variantId, quantity })))); if (result.status === "redirect") window.location.assign(result.url); else setMessage(result.message); };
  return <div className="checkout-page section-shell"><div className="page-intro"><h1>Almost yours.</h1><p>This demo shows the checkout integration point. No payment or order is processed.</p></div>{entries.length ? <div className="checkout-layout"><form onSubmit={submit} className="checkout-form"><h2>Contact & delivery</h2><div className="form-grid"><label>Email address<input type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Full name<input autoComplete="name" required placeholder="Full name" /></label><label>Address<input autoComplete="street-address" required placeholder="Street address" /></label><label>City<input autoComplete="address-level2" required placeholder="City" /></label><label>Postal code<input autoComplete="postal-code" required placeholder="Postal code" /></label><label>Country / region<input autoComplete="country-name" required placeholder="Country / region" /></label></div><button className="button-dark" type="submit">CONTINUE TO PAYMENT INTEGRATION ↗</button><p role="status" className="checkout-message">{message}</p></form><aside className="order-summary"><h2>Your order</h2>{entries.map(({ line, product }) => product && <div className="checkout-line" key={line.key}><span>{product.name} × {line.quantity}</span><strong>{formatPrice(product.price * line.quantity, brand)}</strong></div>)}<div className="checkout-total"><span>SUBTOTAL</span><strong>{formatPrice(subtotal, brand)}</strong></div><p>Final shipping and taxes depend on your provider.</p></aside></div> : <div className="cart-empty"><p>Your bag is empty.</p><Link href="/shop" className="button-dark">EXPLORE THE COLLECTION</Link></div>}</div>;
}
