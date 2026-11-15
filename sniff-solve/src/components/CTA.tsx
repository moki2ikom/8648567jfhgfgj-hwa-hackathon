'use client';

import { Button } from '@/components/Button';
import { product } from '@/lib/product';
import { formatPrice } from '@/lib/utils';

export function CTA() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready for a Calmer, Happier Dog?
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Join 10,000+ dog parents who've transformed alone time into enrichment time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600" onClick={() => document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' })}>
            Get Sniff & Solve — {formatPrice(product.price)}
          </Button>
          <Button variant="ghost" size="lg" className="w-full sm:w-auto text-white hover:bg-gray-800" onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore Modules First
          </Button>
        </div>
        <p className="mt-6 text-sm text-gray-400">
          90-day satisfaction guarantee • Free shipping over $100 • Ships in 1–2 business days
        </p>
      </div>
    </section>
  );
}