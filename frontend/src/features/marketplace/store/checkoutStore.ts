import { create } from 'zustand';

/**
 * Ephemeral checkout state — the variant + EMI plan the user is currently
 * configuring. Server data (products, plans) stays in React Query; only the
 * user's in-progress choices live here so they survive navigation between the
 * product screen and the confirmation screen.
 */
interface CheckoutState {
  productId: string | null;
  variantId: string | null;
  planId: string | null;
  setProduct: (productId: string) => void;
  selectVariant: (variantId: string) => void;
  selectPlan: (planId: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  productId: null,
  variantId: null,
  planId: null,
  setProduct: (productId) =>
    set((s) => (s.productId === productId ? s : { productId, variantId: null, planId: null })),
  selectVariant: (variantId) => set({ variantId }),
  selectPlan: (planId) => set({ planId }),
  reset: () => set({ productId: null, variantId: null, planId: null }),
}));
