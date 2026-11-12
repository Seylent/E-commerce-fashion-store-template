"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

/** Floating entry point to the demo configurator. Hidden on /configure itself. */
export function ConfigureCTA() {
  const pathname = usePathname();
  if (pathname.startsWith("/configure")) return null;
  return <Link href="/configure" className="configure-cta"><SlidersHorizontal size={16} /> Configure your site</Link>;
}
