"use client";

import { SmartImage } from "./SmartImage";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useBrand } from "@/store/config";

export function CollectionsIndexView() {
  const brand = useBrand();
  return <div className="section-shell listing-page"><div className="page-intro"><h1>Our collections.</h1><p>A considered point of view, season after season.</p></div><div className="collection-grid">{brand.collections.map((collection) => <Link className="collection-card" href={`/collections/${collection.slug}`} key={collection.slug}><div className="collection-image"><SmartImage src={collection.image} alt={collection.title} fill sizes="(max-width: 700px) 100vw, 50vw" /></div><div className="collection-copy"><div><h2>{collection.title}</h2><ArrowUpRight size={22} /></div><p>{collection.description}</p></div></Link>)}</div></div>;
}
