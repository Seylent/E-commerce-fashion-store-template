import type { BrandConfig } from "@/config/types";

export type CheckoutLine = { productId: string; variantId: string; quantity: number };
export type CheckoutRequest = { lines: CheckoutLine[]; currency: string; locale: string };
export type CheckoutResult = { status: "redirect"; url: string } | { status: "unconfigured"; message: string };

export interface CheckoutAdapter {
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
}

export const demoCheckoutAdapter: CheckoutAdapter = {
  async createCheckout() {
    return { status: "unconfigured", message: "Checkout is a demo interface. Connect a payment provider before accepting orders." };
  },
};

export function checkoutRequest(brand: BrandConfig, lines: CheckoutLine[]): CheckoutRequest {
  return { lines, currency: brand.currency, locale: brand.locale };
}
