import type { CSSProperties } from 'react';

const P: Record<string, string> = {
  today: 'M3 9h18M3 5h18v14H3zM8 3v4M16 3v4',
  inbox: 'M4 4h16v12H4zM4 12h4l2 3h4l2-3h4',
  prayer: 'M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z',
  site: 'M4 5h16v14H4zM4 9h16M8 5v14',
  events: 'M3 4h18v17H3zM3 9h18M8 2v4M16 2v4M8 14h3M8 17h5',
  media: 'M4 5h16v14H4zM4 15l4-4 3 3 4-5 5 6M9 9a1.2 1.2 0 100-2.4A1.2 1.2 0 009 9z',
  sermons: 'M12 3v18M5 8l7-5 7 5M5 8v10l7 4 7-4V8',
  ai: 'M12 3v3M12 18v3M5 7l2 1M17 16l2 1M5 17l2-1M17 8l2-1M12 8.5A3.5 3.5 0 1012 15.5 3.5 3.5 0 0012 8.5z',
  autopilot: 'M12 3a9 9 0 109 9M12 7v5l3 2M18 3v5h-5',
  settings: 'M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8',
  audit: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
  plus: 'M12 5v14M5 12h14',
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6',
  eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  share: 'M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
  upload: 'M12 15V3M7 8l5-5 5 5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',
  power: 'M12 2v10M18.4 6.6a9 9 0 11-12.8 0',
  copy: 'M9 9h12v12H9zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1',
  sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3a15 15 0 010 18 15 15 0 010-18z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  chevron: 'M6 9l6 6 6-6',
  facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  instagram: 'M2 6a4 4 0 014-4h12a4 4 0 014 4v12a4 4 0 01-4 4H6a4 4 0 01-4-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.5 6.5h.01',
  whatsapp: 'M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.4A10 10 0 1012 2zM8 9c0 4 3 7 7 7',
  mail: 'M4 4h16v16H4zM4 7l8 6 8-6',
  location: 'M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 018 0v4',
  users: 'M9 8a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 11a3 3 0 000-6M15 20a6 6 0 00-1-3.5',
  heart: 'M12 21s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-7 10z',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  calendar: 'M3 4h18v17H3zM3 9h18M8 2v4M16 2v4',
  dollar: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  translate: 'M4 5h7M8 3v2c0 4-2 7-5 8M5 9c0 3 3 5 6 6M13 20l4-9 4 9M14.5 17h5',
};

interface Props { name: string; size?: number; stroke?: number; className?: string; style?: CSSProperties; }

export function Icon({ name, size = 18, stroke = 1.6, className, style }: Props) {
  return (
    <svg
      className={className} style={style}
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d={P[name] ?? ''} />
    </svg>
  );
}
