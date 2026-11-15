'use client';

import { useStore } from '@/lib/store';
import { X, Plus, Minus, Trash2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function Cart() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useStore();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 100 ? 0 : 9;
  const total = subtotal + shipping;

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden"
        onClick={toggleCart}
        aria-hidden="true"
      />
      <aside
        className={cn(
          'fixed right-0 top-16 bottom-0 w-full max-w-sm md:max-w-md z-50 bg-white shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          'translate-x-0'
        )}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
            <button
              onClick={toggleCart}
              className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <svg
                  className="h-12 w-12 mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-7a2 2 0 00-2-2H8a2 2 0 00-2 2v7"
                  />
                </svg>
                <p className="text-sm font-medium">Your cart is empty</p>
                <p className="text-xs mt-1">Add the Sniff & Solve system to get started</p>
                <Link
                  href="#product"
                  onClick={toggleCart}
                  className="mt-4 text-sm font-medium text-amber-600 hover:text-amber-700"
                >
                  View Product →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-gradient-to-br"
                        style={{ background: `linear-gradient(135deg, ${getModuleColor(item.id)}22, ${getModuleColor(item.id)}44)` }}
                        aria-hidden="true"
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-2xl" aria-hidden="true">
                        {getModuleIcon(item.id)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-amber-600 text-center">
                      Add {formatPrice(100 - subtotal)} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-gray-100 p-4 space-y-3">
              <Link
                href="/checkout"
                className="block w-full py-3 px-4 bg-gray-900 text-white text-center font-medium rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              >
                Checkout
                <ChevronRight className="h-4 w-4 inline-block ml-2" aria-hidden="true" />
              </Link>
              <button
                onClick={clearCart}
                className="block w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function getModuleColor(id: string): string {
  const colors: Record<string, string> = {
    'sniff-solve-core': '#E8A87C',
    'expansion-pack': '#8FC1E3',
    'snuffle-spiral-refill': '#D4A5D8',
    'scent-cartridges': '#F4C542',
  };
  return colors[id] || '#E8A87C';
}

function getModuleIcon(id: string): string {
  const icons: Record<string, string> = {
    'sniff-solve-core': '🧩',
    'expansion-pack': '📦',
    'snuffle-spiral-refill': '🌀',
    'scent-cartridges': '🧪',
  };
  return icons[id] || '🧩';
}