import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { activeBrand } from "@/config/brands";

export const metadata: Metadata = { title: "Collections" };
export default function CollectionsPage() { return <div className="section-shell listing-page"><div className="page-intro"><span className="eyebrow">THE EDIT</span><h1>Our collections.</h1><p>A considered point of view, season after season.</p></div><div className="collection-grid">{activeBrand.collections.map((collection) => <Link className="collection-card" href={`/collections/${collection.slug}`} key={collection.slug}><div className="collection-image"><Image src={collection.image} alt={collection.title} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="collection-copy"><span className="eyebrow">{collection.eyebrow}</span><div><h2>{collection.title}</h2><ArrowUpRight size={22} /></div><p>{collection.description}</p></div></Link>)}</div></div>; }
