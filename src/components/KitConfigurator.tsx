'use client';

import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { KIT_PRICE_MAP } from '@/lib/catalog';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

type KitKey = 'starter' | 'core' | 'full';
type ScentKey = '4' | '8';
type FinishKey = 'graphite' | 'bone';

const KITS: Array<{
  key: KitKey;
  label: string;
  modules: number;
  modulesLabel: string;
  blurb: string;
  session: string;
}> = [
  {
    key: 'starter',
    label: 'Starter',
    modules: 3,
    modulesLabel: 'Three modules',
    blurb: 'Maze, spiral and scent tubes. A calm first month of nose work.',
    session: '15–30 min',
  },
  {
    key: 'core',
    label: 'Core',
    modules: 6,
    modulesLabel: 'Six modules',
    blurb: 'All six bays. Every instinct covered, twelve weekly configurations.',
    session: '15–45 min',
  },
  {
    key: 'full',
    label: 'Full library',
    modules: 12,
    modulesLabel: 'Twelve modules',
    blurb: 'Two of each module. Build two stations or double the rotation.',
    session: '15–45 min · two decks',
  },
];

const FINISHES: Array<{ key: FinishKey; label: string; swatch: string; note: string }> = [
  { key: 'graphite', label: 'Graphite', swatch: '#242427', note: 'Powder-coated graphite' },
  { key: 'bone', label: 'Bone', swatch: '#D8CDB7', note: 'Powder-coated warm bone' },
];

const PRESETS: Array<{
  label: string;
  note: string;
  kit: KitKey;
  scents: ScentKey;
  finish: FinishKey;
}> = [
  {
    label: 'The settler',
    note: 'Three modules, one note at a time. A calm first month.',
    kit: 'starter',
    scents: '4',
    finish: 'graphite',
  },
  {
    label: 'The worker',
    note: 'All six instincts and both intensities. Built to rotate.',
    kit: 'core',
    scents: '8',
    finish: 'graphite',
  },
  {
    label: 'The senior',
    note: 'Lower reach, softer finish, shorter sessions.',
    kit: 'starter',
    scents: '4',
    finish: 'bone',
  },
];

export function KitConfigurator() {
  const [kit, setKit] = useState<KitKey>('core');
  const [scents, setScents] = useState<ScentKey>('4');
  const [finish, setFinish] = useState<FinishKey>('graphite');
  const { addToCart, openCart } = useStore();

  const selectedKit = KITS.find((item) => item.key === kit) ?? KITS[1];
  const pricing = KIT_PRICE_MAP[kit][scents];
  const finishInfo = FINISHES.find((item) => item.key === finish) ?? FINISHES[0];
  const installed = Math.min(selectedKit.modules, 6);
  const spare = Math.max(selectedKit.modules - 6, 0);
  const scentsDelta = KIT_PRICE_MAP[kit]['8'].price - KIT_PRICE_MAP[kit]['4'].price;

  const add = () => {
    addToCart({
      id: pricing.id,
      name: pricing.name,
      subtitle: `${finishInfo.label} finish · ${scents} scents`,
      price: pricing.price,
      swatch: finish === 'graphite' ? '#242427' : '#D8CDB7',
    });
    openCart();
  };

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-ink/15 bg-ink/15 lg:grid-cols-12">
      <div className="bg-bone-50 p-6 sm:p-8 lg:col-span-7">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">Start from a household</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {PRESETS.map((preset) => {
              const active =
                kit === preset.kit && scents === preset.scents && finish === preset.finish;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setKit(preset.kit);
                    setScents(preset.scents);
                    setFinish(preset.finish);
                  }}
                  aria-pressed={active}
                  className={`border p-3 text-left transition-colors ${
                    active
                      ? 'border-ink bg-bone-100'
                      : 'border-ink/20 hover:border-ink/50'
                  }`}
                >
                  <span className="block font-display text-[15px] leading-tight">{preset.label}</span>
                  <span className="mt-1 block text-[11px] leading-snug text-ink/50">{preset.note}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">Deck size</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {KITS.map((item) => {
              const active = kit === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setKit(item.key)}
                  aria-pressed={active}
                  className={`relative flex flex-col items-start border p-4 text-left transition-colors ${
                    active
                      ? 'border-ink bg-ink text-bone-50'
                      : 'border-ink/20 bg-transparent hover:border-ink/50'
                  }`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">
                    {item.modulesLabel}
                  </span>
                  <span className="mt-1 font-display text-xl">{item.label}</span>
                  <span className={`mt-2 font-mono text-[11px] ${active ? 'text-ochre-light' : 'text-ink/60'}`}>
                    {formatPrice(KIT_PRICE_MAP[item.key]['4'].price)}
                  </span>
                  {active && <Check className="absolute right-3 top-3 h-4 w-4 text-ochre-light" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <p className="mt-3 max-w-md text-[13px] leading-relaxed text-ink-soft">{selectedKit.blurb}</p>
        </div>

        <div className="mt-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">Scent library</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(['4', '8'] as ScentKey[]).map((option) => {
              const active = scents === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScents(option)}
                  aria-pressed={active}
                  className={`flex items-center justify-between border px-4 py-3 text-left transition-colors ${
                    active ? 'border-ink bg-bone-100' : 'border-ink/20 hover:border-ink/50'
                  }`}
                >
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em]">
                      {option} cartridges
                    </span>
                    <span className="mt-0.5 block text-[12px] text-ink/55">
                      {option === '4' ? 'One intensity per note' : 'Two intensities per note'}
                    </span>
                  </span>
                  <span className="font-mono text-[10px]">{option === '4' ? 'Included' : `+${formatPrice(scentsDelta)}`}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">Base finish</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {FINISHES.map((option) => {
              const active = finish === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setFinish(option.key)}
                  aria-pressed={active}
                  className={`flex items-center gap-3 border px-4 py-3 transition-colors ${
                    active ? 'border-ink bg-bone-100' : 'border-ink/20 hover:border-ink/50'
                  }`}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-ink/20"
                    style={{ backgroundColor: option.swatch }}
                    aria-hidden="true"
                  />
                  <span className="text-left">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.12em]">{option.label}</span>
                    <span className="mt-0.5 block text-[12px] text-ink/55">{option.note}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between bg-bone-100 p-6 sm:p-8 lg:col-span-5">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">Your configuration</p>
          <dl className="mt-4 space-y-3 border-t border-ink/15 pt-4 font-mono text-[11px]">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Deck</dt>
              <dd className="text-right">{selectedKit.label} · {selectedKit.modules} modules</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Scents</dt>
              <dd className="text-right">{scents} cartridges</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Finish</dt>
              <dd className="text-right">{finishInfo.label}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/50">Estimated session</dt>
              <dd className="text-right">{selectedKit.session}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45">
              <span>Deck coverage</span>
              <span>{installed} / 6 bays{spare > 0 ? ` · ${spare} spares` : ''}</span>
            </div>
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <span
                  key={i}
                  className={`h-3 flex-1 transition-colors duration-500 ${i < installed ? 'bg-ink' : 'bg-ink/12'}`}
                />
              ))}
            </div>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
              {spare > 0 ? `${installed} installed · ${spare} spare modules` : 'All six bays filled · 720 deck orders'}
            </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-end justify-between border-t border-ink/15 pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/45">Total</span>
            <span className="font-display text-4xl leading-none">{formatPrice(pricing.price)}</span>
          </div>
          <p className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.1em] text-ink/40">
            Taxes included · free shipping
          </p>
          <button
            type="button"
            onClick={add}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-bone-50 transition-colors hover:bg-moss"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add configuration — {formatPrice(pricing.price)}
          </button>
          <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-[0.1em] text-ink/35">
            Demo checkout · no payment taken
          </p>
        </div>
      </div>
    </div>
  );
}
