import { http } from '@/api/http';
import type {
  CreateOrderPayload,
  EmiPlan,
  Order,
  Product,
  ProductListParams,
  ProductSummary,
} from '@/features/marketplace/types';

/** Typed wrappers around the Marketplace endpoints. UI never calls `http` directly. */

export function getProducts(params: ProductListParams = {}): Promise<ProductSummary[]> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.category) qs.set('category', params.category);
  const query = qs.toString();
  return http.get<ProductSummary[]>(`/products${query ? `?${query}` : ''}`);
}

export function getProduct(id: string): Promise<Product> {
  return http.get<Product>(`/products/${id}`);
}

export function getEmiPlans(): Promise<EmiPlan[]> {
  return http.get<EmiPlan[]>('/emi-plans');
}

export function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return http.post<Order>('/orders', payload);
}
