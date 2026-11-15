'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const { getCartCount, toggleCart, isCartOpen } = useStore();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="Sniff & Solve Home">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">Sniff & Solve</span>
              <span className="hidden sm:inline-block text-xs font-medium text-amber-600 px-2 py-0.5 rounded-full bg-amber-50">
                Modular Scent Puzzle System
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="#product" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Product
              </Link>
              <Link href="#modules" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Modules
              </Link>
              <Link href="#reviews" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                Reviews
              </Link>
              <Link href="#faq" className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className={cn(
                'relative p-2 rounded-lg transition-colors',
                'hover:bg-gray-100',
                'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
              )}
              aria-label={isCartOpen ? 'Close cart' : `Open cart (${cartCount} items)`}
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={toggleCart}
              aria-label="Menu"
            >
              {isCartOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}