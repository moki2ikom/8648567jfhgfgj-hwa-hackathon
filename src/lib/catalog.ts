export interface CatalogItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  swatch: string;
}

export const FREE_SHIPPING_THRESHOLD = 100;

export const catalog: Record<string, CatalogItem> = {
  'kit-starter': {
    id: 'kit-starter',
    name: 'The Station — Starter',
    subtitle: 'Base + 3 modules + 4 scent cartridges',
    price: 189,
    swatch: '#B96A4C',
  },
  'kit-core': {
    id: 'kit-core',
    name: 'The Station — Core System',
    subtitle: 'Base + all 6 modules + 4 scent cartridges',
    price: 249,
    swatch: '#C8892F',
  },
  'kit-full': {
    id: 'kit-full',
    name: 'The Station — Full Library',
    subtitle: 'Base + 12 modules + 4 scent cartridges',
    price: 429,
    swatch: '#3F5240',
  },
  'kit-starter-8': {
    id: 'kit-starter-8',
    name: 'The Station — Starter + 8 scents',
    subtitle: 'Base + 3 modules + 8 scent cartridges',
    price: 207,
    swatch: '#B96A4C',
  },
  'kit-core-8': {
    id: 'kit-core-8',
    name: 'The Station — Core + 8 scents',
    subtitle: 'Base + 6 modules + 8 scent cartridges',
    price: 267,
    swatch: '#C8892F',
  },
  'kit-full-8': {
    id: 'kit-full-8',
    name: 'The Station — Full Library + 8 scents',
    subtitle: 'Base + 12 modules + 8 scent cartridges',
    price: 447,
    swatch: '#3F5240',
  },
  'expansion-pack': {
    id: 'expansion-pack',
    name: 'Expansion Pack',
    subtitle: 'Six additional modules, no base',
    price: 199,
    swatch: '#5E7F9C',
  },
  'snuffle-spiral-refill': {
    id: 'snuffle-spiral-refill',
    name: 'Snuffle Spiral Refill',
    subtitle: 'Machine-washable fleece coil',
    price: 12,
    swatch: '#946F8A',
  },
  'scent-cartridges-4': {
    id: 'scent-cartridges-4',
    name: 'Scent Cartridges — 4 pack',
    subtitle: 'Peanut, bacon, cheese, liver',
    price: 18,
    swatch: '#C58F2E',
  },
  'scent-cartridges-8': {
    id: 'scent-cartridges-8',
    name: 'Scent Cartridges — 8 pack',
    subtitle: 'All four notes, two intensities',
    price: 32,
    swatch: '#C58F2E',
  },
  'care-kit': {
    id: 'care-kit',
    name: 'Care Kit',
    subtitle: 'Brush, silicone seals, spare feet',
    price: 24,
    swatch: '#6E8A77',
  },
};

export const SHIPPING_OPTIONS = [
  {
    id: 'standard',
    name: 'Standard',
    price: 9,
    days: '5–7 business days',
    note: 'Tracked, carbon-neutral',
  },
  {
    id: 'express',
    name: 'Express',
    price: 19,
    days: '2–3 business days',
    note: 'Priority dispatch',
  },
] as const;

export type ShippingId = (typeof SHIPPING_OPTIONS)[number]['id'];

export function shippingCostFor(subtotal: number, method: ShippingId = 'standard'): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_OPTIONS.find((o) => o.id === method)?.price ?? 0;
}

export function getCatalogItem(id: string): CatalogItem | undefined {
  return catalog[id];
}

export const KIT_PRICE_MAP: Record<string, Record<string, CatalogItem>> = {
  starter: {
    '4': catalog['kit-starter'],
    '8': catalog['kit-starter-8'],
  },
  core: {
    '4': catalog['kit-core'],
    '8': catalog['kit-core-8'],
  },
  full: {
    '4': catalog['kit-full'],
    '8': catalog['kit-full-8'],
  },
};
