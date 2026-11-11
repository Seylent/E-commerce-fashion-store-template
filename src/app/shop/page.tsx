import type { Metadata } from "next";
import { ShopView } from "@/components/ShopView";

export const metadata: Metadata = { title: "Shop all" };
export default async function ShopPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const params = await searchParams;
  return <ShopView initialSearch={params.search ?? ""} />;
}
