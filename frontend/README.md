# 1Fi Marketplace

The **1Fi Marketplace** feature, built inside the existing **Shop** experience of the 1Fi app.

Stack: **Expo + React Native + TypeScript**, **expo-router** for navigation, **TanStack Query**
for server state, **Zustand** for checkout state. UI tuned to the live app (app.1fi.in):
violet primary, lavender surfaces, pill controls, floating bottom nav, Plus Jakarta Sans.

---

## Running it

```bash
npm install
npx expo start        # press i / a, or scan the QR with Expo Go
```

Ships with an in-memory **mock API** (on by default) — runs with zero setup.

### Run against the real Django backend
```bash
# in ../backend  (see its README)
python manage.py migrate && python manage.py seed && python manage.py runserver

# here
cp .env.example .env      # EXPO_PUBLIC_USE_MOCK=false + API base URL
npx expo start -c
```
The switch is entirely in `src/api/http.ts` — no component code changes.
(`npm run mock` also still works: json-server on :4000.)

---

## How it maps to the brief

| Requirement | Where |
|---|---|
| Shop page: 3-segment toggle — Top Brands / Nearby Stores / 1Fi Marketplace | `src/app/(tabs)/shop.tsx` |
| Top Brands & Nearby Stores — display only, no backend | `src/features/shop/` (static content, matches the live app) |
| 1Fi Marketplace — product grid rendered inline under its segment | `features/marketplace/components/ProductGrid.tsx` |
| Product listing: showcase cards, 3-up, hover-zoom on web | `features/marketplace/components/ProductCard.tsx` + `HoverScale` |
| Product variants | `features/marketplace/components/VariantSelector.tsx` (attribute-driven) |
| EMI options / plans + select a plan | `EmiPlanList` / `EmiPlanCard` + `utils/emi.ts` |
| Relevant product details | `src/app/product/[productId].tsx` |
| CTA to proceed with selected plan | sticky footer → `src/app/checkout.tsx` (order mutation) |
| No hardcoded data in components, dynamic retrieval | `src/api/*` + `src/hooks/useMarketplace.ts` |
| Loading / error / empty states | `Skeleton`, `StateView` — on every screen |

---

## Architecture

```
screens (expo-router)  →  hooks (TanStack Query)  →  api/marketplace.ts  →  api/http.ts  ─┬─► mock/server.ts (default)
                                                        typed endpoints      one choke      └─► fetch(real backend)
                                                                             point
```

- **`src/api`** — the only layer that knows about transport. `http.ts` picks mock vs. real,
  normalises errors to `ApiError`, is the single place for auth headers / retries.
- **`src/hooks`** — thin React Query wrappers; caching, retry policy, `refetch`, loading/error
  flags come for free. Keys centralised in `queryKeys.ts`.
- **`src/features/marketplace`** — domain `types.ts`, EMI amortisation maths, checkout store,
  presentational components.
- **`src/features/shop`** — static Top Brands / Nearby Stores content + their row component.
- **`src/components/ui`** — design-system primitives (`AppText`, `Button`, `Card`, `Badge`,
  `Screen`, `Skeleton`, `StateView`, `SegmentedControl`, `SearchInput`, `SectionHeader`).
- **`src/theme`** — every colour / space / radius / font token, matched to the live 1Fi app.

### State management
- **Server state** → TanStack Query (products, detail, EMI plans, order mutation).
- **Checkout state** (chosen variant + plan) → Zustand `checkoutStore` — survives navigation
  from the product screen to the confirmation screen.
- **Local UI state** (search, category tab) → `useState` + `useDebouncedValue`.

### EMI calculation — `src/features/marketplace/utils/emi.ts`
Reducing-balance: `EMI = P·r·(1+r)^n / ((1+r)^n − 1)`, with a 0% fast-path for no-cost EMI and
a last-instalment adjustment so rounding never drifts. Returns the full amortisation schedule,
total interest, processing fee and total payable.

---

## Trying the states
- **Loading** — mock latency 650 ms (`src/api/mock/server.ts` → `mockConfig.latencyMs`).
- **Error** — set `mockConfig.failRoute = '/products'` (or `/emi-plans`) to fail the next call.
- **Empty** — search for something that doesn't exist.
- **Out of stock** — iPhone 15 · *256 GB · Pink*.

---

## Folder structure

```
src/
├── app/                              # expo-router routes
│   ├── _layout.tsx                   # providers, font loading, root Stack
│   ├── index.tsx                     # → redirects to /shop
│   ├── (tabs)/                       # floating bottom nav
│   │   ├── _layout.tsx               # Home / Shop / EMI Dues / Limit / Profile
│   │   ├── home.tsx  emi-dues.tsx  limit.tsx  profile.tsx   # stubs
│   │   └── shop.tsx                  # banner + 3-segment toggle + search + tab content
│   ├── product/[productId].tsx       # detail: gallery, variants, EMI plans, CTA
│   └── checkout.tsx                  # plan confirmation + order mutation
├── api/            http.ts · marketplace.ts · mock/{db,server}.ts
├── hooks/          useMarketplace.ts · useDebouncedValue.ts · queryKeys.ts
├── features/
│   ├── marketplace/ types.ts · utils/emi.ts · store/checkoutStore.ts · components/*
│   └── shop/        data/shopContent.ts · components/*
├── components/ui/  AppText · Button · Card · Badge · Screen · Skeleton · StateView
│                   SegmentedControl · SearchInput · SectionHeader
├── providers/      QueryProvider.tsx
├── theme/          index.ts (tokens) · fonts.ts
└── lib/            format.ts

mock/db.json                          # same dataset for json-server
```

---

## If merged into the real 1Fi codebase
- `(tabs)/home.tsx` etc. are stubs — the real tabs already exist.
- `components/ui` primitives map 1:1 to the app's design system; `theme/` names are the bridge.
- `api/http.ts` would delegate to the app's existing authenticated API client.
- Plus Jakarta Sans (`theme/fonts.ts`) stands in for 1Fi's brand typeface — swap the font files.
