import { emiPlans, products } from '@/api/mock/db';
import type { CreateOrderPayload, Order } from '@/features/marketplace/types';

/**
 * A tiny fake HTTP server. It understands the same routes the real backend
 * would expose, adds artificial latency, and can be told to fail so we can
 * exercise error states. Swapping to a real API means deleting this file and
 * flipping `useMockApi` to false in app.json.
 */

interface MockResponse<T = unknown> {
  status: number;
  data: T;
}

export const mockConfig = {
  latencyMs: 650,
  /** Set to a route fragment (e.g. "/products") to force the next match to 500. */
  failRoute: null as string | null,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function mockRequest<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<MockResponse<T>> {
  await delay(mockConfig.latencyMs);

  const [rawPath, rawQuery = ''] = path.split('?');
  const query = new URLSearchParams(rawQuery);

  if (mockConfig.failRoute && rawPath.includes(mockConfig.failRoute)) {
    mockConfig.failRoute = null;
    return { status: 500, data: { message: 'Something went wrong. Please try again.' } as T };
  }

  // GET /products
  if (method === 'GET' && rawPath === '/products') {
    const search = query.get('search')?.toLowerCase().trim();
    const category = query.get('category');
    let list = products.map(toSummary);
    if (category && category !== 'All') list = list.filter((p) => p.category === category);
    if (search)
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search),
      );
    return { status: 200, data: list as T };
  }

  // GET /products/:id
  const productMatch = rawPath.match(/^\/products\/([^/]+)$/);
  if (method === 'GET' && productMatch) {
    const product = products.find((p) => p.id === productMatch[1]);
    return product
      ? { status: 200, data: product as T }
      : { status: 404, data: { message: 'Product not found' } as T };
  }

  // GET /emi-plans
  if (method === 'GET' && rawPath === '/emi-plans') {
    return { status: 200, data: emiPlans as T };
  }

  // POST /orders
  if (method === 'POST' && rawPath === '/orders') {
    const payload = body as CreateOrderPayload;
    const product = products.find((p) => p.id === payload.productId);
    const variant = product?.variants.find((v) => v.id === payload.variantId);
    const plan = emiPlans.find((pl) => pl.id === payload.planId);
    if (!product || !variant || !plan) {
      return { status: 422, data: { message: 'Invalid selection' } as T };
    }
    const order: Order = {
      id: `ord_${Date.now()}`,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      productName: product.name,
      variantLabel: variant.label,
      monthlyEmi: 0, // filled by caller from the quote; kept simple here
      tenureMonths: plan.tenureMonths,
    };
    return { status: 201, data: order as T };
  }

  return { status: 404, data: { message: `No mock handler for ${method} ${rawPath}` } as T };
}

function toSummary(p: (typeof products)[number]) {
  const { id, name, brand, category, thumbnail, startingPrice, startingMrp, rating, ratingCount } = p;
  return { id, name, brand, category, thumbnail, startingPrice, startingMrp, rating, ratingCount };
}
