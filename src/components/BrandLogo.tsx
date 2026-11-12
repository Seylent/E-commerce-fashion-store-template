"use client";

import Link from "next/link";
import { useBrand } from "@/store/config";
import { useEditable } from "@/components/configurator/editable";
import { SmartImage } from "./SmartImage";

export function BrandLogo({ light = false }: { light?: boolean }) {
  const { logo, name } = useBrand();
  const editable = useEditable("brand.logo", "Логотип");
  return (
    <Link href="/" {...editable} className={`brand-logo ${light ? "brand-logo-light" : ""} ${editable.className ?? ""}`} aria-label={`${name} home`}>
      {logo.image ? <SmartImage src={logo.image} alt={name} width={150} height={40} priority /> : logo.text}
    </Link>
  );
}
