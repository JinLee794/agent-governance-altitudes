// Build agent-governance.html from agent-governance.template.html.
// Inlines lucide-static glyphs + official Azure service icons; validates icon refs, NOTES and EXPLAIN keys.
//   node build-agent-governance.mjs            (ICON_NM defaults to %TEMP%\presentation-icons\node_modules)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const NM = process.env.ICON_NM || join(process.env.TEMP || '/tmp', 'presentation-icons', 'node_modules');
const LU = join(NM, 'lucide-static', 'icons');
const MS = process.env.MS_ICONS || 'C:/Users/jinle/MCAPS-IQ/.github/skills/document-processing/assets/ms-service-icons/azure';
const TEMPLATE = join(HERE, 'agent-governance.template.html');
const OUT = join(HERE, 'agent-governance.html');

const tpl = readFileSync(TEMPLATE, 'utf8');
// every icon name the template references, static (data-ico="x") or in JS data (i:/ico: 'x', ico('x'), ic: 'x')
const refs = new Set();
for (const re of [/data-ico="([\w-]+)"/g, /\b(?:i|ico|ic|ms)\s*:\s*'([\w-]+)'/g, /ico\('([\w-]+)'\)/g, /ico\(j === 0 \? '([\w-]+)' : '([\w-]+)'\)/g]) {
  for (const m of tpl.matchAll(re)) for (const g of m.slice(1)) if (g) refs.add(g);
}
const strip = (s) => s.replace(/<\?xml[^>]*\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<title>[\s\S]*?<\/title>/g, '').replace(/\r?\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
const rootTag = (s, cls, extra = '') => s.replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height|class)="[^"]*"/g, '').replace('<svg', `<svg class="${cls}"${extra}`));
const MSFT = '<svg class="ico ico-brand" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="12" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="12" width="10" height="10" fill="#00A4EF"/><rect x="12" y="12" width="10" height="10" fill="#FFB900"/></svg>';

const ICO = {}, missing = [];
// Fallback when lucide-static isn't installable: Lucide (ISC license) paths for the icons this deck uses.
const FB = {
  'git-branch': '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'user-round': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'coins': '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>', 'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'play': '<polygon points="6 3 20 12 6 21 6 3"/>',
  'pause': '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  'circle': '<circle cx="12" cy="12" r="10"/>',
  'circle-check': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  'eye': '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'shield-alert': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
  'activity': '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  'globe': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'zoom-in': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/>',
  'zoom-out': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/>',
  'camera': '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  'users-round': '<path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>',
  'layers': '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  'cpu': '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  'plug': '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
  'key-round': '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
  'network': '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  'server': '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><path d="M6 6h.01"/><path d="M6 18h.01"/>',
  'building-2': '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  'bot': '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  'gauge': '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  'map': '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  'plane': '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  'mountain': '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
  'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
  'workflow': '<rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/>',
  'boxes': '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 8.7 5 8.7-5"/>',
  'list-checks': '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  'fingerprint': '<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>',
  'file-lock': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><rect width="8" height="6" x="8" y="12" rx="1"/><path d="M10 12v-2a2 2 0 1 1 4 0v2"/>',
  'folder-tree': '<path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"/><path d="M3 5a2 2 0 0 0 2 2h3"/><path d="M3 3v13a2 2 0 0 0 2 2h3"/>',
  'scroll-text': '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
  'footprints': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'gavel': '<path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
  'notebook-pen': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'flask-conical': '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
};
const fb = (n) => FB[n] && `<svg class="ico" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${FB[n]}</svg>`;
let fallbackUsed = 0;
for (const n of refs) {
  if (n === 'microsoft') { ICO[n] = MSFT; continue; }
  if (n.startsWith('ms-')) {
    const p = join(MS, n.slice(3) + '.svg');
    if (existsSync(p)) ICO[n] = rootTag(strip(readFileSync(p, 'utf8')), 'ico ico-brand'); else missing.push(n);
    continue;
  }
  const p = join(LU, n + '.svg');
  if (existsSync(p)) ICO[n] = rootTag(strip(readFileSync(p, 'utf8')), 'ico');
  else if (fb(n)) { ICO[n] = fb(n); fallbackUsed++; } else missing.push(n);
}

const problems = [];
if (tpl.split('{{ICONS_JSON}}').length !== 2) problems.push('expected exactly one {{ICONS_JSON}}');
const code = tpl.replace(/<!--[\s\S]*?-->/g, '');
const sections = [...code.matchAll(/<section[^>]*\sdata-t="([^"]+)"/g)].map((m) => m[1]);
const block = (start) => { const i = code.indexOf(start); if (i < 0) return ''; const j = code.indexOf('\n};', i); return code.slice(i, j); };
const has = (b, k) => new RegExp(`['"]${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*:\\s*\\{|[\\s{,]${k}\\s*:\\s*\\{`).test(b);
const notes = block('const NOTES = {'), explain = block('const EXPLAIN = {');
const notesMissing = sections.filter((t) => !has(notes, t));
const exKeys = [...new Set([...code.matchAll(/data-explain="([\w-]+)"/g)].map((m) => m[1]))];
for (const k of exKeys) if (!has(explain, k)) problems.push(`data-explain="${k}" has no EXPLAIN entry`);

// Portal screenshots (Microsoft Learn), inlined as WebP data URIs so the brief works offline.
const SHOTS = {}; const SHOT_DIR = join(dirname(TEMPLATE), 'shots');
// Product screenshots for each plane and altitude (Microsoft Learn, GitHub Docs, Ignite blogs; demo tenants only).
const XSHOTS = ['fdy_guard', 'fdy_tbx', 'def_agent', 'cps_acct', 'cps_ident', 'cps_envgrp', 'cps_grplock', 'cps_dlperr', 'cps_http', 'cps_cost', 'cps_sharing', 'cps_share', 'cps_monitor', 'ca_agents',
  'm365_agents', 'm365_rcdset', 'm365_dlp', 'm365_rcd', 'm365_rac', 'm365_overshare', 'm365_dspm', 'm365_web', 'm365_blocked', 'm365_cites', 'gh_ai', 'gh_fw'];
for (const n of ['overview', 'registry', 'details', 'map', 'tools', 'mcp', 'rule', 'platforms', 'multi', 'cowork', 'biz', 'action', ...XSHOTS]) {
  const p = join(SHOT_DIR, n + '.webp');
  if (existsSync(p)) SHOTS[n] = 'data:image/webp;base64,' + readFileSync(p).toString('base64'); else problems.push('missing screenshot ' + n);
}
const html = tpl.replace('{{ICONS_JSON}}', JSON.stringify(ICO)).replace('{{SHOTS_JSON}}', JSON.stringify(SHOTS));
writeFileSync(OUT, html, 'utf8');
console.log('screenshots    :', Object.keys(SHOTS).length, (Object.values(SHOTS).join('').length / 1024).toFixed(0) + ' KB');
console.log('icons embedded :', Object.keys(ICO).length, '/', refs.size, fallbackUsed ? `(${fallbackUsed} from built-in Lucide fallback)` : '');
console.log('missing        :', missing.length ? missing.join(', ') : 'none');
console.log('speaker notes  :', `${sections.length - notesMissing.length}/${sections.length} sections` + (notesMissing.length ? ' <- missing: ' + notesMissing.join(', ') : ''));
console.log('explainers     :', exKeys.join(', '));
if (problems.length) console.log('problems       :', problems.join('; '));
console.log('wrote          :', OUT, (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB');
if (missing.length || problems.length || notesMissing.length) process.exitCode = 1;
