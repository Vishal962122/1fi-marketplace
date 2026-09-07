import type { ProductListParams } from '@/features/marketplace/types';

/** Centralised React Query keys so invalidation stays consistent. */
export const queryKeys = {
  products: (params: ProductListParams) => ['products', params] as const,
  product: (id: string) => ['product', id] as const,
  emiPlans: () => ['emi-plans'] as const,
};
