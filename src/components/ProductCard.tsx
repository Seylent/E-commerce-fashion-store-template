"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/config/types";
import { useBrand } from "@/store/config";
import { formatPrice } from "@/lib/commerce";
import { productImage } from "@/store/configMutations";
import { useCart } from "@/store/cart";
import { useEditable } from "@/components/configurator/editable";
import { SmartImage } from "./SmartImage";

export function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const add = useCart((state) => state.add);
  const brand = useBrand();
  const name = useEditable(`product.${product.id}.name`, `Назва товару «${product.name}»`);
  const price = useEditable(`product.${product.id}.price`, `Ціна товару «${product.name}»`);
  const image = useEditable(`product.${product.id}.image`, `Фото товару «${product.name}»`);
  const variant = product.variants.find((option) => option.color === selectedColor && option.inventory > 0);
  return <article className="product-card" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <div className="product-card-media"><Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} {...image}>
      <SmartImage src={productImage(product)} alt={`${product.name} front view`} fill sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw" className={`product-card-image ${hovered ? "is-hovered" : ""}`} />
      {product.images[1] && <SmartImage src={product.images[1]} alt={`${product.name} editorial view`} fill sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw" className={`product-card-image product-card-image-alt ${hovered ? "is-hovered" : ""}`} />}
    </Link>{product.badge && <span className="product-badge">{product.badge}</span>}{variant && <button className="quick-add" onClick={() => add(product, variant)} aria-label={`Quick add ${product.name} in ${variant.size}, ${variant.color} to cart`}><Plus size={17} /><span>QUICK ADD</span></button>}</div>
    <div className="product-card-info"><Link href={`/products/${product.slug}`} {...name}>{product.name}</Link><span {...price}>{formatPrice(product.price, brand)}</span><div className="product-card-swatches" aria-label={`${product.name} colors`}>{product.colors.map((color) => <button key={color.name} type="button" title={color.name} aria-label={`${product.name} in ${color.name}`} aria-pressed={selectedColor === color.name} onClick={() => setSelectedColor(color.name)} style={{ backgroundColor: color.hex }} className={selectedColor === color.name ? "selected" : ""} />)}</div></div>
  </article>;
}
