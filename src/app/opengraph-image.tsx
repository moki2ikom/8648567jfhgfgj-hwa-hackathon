import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Sniff & Solve — a nose-led puzzle that redraws itself';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#17150f',
          color: '#f7f2e6',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#c8892f' }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#b96a4c' }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: '#5e7f9c' }} />
            </div>
            <span style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase' }}>
              Sniff &amp; Solve
            </span>
          </div>
          <span style={{ fontSize: 15, letterSpacing: 3, color: '#c8892f', textTransform: 'uppercase' }}>
            Station 01
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontSize: 15, letterSpacing: 4, color: '#8f9a85', textTransform: 'uppercase' }}>
            Enrichment, engineered
          </span>
          <div
            style={{
              fontSize: 84,
              lineHeight: 0.98,
              letterSpacing: -2,
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 900,
            }}
          >
            <span>A puzzle that</span>
            <span>redraws itself.</span>
          </div>
          <span style={{ fontSize: 22, color: '#d8d2c2', maxWidth: 760, lineHeight: 1.4 }}>
            Six magnetic scent modules. 720 deck permutations. One station your dog can never finish.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(247,242,230,0.18)',
            paddingTop: 24,
            fontSize: 15,
            letterSpacing: 2,
            color: '#8f9a85',
            textTransform: 'uppercase',
          }}
        >
          <span>Modular nose work for dogs</span>
          <span>8648567jfhgfgj-hwa-hackathon.vercel.app</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
