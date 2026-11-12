import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { activeBrand } from "@/config/brands";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { ConfigureCTA } from "@/components/ConfigureCTA";
import "./globals.css";

// Grotesque sans in the spirit of Helvetica Neue — the Represent-style face.
const archivo = Archivo({ subsets: ["latin"], display: "swap", variable: "--font-represent" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: activeBrand.seo.title, template: `%s | ${activeBrand.name}` },
  description: activeBrand.seo.description,
  keywords: activeBrand.seo.keywords,
  icons: { icon: activeBrand.favicon },
  openGraph: { title: activeBrand.seo.title, description: activeBrand.seo.description, images: [activeBrand.hero.image], type: "website" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: activeBrand.colors.background };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const c = activeBrand.colors;
  const style = { "--background": c.background, "--surface": c.surface, "--text": c.text, "--muted": c.muted, "--border": c.border, "--accent": c.accent, "--font-body": activeBrand.typography.body, "--font-display": activeBrand.typography.display } as React.CSSProperties;
  return <html lang={activeBrand.locale.split("-")[0]} data-scroll-behavior="smooth"><body style={style}><a className="skip-link" href="#main">Skip to content</a><div className="storefront"><Header /><main id="main">{children}</main><Footer /><CartDrawer /></div><ConfigureCTA /></body></html>;
}
