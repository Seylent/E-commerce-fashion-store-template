import type { Metadata } from "next";
import { CartPageView } from "@/components/CartPageView";
export const metadata: Metadata = { title: "Shopping bag" };
export default function CartPage() { return <CartPageView />; }
