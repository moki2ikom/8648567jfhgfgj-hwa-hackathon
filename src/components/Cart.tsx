'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Minus, Plus, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';

export function Cart() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  const subtotal = getCartTotal();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 9;
  const total = subtotal + shipping;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-[2px]"
        onClick={closeCart}
        aria-label="Close cart"
        tabIndex={-1}
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-ink/20 bg-bone-50 shadow-[-24px_0_60px_rgba(23,21,15,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-start justify-between border-b border-ink/15 px-6 py-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ochre">Your selection</p>
            <h2 className="mt-1 font-display text-2xl">The cart</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="rounded-sm p-2 text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-ink/20">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">0</span>
              </div>
              <p className="font-display text-2xl">Nothing selected yet.</p>
              <p className="mt-2 max-w-[240px] text-sm text-ink-soft">
                The station is sold as a complete instrument, or built to your dog&apos;s level.
              </p>
              <Link
                href="/#station"
                onClick={closeCart}
                className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink underline decoration-ochre decoration-2 underline-offset-4"
              >
                See the station <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-4 py-5 first:pt-0">
                  <div
                    className="mt-1 h-14 w-14 flex-shrink-0 rounded-sm border border-ink/15"
                    style={{ backgroundColor: item.swatch }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[15px] font-medium leading-snug">{item.name}</h3>
                        {item.subtitle && (
                          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/45">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                      <p className="whitespace-nowrap font-mono text-[11px]">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center border border-ink/20">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-ink/60 hover:bg-ink/5 hover:text-ink"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-[11px]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-ink/60 hover:bg-ink/5 hover:text-ink"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40 underline underline-offset-4 hover:text-clay"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-ink/15 px-6 py-5">
            <div className="mb-4">
              <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-ink/50">
                <span>{remaining === 0 ? 'Free shipping unlocked' : `${formatPrice(remaining)} to free shipping`}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-[3px] w-full bg-ink/10">
                <div
                  className="h-full bg-ochre transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <dl className="space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <dt className="text-ink/55">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Shipping</dt>
                <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/15 pt-2 text-[13px]">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-50 transition-colors hover:bg-moss"
            >
              Continue to checkout <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={clearCart}
                className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40 hover:text-ink"
              >
                Clear cart
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40 hover:text-ink"
              >
                Keep browsing
              </button>
            </div>
            <p className="mt-4 text-center font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35">
              Demo checkout · no payment is taken
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
