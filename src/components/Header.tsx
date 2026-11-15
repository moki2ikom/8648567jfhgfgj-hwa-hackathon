'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useMounted } from '@/lib/use-mounted';
import { Menu, ShoppingBag, X } from 'lucide-react';

const NAV = [
  { href: '/#station', label: 'The station', index: '03' },
  { href: '/#modules', label: 'Modules', index: '04' },
  { href: '/#scents', label: 'Scent library', index: '05' },
  { href: '/#build', label: 'Build a kit', index: '06' },
  { href: '/#notes', label: 'Field notes', index: '08' },
];

export function Header() {
  const openCart = useStore((state) => state.openCart);
  const isCartOpen = useStore((state) => state.isCartOpen);
  const cartCount = useStore((state) =>
    state.cart.reduce((count, item) => count + item.quantity, 0)
  );
  const mounted = useMounted();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const visibleCount = mounted ? cartCount : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/15 bg-bone-50/92 backdrop-blur-md">
      <div className="border-b border-ink/10 bg-ink text-bone-100">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] sm:px-8">
          <p>Free shipping over $100</p>
          <p className="hidden sm:block">60-day nose-back trial · 2-year hardware warranty</p>
          <p className="text-ochre-light">Concept store · station 01</p>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-3" aria-label="Sniff & Solve home">
          <span className="font-display text-[22px] leading-none tracking-[-0.02em] text-ink sm:text-[25px]">
            Sniff &amp; Solve
          </span>
          <span className="hidden font-mono text-[8px] uppercase leading-tight tracking-[0.24em] text-ink/45 md:block">
            Olfactory
            <br />
            Instruments
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-ink"
            >
              <span className="text-[8px] text-ochre">{item.index}</span>
              <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-ink/40">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#build"
            className="hidden rounded-sm border border-ink/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-ink hover:bg-ink hover:text-bone-50 sm:inline-flex"
          >
            Build a kit
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-sm px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label={`Open cart, ${visibleCount} ${visibleCount === 1 ? 'item' : 'items'}`}
            aria-haspopup="dialog"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ochre px-1 text-[9px] font-semibold leading-none text-ink">
              {visibleCount}
            </span>
          </button>
          <button
            type="button"
            className="p-2 text-ink lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-ink/15 bg-bone-50 px-5 pb-8 pt-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="divide-y divide-ink/10">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline justify-between py-4 font-display text-2xl text-ink"
                >
                  {item.label}
                  <span className="font-mono text-[10px] text-ochre">{item.index}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openCart();
            }}
            className="mt-6 w-full rounded-sm border border-ink/25 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em]"
          >
            View cart {isCartOpen ? '' : `(${visibleCount})`}
          </button>
        </nav>
      )}
    </header>
  );
}
