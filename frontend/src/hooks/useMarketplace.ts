import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createOrder,
  getEmiPlans,
  getProduct,
  getProducts,
} from '@/api/marketplace';
import { queryKeys } from '@/hooks/queryKeys';
import type { CreateOrderPayload, ProductListParams } from '@/features/marketplace/types';

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
    placeholderData: (prev) => prev, // keep list on screen while a new search resolves
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => getProduct(id),
    enabled: Boolean(id),
  });
}

export function useEmiPlans() {
  return useQuery({
    queryKey: queryKeys.emiPlans(),
    queryFn: getEmiPlans,
    staleTime: 5 * 60 * 1000, // plans rarely change
  });
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
  });
}
