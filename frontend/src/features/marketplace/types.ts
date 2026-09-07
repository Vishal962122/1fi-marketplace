/** Domain models for the 1Fi Marketplace. Shared by the API layer and the UI. */

export interface ProductVariant {
  id: string;
  /** e.g. "128 GB · Midnight" */
  label: string;
  /** Attribute map used to render variant pickers (colour, storage, size…). */
  attributes: Record<string, string>;
  price: number;
  mrp: number;
  inStock: boolean;
  image?: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  category: string;
  thumbnail: string;
  /** Lowest variant price — used for "from ₹X" on listing cards. */
  startingPrice: number;
  startingMrp: number;
  rating?: number;
  ratingCount?: number;
}

export interface Product extends ProductSummary {
  images: string[];
  description: string;
  highlights: string[];
  specifications: { label: string; value: string }[];
  variants: ProductVariant[];
}

export interface EmiPlan {
  id: string;
  tenureMonths: number;
  /** Flat annual interest rate applied on the financed amount, in percent. */
  annualInterestRate: number;
  /** One-time processing fee in percent of principal. */
  processingFeePercent: number;
  recommended?: boolean;
  /** Optional marketing tag, e.g. "No cost EMI". */
  tag?: string;
}

export interface EmiQuote {
  planId: string;
  tenureMonths: number;
  principal: number;
  monthlyEmi: number;
  totalInterest: number;
  processingFee: number;
  totalPayable: number;
  annualInterestRate: number;
  schedule: { month: number; principal: number; interest: number; balance: number }[];
}

export interface CreateOrderPayload {
  productId: string;
  variantId: string;
  planId: string;
}

export interface Order {
  id: string;
  status: 'CONFIRMED';
  createdAt: string;
  productName: string;
  variantLabel: string;
  monthlyEmi: number;
  tenureMonths: number;
}

export interface ProductListParams {
  search?: string;
  category?: string;
}
