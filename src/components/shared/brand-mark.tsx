/**
 * The splitiphy mark (a rotated divide sign) on an emerald tile, as plain
 * JSX for next/og image routes.
 */
export const BrandMark = ({
  size,
  rounded = true,
}: {
  size: number;
  /** iOS rounds home-screen icons itself, so apple-icon passes false */
  rounded?: boolean;
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d9467',
      borderRadius: rounded ? size * 0.22 : 0,
    }}
  >
    <svg
      width={size * 0.62}
      height={size * 0.62}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ transform: 'rotate(45deg)' }}
    >
      <circle cx="12" cy="6" r="2" fill="#ffffff" />
      <line x1="5" x2="19" y1="12" y2="12" />
      <circle cx="12" cy="18" r="2" fill="#ffffff" />
    </svg>
  </div>
);
