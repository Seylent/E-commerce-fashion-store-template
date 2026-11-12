"use client";

import { useBrand } from "@/store/config";

export function ShippingView() {
  const brand = useBrand();
  return <div className="info-page section-shell"><div className="page-intro"><h1>Shipping & returns.</h1><p>Everything you need to know before placing an order.</p></div><div className="policy-block"><h2>Delivery</h2><p>{brand.shipping.delivery}</p></div><div className="policy-block"><h2>Returns</h2><p>{brand.shipping.returns}</p></div><p className="policy-disclaimer">This template includes sample policy text only. Replace it with your actual terms, regions and rates before launch.</p></div>;
}
