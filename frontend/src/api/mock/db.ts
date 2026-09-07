import type { EmiPlan, Product } from '@/features/marketplace/types';

/**
 * In-memory mock database.
 *
 * This is the single source of truth for the mock API. The same shape is
 * mirrored in /mock/db.json so the app can also run against `json-server`
 * (see README) without touching any component code.
 */

const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

export const products: Product[] = [
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'Smartphones',
    thumbnail: img('iphone15-black'),
    startingPrice: 72999,
    startingMrp: 79900,
    rating: 4.7,
    ratingCount: 1240,
    images: [img('iphone15-black'), img('iphone15-back'), img('iphone15-side')],
    description:
      'A 6.1-inch Super Retina XDR display, Dynamic Island, a 48MP main camera and the A16 Bionic chip. Built with aerospace-grade aluminium and colour-infused glass.',
    highlights: [
      '48MP main camera with 2x telephoto',
      'A16 Bionic chip',
      'USB-C, all-day battery life',
      'Ceramic Shield front',
    ],
    specifications: [
      { label: 'Display', value: '6.1" OLED, 60Hz' },
      { label: 'Chipset', value: 'Apple A16 Bionic' },
      { label: 'Rear camera', value: '48MP + 12MP' },
      { label: 'Battery', value: '3349 mAh' },
      { label: 'Warranty', value: '1 year' },
    ],
    variants: [
      {
        id: 'iphone-15-128-black',
        label: '128 GB · Black',
        attributes: { Storage: '128 GB', Colour: 'Black' },
        price: 72999,
        mrp: 79900,
        inStock: true,
        image: img('iphone15-black'),
      },
      {
        id: 'iphone-15-128-blue',
        label: '128 GB · Blue',
        attributes: { Storage: '128 GB', Colour: 'Blue' },
        price: 72999,
        mrp: 79900,
        inStock: true,
        image: img('iphone15-blue'),
      },
      {
        id: 'iphone-15-256-black',
        label: '256 GB · Black',
        attributes: { Storage: '256 GB', Colour: 'Black' },
        price: 82999,
        mrp: 89900,
        inStock: true,
        image: img('iphone15-black'),
      },
      {
        id: 'iphone-15-256-pink',
        label: '256 GB · Pink',
        attributes: { Storage: '256 GB', Colour: 'Pink' },
        price: 82999,
        mrp: 89900,
        inStock: false,
        image: img('iphone15-pink'),
      },
    ],
  },
  {
    id: 'galaxy-s24',
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'Smartphones',
    thumbnail: img('galaxys24'),
    startingPrice: 67999,
    startingMrp: 74999,
    rating: 4.5,
    ratingCount: 860,
    images: [img('galaxys24'), img('galaxys24-back')],
    description:
      'Galaxy AI is here. A flat 6.2-inch FHD+ Dynamic AMOLED 2X display, Snapdragon 8 Gen 3 for Galaxy, and a pro-grade triple camera.',
    highlights: ['Galaxy AI features', 'Snapdragon 8 Gen 3', '50MP triple camera', '7 years of OS updates'],
    specifications: [
      { label: 'Display', value: '6.2" AMOLED, 120Hz' },
      { label: 'Chipset', value: 'Snapdragon 8 Gen 3' },
      { label: 'Rear camera', value: '50MP + 12MP + 10MP' },
      { label: 'Battery', value: '4000 mAh' },
      { label: 'Warranty', value: '1 year' },
    ],
    variants: [
      {
        id: 'galaxy-s24-128-onyx',
        label: '8/128 GB · Onyx Black',
        attributes: { Storage: '128 GB', Colour: 'Onyx Black' },
        price: 67999,
        mrp: 74999,
        inStock: true,
      },
      {
        id: 'galaxy-s24-256-marble',
        label: '8/256 GB · Marble Grey',
        attributes: { Storage: '256 GB', Colour: 'Marble Grey' },
        price: 73999,
        mrp: 79999,
        inStock: true,
      },
    ],
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air 13" (M3)',
    brand: 'Apple',
    category: 'Laptops',
    thumbnail: img('macbookair'),
    startingPrice: 104999,
    startingMrp: 114900,
    rating: 4.8,
    ratingCount: 430,
    images: [img('macbookair'), img('macbookair-open')],
    description:
      'The M3 chip makes MacBook Air even more capable. Up to 18 hours of battery life, a fanless design, and a brilliant Liquid Retina display.',
    highlights: ['Apple M3 chip', 'Up to 18 hrs battery', '13.6" Liquid Retina', '1.24 kg'],
    specifications: [
      { label: 'Display', value: '13.6" Liquid Retina' },
      { label: 'Chip', value: 'Apple M3, 8-core CPU' },
      { label: 'Memory', value: '8 GB / 16 GB' },
      { label: 'Battery', value: 'Up to 18 hours' },
      { label: 'Warranty', value: '1 year' },
    ],
    variants: [
      {
        id: 'mba-m3-8-256',
        label: 'M3 · 8 GB · 256 GB',
        attributes: { Memory: '8 GB', Storage: '256 GB' },
        price: 104999,
        mrp: 114900,
        inStock: true,
      },
      {
        id: 'mba-m3-16-512',
        label: 'M3 · 16 GB · 512 GB',
        attributes: { Memory: '16 GB', Storage: '512 GB' },
        price: 134999,
        mrp: 144900,
        inStock: true,
      },
    ],
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'Audio',
    thumbnail: img('sonyxm5'),
    startingPrice: 26990,
    startingMrp: 34990,
    rating: 4.6,
    ratingCount: 2100,
    images: [img('sonyxm5'), img('sonyxm5-case')],
    description:
      'Industry-leading noise cancellation with two processors controlling eight microphones. Up to 30 hours of battery with quick charging.',
    highlights: ['Best-in-class ANC', '30 hr battery', 'Multipoint connection', 'Speak-to-chat'],
    specifications: [
      { label: 'Type', value: 'Over-ear, wireless' },
      { label: 'Battery', value: '30 hours (ANC on)' },
      { label: 'Codecs', value: 'LDAC, AAC, SBC' },
      { label: 'Weight', value: '250 g' },
      { label: 'Warranty', value: '1 year' },
    ],
    variants: [
      {
        id: 'xm5-black',
        label: 'Black',
        attributes: { Colour: 'Black' },
        price: 26990,
        mrp: 34990,
        inStock: true,
      },
      {
        id: 'xm5-silver',
        label: 'Silver',
        attributes: { Colour: 'Silver' },
        price: 26990,
        mrp: 34990,
        inStock: true,
      },
    ],
  },
];

export const emiPlans: EmiPlan[] = [
  {
    id: 'plan-3m',
    tenureMonths: 3,
    annualInterestRate: 0,
    processingFeePercent: 0,
    tag: 'No cost EMI',
  },
  {
    id: 'plan-6m',
    tenureMonths: 6,
    annualInterestRate: 13,
    processingFeePercent: 1,
    recommended: true,
  },
  {
    id: 'plan-9m',
    tenureMonths: 9,
    annualInterestRate: 14,
    processingFeePercent: 1,
  },
  {
    id: 'plan-12m',
    tenureMonths: 12,
    annualInterestRate: 15,
    processingFeePercent: 1.5,
  },
];
