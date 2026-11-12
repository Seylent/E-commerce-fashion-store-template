"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useBrand } from "@/store/config";
import { filterProducts } from "@/lib/commerce";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";

export function ShopView({ initialSearch = "", collection }: { initialSearch?: string; collection?: string }) {
  const brand = useBrand();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const categories = [...new Set(brand.products.map((product) => product.category))];
  const sizes = [...new Set(brand.products.flatMap((product) => product.sizes))];
  const colors = [...new Set(brand.products.flatMap((product) => product.colors.map((option) => option.name)))];
  const products = useMemo(() => filterProducts(brand.products, { search, category, size, color, sort, collection }), [search, category, size, color, sort, collection]);
  const activeFilters = [category, size, color].filter(Boolean).length;
  return <div className="shop-page section-shell"><div className="page-intro"><h1>{collection ? brand.collections.find((item) => item.slug === collection)?.title ?? "Collection" : "Clothing for the everyday."}</h1><p>{collection ? brand.collections.find((item) => item.slug === collection)?.description : "Considered pieces. Uncomplicated style. Find your new everyday."}</p></div><div className="shop-toolbar"><span>{products.length.toString().padStart(2, "0")} PIECES</span><div><button className="filter-toggle" onClick={() => setFilterOpen(true)}><SlidersHorizontal size={16} /> FILTER {activeFilters > 0 && `(${activeFilters})`}</button><label className="sort-label" htmlFor="sort">SORT BY</label><select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select></div></div><div className="shop-layout"><aside className={`filter-sidebar ${filterOpen ? "filter-open" : ""}`} aria-label="Product filters"><div className="filter-header"><h2>Filters</h2><button className="mobile-only icon-button" aria-label="Close filters" onClick={() => setFilterOpen(false)}><X size={21} /></button></div><label className="filter-search-label" htmlFor="product-search">SEARCH</label><input id="product-search" className="filter-search" type="search" placeholder="Search pieces" value={search} onChange={(event) => setSearch(event.target.value)} /><div className="filter-group"><h2>CATEGORY</h2>{categories.map((item) => <label key={item}><input type="checkbox" checked={category === item} onChange={() => setCategory(category === item ? "" : item)} /><span>{item}</span></label>)}</div><div className="filter-group"><h2>SIZE</h2><div className="filter-pills">{sizes.map((item) => <button key={item} className={size === item ? "selected" : ""} aria-pressed={size === item} onClick={() => setSize(size === item ? "" : item)}>{item}</button>)}</div></div><div className="filter-group"><h2>COLOR</h2>{colors.map((item) => <label key={item}><input type="checkbox" checked={color === item} onChange={() => setColor(color === item ? "" : item)} /><span>{item}</span></label>)}</div><button className="clear-filters" onClick={() => { setCategory(""); setSize(""); setColor(""); setSearch(""); }}>CLEAR ALL FILTERS</button><button className="button-dark mobile-only filter-apply" onClick={() => setFilterOpen(false)}>SHOW {products.length} PIECES</button></aside><div className="shop-results">{products.length ? <div className="product-grid">{products.map((product, index) => <Reveal key={product.id} delay={Math.min(index, 6) * 0.05}><ProductCard product={product} /></Reveal>)}</div> : <div className="empty-results"><h2>No pieces found.</h2><p>Try another search or clear your filters.</p><button className="underlined-link" onClick={() => { setCategory(""); setSize(""); setColor(""); setSearch(""); }}>CLEAR FILTERS →</button></div>}</div></div></div>;
}
