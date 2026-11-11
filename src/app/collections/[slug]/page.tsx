import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { activeBrand } from "@/config/brands";
import { ShopView } from "@/components/ShopView";

export function generateStaticParams() { return activeBrand.collections.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: activeBrand.collections.find((item) => item.slug === slug)?.title ?? "Collection" }; }
export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; if (!activeBrand.collections.some((item) => item.slug === slug)) notFound(); return <ShopView collection={slug} />; }
