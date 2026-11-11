import type { Metadata } from "next";
import { activeBrand } from "@/config/brands";
export const metadata: Metadata = { title: "Shipping & returns" };
export default function ShippingPage() { return <div className="info-page section-shell"><div className="page-intro"><span className="eyebrow">HELP & INFORMATION</span><h1>Shipping & returns.</h1><p>Everything you need to know before placing an order.</p></div><div className="policy-block"><h2>Delivery</h2><p>{activeBrand.shipping.delivery}</p></div><div className="policy-block"><h2>Returns</h2><p>{activeBrand.shipping.returns}</p></div><p className="policy-disclaimer">This template includes sample policy text only. Replace it with your actual terms, regions and rates before launch.</p></div>; }
