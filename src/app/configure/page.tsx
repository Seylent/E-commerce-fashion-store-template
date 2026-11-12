import type { Metadata } from "next";
import { ConfiguratorApp } from "@/components/configurator/ConfiguratorApp";

export const metadata: Metadata = { title: "Конфігуратор" };

export default function ConfigurePage() {
  return <ConfiguratorApp />;
}
