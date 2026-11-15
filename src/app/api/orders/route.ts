import { NextResponse } from 'next/server';
import {
  catalog,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_OPTIONS,
  type ShippingId,
} from '@/lib/catalog';
import { validateEmail, validatePhone } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const MAX_LINES = 50;
const MAX_QUANTITY = 20;
const SHIPPING_METHODS: ShippingId[] = ['standard', 'express'];
const COUNTRIES = new Set(['US', 'CA', 'GB', 'DE', 'FR', 'NL', 'AU']);

export interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: string;
  token: string;
  createdAt: string;
  status: 'confirmed' | 'packing' | 'shipped';
  email: string;
  customer: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    region: string;
    postal: string;
    country: string;
  };
  items: OrderLine[];
  subtotal: number;
  shipping: number;
  shippingMethod: ShippingId;
  taxIncluded: true;
  total: number;
}

interface OrderRegistry {
  orders: Map<string, Order>;
}

const registry: OrderRegistry = ((globalThis as unknown as { __sniffSolveOrders?: OrderRegistry })
  .__sniffSolveOrders ??= { orders: new Map<string, Order>() });

function makeOrderId(): string {
  return `SNS-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body must be valid JSON.' }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const customer = typeof data.customer === 'string' ? data.customer.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const shippingInput = data.shippingMethod ?? 'standard';
  const shippingMethod = String(shippingInput) as ShippingId;
  const addressInput = (data.address ?? {}) as Record<string, unknown>;

  const errors: string[] = [];
  if (!validateEmail(email)) errors.push('A valid email is required.');
  if (!customer) errors.push('Customer name is required.');
  if (phone && !validatePhone(phone)) errors.push('Phone number is invalid.');
  if (rawItems.length === 0) errors.push('At least one item is required.');
  if (rawItems.length > MAX_LINES) errors.push(`Orders are limited to ${MAX_LINES} line items.`);
  if (!SHIPPING_METHODS.includes(shippingMethod)) {
    errors.push('Shipping method must be standard or express.');
  }

  const address = {
    line1: String(addressInput.line1 ?? '').trim(),
    line2: String(addressInput.line2 ?? '').trim(),
    city: String(addressInput.city ?? '').trim(),
    region: String(addressInput.region ?? '').trim(),
    postal: String(addressInput.postal ?? '').trim(),
    country: String(addressInput.country ?? 'US').trim().toUpperCase(),
  };
  if (!address.line1 || !address.city || !address.region || !address.postal) {
    errors.push('A complete shipping address is required.');
  }
  if (!COUNTRIES.has(address.country)) {
    errors.push('We only ship to the listed countries in this demo.');
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' '), errors }, { status: 422 });
  }

  const merged = new Map<string, number>();
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') continue;
    const line = raw as Record<string, unknown>;
    const id = String(line.id ?? '');
    const item = catalog[id];
    if (!item) {
      return NextResponse.json({ error: `Unknown item: ${id}` }, { status: 422 });
    }
    const quantity = Math.min(
      MAX_QUANTITY,
      Math.max(1, Math.floor(Number(line.quantity) || 0))
    );
    merged.set(id, (merged.get(id) ?? 0) + quantity);
  }

  if (merged.size === 0) {
    return NextResponse.json({ error: 'No valid items in order.' }, { status: 422 });
  }

  const items: OrderLine[] = [...merged.entries()].map(([id, quantity]) => ({
    id,
    name: catalog[id].name,
    price: catalog[id].price,
    quantity: Math.min(MAX_QUANTITY, quantity),
  }));

  const subtotal = items.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_OPTIONS.find((option) => option.id === shippingMethod)?.price ?? 9;

  const order: Order = {
    orderId: makeOrderId(),
    token: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    email,
    customer,
    phone,
    address,
    items,
    subtotal,
    shipping,
    shippingMethod,
    taxIncluded: true,
    total: subtotal + shipping,
  };

  registry.orders.set(order.orderId, order);
  if (registry.orders.size > 200) {
    const oldest = registry.orders.keys().next().value;
    if (oldest) registry.orders.delete(oldest);
  }

  const { token, ...buyerOrder } = order;

  return NextResponse.json(
    {
      orderId: order.orderId,
      orderToken: token,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shipping: order.shipping,
      currency: 'USD',
      order: buyerOrder,
      message: 'Demo order received. No payment was taken.',
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/orders',
    accepts: {
      email: 'string',
      customer: 'string',
      phone: 'string (optional)',
      shippingMethod: 'standard | express',
      items: '[{ id, quantity }]',
      address: '{ line1, line2?, city, region, postal, country }',
    },
    limits: {
      lineItems: MAX_LINES,
      quantityPerItem: MAX_QUANTITY,
      countries: [...COUNTRIES],
    },
    note: 'Created orders are retrievable only with the token returned by the POST response.',
  });
}
