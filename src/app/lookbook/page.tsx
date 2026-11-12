import type { Metadata } from "next";
import { LookbookView } from "@/components/LookbookView";

export const metadata: Metadata = { title: "Lookbook" };

export default function LookbookPage() {
  return <LookbookView />;
}
