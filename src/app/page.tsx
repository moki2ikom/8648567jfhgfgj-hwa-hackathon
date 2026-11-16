'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Check, Shuffle, Star, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import dynamic from 'next/dynamic';
import { Button } from '@/components/Button';
import { FAQItem } from '@/components/FAQItem';
import { CTA } from '@/components/CTA';
import { Reveal } from '@/components/Reveal';
import { ModuleGlyph } from '@/components/ModuleGlyph';
import { StationDiagram } from '@/components/StationDiagram';
import { KitConfigurator } from '@/components/KitConfigurator';
import { product } from '@/lib/product';
import { catalog } from '@/lib/catalog';
import { formatPrice } from '@/lib/utils';
import { useStore } from '@/lib/store';

const Product3D = dynamic(
  () => import('@/components/Product3D').then((module) => module.Product3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-bone-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border border-ink/15 border-t-ochre" />
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
            Loading station
          </p>
        </div>
      </div>
    ),
  }
);

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.26em] text-ink/50">
      <span className="text-ochre">{index}</span>
      <span className="h-px w-8 bg-ink/25" aria-hidden="true" />
      {children}
    </p>
  );
}

function Difficulty({ value, color }: { value: number; color: string }) {
  return (
    <span className="flex items-center gap-[3px]" aria-label={`Difficulty ${value} of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className="h-[5px] w-[5px] rounded-full"
          style={{ backgroundColor: index < value ? color : 'rgba(23,21,15,0.14)' }}
        />
      ))}
    </span>
  );
}

function Hero({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { addToCart, openCart } = useStore();
  const core = catalog['kit-core'];
  const activeIndex = product.modules.findIndex((module) => module.id === selected);
  const active = activeIndex >= 0 ? product.modules[activeIndex] : null;

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSelect(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onSelect]);

  const step = (direction: number) => {
    const next =
      (activeIndex + direction + product.modules.length) % product.modules.length;
    onSelect(product.modules[next].id);
  };

  const addCore = () => {
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
    <section id="hero" className="relative scroll-mt-24 overflow-hidden border-b border-ink/15">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-12">
        <div className="relative order-2 px-5 py-14 sm:px-8 lg:order-1 lg:col-span-5 lg:border-r lg:border-ink/15 lg:py-20 lg:pr-10">
          <div className="animate-rise">
            <SectionLabel index="01">The instrument</SectionLabel>

            <h1 className="mt-8 max-w-xl font-display text-[46px] leading-[0.96] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[68px]">
              A nose-led puzzle that <em className="font-light italic underline-ochre">redraws</em> itself
              every week.
            </h1>

            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ink-soft sm:text-base">
              Six magnetic scent modules on a machined base. Rearrange the deck, change the
              cartridge, raise the difficulty — and the puzzle your dog solved yesterday is gone.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" onClick={addCore} className="group">
                Add the station — {formatPrice(core.price)}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Button>
              <a
                href="#station"
                className="inline-flex items-center justify-center gap-2 border border-ink/25 px-7 py-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bone-50"
              >
                See the deck
              </a>
            </div>

            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
              Core system · six modules · four scents · free shipping
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-px border border-ink/15 bg-ink/15 sm:grid-cols-4">
              {product.stats.map((stat) => (
                <div key={stat.label} className="bg-bone-50 px-3 py-4">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl leading-none">{stat.value}</span>
                    <span className="mt-1.5 block font-mono text-[8px] uppercase leading-tight tracking-[0.1em] text-ink/45">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative order-1 border-b border-ink/15 bg-bone-100 lg:order-2 lg:col-span-7 lg:border-b-0">
          <div className="pointer-events-none absolute inset-0 grid-paper opacity-60" aria-hidden="true" />
          <div className="pointer-events-none absolute left-4 top-4 z-10 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">
            Plate I / The station
          </div>
          <div className="pointer-events-none absolute right-4 top-4 z-10 text-right font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-ink/45">
            06 modules
            <br />
            01 deck
          </div>

          <p className="sr-only">
            Interactive 3D preview of the station. Click a module or use the numbered controls to
            read its note. The same six modules are described in the modules section below.
          </p>
          <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[660px]">
            <Product3D selected={selected} onSelect={onSelect} />

            <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2 rounded-sm border border-ink/15 bg-bone-50/92 p-1.5 backdrop-blur-md sm:inset-x-4 sm:bottom-4">
              <div className="flex items-center gap-0.5 sm:gap-1" role="group" aria-label="Inspect a module">
                {product.modules.map((module) => (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => onSelect(selected === module.id ? null : module.id)}
                    aria-pressed={selected === module.id}
                    title={module.name}
                    className={`flex items-center gap-1.5 rounded-sm px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors ${
                      selected === module.id
                        ? 'text-ink'
                        : 'text-ink/50 hover:bg-ink/5 hover:text-ink'
                    }`}
                    style={
                      selected === module.id
                        ? { backgroundColor: `${module.color}33`, color: '#17150F' }
                        : undefined
                    }
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: module.color }}
                      aria-hidden="true"
                    />
                    {module.number}
                    <span className="hidden lg:inline">{module.name}</span>
                    <span className="sr-only lg:hidden">{module.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {active ? (
                  <>
                    <span className="hidden px-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/40 sm:inline">
                      {active.number} / 06
                    </span>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label="Previous module"
                      className="rounded-sm p-1.5 text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label="Next module"
                      className="rounded-sm p-1.5 text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink"
                    >
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <span className="px-2 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/40">
                    06 bays
                  </span>
                )}
              </div>
            </div>
          </div>

          <div aria-live="polite" className="sr-only">
            {active
              ? `${active.name} selected. ${active.instinct}. ${active.time}.`
              : 'Full deck view.'}
          </div>

          {active ? (
            <div
              id="module-dossier"
              className="relative z-20 mx-3 mb-5 animate-rise border border-ink/20 bg-bone-50/95 p-5 shadow-[0_20px_60px_rgba(23,21,15,0.14)] backdrop-blur-sm sm:absolute sm:right-4 sm:top-14 sm:mx-0 sm:mb-0 sm:w-[320px]"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ochre">
                  {active.number} — {active.code}
                </p>
                <button
                  type="button"
                  onClick={() => onSelect(null)}
                  aria-label="Close module note"
                  className="-mr-1 -mt-1 rounded-sm p-1 text-ink/45 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <h3 className="mt-2 font-display text-[28px] leading-none">{active.name}</h3>
              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.14em] text-ink/45">
                {active.instinct} · {active.time}
              </p>
              <blockquote className="mt-4 border-l border-ochre pl-3 font-display text-[15px] italic leading-snug text-ink/75">
                “{active.moment}”
              </blockquote>
              <p className="mt-4 text-[12.5px] leading-relaxed text-ink-soft">{active.description}</p>
              <details className="group mt-4 border-t border-ink/15 pt-3">
                <summary className="cursor-pointer list-none font-mono text-[9px] uppercase tracking-[0.14em] text-ink/50 transition-colors hover:text-ink">
                  How it changes
                  <span className="ml-1 inline-block transition-transform group-open:rotate-90" aria-hidden="true">
                    ›
                  </span>
                </summary>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-soft">{active.method}</p>
              </details>
              <div className="mt-4 flex items-center justify-between border-t border-ink/15 pt-3">
                <span className="flex items-center gap-2">
                  <Difficulty value={active.difficulty} color={active.color} />
                  <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/40">
                    Difficulty
                  </span>
                </span>
                <a
                  href="#modules"
                  className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60 underline decoration-ochre decoration-2 underline-offset-4 transition-colors hover:text-ink"
                >
                  Full entry
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-ink/15 bg-bone-100">
        <div className="mx-auto flex max-w-[1400px] items-center gap-6 overflow-hidden px-5 py-3 sm:px-8">
          <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.2em] text-ink/40">Method</span>
          <div className="flex min-w-max animate-marquee items-center gap-8 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/60">
            {Array.from({ length: 2 }).map((_, loop) => (
              <div key={loop} className="flex items-center gap-8" aria-hidden={loop === 1}>
                {['Scent', 'Search', 'Solve', 'Settle', 'Reset'].map((word) => (
                  <span key={word} className="flex items-center gap-8">
                    {word}
                    <span className="h-1 w-1 rounded-full bg-ochre" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Science() {
  const [open, setOpen] = useState(0);
  const principles = [
    {
      n: '01',
      title: 'Scent is the doorway',
      text: 'Nose work asks a dog to gather information with the sense they already use to read a room. It is tiring in a different way from running — shorter sessions, more recovery.',
      detail: 'A dog can separate a trail into layers: direction, age, concentration. The station gives that ability a place to work.',
      cue: 'Track · search',
    },
    {
      n: '02',
      title: 'Novelty needs a schedule',
      text: 'Change two modules and one cartridge each week. The deck stays familiar; the problem does not. That small rotation is the difference between a toy and a practice.',
      detail: 'Twelve weekly configurations ship with the station. After that, the permutations are yours to rebuild.',
      cue: 'Rotate · rebuild',
    },
    {
      n: '03',
      title: 'Solving is rest',
      text: 'A focused scent session gives a dog a job with a clear end. Many dogs settle afterward; adjust duration for age and mobility.',
      detail: 'The goal is not exhaustion. It is the quiet that arrives when the nose has finished its sentence.',
      cue: 'Solve · settle',
    },
  ];

  return (
    <section id="science" className="border-b border-ink/15">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionLabel index="02">The principle</SectionLabel>
            <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-[56px]">
              Dogs don’t play
              <br />
              with their eyes.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              A toy that looks interesting to us can be almost invisible to a dog. Scent is the
              channel they trust: a nose that can separate a trail into layers, and a brain that
              reads a room before the eyes do.
            </p>
            <div className="mt-8 border-l-2 border-ochre pl-5">
              <p className="font-display text-xl leading-snug text-ink sm:text-[26px]">
                “A puzzle your dog can finish is a puzzle they stop using. This one is designed to
                stay unfinished.”
              </p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">
                Design principle no. 1
              </p>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={100}>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-ink">
              Enrichment fails for a boring reason: habituation. A dog masters a treat ball in a
              week, and after that the object carries no new information. The station treats
              novelty as a schedule rather than a feature. Every bay accepts every module, so the
              problem space can be rebuilt without buying another object. The scent cartridges
              change what the puzzle is asking, not just how hard it is.
            </p>
          </Reveal>

          <div className="mt-10 border-y border-ink/15">
            {principles.map((item, index) => {
              const expanded = open === index;
              return (
                <div key={item.n} className="border-b border-ink/15 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? -1 : index)}
                    aria-expanded={expanded}
                    className="grid w-full grid-cols-[40px_1fr_auto] items-center gap-4 py-5 text-left transition-colors hover:bg-bone-100/60 sm:grid-cols-[56px_1fr_auto]"
                  >
                    <span className={`font-mono text-[10px] transition-colors ${expanded ? 'text-ochre' : 'text-ink/35'}`}>
                      {item.n}
                    </span>
                    <span>
                      <span className="block font-display text-xl leading-tight">{item.title}</span>
                      <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">
                        {item.cue}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mr-1 text-lg font-light text-ink/40 transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}
                    >
                      +
                    </span>
                  </button>
                  {expanded ? (
                    <div className="animate-rise pb-6 pl-[56px] pr-6 sm:pl-[72px]">
                      <p className="max-w-xl text-[14px] leading-relaxed text-ink-soft">{item.text}</p>
                      <p className="mt-3 max-w-xl border-l border-ochre/60 pl-4 text-[13px] leading-relaxed text-ink/55">
                        {item.detail}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-ink/40">
              Designed around nose-work fundamentals: track, search, manipulate, persist — then rest.
            </p>
            <span className="flex-shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/30">
              {String(open + 1).padStart(2, '0')} / 03
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StationSection({ onInspect }: { onInspect: (id: string) => void }) {
  const { addToCart, openCart } = useStore();
  const core = catalog['kit-core'];

  return (
    <section id="station" className="border-b border-ink/15 bg-bone-100">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-7">
          <Reveal>
            <StationDiagram onInspect={onInspect} />
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={80}>
            <SectionLabel index="03">The station</SectionLabel>
            <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl">
              A desk
              <br />
              for the nose.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              The base is not a tray. It is a weighted aluminum instrument with six recessed
              bays, encapsulated magnets and a machined lip that catches light like a camera body.
              It stays where you put it.
            </p>

            <ul className="mt-8 divide-y divide-ink/15 border-y border-ink/15">
              {product.includes.slice(0, 5).map((item) => (
                <li key={item} className="flex items-start gap-3 py-3.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-ochre" aria-hidden="true" />
                  <span className="text-[13.5px] leading-snug text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-b border-ink/15 pb-6 font-mono text-[10px]">
              <div>
                <dt className="uppercase tracking-[0.14em] text-ink/40">Base</dt>
                <dd className="mt-1 text-ink/75">480 × 360 × 45 mm</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.14em] text-ink/40">Weight</dt>
                <dd className="mt-1 text-ink/75">3.6 kg, weighted</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.14em] text-ink/40">Magnets</dt>
                <dd className="mt-1 text-ink/75">N42, encapsulated</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.14em] text-ink/40">Mount</dt>
                <dd className="mt-1 text-ink/75">Floor or wall</dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/45">Core system</p>
                <p className="mt-1 font-display text-4xl leading-none">{formatPrice(core.price)}</p>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  addToCart({
                    id: core.id,
                    name: core.name,
                    subtitle: core.subtitle,
                    price: core.price,
                    swatch: core.swatch,
                  });
                  openCart();
                }}
              >
                Add to cart
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </div>

            <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-ink/40">
              Concept store · demo checkout · 60-day trial · 2-year warranty
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Modules({ onInspect }: { onInspect: (id: string) => void }) {
  const { addToCart, openCart } = useStore();
  const expansion = catalog['expansion-pack'];
  const [activeId, setActiveId] = useState(product.modules[0].id);
  const activeIndex = product.modules.findIndex((module) => module.id === activeId);
  const active = product.modules[activeIndex];

  const step = (direction: number) => {
    const next = (activeIndex + direction + product.modules.length) % product.modules.length;
    setActiveId(product.modules[next].id);
  };

  return (
    <section id="modules" className="border-b border-ink/15">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="04">The modules</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-[56px]">
                Six instincts, six objects.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                Each module targets a different part of the problem: tracking, foraging,
                manipulation, nose work, reach and sequence. Every bay accepts every module.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-ink/15 bg-ink/15 lg:grid-cols-12">
          <div className="bg-bone-50 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-ink/15 px-5 py-4 sm:px-6">
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">Module index</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
                {active.number} / 06
              </span>
            </div>
            <div role="group" aria-label="Choose a module" className="flex flex-col">
              {product.modules.map((module) => {
                const selected = module.id === activeId;
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => setActiveId(module.id)}
                    aria-pressed={selected}
                    className={`group/index flex items-center gap-4 border-b border-ink/10 px-5 py-4 text-left transition-colors duration-300 last:border-b-0 sm:px-6 ${
                      selected ? 'bg-ink text-bone-50' : 'hover:bg-bone-100'
                    }`}
                  >
                    <span
                      className={`font-mono text-[9px] tracking-[0.1em] ${selected ? 'text-ochre-light' : 'text-ink/35'}`}
                    >
                      {module.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-display text-[19px] leading-tight ${selected ? 'text-bone-50' : 'text-ink'}`}>
                        {module.name}
                      </span>
                      <span className={`mt-0.5 block font-mono text-[8px] uppercase tracking-[0.12em] ${selected ? 'text-bone-50/50' : 'text-ink/40'}`}>
                        {module.instinct}
                      </span>
                    </span>
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full transition-transform duration-300 group-hover/index:scale-125"
                      style={{ backgroundColor: module.color }}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
            <p className="border-t border-ink/15 px-5 py-4 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-ink/35 sm:px-6">
              Every bay accepts every module · 720 deck permutations
            </p>
          </div>

          <div className="bg-bone-50 p-5 sm:p-8 lg:col-span-8">
            <div key={active.id} className="animate-rise">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ochre">
                    {active.number} — {active.code} / {active.instinct}
                  </p>
                  <h3 className="mt-3 font-display text-[34px] leading-none tracking-[-0.02em] sm:text-[44px]">
                    {active.name}
                  </h3>
                </div>
                <div className="text-right">
                  <Difficulty value={active.difficulty} color={active.color} />
                  <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/40">
                    Difficulty · {active.time}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] sm:gap-8">
                <div>
                  <div className="aspect-[4/3] w-full border border-ink/10 bg-bone-100/70 p-5">
                    <ModuleGlyph id={active.id} accent={active.color} />
                  </div>
                  <blockquote className="mt-5 border-l border-ochre pl-4 font-display text-[17px] italic leading-snug text-ink/75">
                    “{active.moment}”
                  </blockquote>
                </div>

                <div>
                  <p className="text-[14px] leading-relaxed text-ink-soft">{active.description}</p>
                  <div className="mt-6 border-t border-ink/15 pt-4">
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">How it changes</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{active.method}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onInspect(active.id)}
                      className="inline-flex items-center gap-2 rounded-sm bg-ink px-5 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-bone-50 transition-colors hover:bg-moss"
                    >
                      Inspect in 3D
                      <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/35">
                      Included in every core deck
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-ink/15 pt-4">
                <div className="flex items-center gap-1">
                  {product.modules.map((module) => (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => setActiveId(module.id)}
                      aria-label={`Show ${module.name}`}
                      aria-pressed={module.id === activeId}
                      className={`h-1 w-6 transition-colors ${module.id === activeId ? 'bg-ink' : 'bg-ink/15 hover:bg-ink/40'}`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous module"
                    className="rounded-sm p-2 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next module"
                    className="rounded-sm p-2 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center">
            <p className="max-w-lg text-[13.5px] leading-relaxed text-ink-soft">
              Already have a station? The Expansion Pack adds a second set of all six modules for
              two-station households or a faster rotation.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                addToCart({
                  id: expansion.id,
                  name: expansion.name,
                  subtitle: expansion.subtitle,
                  price: expansion.price,
                  swatch: expansion.swatch,
                });
                openCart();
              }}
            >
              Add expansion — {formatPrice(expansion.price)}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Scents({ onInspect }: { onInspect: (id: string) => void }) {
  const { addToCart, openCart } = useStore();
  const [activeScent, setActiveScent] = useState<string | null>(null);
  const cartridges = catalog['scent-cartridges-4'];

  return (
    <section id="scents" className="border-b border-ink/15 bg-bone-100">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="05">The scent library</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-[56px]">
                Four notes. One nose.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                Cartridges are the information layer. Swap one and the same maze becomes a
                different question. Start with one note, add a second once your dog commits.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {product.scents.map((scent) => {
            const pair = product.modules.find((module) => module.id === scent.pair);
            const expanded = activeScent === scent.code;
            return (
              <article
                key={scent.code}
                onPointerMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect();
                  event.currentTarget.style.setProperty('--scent-x', `${event.clientX - rect.left}px`);
                  event.currentTarget.style.setProperty('--scent-y', `${event.clientY - rect.top}px`);
                }}
                className="scent-card lift relative flex flex-col overflow-hidden bg-bone-50 p-6 sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">
                    {scent.code}
                  </span>
                  <span
                    className="h-8 w-8 rounded-full border border-ink/10 transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundColor: scent.color }}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-6 font-display text-2xl leading-tight">{scent.name}</h3>
                <p className="mt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-ink/45">
                  {scent.notes}
                </p>
                <div className="mt-5 flex items-center gap-1" aria-label={`Intensity ${scent.intensity} of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-[3px] flex-1 ${i < scent.intensity ? 'bg-ink' : 'bg-ink/10'}`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">{scent.use}</p>

                <button
                  type="button"
                  onClick={() => setActiveScent(expanded ? null : scent.code)}
                  aria-expanded={expanded}
                  className="mt-4 inline-flex items-center gap-1.5 self-start border-b border-ink/20 pb-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/50 transition-colors hover:border-ochre hover:text-ink"
                >
                  {expanded ? 'Close note' : 'Scent note'}
                  <span
                    className={`inline-block transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
                    aria-hidden="true"
                  >
                    ›
                  </span>
                </button>

                {expanded ? (
                  <div className="mt-4 animate-rise border-t border-ink/15 pt-4">
                    <p className="text-[12.5px] leading-relaxed text-ink-soft">
                      Load one note at a time. The first three sessions stay shallow: one bay, one
                      cartridge, reward easy to reach. Depth is a later conversation.
                    </p>
                    {pair ? (
                      <button
                        type="button"
                        onClick={() => onInspect(pair.id)}
                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/55 underline decoration-ochre decoration-2 underline-offset-4 transition-colors hover:text-ink"
                      >
                        First pairing · {pair.name}
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-ink/15 pt-6 sm:flex-row sm:items-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45">
              Extra cartridges · four pack · {formatPrice(cartridges.price)}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                addToCart({
                  id: cartridges.id,
                  name: cartridges.name,
                  subtitle: cartridges.subtitle,
                  price: cartridges.price,
                  swatch: cartridges.swatch,
                });
                openCart();
              }}
            >
              Add four cartridges
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Build() {
  return (
    <section id="build" className="border-b border-ink/15">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="06">Build a deck</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-[56px]">
                Build it to the dog.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                A confident three-module start or the complete library. Every configuration ships
                with the same base, so you can grow the deck later without replacing anything.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10">
            <KitConfigurator />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Comparison() {
  const [openRow, setOpenRow] = useState<string | null>(null);

  return (
    <section className="border-b border-ink/15 bg-bone-100">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="07">Category</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-[56px]">
                Against the usual objects.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
                Snuffle mats, treat balls and fixed boards all do one job well. The station is for
                the dog who has already learned the one job.
              </p>
              <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">
                Select a row to read the difference
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink/25">
                  <th scope="col" className="py-3 pr-6 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-ink/45">
                    Feature
                  </th>
                  <th scope="col" className="bg-bone-50 px-4 py-3 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-ink">
                    Sniff &amp; Solve
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-ink/45">
                    Snuffle mat
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-ink/45">
                    Treat ball
                  </th>
                  <th scope="col" className="px-4 py-3 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-ink/45">
                    Fixed puzzle
                  </th>
                </tr>
              </thead>
              <tbody>
                {product.comparison.map((row) => {
                  const expanded = openRow === row.feature;
                  return (
                    <Fragment key={row.feature}>
                      <tr className="group border-b border-ink/10 transition-colors hover:bg-bone-50/70">
                        <th scope="row" className="py-0 pr-6 text-left text-[13px] font-normal text-ink/70">
                          <button
                            type="button"
                            onClick={() => setOpenRow(expanded ? null : row.feature)}
                            aria-expanded={expanded}
                            className="flex w-full items-center gap-2 py-4 text-left transition-colors group-hover:text-ink"
                          >
                            <span
                              aria-hidden="true"
                              className={`text-[13px] text-ink/30 transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}
                            >
                              +
                            </span>
                            {row.feature}
                          </button>
                        </th>
                        <td className="bg-bone-50 px-4 py-4 text-[13px] font-medium text-ink transition-colors group-hover:bg-ochre/10">
                          {row.station}
                        </td>
                        <td className="px-4 py-4 text-[13px] text-ink/50">{row.snuffle}</td>
                        <td className="px-4 py-4 text-[13px] text-ink/50">{row.ball}</td>
                        <td className="px-4 py-4 text-[13px] text-ink/50">{row.puzzle}</td>
                      </tr>
                      {expanded ? (
                        <tr className="border-b border-ink/10 bg-bone-50/80">
                          <td colSpan={5} className="px-4 py-0">
                            <div className="flex animate-rise items-start gap-3 py-4">
                              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-ochre" aria-hidden="true" />
                              <p className="max-w-2xl text-[13px] leading-relaxed text-ink-soft">{row.note}</p>
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Notes() {
  const filters = ['All', 'Active', 'Senior', 'First-timer'] as const;
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const visible = product.reviews.filter(
    (review) => filter === 'All' || review.tags.includes(filter)
  );

  return (
    <section id="notes" className="border-b border-ink/15">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="08">Field notes</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-[56px]">
                Notes from the test deck.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <div className="flex items-end gap-5">
                <p className="font-display text-6xl leading-none">04</p>
                <div className="pb-1">
                  <div className="flex gap-0.5" aria-label="Four written notes">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < 4 ? 'fill-ochre text-ochre' : 'fill-ink/15 text-ink/15'}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/45">
                    Illustrative notes · concept store
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink-soft">
                These notes are written for the concept store. They are not real customer
                reviews, and no average rating is claimed.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-ink/15 py-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter field notes by household">
            {filters.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? 'border-ink bg-ink text-bone-50'
                      : 'border-ink/20 text-ink/50 hover:border-ink/45 hover:text-ink'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35">
            Showing {String(visible.length).padStart(2, '0')} of {String(product.reviews.length).padStart(2, '0')}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-px border border-ink/15 bg-ink/15 lg:grid-cols-2">
          {visible.map((review) => (
            <article key={`${filter}-${review.id}`} className="flex animate-rise flex-col bg-bone-50 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < review.rating ? 'fill-ink text-ink' : 'fill-ink/12 text-ink/12'}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink/35">
                  {review.household}
                </span>
              </div>

              <h3 className="mt-5 font-display text-[22px] leading-tight">{review.title}</h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-soft">
                “{review.text}”
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {review.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-ink/15 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-ink/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <footer className="mt-5 flex items-end justify-between border-t border-ink/15 pt-4">
                <div>
                  <p className="text-[13px] font-medium">{review.name}</p>
                  <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40">
                    {review.dog} · {review.city}
                  </p>
                </div>
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35">{review.date}</p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Wager() {
  const [reading, setReading] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const readings = [
    {
      label: 'For the dog',
      line: 'A problem with a scent at the end of it.',
      note: 'Fifteen minutes of being excellent at something nobody had to explain. What changes is not the object. It is the dog’s confidence in its own nose.',
    },
    {
      label: 'For you',
      line: 'A reason to stop supervising and start noticing.',
      note: 'The station asks for ten minutes, not a subscription to progress. The reward is a dog that settles because the work is finished, not because the treats ran out.',
    },
    {
      label: 'For the room',
      line: 'A quiet object that earns its place.',
      note: 'Five passive bays. No app, no account, no light blinking for attention. The sixth bay clicks. That is the only sound it makes on its own.',
    },
  ];

  const move = (delta: number) => {
    const next = (reading + delta + readings.length) % readings.length;
    setReading(next);
    tabRefs.current[next]?.focus();
  };
  const active = readings[reading];

  return (
    <section aria-labelledby="wager-title" className="relative overflow-hidden border-b border-ink/15 bg-ink text-bone-50">
      <div aria-hidden="true" className="grid-paper absolute inset-0 opacity-[0.16]" />
      <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-50/40">
              Interlude — the wager
            </p>
            <h2 id="wager-title" className="mt-6 font-display text-5xl leading-[0.96] tracking-[-0.03em] sm:text-6xl">
              We are not
              <br />
              selling a toy.
            </h2>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-bone-50/60">
              A toy asks for attention. A station asks for a relationship with attention. Everything
              else — the six bays, the four notes, the aluminium — is in service of that one sentence.
            </p>
          </div>

          <div className="lg:col-span-7 lg:pt-2">
            <div role="tablist" aria-label="Three readings of the station" className="flex flex-wrap gap-x-7 gap-y-2 border-b border-bone-50/15 pb-4">
              {readings.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  role="tab"
                  id={`wager-tab-${index}`}
                  aria-selected={reading === index}
                  aria-controls="wager-panel"
                  tabIndex={reading === index ? 0 : -1}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  onClick={() => setReading(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                      event.preventDefault();
                      move(1);
                    }
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                      event.preventDefault();
                      move(-1);
                    }
                  }}
                  className={`relative pb-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                    reading === index ? 'text-bone-50' : 'text-bone-50/40 hover:text-bone-50/75'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-[17px] h-px origin-left bg-ochre transition-transform duration-500 ${
                      reading === index ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div
              role="tabpanel"
              id="wager-panel"
              aria-labelledby={`wager-tab-${reading}`}
              className="min-h-[220px] pt-10"
            >
              <p key={`line-${reading}`} className="animate-rise max-w-2xl font-display text-3xl leading-[1.08] tracking-[-0.02em] sm:text-[2.6rem]">
                {active.line}
              </p>
              <p key={`note-${reading}`} className="mt-6 max-w-lg animate-rise text-[13.5px] leading-relaxed text-bone-50/60">
                {active.note}
              </p>
            </div>

            <p className="mt-10 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-bone-50/35">
              Design principle no. 2 — attention, given a shape, becomes rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  const [openCard, setOpenCard] = useState(0);

  return (
    <section className="border-b border-ink/15 bg-bone-100">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-24">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="09">The promise</SectionLabel>
              <h2 className="mt-6 font-display text-4xl leading-[0.98] tracking-[-0.02em] sm:text-5xl">
                A trial that
                <br />
                actually ends.
              </h2>
              <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ink-soft">
                Enrichment is personal. If the station does not fit your dog, we take it back and
                pay the return shipping. No forms, no restocking fee.
              </p>
              <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.14em] text-ink/40">
                Select a promise to read the detail
              </p>
            </div>
            <div className="grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-3 lg:col-span-8">
              {product.guarantee.map((item, index) => {
                const expanded = openCard === index;
                return (
                  <div key={item.title} className="flex flex-col bg-bone-50">
                    <button
                      type="button"
                      onClick={() => setOpenCard(expanded ? -1 : index)}
                      aria-expanded={expanded}
                      className="flex flex-1 flex-col p-6 text-left"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="font-display text-5xl leading-none text-ink/15">
                          {['60', '02', '∞'][index]}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-1 font-mono text-sm text-ink/30 transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}
                        >
                          +
                        </span>
                      </span>
                      <h3 className="mt-6 font-display text-xl leading-tight">{item.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{item.text}</p>
                    </button>
                    {expanded ? (
                      <div className="animate-rise border-t border-ink/15 px-6 py-4">
                        <p className="text-[12.5px] leading-relaxed text-ink/60">{item.detail}</p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="border-b border-ink/15">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="10">Questions</SectionLabel>
            <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl">
              The honest
              <br />
              answers.
            </h2>
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-ink-soft">
              If something is missing, write to us. A person who has set up the station will
              answer.
            </p>
            <a
              href="mailto:hello@sniffsolve.example"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] underline decoration-ochre decoration-2 underline-offset-4"
            >
              hello@sniffsolve.example
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="lg:col-span-8">
          <div className="border-t border-ink/15">
            {product.faq.map((item, index) => (
              <FAQItem key={item.q} question={item.q} answer={item.a} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ onInspect }: { onInspect: (id: string) => void }) {
  const shuffle = () => {
    const index = Math.floor(Math.random() * product.modules.length);
    onInspect(product.modules[index].id);
  };

  return (
    <footer className="bg-bone-100">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="grid gap-10 border-b border-ink/15 pb-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-[26px] leading-none">Sniff &amp; Solve</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.24em] text-ink/45">
              Olfactory instruments for dogs
            </p>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-ink-soft">
              A modular scent-puzzle station designed to be rearranged, not completed. Made for
              dogs who read the world with their nose.
            </p>
            <p className="mt-5 max-w-sm border-l border-ochre/60 pl-3 font-mono text-[8px] uppercase leading-relaxed tracking-[0.1em] text-ink/35">
              Concept store. The product, brand and field notes are fictional — built as a
              design-and-commerce demo. No payment is taken.
            </p>
          </div>

          <nav className="lg:col-span-2" aria-label="Shop">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {[
                ['The station', '/#station'],
                ['Modules', '/#modules'],
                ['Scent library', '/#scents'],
                ['Build a kit', '/#build'],
                ['Expansion pack', '/#modules'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-ink/70 transition-colors hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-2" aria-label="Support">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">Support</h3>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {[
                ['Shipping', '/#faq'],
                ['Returns & trial', '/#faq'],
                ['Warranty', '/#faq'],
                ['Care guide', '/#faq'],
                ['Field notes', '/#notes'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-ink/70 transition-colors hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              <li>
                <Link href="/#faq" className="text-ink/70 hover:text-ink">
                  Order &amp; delivery questions
                </Link>
              </li>
              <li className="text-ink/50">
                This is a concept store. No support inbox is monitored.
              </li>
              <li>
                <span className="block font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35">
                  Demo order endpoint
                </span>
                <code className="mt-1 block font-mono text-[10px] uppercase tracking-[0.1em] text-ink/55">
                  POST /api/orders
                </code>
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={shuffle}
                className="group inline-flex items-center justify-between gap-3 border border-ink/20 px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.14em] text-ink/70 transition-colors hover:border-ink hover:bg-ink hover:text-bone-50"
              >
                Shuffle a bay
                <Shuffle className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
                }}
                className="inline-flex items-center justify-between gap-3 px-4 py-2 text-left font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40 transition-colors hover:text-ink"
              >
                Back to the top
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sniff &amp; Solve. All rights reserved.</p>
          <p>Demo build · no real payments · no real shipping</p>
          <p>Station 01 · concept build</p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [selected, setSelected] = useState<string | null>(null);

  const select = useCallback((id: string | null) => setSelected(id), []);

  const inspect = useCallback((id: string) => {
    setSelected(id);
    const target = document.getElementById('hero');
    if (!target) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-bone-50">
      <Header />
      <Cart />
      <main id="main" className="flex-1">
        <Hero selected={selected} onSelect={select} />
        <Science />
        <StationSection onInspect={inspect} />
        <Modules onInspect={inspect} />
        <Scents onInspect={inspect} />
        <Build />
        <Comparison />
        <Notes />
        <Wager />
        <Guarantee />
        <FAQ />
        <CTA />
      </main>
      <Footer onInspect={inspect} />
    </div>
  );
}
