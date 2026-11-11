"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/config/types";

export type CartLine = { key: string; productId: string; variantId: string; quantity: number };
type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product, variant: ProductVariant, quantity?: number) => void;
  update: (key: string, quantity: number, inventory: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(persist((set) => ({
  lines: [], isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  add: (product, variant, quantity = 1) => set((state) => {
    if (variant.inventory < 1) return state;
    const key = `${product.id}:${variant.id}`;
    const existing = state.lines.find((line) => line.key === key);
    const desired = Math.max(1, Math.min(variant.inventory, (existing?.quantity ?? 0) + quantity));
    return { isOpen: true, lines: existing ? state.lines.map((line) => line.key === key ? { ...line, quantity: desired } : line) : [...state.lines, { key, productId: product.id, variantId: variant.id, quantity: desired }] };
  }),
  update: (key, quantity, inventory) => set((state) => ({ lines: state.lines.map((line) => line.key === key ? { ...line, quantity: Math.max(1, Math.min(quantity, inventory)) } : line) })),
  remove: (key) => set((state) => ({ lines: state.lines.filter((line) => line.key !== key) })),
  clear: () => set({ lines: [] }),
}), { name: "atelier-cart-v1", partialize: (state) => ({ lines: state.lines }) }));
