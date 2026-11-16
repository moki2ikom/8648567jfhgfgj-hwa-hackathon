'use client';

import { useState } from 'react';
import { product } from '@/lib/product';

const LAYOUT = [
  { id: 'scent-maze', x: 74, y: 86 },
  { id: 'treat-tumble', x: 202, y: 86 },
  { id: 'flip-find', x: 330, y: 86 },
  { id: 'snuffle-spiral', x: 74, y: 220 },
  { id: 'scent-tubes', x: 202, y: 220 },
  { id: 'paw-press', x: 330, y: 220 },
];

const SIZE = 116;

export function StationDiagram({ onInspect }: { onInspect?: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const active = product.modules.find((unit) => unit.id === hovered);

  return (
    <figure className="w-full">
      <div className="relative rounded-sm border border-ink/15 bg-bone-100/60 p-3 sm:p-5">
        <svg viewBox="0 0 520 420" className="w-full" role="group" aria-label="Top-down technical diagram of the Sniff & Solve base station with six module bays">
          <title>Top-down technical diagram of the base station</title>

          <g stroke="#17150f" strokeOpacity="0.25" strokeWidth="0.75" fill="none">
            <path d="M40 30v-8M480 30v-8M40 392v8M480 392v8" />
            <path d="M40 26h440" strokeDasharray="2 4" />
            <path d="M36 50h-8M36 380h-8" />
            <path d="M32 50v330" strokeDasharray="2 4" />
          </g>
          <text x="260" y="18" textAnchor="middle" fill="#17150f" fillOpacity="0.45" fontSize="9" fontFamily="ui-monospace, monospace" letterSpacing="1.4">
            480 MM
          </text>
          <text x="18" y="215" textAnchor="middle" fill="#17150f" fillOpacity="0.45" fontSize="9" fontFamily="ui-monospace, monospace" letterSpacing="1.4" transform="rotate(-90 18 215)">
            360 MM
          </text>

          <rect x="40" y="50" width="440" height="330" rx="6" fill="#F4EFE4" stroke="#17150f" strokeOpacity="0.6" strokeWidth="1.2" />
          <rect x="46" y="56" width="428" height="318" rx="3" fill="none" stroke="#B9A57E" strokeOpacity="0.9" strokeWidth="1" />

          <g fill="#17150f" fillOpacity="0.08">
            <circle cx="260" cy="50" r="2.4" />
            <circle cx="260" cy="380" r="2.4" />
            <circle cx="40" cy="215" r="2.4" />
            <circle cx="480" cy="215" r="2.4" />
          </g>

          {LAYOUT.map((slot, index) => {
            const unit = product.modules.find((item) => item.id === slot.id);
            if (!unit) return null;
            const isActive = hovered === slot.id;
            return (
              <g
                key={slot.id}
                onMouseEnter={() => setHovered(slot.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(slot.id)}
                onBlur={() => setHovered(null)}
                onClick={() => onInspect?.(slot.id)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  onInspect?.(slot.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`Inspect ${unit.name} in the 3D station`}
                className="cursor-pointer outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ochre"
              >
                <rect
                  x={slot.x}
                  y={slot.y}
                  width={SIZE}
                  height={SIZE}
                  rx="3"
                  fill={isActive ? unit.color : '#FBF8F1'}
                  fillOpacity={isActive ? 0.22 : 1}
                  stroke={isActive ? unit.color : '#17150f'}
                  strokeOpacity={isActive ? 1 : 0.45}
                  strokeWidth={isActive ? 1.6 : 1}
                />
                <rect x={slot.x + 8} y={slot.y + 8} width={SIZE - 16} height={SIZE - 16} rx="2" fill="none" stroke={unit.color} strokeOpacity="0.45" strokeWidth="0.8" />
                <text x={slot.x + 12} y={slot.y + 24} fill="#17150f" fillOpacity="0.55" fontSize="8" fontFamily="ui-monospace, monospace" letterSpacing="1.2">
                  {unit.code}
                </text>
                <text x={slot.x + 12} y={slot.y + 42} fill="#17150f" fontSize="11" fontFamily="Georgia, serif">
                  {unit.name}
                </text>
                <g fill={unit.color} fillOpacity={0.85}>
                  {Array.from({ length: 5 }).map((_, dot) => (
                    <circle key={dot} cx={slot.x + 14 + dot * 9} cy={slot.y + SIZE - 16} r={dot < unit.difficulty ? 2.4 : 1.4} fillOpacity={dot < unit.difficulty ? 0.9 : 0.22} />
                  ))}
                </g>
                <text x={slot.x + SIZE - 12} y={slot.y + SIZE - 13} textAnchor="end" fill="#17150f" fillOpacity="0.4" fontSize="8" fontFamily="ui-monospace, monospace">
                  {String(index + 1).padStart(2, '0')}
                </text>
              </g>
            );
          })}

          <g stroke="#17150f" strokeOpacity="0.18" strokeWidth="0.75">
            <path d="M40 65h-5M40 365h-5M455 395v5M465 395v5" />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-x-6 bottom-5 sm:bottom-7">
          <div className="flex items-end justify-between gap-4 border-t border-ink/15 pt-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">
              FIG. 01 — Six-bay deck · N42 magnets · 2.2 kg pull
            </p>
            <p className="hidden text-right font-mono text-[9px] uppercase tracking-[0.16em] text-ink/70 sm:block">
              {active ? `${active.number} — ${active.instinct}` : 'Select a bay'}
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">
        <span>Top-down study · select a bay to inspect in 3D</span>
        <span className="hidden sm:inline">Aluminium / copolyester / fleece</span>
      </figcaption>
    </figure>
  );
}
