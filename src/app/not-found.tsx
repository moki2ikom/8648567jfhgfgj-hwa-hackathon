import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { ModuleGlyph } from '@/components/ModuleGlyph';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-bone-50">
      <Header />
      <Cart />
      <main id="main" className="flex flex-1 items-center px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-12 lg:items-center">
          <div className="animate-rise lg:col-span-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ochre">
              404 — Trail lost
            </p>
            <h1 className="mt-6 max-w-2xl font-display text-[44px] leading-[0.96] tracking-[-0.03em] sm:text-6xl lg:text-[72px]">
              This scent has
              <br />
              gone cold.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              The page you followed is not on the deck. The station, the modules and the scent
              library are all still where you left them.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-50 transition-colors hover:bg-moss"
              >
                Back to the station <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/#modules"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-ink/25 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone-50"
              >
                Read the modules <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35">
              Error 404 · concept store
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative border border-ink/15 bg-bone-100 p-6 sm:p-10">
              <div className="pointer-events-none absolute inset-0 grid-paper opacity-70" aria-hidden="true" />
              <div className="relative aspect-square w-full animate-rise">
                <ModuleGlyph id="scent-maze" accent="#8A9A5B" />
              </div>
              <div className="relative mt-5 flex items-center justify-between border-t border-ink/15 pt-4 font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">
                <span>Plate 404</span>
                <span>Scent Maze / M-01</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
