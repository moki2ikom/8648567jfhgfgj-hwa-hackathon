'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { catalog } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';

export function CTA() {
  const { addToCart, openCart } = useStore();
  const core = catalog['kit-core'];

  const add = () => {
    addToCart({
      id: core.id,
      name: core.name,
      subtitle: core.subtitle,
      price: core.price,
      swatch: core.swatch,
    });
    openCart();
  };

  return (
    <section className="relative overflow-hidden bg-ink text-bone-50">
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="grid-paper h-full w-full" />
      </div>
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 py-24 sm:px-8 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-ochre-light">
            07 — The invitation
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-[38px] leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            Give the nose
            <br />
            a job.
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-bone-100/65">
            Twenty minutes of scent work can settle a dog the way a long walk cannot. The
            station is built to be rearranged, not completed.
          </p>
        </div>
        <div className="flex flex-col justify-end lg:col-span-4 lg:items-end">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-100/50">
            Core system · 6 modules
          </p>
          <p className="mt-2 font-display text-5xl">{formatPrice(core.price)}</p>
          <button
            type="button"
            onClick={add}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-bone-50 px-7 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ochre lg:w-auto"
          >
            Add the station <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/#build"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-bone-50/25 px-7 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-50 transition-colors hover:bg-bone-50/10 lg:w-auto"
          >
            Build a custom kit
          </Link>
          <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.12em] text-bone-100/35">
            60-day trial · free shipping over $100
          </p>
        </div>
      </div>
    </section>
  );
}
