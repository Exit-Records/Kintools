import sharp from './artifacts/api-server/node_modules/sharp/lib/index.js';
import { writeFileSync } from 'fs';

const W = 1080, H = 1350;
const ICON = 168, GAP = 16;
const COLS = 5, ROWS = 7;
const PAD_X = (W - COLS * ICON - (COLS - 1) * GAP) / 2;
const PAD_Y = (H - ROWS * ICON - (ROWS - 1) * GAP) / 2;

function col(i) { return PAD_X + (i % COLS) * (ICON + GAP); }
function row(i) { return PAD_Y + Math.floor(i / COLS) * (ICON + GAP); }

function roundedRect(x, y, w, h, r, fill) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
}

function icon(idx, bg0, bg1, content) {
  const x = col(idx), y = row(idx);
  const gid = `g${idx}`;
  const flat = bg0 === bg1;
  const bgFill = flat ? `fill="${bg0}"` : `fill="url(#${gid})"`;
  const gradient = flat ? '' : `<linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg0}"/>
      <stop offset="100%" stop-color="${bg1}"/>
    </linearGradient>`;
  return { gradient, shape: `<g transform="translate(${x},${y})">
    <rect width="${ICON}" height="${ICON}" rx="28" ${bgFill}/>
    ${content}
  </g>` };
}

const W_STR = 'rgba(245,240,232,0.92)';

function svgIcon(vb, pathData) {
  const off = 39, sz = 90;
  return `<svg x="${off}" y="${off}" width="${sz}" height="${sz}" viewBox="${vb}" fill="none">${pathData}</svg>`;
}

const tools = [
  {
    idx: 0, bg0: '#1a1a18', bg1: '#1a1a18',
    content: `<g transform="translate(84,84)" stroke="${W_STR}" stroke-width="7" stroke-linecap="round" fill="none">
      <line x1="-15" y1="-57" x2="-15" y2="-7"/>
      <line x1="15" y1="-57" x2="15" y2="-7"/>
      <path d="M-15,-7 Q-15,13 0,13 Q15,13 15,-7"/>
      <line x1="0" y1="13" x2="0" y2="60"/>
    </g>`
  },
  {
    idx: 1, bg0: '#4A3D6B', bg1: '#2e2548',
    content: svgIcon('0 0 48 48', `<path d="M18 40l6-32 6 32" stroke="${W_STR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 14l10 10" stroke="${W_STR}" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="12" r="3" stroke="${W_STR}" stroke-width="2"/>`)
  },
  {
    idx: 2, bg0: '#6B3D3D', bg1: '#4a2525',
    content: svgIcon('0 0 48 48', `<circle cx="24" cy="24" r="14" stroke="${W_STR}" stroke-width="2"/><path d="M24 14v10l7 4" stroke="${W_STR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 8l4 4M36 8l-4 4" stroke="${W_STR}" stroke-width="2" stroke-linecap="round"/>`)
  },
  {
    idx: 3, bg0: '#3D5A6B', bg1: '#263d48',
    content: svgIcon('0 0 48 48', `<circle cx="20" cy="20" r="8" stroke="${W_STR}" stroke-width="2" fill="none" opacity="0.7"/><circle cx="28" cy="20" r="8" stroke="${W_STR}" stroke-width="2" fill="none" opacity="0.7"/><circle cx="24" cy="27" r="8" stroke="${W_STR}" stroke-width="2" fill="none" opacity="0.7"/>`)
  },
  {
    idx: 4, bg0: '#6B5A2D', bg1: '#4a3d1a',
    content: svgIcon('0 0 48 48', `<rect x="10" y="10" width="10" height="10" rx="1" stroke="${W_STR}" stroke-width="2"/><rect x="28" y="10" width="10" height="10" rx="1" stroke="${W_STR}" stroke-width="2"/><rect x="10" y="28" width="10" height="10" rx="1" stroke="${W_STR}" stroke-width="2"/><rect x="30" y="30" width="6" height="6" rx="1" stroke="${W_STR}" stroke-width="2" opacity="0.5"/>`)
  },
  {
    idx: 5, bg0: '#1a2840', bg1: '#0a1220',
    content: `<g fill="${W_STR}" stroke="${W_STR}" stroke-linejoin="round">
      <rect x="56" y="32" width="56" height="7" rx="2"/>
      <rect x="56" y="129" width="56" height="7" rx="2"/>
      <polygon points="56,39 112,39 84,80" opacity="1"/>
      <polygon points="56,129 112,129 84,88" opacity="0.5"/>
      <polyline points="56,39 84,80 112,39" stroke-width="5" fill="none" stroke-linecap="round"/>
      <polyline points="56,129 84,88 112,129" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>`
  },
  {
    idx: 6, bg0: '#5A3D4A', bg1: '#1a2a3d',
    content: svgIcon('0 0 48 48', `<circle cx="24" cy="24" r="3" fill="white" opacity="0.9"/><circle cx="24" cy="24" r="8" stroke="white" stroke-width="1.5" opacity="0.6"/><circle cx="24" cy="24" r="14" stroke="white" stroke-width="1.5" opacity="0.35"/><path d="M12 24c0 2 1 5 3 7" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.7"/><path d="M36 24c0-2-1-5-3-7" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`)
  },
  {
    idx: 7, bg0: '#2D4A6B', bg1: '#1a3248',
    content: svgIcon('0 0 48 48', `<rect x="10" y="14" width="22" height="16" rx="2" stroke="${W_STR}" stroke-width="2"/><rect x="16" y="18" width="22" height="16" rx="2" stroke="${W_STR}" stroke-width="2" opacity="0.5"/>`)
  },
  {
    idx: 8, bg0: '#1A4060', bg1: '#0d2235',
    content: svgIcon('0 0 48 48', `<circle cx="24" cy="24" r="13" stroke="${W_STR}" stroke-width="2"/><path d="M24 11c-3.5 4-5.5 8.5-5.5 13s2 9 5.5 13" stroke="${W_STR}" stroke-width="1.5" stroke-linecap="round"/><path d="M24 11c3.5 4 5.5 8.5 5.5 13s-2 9-5.5 13" stroke="${W_STR}" stroke-width="1.5" stroke-linecap="round"/><path d="M11 24h26" stroke="${W_STR}" stroke-width="1.5" stroke-linecap="round" opacity="0.55"/><path d="M24 17v7l4 3" stroke="${W_STR}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`)
  },
  {
    idx: 9, bg0: '#1f1040', bg1: '#080514',
    content: svgIcon('0 0 48 48', `<rect x="4" y="20" width="4" height="8" rx="2" fill="${W_STR}" opacity="0.5"/><rect x="12" y="14" width="4" height="20" rx="2" fill="${W_STR}" opacity="0.7"/><rect x="20" y="8" width="4" height="32" rx="2" fill="${W_STR}"/><rect x="28" y="4" width="4" height="40" rx="2" fill="${W_STR}"/><rect x="36" y="12" width="4" height="24" rx="2" fill="${W_STR}" opacity="0.7"/><rect x="44" y="18" width="4" height="12" rx="2" fill="${W_STR}" opacity="0.4"/>`)
  },
  {
    idx: 10, bg0: '#3D2A10', bg1: '#080514',
    content: svgIcon('0 0 48 48', `<rect x="4" y="20" width="12" height="22" rx="2" fill="${W_STR}" opacity="0.45"/><rect x="4" y="12" width="12" height="6" rx="2" fill="${W_STR}" opacity="0.25"/><rect x="20" y="10" width="12" height="32" rx="2" fill="${W_STR}" opacity="0.85"/><rect x="20" y="4" width="12" height="4" rx="2" fill="${W_STR}" opacity="0.4"/><path d="M38 24 L41 28 L46 18" stroke="${W_STR}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`)
  },
  {
    idx: 11, bg0: '#3D1A4A', bg1: '#1f0d2e',
    content: svgIcon('0 0 48 48', `<rect x="10" y="12" width="28" height="6" rx="3" fill="${W_STR}" opacity="0.35"/><rect x="10" y="21" width="28" height="6" rx="3" fill="${W_STR}" opacity="1"/><rect x="10" y="30" width="28" height="6" rx="3" fill="${W_STR}" opacity="0.35"/><circle cx="38" cy="24" r="5" fill="${W_STR}" opacity="0.9"/><path d="M36 24l1.5 1.5L40 22" stroke="#3D1A4A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`)
  },
  {
    idx: 12, bg0: '#1A3A50', bg1: '#0d1e2a',
    content: svgIcon('0 0 48 48', `<line x1="8" y1="24" x2="40" y2="24" stroke="${W_STR}" stroke-width="3" stroke-linecap="round" opacity="0.4"/><line x1="8" y1="18" x2="8" y2="30" stroke="${W_STR}" stroke-width="2" stroke-linecap="round" opacity="0.35"/><line x1="40" y1="18" x2="40" y2="30" stroke="${W_STR}" stroke-width="2" stroke-linecap="round" opacity="0.35"/><circle cx="30" cy="24" r="8" fill="${W_STR}" opacity="0.95"/>`)
  },
  {
    idx: 13, bg0: '#1F3828', bg1: '#0a1a10',
    content: `<circle cx="84" cy="84" r="71" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4.7"/>
    <circle cx="84" cy="84" r="50" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="6.5"/>
    <circle cx="84" cy="84" r="27" fill="rgba(255,255,255,0.92)"/>`
  },
  {
    idx: 14, bg0: '#7c5cbf', bg1: '#5a3d8f',
    content: svgIcon('0 0 18 18', `<circle cx="9" cy="9" r="6" stroke="white" stroke-width="1.5" fill="none"/><circle cx="9" cy="3" r="1.5" fill="white"/><line x1="9" y1="9" x2="9" y2="3" stroke="white" stroke-width="1.5"/>`)
  },
  {
    idx: 15, bg0: '#f59e0b', bg1: '#b45309',
    content: svgIcon('0 0 18 18', `<path d="M4 3h10l2.5 13H1.5L4 3z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><line x1="5" y1="6.5" x2="8.5" y2="6.5" stroke="white" stroke-width="1.2" stroke-linecap="round"/><line x1="4.5" y1="9.5" x2="8.5" y2="9.5" stroke="white" stroke-width="1.2" stroke-linecap="round"/><line x1="4" y1="12.5" x2="8.5" y2="12.5" stroke="white" stroke-width="1.2" stroke-linecap="round"/>`)
  },
  {
    idx: 16, bg0: '#a78bfa', bg1: '#7c3aed',
    content: svgIcon('0 0 18 18', `<circle cx="9" cy="9" r="7" stroke="white" stroke-width="1.5"/><path d="M7.5 7.5c0-1 .7-1.8 1.5-1.8s1.5.8 1.5 1.8c0 .9-.8 1.4-1.5 2.4" stroke="white" stroke-width="1.4" stroke-linecap="round"/><circle cx="9" cy="12.8" r=".9" fill="white"/>`)
  },
  {
    idx: 17, bg0: '#34d399', bg1: '#059669',
    content: svgIcon('0 0 24 24', `<path d="M6 20q5-5 12-8" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M6 16q5-3 12-4" stroke="white" stroke-width="2" stroke-linecap="round" opacity=".7"/><ellipse cx="12" cy="8" rx="4" ry="5" fill="white" opacity=".9"/>`)
  },
  {
    idx: 18, bg0: '#202028', bg1: '#0e0e14',
    content: `<g stroke="${W_STR}" stroke-linecap="round" stroke-linejoin="round" fill="none">
      <path d="M58,35 L97,35 L116,54 L116,114 L58,114 Z" stroke-width="4.7"/>
      <path d="M97,35 L97,54 L116,54" stroke-width="4.7"/>
      <line x1="84" y1="62" x2="84" y2="97" stroke-width="6.6"/>
      <polyline points="65,86 84,107 103,86" stroke-width="6.6"/>
    </g>`
  },
  {
    idx: 19, bg0: '#0c1020', bg1: '#050810',
    content: `<g stroke="${W_STR}" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="5.5">
      <path d="M66,84 L66,67 C66,47 103,47 103,67 L103,84"/>
      <rect x="60" y="82" width="49" height="45" rx="3"/>
    </g>
    <circle cx="84" cy="101" r="7.4" fill="${W_STR}"/>
    <rect x="80" y="99" width="7.4" height="12.6" fill="${W_STR}"/>`
  },
  {
    idx: 20, bg0: '#c45d3e', bg1: '#8a3525',
    content: svgIcon('0 0 24 24', `<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="16" y1="13" x2="8" y2="13" stroke="white" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="17" x2="8" y2="17" stroke="white" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="9" x2="8" y2="9" stroke="white" stroke-width="1.5" stroke-linecap="round"/>`)
  },
  {
    idx: 21, bg0: '#2d5a3f', bg1: '#1a3628',
    content: `<text x="84" y="84" text-anchor="middle" dominant-baseline="central" font-size="52" font-weight="bold" font-family="system-ui,sans-serif" fill="rgba(255,255,255,0.88)">FS</text>`
  },
  {
    idx: 22, bg0: '#4b3a7c', bg1: '#2d1f5e',
    content: `<text x="84" y="84" text-anchor="middle" dominant-baseline="central" font-size="44" font-weight="bold" font-family="monospace,sans-serif" fill="rgba(255,255,255,0.9)">{}</text>`
  },
  {
    idx: 23, bg0: '#1a2830', bg1: '#0a1418',
    content: `<path d="M75,128 A45,45 0 1,0 84,129" stroke="${W_STR}" stroke-width="6.5" stroke-linecap="round" fill="none"/>
    <polyline points="45,107 50,119 62,112" stroke="${W_STR}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
  },
  {
    idx: 24, bg0: '#182a20', bg1: '#0a1610',
    content: `<circle cx="84" cy="40" r="10" fill="${W_STR}"/>
    <g stroke="${W_STR}" stroke-linecap="round" stroke-width="5.5">
      <line x1="84" y1="50" x2="84" y2="103"/>
      <line x1="84" y1="71" x2="50" y2="51"/>
      <line x1="84" y1="71" x2="118" y2="51"/>
      <line x1="84" y1="103" x2="62" y2="134"/>
      <line x1="84" y1="103" x2="106" y2="134"/>
    </g>`
  },
  {
    idx: 25, bg0: '#201a12', bg1: '#100d08',
    content: `<g stroke="${W_STR}" stroke-linecap="round">
      <line x1="84" y1="47" x2="84" y2="91" stroke-width="5.5"/>
      <line x1="64" y1="96" x2="104" y2="96" stroke-width="5.5"/>
      <line x1="72" y1="111" x2="96" y2="111" stroke-width="4.7"/>
      <line x1="77" y1="124" x2="91" y2="124" stroke-width="3.7"/>
    </g>`
  },
  {
    idx: 26, bg0: '#1a1e2c', bg1: '#0a0c18',
    content: `<g fill="${W_STR}">
      <rect x="69" y="82" width="30" height="7.4"/>
      <rect x="49" y="69" width="15" height="30"/>
      <rect x="104" y="69" width="15" height="30"/>
      <rect x="69" y="77" width="8.4" height="15"/>
      <rect x="91" y="77" width="8.4" height="15"/>
    </g>`
  },
  {
    idx: 27, bg0: '#1c1c28', bg1: '#0c0c14',
    content: `<g stroke="${W_STR}" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-width="4.7">
      <path d="M55,35 L101,35 L116,52 L116,116 L55,116 Z"/>
      <path d="M101,35 L101,52 L116,52"/>
    </g>
    <rect x="55" y="73" width="61" height="2.4" fill="${W_STR}"/>
    <rect x="65" y="45" width="30" height="6.7" fill="${W_STR}" opacity="0.4"/>
    <rect x="65" y="54" width="22" height="6.7" fill="${W_STR}" opacity="0.4"/>
    <rect x="65" y="84" width="34" height="6.7" fill="${W_STR}" opacity="0.3"/>
    <rect x="65" y="93" width="25" height="6.7" fill="${W_STR}" opacity="0.3"/>
    <rect x="65" y="101" width="29" height="6.7" fill="${W_STR}" opacity="0.3"/>`
  },
  {
    idx: 28, bg0: '#1a1a18', bg1: '#1a1a18',
    content: `<g transform="translate(84,84)" stroke="${W_STR}" stroke-width="7" stroke-linecap="round" fill="none">
      <line x1="-10" y1="25" x2="-10" y2="-45"/>
      <polyline points="-10,-45 20,-15"/>
      <polyline points="-10,-45 -40,-15" opacity="0.35"/>
    </g>
    <circle cx="84" cy="116" r="6" fill="${W_STR}" opacity="0.7"/>
    <circle cx="84" cy="84" r="67" fill="none" stroke="${W_STR}" stroke-width="1.5" opacity="0.18"/>
    <circle cx="84" cy="84" r="45" fill="none" stroke="${W_STR}" stroke-width="2" opacity="0.12"/>`
  },
  {
    idx: 29, bg0: '#1a1a1a', bg1: '#1a1a1a',
    content: `<circle cx="84" cy="84" r="67" fill="none" stroke="#cc0000" stroke-width="1.1" opacity="0.3"/>
    <circle cx="84" cy="84" r="9.3" fill="#cc0000"/>
    <circle cx="48" cy="56" r="4.7" fill="#cc0000" opacity="0.7"/>
    <circle cx="123" cy="67" r="4.2" fill="#cc0000" opacity="0.5"/>
    <circle cx="62" cy="120" r="3.3" fill="#cc0000" opacity="0.6"/>`
  },
  {
    idx: 30, bg0: '#1a1a1a', bg1: '#1a1a1a',
    content: `<circle cx="84" cy="84" r="67" fill="none" stroke="rgba(26,86,219,0.15)" stroke-width="0.8"/>
    <circle cx="84" cy="84" r="45" fill="none" stroke="rgba(26,86,219,0.3)" stroke-width="1.2"/>
    <circle cx="84" cy="84" r="9.3" fill="#1a56db"/>
    <circle cx="48" cy="56" r="4.7" fill="#1a56db" opacity="0.7"/>
    <circle cx="123" cy="67" r="4.2" fill="#1a56db" opacity="0.5"/>
    <circle cx="62" cy="120" r="3.5" fill="#1a56db" opacity="0.6"/>
    <circle cx="117" cy="110" r="3.7" fill="#1a56db" opacity="0.45"/>
    <circle cx="28" cy="34" r="2.8" fill="#1a56db" opacity="0.25"/>`
  },
  {
    idx: 31, bg0: '#1a1a1a', bg1: '#1a1a1a',
    content: `<circle cx="84" cy="84" r="67" fill="none" stroke="rgba(17,122,85,0.2)" stroke-width="0.8"/>
    <circle cx="84" cy="84" r="45" fill="none" stroke="rgba(17,122,85,0.35)" stroke-width="1.2"/>
    <circle cx="84" cy="84" r="9.3" fill="#117a55"/>
    <circle cx="48" cy="56" r="4.7" fill="#117a55" opacity="0.7"/>
    <circle cx="123" cy="67" r="4.2" fill="#117a55" opacity="0.55"/>
    <circle cx="62" cy="120" r="3.5" fill="#117a55" opacity="0.65"/>
    <circle cx="117" cy="110" r="3.7" fill="#117a55" opacity="0.5"/>
    <circle cx="52" cy="84" r="2.8" fill="#117a55" opacity="0.4"/>
    <circle cx="28" cy="34" r="2.8" fill="#117a55" opacity="0.3"/>
    <circle cx="143" cy="121" r="2.3" fill="#117a55" opacity="0.25"/>`
  },
  {
    idx: 32, bg0: '#0e2020', bg1: '#061010',
    content: `<g stroke="${W_STR}" stroke-linecap="round" fill="none">
      <circle cx="59" cy="49" r="13" stroke-width="5.5"/>
      <circle cx="109" cy="49" r="13" stroke-width="5.5"/>
      <line x1="67" y1="59" x2="101" y2="104" stroke-width="6.5"/>
      <line x1="101" y1="59" x2="67" y2="104" stroke-width="6.5"/>
    </g>
    <circle cx="84" cy="81" r="4.7" fill="${W_STR}"/>
    <polygon points="72,107 84,121 96,107" fill="${W_STR}"/>`
  },
  {
    idx: 33, bg0: '#2a1010', bg1: '#140808',
    content: `<g fill="${W_STR}">
      <rect x="47" y="75" width="11" height="18" opacity="0.55"/>
      <rect x="62" y="59" width="11" height="50" opacity="0.75"/>
      <rect x="78" y="47" width="12" height="74" opacity="1"/>
      <rect x="94" y="58" width="11" height="52" opacity="0.75"/>
      <rect x="110" y="73" width="11" height="22" opacity="0.55"/>
    </g>`
  },
  {
    idx: 34, bg0: '#2e1612', bg1: '#160a08',
    content: `<polygon points="84,10 99,69 158,84 99,99 84,158 69,99 10,84 69,69" fill="${W_STR}" opacity="0.95"/>`
  }
];

const gradients = tools.map(t => t.bg0 !== t.bg1 ? `<linearGradient id="g${t.idx}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${t.bg0}"/><stop offset="100%" stop-color="${t.bg1}"/></linearGradient>` : '').join('\n');

const shapes = tools.map(t => {
  const x = col(t.idx), y = row(t.idx);
  const fill = t.bg0 === t.bg1 ? `fill="${t.bg0}"` : `fill="url(#g${t.idx})"`;
  return `<g transform="translate(${x},${y})">
    <rect width="${ICON}" height="${ICON}" rx="28" ${fill}/>
    ${t.content}
  </g>`;
}).join('\n');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>${gradients}</defs>
  <rect width="${W}" height="${H}" fill="#100f0e"/>
  ${shapes}
</svg>`;

const buf = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync('./icon-grid.png', buf);
console.log('Done: icon-grid.png');
