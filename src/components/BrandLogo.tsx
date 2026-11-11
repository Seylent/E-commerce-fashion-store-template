import Image from "next/image";
import Link from "next/link";
import { activeBrand } from "@/config/brands";

export function BrandLogo({ light = false }: { light?: boolean }) {
  const { logo, name } = activeBrand;
  return <Link href="/" aria-label={`${name} home`} className={`brand-logo ${light ? "brand-logo-light" : ""}`}>
    {logo.image ? <Image src={logo.image} alt={name} width={150} height={40} priority /> : logo.text}
  </Link>;
}
