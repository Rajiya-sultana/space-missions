# Plan: Multi-Product Hub for watch.learnwhatmatters.in

## Context

Currently `watch.learnwhatmatters.in` opens directly into the **Ultimate Space Explorer** mission grid (10 missions). The site needs to become a **multi-product video hub** for the three Learn What Matters products:

1. **Ultimate Space Explorer Workbook** (already built — 10 missions)
2. **Fun Science Experiments** (to be built)
3. **Young Hustler / Teen** (to be built)

Behavior we want:
- `/` → product hub: shows the 3 product cards.
- Click a product → that product's mission/video page.
- If the logged-in customer has bought **that specific product** → unlock its videos.
- If not → show a "Buy now" CTA that links to the product's purchase page on `learnwhatmatters.in`.
- Free Mission 1 (Space Explorer) preview behavior is preserved.

The existing Firebase Phone-OTP auth + Shopify webhook + `purchases` collection in Firestore stays — we just generalize it from "1 product" to "N products".

---

## Current state (relevant files)

- [app/page.tsx](app/page.tsx) — currently the Space Explorer mission HQ (will become product hub).
- [app/mission/[id]/page.tsx](app/mission/[id]/page.tsx) — mission video page (will move under `/space-explorer/...`).
- [data/missions.ts](data/missions.ts) — Space Explorer's 10 missions array.
- [components/MissionCard.tsx](components/MissionCard.tsx), [components/ProtectedVideo.tsx](components/ProtectedVideo.tsx), [components/VideoPlayer.tsx](components/VideoPlayer.tsx).
- [app/api/webhooks/shopify/route.ts](app/api/webhooks/shopify/route.ts) — only accepts the Space Explorer product ID (`10426881114406`); ignores everything else.
- [app/api/auth/verify-purchase/route.ts](app/api/auth/verify-purchase/route.ts) — checks `purchases` by phone only, no product filter.
- [context/AuthContext.tsx](context/AuthContext.tsx) — `hasPurchase` is a single boolean.

---

## Target structure

```
app/
├── page.tsx                              ← NEW product hub (3 cards)
├── space-explorer/
│   ├── page.tsx                          ← moved from app/page.tsx (mission grid)
│   └── mission/[id]/page.tsx             ← moved from app/mission/[id]/page.tsx
├── fun-science/
│   ├── page.tsx                          ← scaffold (mission grid, empty/few missions)
│   └── mission/[id]/page.tsx             ← scaffold
├── young-hustler/
│   ├── page.tsx                          ← scaffold
│   └── mission/[id]/page.tsx             ← scaffold
└── api/
    ├── webhooks/shopify/route.ts         ← generalize (accept all known product IDs)
    └── auth/verify-purchase/route.ts     ← accept productSlug, filter by it
data/
├── products.ts                           ← NEW (product registry)
├── missions/
│   ├── space-explorer.ts                 ← renamed from data/missions.ts
│   ├── fun-science.ts                    ← NEW (placeholder array)
│   └── young-hustler.ts                  ← NEW (placeholder array)
```

---

## Step 1 — Product registry

Create `data/products.ts`:

```ts
export type Product = {
  slug: "space-explorer" | "fun-science" | "young-hustler";
  title: string;
  tagline: string;
  shopifyProductId: string;          // for webhook matching
  purchaseUrl: string;               // learnwhatmatters.in product page
  missionsModule: "space-explorer" | "fun-science" | "young-hustler";
  gradient: string;
  emoji: string;
  freeMissionId?: number;            // e.g. 1 for space explorer
};

export const products: Product[] = [
  {
    slug: "space-explorer",
    title: "Ultimate Space Explorer",
    tagline: "10 missions through the Solar System",
    shopifyProductId: "10426881114406",
    purchaseUrl: "https://learnwhatmatters.in/products/the-ultimate-space-explorer-workbook",
    missionsModule: "space-explorer",
    gradient: "from-orange-600 via-purple-600 to-blue-700",
    emoji: "🚀",
    freeMissionId: 1,
  },
  // fun-science + young-hustler entries — fill IDs/URLs when known
];
```

Keep `data/missions.ts` content but **rename** to `data/missions/space-explorer.ts`. Stub `fun-science.ts` and `young-hustler.ts` with empty arrays of the same `Mission` type.

---

## Step 2 — New `/` product hub

Replace [app/page.tsx](app/page.tsx) with a hub that:
- Reuses `StarBackground`, the nebula blobs, header, and footer.
- Renders 3 large product cards (one per `products[]` entry) linking to `/{slug}`.
- Top-right shows `<UserProfileButton />` (already exists).

Keep visual style identical to the existing hero — port the gradient/glass-card classes from current `app/page.tsx`.

---

## Step 3 — Move Space Explorer pages

- Move current `app/page.tsx` body → `app/space-explorer/page.tsx`. Update import to `@/data/missions/space-explorer`. Update mission card link from `/mission/${id}` → `/space-explorer/mission/${id}`. Add a back-to-hub link in the header.
- Move `app/mission/[id]/page.tsx` → `app/space-explorer/mission/[id]/page.tsx`. Update missions import path. Update prev/next links to `/space-explorer/mission/{id}`. Pass new `productSlug="space-explorer"` prop to `ProtectedVideo`.
- Delete the old `app/mission/` directory.

---

## Step 4 — Per-product purchase gating

### `verify-purchase` route
Update [app/api/auth/verify-purchase/route.ts](app/api/auth/verify-purchase/route.ts) to accept `{ phone, productSlug }`. Look up the product's `shopifyProductId` and query:

```ts
adminDb.collection("purchases")
  .where("phoneNumber", "==", normalized)
  .where("productId", "==", product.shopifyProductId)
  .limit(1)
  .get()
```

### `AuthContext`
Change `hasPurchase: boolean` → `purchases: Record<ProductSlug, boolean>`. Helper `hasPurchase(slug)`. Refresh on login by calling verify-purchase per product (3 small calls is fine; or make a single `/api/auth/verify-purchases` that returns a map — preferred).

Recommended: add `app/api/auth/verify-purchases/route.ts` returning `{ "space-explorer": true, "fun-science": false, ... }` in one round trip.

### `ProtectedVideo`
Add `productSlug` prop. Reads `hasPurchase(productSlug)` from context. When not purchased, "Buy Now" link uses `products[slug].purchaseUrl`. Free-mission check uses `products[slug].freeMissionId`.

---

## Step 5 — Webhook generalization

Update [app/api/webhooks/shopify/route.ts](app/api/webhooks/shopify/route.ts):
- Build a `Set<string>` of all `shopifyProductId`s from `products[]`.
- Iterate `order.line_items`. For **each** matching line item, write a `purchases` doc with that line item's `productId` + `productName`. (Today the route only writes one doc using `line_items[0]`, which is wrong for mixed-cart orders.)
- Skip the order only if no line items match any known product.
- HMAC verification stays unchanged.

---

## Step 6 — Fun Science & Young Hustler scaffolds

Create `app/fun-science/page.tsx` and `app/fun-science/mission/[id]/page.tsx` mirroring the Space Explorer versions but reading from `data/missions/fun-science.ts`. Same for `young-hustler`. With empty mission arrays the grid renders an empty state — fine for now; mission data drops in later.

A small shared helper to avoid duplication:

```
components/MissionGrid.tsx     ← takes { product, missions } and renders the grid + hero
components/MissionDetail.tsx   ← takes { product, mission, prev, next }
```

Then each product page is ~10 lines. Optional but recommended — saves triplicating ~150 lines per product.

---

## Files to modify / create

**Create**
- `data/products.ts`
- `data/missions/space-explorer.ts` (moved)
- `data/missions/fun-science.ts` (stub)
- `data/missions/young-hustler.ts` (stub)
- `app/space-explorer/page.tsx`
- `app/space-explorer/mission/[id]/page.tsx`
- `app/fun-science/page.tsx`
- `app/fun-science/mission/[id]/page.tsx`
- `app/young-hustler/page.tsx`
- `app/young-hustler/mission/[id]/page.tsx`
- `app/api/auth/verify-purchases/route.ts`
- `components/MissionGrid.tsx` (optional shared)
- `components/MissionDetail.tsx` (optional shared)

**Modify**
- `app/page.tsx` → product hub
- `app/api/webhooks/shopify/route.ts` → multi-product
- `app/api/auth/verify-purchase/route.ts` → product-scoped (or replace with verify-purchases)
- `context/AuthContext.tsx` → per-product purchase map
- `components/ProtectedVideo.tsx` → `productSlug` prop
- `components/MissionCard.tsx` → accept `basePath` for link

**Delete**
- `app/mission/` (after move)
- `data/missions.ts` (after move)

---

## Decisions (confirmed with user)

- **Scope this pass:** hub + move Space Explorer + scaffold empty Fun Science / Young Hustler routes. Webhook + verify-purchase will already be generalized so adding product IDs later is a one-line change in `data/products.ts`.
- **Free preview rule:** Mission 1 of every product is free. `Product.freeMissionId = 1` for all three.
- **Not-purchased UX:** show inline "Buy Now" CTA (per-product `purchaseUrl`). No auto-redirect.
- **Fun Science / Young Hustler product IDs + purchase URLs + missions:** to be filled into `data/products.ts` and `data/missions/*.ts` later. Until then those slugs use placeholder IDs (`""`) and empty mission arrays. Their `/{slug}` pages render an empty grid with a "Coming soon" state.

---

## Verification plan

1. `npm run dev` → visit `/` → see 3 product cards.
2. Click Space Explorer → land on `/space-explorer` → see the 10 missions grid (identical to today).
3. Click Mission 2 → routes to `/space-explorer/mission/2`. Without auth, video plays (auth flag still off in `ProtectedVideo`). With `AUTH_ENABLED=true`: login → "Purchase required" if unpurchased; video if purchased.
4. Send a Shopify test webhook for the Space Explorer product → `purchases` doc written; verify-purchases returns `{ "space-explorer": true }` for that phone.
5. Send a webhook for Fun Science product ID (after we have it) → separate `purchases` doc; only fun-science is unlocked, space-explorer stays locked for that phone.
6. Visit `/fun-science` and `/young-hustler` → grid renders (empty state if no missions yet) without errors.