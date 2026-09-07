/**
 * Static content for the Top Brands / Nearby Stores tabs.
 *
 * The assignment brief says these two tabs need no implementation — they're
 * rendered here only so the Shop screen visually matches the live app. The
 * 1Fi Marketplace tab is the one backed by the (mock) API.
 */

export interface Brand {
  id: string;
  name: string;
  logo: string;
  offer: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  address: string;
  distanceKm: number;
}

export const topBrands: Brand[] = [
  { id: 'air-india', name: 'Air India', logo: 'https://logo.clearbit.com/airindia.com', offer: 'No-cost EMIs upto 18 months' },
  { id: 'apple-premium', name: 'Apple Premium Reseller', logo: 'https://logo.clearbit.com/apple.com', offer: 'No-cost EMIs upto 24 months' },
  { id: 'caratlane', name: 'CaratLane', logo: 'https://logo.clearbit.com/caratlane.com', offer: 'No-cost EMIs upto 6 months' },
  { id: 'cgh-earth', name: 'CGH Earth', logo: 'https://logo.clearbit.com/cghearth.com', offer: 'No-cost EMIs upto 24 months' },
  { id: 'croma', name: 'Croma', logo: 'https://logo.clearbit.com/croma.com', offer: 'No-cost EMIs upto 12 months' },
  { id: 'wakefit', name: 'Wakefit', logo: 'https://logo.clearbit.com/wakefit.co', offer: 'No-cost EMIs upto 12 months' },
];

export const nearbyStores: Store[] = [
  {
    id: 'atelier',
    name: 'Atelier Forbidden Journeys',
    logo: 'https://logo.clearbit.com/atelier.com',
    address: 'Sector 40, Gurugram, Haryana, 122001',
    distanceKm: 35,
  },
  {
    id: 'pacholi-suzuki',
    name: 'Pacholi Suzuki Railway Road',
    logo: 'https://logo.clearbit.com/marutisuzuki.com',
    address: '64/9, New Railway Rd, near DSD college, Sector 8, Gurugram, Haryana, 122001',
    distanceKm: 37,
  },
  {
    id: 'ashoka-suzuki',
    name: 'Ashoka Suzuki',
    logo: 'https://logo.clearbit.com/marutisuzuki.com',
    address: 'Khata No 271, 316, Badshahpur Sohna Rd, Gurugram, Haryana, 122001',
    distanceKm: 37,
  },
  {
    id: 'tripbouquet',
    name: 'TripBouquet',
    logo: 'https://logo.clearbit.com/tripbouquet.com',
    address: '241, Tower B, Spazedge, near Dmart, Gurugram, Haryana, 122018',
    distanceKm: 37,
  },
];
