import type { Metadata } from "next";
import { AboutView } from "@/components/AboutView";

export const metadata: Metadata = { title: "Our story" };

export default function AboutPage() {
  return <AboutView />;
}
