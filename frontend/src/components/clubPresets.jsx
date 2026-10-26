const LIMESTONE = '#f3f0ea'
const SANDSTONE = '#e8e2d6'
const DUST = '#d9cfbe'
const OCHRE = '#c9b99d'
const UMBER = '#5e564c'
const OBSIDIAN = '#1a1714'
const VERDIGRIS = '#1e6b61'
const DEEP_VERDIGRIS = '#154f48'
const GOLD = '#b07a1e'

function chevronRow(y) {
  let path = ''
  for (let x = -20; x < 340; x += 40) {
    path += `M ${x} ${y} l 20 -14 l 20 14 `
  }
  return path
}

export const PRESETS = [
  {
    name: 'Sun over the steps',
    art: (
      <>
        <rect width="320" height="180" fill={DUST} />
        <circle cx="236" cy="62" r="30" fill={GOLD} />
        <rect x="70" y="140" width="200" height="28" fill={OBSIDIAN} />
        <rect x="95" y="112" width="150" height="29" fill={OBSIDIAN} />
        <rect x="120" y="84" width="100" height="29" fill={OBSIDIAN} />
        <rect y="168" width="320" height="12" fill={VERDIGRIS} />
      </>
    ),
  },
  {
    name: 'Dunes at noon',
    art: (
      <>
        <rect width="320" height="180" fill={LIMESTONE} />
        <circle cx="250" cy="50" r="22" fill={GOLD} />
        <path d="M 0 112 Q 80 72 160 102 T 320 92 V 180 H 0 Z" fill={DUST} />
        <path d="M 0 146 Q 100 106 200 136 T 320 130 V 180 H 0 Z" fill={OCHRE} />
        <path d="M 0 168 Q 120 146 220 164 T 320 160 V 180 H 0 Z" fill={UMBER} />
      </>
    ),
  },
  {
    name: 'Sunrise over the water',
    art: (
      <>
        <rect width="320" height="180" fill={VERDIGRIS} />
        <circle cx="160" cy="124" r="50" fill={GOLD} />
        <rect y="124" width="320" height="56" fill={DEEP_VERDIGRIS} />
        <rect x="110" y="138" width="100" height="6" fill={GOLD} />
        <rect x="130" y="154" width="60" height="6" fill={GOLD} />
        <rect x="148" y="170" width="24" height="6" fill={GOLD} />
      </>
    ),
  },
  {
    name: 'Obelisk',
    art: (
      <>
        <rect width="320" height="180" fill={SANDSTONE} />
        <circle cx="62" cy="50" r="18" fill={GOLD} />
        <rect y="132" width="320" height="48" fill={DUST} />
        <polygon points="152,132 170,132 310,170 288,170" fill={UMBER} />
        <polygon points="150,132 150,42 160,24 170,42 170,132" fill={OBSIDIAN} />
      </>
    ),
  },
  {
    name: 'Chevron inlay',
    art: (
      <>
        <rect width="320" height="180" fill={OBSIDIAN} />
        {[34, 74, 114, 154].map((y, row) => (
          <path key={y} d={chevronRow(y)} fill="none" stroke={row % 2 ? VERDIGRIS : GOLD} strokeWidth="8" />
        ))}
        <circle cx="160" cy="90" r="34" fill={GOLD} stroke={OBSIDIAN} strokeWidth="12" />
      </>
    ),
  },
  {
    name: 'Domed gate',
    art: (
      <>
        <rect width="320" height="180" fill={LIMESTONE} />
        <circle cx="160" cy="28" r="14" fill={GOLD} />
        <rect x="40" y="110" width="70" height="70" fill={DUST} />
        <rect x="210" y="110" width="70" height="70" fill={DUST} />
        <path d="M 110 180 V 100 A 50 50 0 0 1 210 100 V 180 Z" fill={VERDIGRIS} />
        <path d="M 136 180 V 118 A 24 24 0 0 1 184 118 V 180 Z" fill={OBSIDIAN} />
        <rect y="172" width="320" height="8" fill={UMBER} />
      </>
    ),
  },
  {
    name: 'Strata',
    art: (
      <>
        <rect width="320" height="180" fill={SANDSTONE} />
        <rect y="58" width="320" height="30" fill={DUST} />
        <rect y="88" width="320" height="24" fill={OCHRE} />
        <rect y="112" width="320" height="18" fill={UMBER} />
        <rect y="130" width="320" height="22" fill={VERDIGRIS} />
        <rect y="152" width="320" height="28" fill={OBSIDIAN} />
        <circle cx="92" cy="70" r="36" fill={GOLD} />
      </>
    ),
  },
  {
    name: 'Eclipse',
    art: (
      <>
        <rect width="320" height="180" fill={OBSIDIAN} />
        {[[40, 30], [96, 58], [150, 22], [280, 40], [300, 96], [34, 92], [250, 120]].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r="2" fill={LIMESTONE} />
        ))}
        <circle cx="206" cy="70" r="36" fill={GOLD} />
        <circle cx="216" cy="62" r="31" fill={OBSIDIAN} />
        <path d="M 0 150 Q 90 112 180 140 T 320 130 V 180 H 0 Z" fill={DEEP_VERDIGRIS} />
        <path d="M 0 170 Q 110 150 210 166 T 320 160 V 180 H 0 Z" fill={VERDIGRIS} />
      </>
    ),
  },
]
