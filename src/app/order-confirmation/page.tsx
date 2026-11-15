'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Loader2,
  MapPin,
  Package,
  Truck,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { formatPrice } from '@/lib/utils';

interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  createdAt: string;
  status: string;
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
  shippingMethod: 'standard' | 'express';
  total: number;
}

function addDays(date: Date, days: number): string {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/40 transition-colors hover:text-ink"
      aria-label="Copy order number"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing' | 'error'>(
    orderId ? 'loading' : 'missing'
  );

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (cancelled) return;
        if (response.status === 404) {
          setStatus('missing');
          return;
        }
        if (!response.ok) {
          setStatus('error');
          return;
        }
        const payload = (await response.json()) as Order & { order?: Order };
        const record = payload.order ?? payload;
        if (!record.orderId || !Array.isArray(record.items)) {
          setStatus('error');
          return;
        }
        setOrder(record);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return (
    <div className="flex min-h-screen flex-col bg-bone-50">
      <Header />
      <Cart />

      <main className="flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {status === 'loading' && (
            <div className="flex flex-col items-center py-24 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-ink/40" aria-hidden="true" />
              <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">
                Retrieving order record
              </p>
            </div>
          )}

          {status === 'missing' && (
            <div className="border border-ink/15 bg-bone-50 p-8 text-center sm:p-12">
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ochre">No record</p>
              <h1 className="mt-4 font-display text-3xl sm:text-4xl">That order isn’t here.</h1>
              <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-ink-soft">
                This demo keeps orders in memory on the server, so a record can disappear when the
                API restarts. If you just placed an order, try the link again in a moment.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/#build"
                  className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50 hover:bg-moss"
                >
                  Build another kit <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink/25 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] hover:bg-ink hover:text-bone-50"
                >
                  Back to the station
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="border border-clay/40 bg-clay/5 p-8 text-center sm:p-12">
              <AlertCircle className="mx-auto h-8 w-8 text-clay" aria-hidden="true" />
              <h1 className="mt-4 font-display text-3xl">We couldn’t load that order.</h1>
              <p className="mx-auto mt-3 max-w-md text-[14px] text-ink-soft">
                The order service didn’t respond as expected. It’s a demo endpoint, so this can
                happen after a redeploy.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ochre hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Return home
              </Link>
            </div>
          )}

          {status === 'ready' && order && (
            <>
              <div className="border-b border-ink/15 pb-8">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss text-bone-50">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-moss">
                    Demo order recorded
                  </p>
                </div>
                <h1 className="mt-4 font-display text-4xl leading-[0.95] sm:text-5xl">
                  Good choices, {order.customer.split(' ')[0] || 'friend'}.
                </h1>
                <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-ink-soft">
                  Your station is reserved. No payment was taken — this is a demonstration
                  checkout, and the order below is what the demo API stored.
                </p>
              </div>

              <div className="mt-8 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-3">
                <div className="bg-bone-50 p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">Order</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="font-mono text-[12px]">{order.orderId}</p>
                  </div>
                  <div className="mt-1">
                    <CopyButton value={order.orderId} />
                  </div>
                </div>
                <div className="bg-bone-50 p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">Total</p>
                  <p className="mt-2 font-display text-2xl">{formatPrice(order.total)}</p>
                  <p className="font-mono text-[8px] uppercase tracking-[0.08em] text-ink/40">
                    Tax included
                  </p>
                </div>
                <div className="bg-bone-50 p-5">
                  <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">Status</p>
                  <p className="mt-2 text-[14px] capitalize">{order.status}</p>
                  <p className="font-mono text-[8px] uppercase tracking-[0.08em] text-ink/40">
                    Recorded just now
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="border border-ink/15 bg-bone-50 p-5">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-ink/45" aria-hidden="true" />
                    <h2 className="font-mono text-[9px] uppercase tracking-[0.16em]">Estimated arrival</h2>
                  </div>
                  <p className="mt-3 font-display text-xl">
                    {addDays(new Date(order.createdAt), order.shippingMethod === 'express' ? 3 : 6)}
                  </p>
                  <p className="mt-1 text-[12px] text-ink-soft">
                    {order.shippingMethod === 'express' ? 'Express' : 'Standard'} shipping ·{' '}
                    {order.shipping === 0 ? 'free' : formatPrice(order.shipping)}
                  </p>
                  <p className="mt-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.08em] text-ink/35">
                    Demo estimate only. A real store would email tracking once the parcel leaves.
                  </p>
                </div>
                <div className="border border-ink/15 bg-bone-50 p-5">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-ink/45" aria-hidden="true" />
                    <h2 className="font-mono text-[9px] uppercase tracking-[0.16em]">Shipping to</h2>
                  </div>
                  <address className="mt-3 text-[13px] not-italic leading-relaxed text-ink-soft">
                    {order.customer}
                    <br />
                    {order.address.line1}
                    {order.address.line2 ? (
                      <>
                        <br />
                        {order.address.line2}
                      </>
                    ) : null}
                    <br />
                    {order.address.city}, {order.address.region} {order.address.postal}
                    <br />
                    {order.address.country}
                  </address>
                </div>
              </div>

              <div className="mt-4 border border-ink/15 bg-bone-50">
                <div className="flex items-center gap-2 border-b border-ink/15 px-5 py-4">
                  <Package className="h-4 w-4 text-ink/45" aria-hidden="true" />
                  <h2 className="font-mono text-[9px] uppercase tracking-[0.16em]">
                    {order.items.reduce((sum, line) => sum + line.quantity, 0)}{' '}
                    {order.items.reduce((sum, line) => sum + line.quantity, 0) === 1 ? 'item' : 'items'}
                  </h2>
                </div>
                <ul className="divide-y divide-ink/10 px-5">
                  {order.items.map((line) => (
                    <li key={line.id} className="flex items-baseline justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <p className="text-[13px]">{line.name}</p>
                        <p className="font-mono text-[8px] uppercase tracking-[0.08em] text-ink/40">
                          {line.id} · qty {line.quantity}
                        </p>
                      </div>
                      <p className="font-mono text-[11px]">{formatPrice(line.price * line.quantity)}</p>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-2 border-t border-ink/15 px-5 py-4 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <dt className="text-ink/50">Subtotal</dt>
                    <dd>{formatPrice(order.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/50">Shipping</dt>
                    <dd>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-ink/15 pt-2 text-[13px]">
                    <dt>Total</dt>
                    <dd>{formatPrice(order.total)}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 border border-ink/15 bg-bone-100/60 p-5">
                <h2 className="font-display text-xl">While you wait</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                  Introduce one module at a time, at the easiest level, for three short sessions
                  before raising difficulty. Most dogs need the win more than the challenge.
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <Link
                    href="/#modules"
                    className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ochre hover:underline"
                  >
                    Read the module guide <ArrowRight className="h-3 w-3" />
                  </Link>
                  <Link
                    href="/#notes"
                    className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-ochre hover:underline"
                  >
                    Field notes <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center">
                <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/35">
                  Demo store · no payment taken · {order.email}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-sm border border-ink/25 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] hover:bg-ink hover:text-bone-50"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to the station
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-bone-50">
      <Header />
      <Cart />
      <main className="flex flex-1 px-5 py-16">
        <div className="mx-auto w-full max-w-3xl animate-pulse">
          <div className="h-3 w-32 bg-ink/10" />
          <div className="mt-6 h-10 w-2/3 bg-ink/10" />
          <div className="mt-4 h-3 w-1/2 bg-ink/10" />
          <div className="mt-10 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-3">
            <div className="h-28 bg-bone-100" />
            <div className="h-28 bg-bone-100" />
            <div className="h-28 bg-bone-100" />
          </div>
          <div className="mt-4 h-56 border border-ink/10 bg-bone-100" />
        </div>
      </main>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <ConfirmationContent />
    </Suspense>
  );
}
