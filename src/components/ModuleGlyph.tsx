function spiralPath(cx: number, cy: number, turns: number, start: number, end: number) {
  const points: string[] = [];
  const steps = 140;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = t * Math.PI * 2 * turns;
    const radius = start + t * (end - start);
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return points.join(' ');
}

const SPIRAL = spiralPath(60, 60, 2.35, 10, 40);

export function ModuleGlyph({ id, accent }: { id: string; accent: string }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.15,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full text-ink/75" role="img" aria-hidden="true">
      <rect x="12" y="12" width="96" height="96" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.8" fill="none" />

      {id === 'scent-maze' && (
        <g {...common}>
          <rect x="26" y="26" width="68" height="68" />
          <path d="M26 48H58V40H80" />
          <path d="M46 26V60H68V74H92" />
          <path d="M26 76H50V92" />
          <path d="M72 94V84H92" />
          <circle cx="60" cy="60" r="4.5" fill={accent} stroke="none" />
          <path d="M36 34c6 3 3 9 9 12" strokeDasharray="2 3" strokeOpacity="0.6" />
        </g>
      )}

      {id === 'treat-tumble' && (
        <g {...common}>
          <circle cx="60" cy="60" r="31" />
          <circle cx="60" cy="60" r="23" strokeOpacity="0.55" />
          <path d="M22 60h76" />
          <circle cx="46" cy="53" r="3.4" fill={accent} stroke="none" />
          <circle cx="67" cy="66" r="3.4" fill={accent} stroke="none" />
          <circle cx="63" cy="46" r="2.6" fill={accent} stroke="none" opacity="0.55" />
          <circle cx="26" cy="60" r="4" />
          <circle cx="94" cy="60" r="4" />
        </g>
      )}

      {id === 'flip-find' && (
        <g {...common}>
          <rect x="22" y="34" width="76" height="58" />
          <rect x="28" y="42" width="18" height="40" fill={accent} fillOpacity="0.14" />
          <rect x="51" y="42" width="18" height="40" fill={accent} fillOpacity="0.14" />
          <rect x="74" y="42" width="18" height="40" fill={accent} fillOpacity="0.14" />
          <path d="M28 42l18-8M51 42l18-8M74 42l18-8" strokeOpacity="0.55" />
          <circle cx="28" cy="42" r="1.8" fill="currentColor" />
          <circle cx="51" cy="42" r="1.8" fill="currentColor" />
          <circle cx="74" cy="42" r="1.8" fill="currentColor" />
          <path d="M36 62h4M59 62h4M82 62h4" strokeOpacity="0.6" />
        </g>
      )}

      {id === 'snuffle-spiral' && (
        <g {...common}>
          <path d={SPIRAL} stroke={accent} strokeWidth="5.5" strokeOpacity="0.3" />
          <path d={SPIRAL} />
          <circle cx="60" cy="60" r="5" />
          <circle cx="74" cy="38" r="2.4" fill={accent} stroke="none" />
          <circle cx="42" cy="79" r="2.4" fill={accent} stroke="none" />
          <circle cx="84" cy="72" r="2.4" fill={accent} stroke="none" />
        </g>
      )}

      {id === 'scent-tubes' && (
        <g {...common}>
          <rect x="24" y="24" width="72" height="72" rx="2" />
          {[
            [36, 40, 30],
            [50, 34, 44],
            [64, 42, 24],
            [78, 36, 38],
            [44, 78, 20],
            [70, 78, 26],
          ].map(([x, y, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width="9" height={h} rx="4.5" fill={accent} fillOpacity="0.1" />
              <path d={`M${x} ${y + 6}h9`} strokeOpacity="0.5" />
            </g>
          ))}
          <path d="M30 100h60" strokeDasharray="2 3" strokeOpacity="0.5" />
        </g>
      )}

      {id === 'paw-press' && (
        <g {...common}>
          <rect x="24" y="24" width="72" height="72" />
          {[
            [43, 43],
            [77, 43],
            [43, 77],
            [77, 77],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="12" />
              <circle cx={x} cy={y} r="8" strokeOpacity="0.5" />
              <circle cx={x} cy={y} r="4" fill={i === 0 ? accent : 'none'} stroke={i === 0 ? 'none' : 'currentColor'} />
            </g>
          ))}
          <path d="M24 60h8M88 60h8M60 24v8M60 88v8" strokeOpacity="0.4" />
        </g>
      )}
    </svg>
  );
}
