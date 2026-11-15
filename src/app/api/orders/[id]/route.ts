import { NextResponse } from 'next/server';
import type { Order } from '../route';

export const dynamic = 'force-dynamic';

interface OrderRegistry {
  orders: Map<string, Order>;
}

const registry: OrderRegistry = ((globalThis as unknown as { __sniffSolveOrders?: OrderRegistry })
  .__sniffSolveOrders ??= { orders: new Map<string, Order>() });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = registry.orders.get(id);

  if (!order) {
    return NextResponse.json(
      { error: 'Order not found on this instance. Try the order confirmation screen that followed checkout.' },
      { status: 404 }
    );
  }

  return NextResponse.json(order, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
