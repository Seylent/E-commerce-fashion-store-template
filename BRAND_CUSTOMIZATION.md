# Rebrand in minutes

The template renders from one typed `BrandConfig`. Rebranding requires configuration and asset changes; storefront components stay the same.

1. **Choose a preset.** Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BRAND_PRESET=atelier`, `form`, or `object`. Restart the server after changing it.
2. **Create a client preset.** Duplicate one object in `src/config/brands.ts`, assign a new `id`, and add it to `brandPresets`. TypeScript checks all required fields against `BrandConfig` in `src/config/types.ts`.
3. **Set identity and design.** Edit `name`, `logo.text` or `logo.image`, `favicon`, `tagline`, `announcement`, `colors`, and `typography`. Add logo and favicon files under `public/` and reference them with `/filename.ext` paths. Color fields become CSS variables in the root layout.
4. **Replace imagery.** Put campaign, collection and catalog images in `public/images/`. Update `hero`, `home.editorialImage`, each `collections[].image`, and each `products[].images`. Use large source photos with the subject framed for mobile crops. `next/image` handles responsive delivery.
5. **Update merchandise.** Edit or replace `src/config/catalog.ts` and set the new preset's `products` array. Each product has a stable `id`, URL `slug`, images, category, collection slug, prices, colors, sizes and variants. Variant `inventory: 0` disables purchase. Keep each `variant.id` unique; cart persistence refers to product and variant IDs.
6. **Set commerce and content.** Edit `currency` and `locale` together, then update homepage headings and section order in `home.featuredSections`. Update collection descriptions, SEO metadata, social URLs, contact, shipping and returns. Remove sample business details.
   Set `NEXT_PUBLIC_SITE_URL` to the client's public origin for canonical Open Graph image URLs.
7. **Connect services.** Replace `demoCheckoutAdapter` in `src/lib/checkout.ts` with a real implementation of `CheckoutAdapter`, ideally via a server endpoint that validates current prices and stock. Connect `Newsletter` to your email platform. Replace privacy and terms pages with real legal documents.
8. **Verify.** Run `npm run typecheck`, `npm test`, and `npm run build`. Check desktop and mobile crops, keyboard navigation, cart persistence, low-stock variants, metadata and real checkout in a staging environment.

## Configuration example

```ts
const myBrand: BrandConfig = {
  ...brandPresets.atelier,
  id: "my-brand",
  name: "My Brand",
  logo: { text: "MY BRAND", image: "/my-logo.svg" },
  favicon: "/my-favicon.svg",
  colors: { ...brandPresets.atelier.colors, accent: "#7D8778" },
  hero: { ...brandPresets.atelier.hero, title: "A new point\nof view.", image: "/images/my-campaign.jpg" },
  products: myProducts,
};
```

The initial demo catalog is shared by all three sample presets so their design and voice can be compared quickly. Client presets should point to their own catalog and imagery.
