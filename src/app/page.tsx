'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Star } from 'lucide-react';
import { Header } from '@/components/Header';
import { Cart } from '@/components/Cart';
import { Product3D } from '@/components/Product3D';
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

function Hero() {
  const { addToCart, openCart } = useStore();
  const [selected, setSelected] = useState<string | null>(null);
  const core = catalog['kit-core'];
  const active = product.modules.find((module) => module.id === selected);

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
    <section className="relative overflow-hidden border-b border-ink/15">
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

          <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[660px]">
            <Product3D selected={selected} onSelect={(id) => setSelected((current) => (current === id ? null : id))} />
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 sm:inset-x-6">
            <div className="flex items-end justify-between gap-4 border-t border-ink/20 pt-3">
              {active ? (
                <div className="min-w-0">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ochre">
                    {active.number} — {active.code}
                  </p>
                  <p className="mt-1 font-display text-xl leading-none sm:text-2xl">{active.name}</p>
                  <p className="mt-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/45">
                    {active.instinct} · {active.time}
                  </p>
                </div>
              ) : (
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/45">
                  Click a module to inspect it
                </p>
              )}
              <div className="hidden shrink-0 text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.12em] text-ink/40 sm:block">
                Scale 1:2
                <br />
                Graphite / brass
              </div>
            </div>
          </div>
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
              channel they trust: roughly forty times the olfactory cortex of a human, and a nose
              that can separate a trail into layers.
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

          <div className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
            {[
              {
                n: '01',
                title: 'Scent is the doorway',
                text: 'Nose work asks a dog to gather information with the sense they already use to read a room. It is tiring in a different way from running.',
              },
              {
                n: '02',
                title: 'Novelty needs a schedule',
                text: 'Change two modules and one cartridge each week. The deck stays familiar; the problem does not.',
              },
              {
                n: '03',
                title: 'Solving is rest',
                text: 'A focused scent session can settle a dog the way a long walk does — with less wear on joints and far less furniture.',
              },
            ].map((item) => (
              <div key={item.n} className="grid grid-cols-[40px_1fr] gap-4 py-5 sm:grid-cols-[56px_1fr]">
                <span className="font-mono text-[10px] text-ochre">{item.n}</span>
                <div>
                  <h3 className="font-display text-xl leading-tight">{item.title}</h3>
                  <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-ink/40">
            Built with input from three working scent-detection trainers and a veterinary
            behaviour consultant.
          </p>
        </div>
      </div>
    </section>
  );
}

function StationSection() {
  const { addToCart, openCart } = useStore();
  const core = catalog['kit-core'];

  return (
    <section id="station" className="border-b border-ink/15 bg-bone-100">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="lg:col-span-7">
          <Reveal>
            <StationDiagram />
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
              The base is not a tray. It is a weighted aluminium instrument with six recessed
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
              In stock · ships in 1–2 business days · 60-day trial · 2-year warranty
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  const { addToCart, openCart } = useStore();
  const expansion = catalog['expansion-pack'];

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

        <div className="mt-12 grid grid-cols-1 gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
          {product.modules.map((module) => (
            <article
              key={module.id}
              className="group relative flex flex-col bg-bone-50 p-6 transition-colors duration-500 hover:bg-bone-100 sm:p-7"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">
                    {module.number} / {module.code.split('/')[1]?.trim()}
                  </p>
                  <h3 className="mt-3 font-display text-[26px] leading-none">{module.name}</h3>
                </div>
                <span
                  className="mt-1 h-3 w-3 rounded-full"
                  style={{ backgroundColor: module.color }}
                  aria-hidden="true"
                />
              </div>

              <div className="mt-5 aspect-[4/3] w-full rounded-sm border border-ink/10 bg-bone-100/60 p-4 transition-colors group-hover:bg-bone-50">
                <ModuleGlyph id={module.id} accent={module.color} />
              </div>

              <p className="mt-5 flex-1 text-[13.5px] leading-relaxed text-ink-soft">
                {module.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-ink/15 pt-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ink/45">
                  {module.instinct}
                </span>
                <Difficulty value={module.difficulty} color={module.color} />
              </div>
              <div className="mt-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                <span>{module.time}</span>
                <span>Included in core</span>
              </div>
            </article>
          ))}
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

function Scents() {
  const { addToCart, openCart } = useStore();
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
          {product.scents.map((scent) => (
            <article key={scent.code} className="bg-bone-50 p-6 sm:p-7">
              <div className="flex items-start justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/40">
                  {scent.code}
                </span>
                <span
                  className="h-8 w-8 rounded-full border border-ink/10"
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
            </article>
          ))}
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
                {product.comparison.map((row) => (
                  <tr key={row.feature} className="border-b border-ink/10">
                    <th scope="row" className="py-4 pr-6 text-[13px] font-normal text-ink/70">
                      {row.feature}
                    </th>
                    <td className="bg-bone-50 px-4 py-4 text-[13px] font-medium text-ink">
                      {row.station}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-ink/50">{row.snuffle}</td>
                    <td className="px-4 py-4 text-[13px] text-ink/50">{row.ball}</td>
                    <td className="px-4 py-4 text-[13px] text-ink/50">{row.puzzle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Notes() {
  return (
    <section id="notes" className="border-b border-ink/15">
      <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel index="08">Field notes</SectionLabel>
              <h2 className="mt-6 font-display text-[40px] leading-[0.98] tracking-[-0.02em] sm:text-5xl lg:text-[56px]">
                From the first 214 households.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <div className="flex items-end gap-5">
                <p className="font-display text-6xl leading-none">4.7</p>
                <div className="pb-1">
                  <div className="flex gap-0.5" aria-label="4.7 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < 4 ? 'fill-ochre text-ochre' : 'fill-ink/15 text-ink/15'}`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/45">
                    214 beta households · 31 written notes
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-ink-soft">
                Beta households paid cost price for the station. Notes are unedited, including the
                critical ones.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-px border border-ink/15 bg-ink/15 lg:grid-cols-2">
          {product.reviews.map((review) => (
            <article key={review.id} className="flex flex-col bg-bone-50 p-6 sm:p-8">
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

              <footer className="mt-6 flex items-end justify-between border-t border-ink/15 pt-4">
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

function Guarantee() {
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
            </div>
            <div className="grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-3 lg:col-span-8">
              {product.guarantee.map((item, index) => (
                <div key={item.title} className="bg-bone-50 p-6">
                  <p className="font-display text-5xl leading-none text-ink/15">
                    {['60', '02', '∞'][index]}
                  </p>
                  <h3 className="mt-6 font-display text-xl leading-tight">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{item.text}</p>
                </div>
              ))}
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

function Footer() {
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
                <a href="mailto:hello@sniffsolve.example" className="text-ink/70 hover:text-ink">
                  hello@sniffsolve.example
                </a>
              </li>
              <li className="text-ink/50">Mon–Fri, 09:00–17:00 CET</li>
              <li>
                <Link href="/#faq" className="text-ink/70 hover:text-ink">
                  Order &amp; delivery questions
                </Link>
              </li>
              <li>
                <code className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/45">
                  GET /api/orders
                </code>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sniff &amp; Solve. All rights reserved.</p>
          <p>Demo build · no real payments · no real shipping</p>
          <div className="flex gap-5">
            <Link href="/#faq" className="hover:text-ink">Privacy</Link>
            <Link href="/#faq" className="hover:text-ink">Terms</Link>
            <Link href="/#faq" className="hover:text-ink">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-bone-50">
      <Header />
      <Cart />
      <main className="flex-1">
        <Hero />
        <Science />
        <StationSection />
        <Modules />
        <Scents />
        <Build />
        <Comparison />
        <Notes />
        <Guarantee />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
