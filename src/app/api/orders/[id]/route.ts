import { NextResponse } from 'next/server';
import type { Order } from '../route';

export const dynamic = 'force-dynamic';

interface OrderRegistry {
  orders: Map<string, Order>;
}

const registry: OrderRegistry = ((globalThis as unknown as { __sniffSolveOrders?: OrderRegistry })
  .__sniffSolveOrders ??= { orders: new Map<string, Order>() });

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get('token') ?? '';
  const order = registry.orders.get(id);

  if (!order || !token || token !== order.token) {
    return NextResponse.json(
      {
        error:
          'Order not found on this instance. Orders are retrievable only with the token from checkout.',
      },
      { status: 404 }
    );
  }

  const { token: _token, ...buyerOrder } = order;
  void _token;

  return NextResponse.json(buyerOrder, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
