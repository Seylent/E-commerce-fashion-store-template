import type { Metadata } from "next";
import { CollectionsIndexView } from "@/components/CollectionsIndexView";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return <CollectionsIndexView />;
}
