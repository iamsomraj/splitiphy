import { siteConfig } from '@/config/site';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = `${siteConfig.name} - split bills with friends and family`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const fontsDir = join(process.cwd(), 'src/assets/fonts');
const [interMedium, interBold] = await Promise.all([
  readFile(join(fontsDir, 'inter-500.ttf')),
  readFile(join(fontsDir, 'inter-700.ttf')),
]);

// Dark theme tokens from globals.css, as hex for Satori
const colors = {
  background: '#0e0c0b',
  card: '#161312',
  border: '#2e2926',
  foreground: '#fafaf9',
  muted: '#a8a29e',
  primary: '#34d399',
  primaryForeground: '#022c22',
  destructive: '#f87171',
};

const balances = [
  { name: 'Aisha', note: 'paid for dinner', amount: '+ $124.00', owed: true },
  { name: 'Rahul', note: 'owes for the cab', amount: '− $38.00', owed: false },
  { name: 'Meera', note: 'settled up', amount: '$0.00', owed: null },
];

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: colors.background,
        backgroundImage: `radial-gradient(circle at 85% 20%, rgba(52, 211, 153, 0.22), transparent 55%)`,
        color: colors.foreground,
        fontFamily: 'Inter',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: 560 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.primary}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ transform: 'rotate(45deg)' }}
          >
            <circle cx="12" cy="6" r="2" fill={colors.primary} />
            <line x1="5" x2="19" y1="12" y2="12" />
            <circle cx="12" cy="18" r="2" fill={colors.primary} />
          </svg>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
            {siteConfig.name}
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -3,
          }}
        >
          Split bills, not friendships
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.4,
            color: colors.muted,
          }}
        >
          Shared expenses for trips, flats and friends. Simplify debts and
          settle up in one tap.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 440,
          padding: 32,
          gap: 20,
          borderRadius: 24,
          border: `1px solid ${colors.border}`,
          background: colors.card,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700 }}>Goa trip</div>
          <div
            style={{
              display: 'flex',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 700,
              background: colors.primary,
              color: colors.primaryForeground,
            }}
          >
            Simplified
          </div>
        </div>
        {balances.map((balance) => (
          <div
            key={balance.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 20,
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {balance.name}
              </div>
              <div style={{ fontSize: 18, color: colors.muted }}>
                {balance.note}
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color:
                  balance.owed === null
                    ? colors.muted
                    : balance.owed
                      ? colors.primary
                      : colors.destructive,
              }}
            >
              {balance.amount}
            </div>
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Inter', data: interMedium, style: 'normal', weight: 500 },
        { name: 'Inter', data: interBold, style: 'normal', weight: 700 },
      ],
    },
  );
}
