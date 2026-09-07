# 1Fi Marketplace — Backend

Django + Django REST Framework API for the 1Fi Marketplace feature. Serves the
exact JSON shape the Expo app expects, so switching the app from its mock to
this backend is a one-line config change.

## Setup

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

python manage.py migrate
python manage.py seed                 # loads the demo catalogue + EMI plans
python manage.py createsuperuser      # optional, for /admin
python manage.py runserver            # http://localhost:8000
```

Sanity check: <http://localhost:8000/api/products>

## Point the app at it

In `frontend/`:
```bash
cp .env.example .env      # sets EXPO_PUBLIC_USE_MOCK=false + API base URL
npx expo start -c
```
On a physical device, set `EXPO_PUBLIC_API_BASE_URL` to your machine's LAN IP.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/products` | `?search=` (name/brand), `?category=` (`All` = no filter). Returns `ProductSummary[]` |
| `GET` | `/api/products/<id>` | Full product with `variants`, `specifications`, `highlights`, `images` |
| `GET` | `/api/emi-plans` | Active `EmiPlan[]` |
| `GET` | `/api/emi/quote?principal=&planId=` | Full amortisation schedule (server-computed) |
| `POST` | `/api/orders` | Body `{ productId, variantId, planId }` → created `Order` |
| `GET` | `/admin/` | Django admin — manage catalogue & view orders |

All responses are **camelCase** (`startingPrice`, `tenureMonths`, `inStock`, …) via
`djangorestframework-camel-case`, while the Python code stays snake_case.

Example:
```bash
curl localhost:8000/api/products/iphone-15
curl -X POST localhost:8000/api/orders \
  -H 'Content-Type: application/json' \
  -d '{"productId":"iphone-15","variantId":"iphone-15-128-black","planId":"plan-6m"}'
```

## Architecture

```
marketplace/
├── models.py        Product · ProductVariant · EmiPlan · Order
│                    (presentation data as JSONField to mirror the client shape;
│                     starting_price/mrp derived from the cheapest variant)
├── serializers.py   Summary vs Detail product serializers; CreateOrderSerializer
│                    validates variant⇄product, stock, and denormalises a snapshot
├── views.py         Thin DRF generic views + one APIView for the EMI quote
├── emi.py           Reducing-balance EMI maths — mirrors the app's emi.ts so the
│                    numbers match before and after checkout
├── urls.py          Explicit paths, no trailing slash (matches the app's calls)
├── admin.py         Catalogue management + read-only orders
└── management/commands/seed.py   Idempotent demo data (same as the app's mock)
```

### Notes
- **No trailing slashes** (`APPEND_SLASH=False`) — the app calls `/api/products`, not `/api/products/`.
- **Pagination off** for list endpoints — the app expects bare arrays.
- **Decimals render as numbers** (`COERCE_DECIMAL_TO_STRING=False`) — the app does EMI maths on them.
- **CORS** open to `localhost:*` in dev (`config/settings.py`).
- EMI amortisation is computed on both ends; the server value is what gets stored on the `Order`.

## Production checklist (out of scope for the assignment)
Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=false`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOW_ALL=false`
(the `localhost` regex still allows dev), swap SQLite for Postgres, add auth on `POST /orders`.
