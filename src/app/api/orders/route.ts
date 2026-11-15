import { NextResponse } from 'next/server';
import {
  catalog,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_OPTIONS,
  type ShippingId,
} from '@/lib/catalog';
import { validateEmail, validatePhone } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  orderId: string;
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
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `SNS-${stamp}-${rand}`;
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
  const shippingMethod = (data.shippingMethod === 'express' ? 'express' : 'standard') as ShippingId;
  const addressInput = (data.address ?? {}) as Record<string, unknown>;

  const errors: string[] = [];
  if (!validateEmail(email)) errors.push('A valid email is required.');
  if (!customer) errors.push('Customer name is required.');
  if (phone && !validatePhone(phone)) errors.push('Phone number is invalid.');
  if (rawItems.length === 0) errors.push('At least one item is required.');

  const address = {
    line1: String(addressInput.line1 ?? '').trim(),
    line2: String(addressInput.line2 ?? '').trim(),
    city: String(addressInput.city ?? '').trim(),
    region: String(addressInput.region ?? '').trim(),
    postal: String(addressInput.postal ?? '').trim(),
    country: String(addressInput.country ?? 'US').trim(),
  };
  if (!address.line1 || !address.city || !address.region || !address.postal) {
    errors.push('A complete shipping address is required.');
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' '), errors }, { status: 422 });
  }

  const items: OrderLine[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') continue;
    const line = raw as Record<string, unknown>;
    const id = String(line.id ?? '');
    const quantity = Math.min(20, Math.max(1, Math.floor(Number(line.quantity) || 0)));
    const item = catalog[id];
    if (!item) {
      return NextResponse.json({ error: `Unknown item: ${id}` }, { status: 422 });
    }
    items.push({ id, name: item.name, price: item.price, quantity });
  }

  if (items.length === 0) {
    return NextResponse.json({ error: 'No valid items in order.' }, { status: 422 });
  }

  const subtotal = items.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_OPTIONS.find((option) => option.id === shippingMethod)?.price ?? 9;

  const order: Order = {
    orderId: makeOrderId(),
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

  return NextResponse.json(
    {
      orderId: order.orderId,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shipping: order.shipping,
      currency: 'USD',
      message: 'Demo order received. No payment was taken.',
    },
    { status: 201 }
  );
}

export async function GET() {
  const recent = [...registry.orders.values()]
    .slice(-20)
    .reverse()
    .map((order) => ({
      orderId: order.orderId,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
      items: order.items.reduce((sum, line) => sum + line.quantity, 0),
    }));

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
    count: recent.length,
    orders: recent,
  });
}
