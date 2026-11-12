import type { Metadata } from "next";
import { ShippingView } from "@/components/ShippingView";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingPage() {
  return <ShippingView />;
}
