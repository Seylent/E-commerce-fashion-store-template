import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { activeBrand } from "@/config/brands";
import { ProductDetail } from "@/components/ProductDetail";

export function generateStaticParams() { return activeBrand.products.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const product = activeBrand.products.find((item) => item.slug === slug); return { title: product?.name ?? "Product", description: product?.description, openGraph: product ? { images: product.images.slice(0, 1) } : undefined }; }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const product = activeBrand.products.find((item) => item.slug === slug); if (!product) notFound(); return <ProductDetail product={product} />; }
