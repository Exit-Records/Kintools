# Kin Tools — Version Manifest

Canonical reference for all 35 tools in the Kin ecosystem.  
All tools deploy as Cloudflare Pages at `<subdomain>.kintools.net`.

**Last updated:** 2026-03-26  
**Stress-test phase:** in progress — do not push until all 35 checked.

---

## Status key

| Symbol | Meaning |
|--------|---------|
| ✅ | Stress tested and all issues fixed |
| 🔄 | Not yet stress tested |
| 🔨 | Needs rebuild (does not follow single-file HTML standard) |
| ⚠️ | Known issue noted |

---

## Tool register

| # | Tool | Version | Creator | URL | Status | Notes |
|---|------|---------|---------|-----|--------|-------|
| KIN-001 | Ukulele Tuner | v1.1 | Maya | ukulele.kintools.net | ✅ | 8 issues fixed |
| KIN-002 | Metronome | v1.0 | Darren | metronome.kintools.net | ✅ | 9 issues fixed |
| KIN-003 | BPM Counter | v1.0 | Darren | bpm.kintools.net | ✅ | 10 issues fixed |
| KIN-004 | Colour Picker | — | Darren | colour-picker.kintools.net | 🔨 | React bundle, not single-file HTML |
| KIN-005 | QR Builder | v1.0 | Darren | qr-builder.kintools.net | 🔨 | React bundle, not single-file HTML |
| KIN-006 | Classroom Timer | v1.0 | Darren | classroom-timer.kintools.net | ✅ | 3 issues fixed |
| KIN-007 | Ambient Mixer | v1.0 | Darren | ambient.kintools.net | ✅ | 5 issues fixed; ScriptProcessorNode noted for future major update |
| KIN-008 | Flashcards | v1.0 | dBridge | flashcards.kintools.net | ✅ | 6 issues fixed; custom confirm modal noted (low priority) |
| KIN-009 | Jet Lag Planner | v1.0 | Darren | jetlag.kintools.net | ✅ | 2 fixes: bug report + header storage ⓘ added |
| KIN-010 | Audio Calculators | v1.0 | Darren | audio-calc.kintools.net | ✅ | 5 fixes: localStorage key bug, bug report, theme-color, OG, semitone text |
| KIN-011 | Unit Price Calc | v1.0 | Darren | unit-price.kintools.net | 🔄 | |
| KIN-012 | Name Picker | v1.1 | Darren | name-picker.kintools.net | 🔄 | |
| KIN-013 | Mood Slider | v1.0 | Darren | mood-slider.kintools.net | 🔄 | |
| KIN-014 | Breathing | v1.1 | Darren | breathing.kintools.net | 🔄 | |
| KIN-015 | Quiet Cycle | v1.0 | Alice & Darren | quiet-cycle.kintools.net | 🔄 | |
| KIN-016 | Recipe Scaler | v1.0 | Darren | recipe-scaler.kintools.net | 🔄 | |
| KIN-017 | Decision Flip | v1.0 | Alice | decision-flip.kintools.net | 🔄 | |
| KIN-018 | Kin Nest | v1.0 | Alice & Darren | kin-nest.kintools.net | 🔄 | |
| KIN-019 | Markdown Download | v1.0 | Darren | markdown-download.kintools.net | 🔄 | |
| KIN-020 | Password Generator | v1.0 | Darren | password-generator.kintools.net | 🔄 | |
| KIN-021 | Text Counter | v1.0 | Darren | text-counter.kintools.net | 🔄 | |
| KIN-022 | Fair Share | v1.0 | Darren | fair-share.kintools.net | 🔄 | |
| KIN-023 | JSON | v1.0 | Darren | json.kintools.net | 🔄 | |
| KIN-024 | Thought Loop | v1.0 | Darren | thought-loop.kintools.net | 🔄 | |
| KIN-025 | Stretch | v1.0 | Darren | stretch.kintools.net | 🔄 | |
| KIN-026 | Kin Ground | v1.0 | Darren | kin-ground.kintools.net | 🔄 | |
| KIN-027 | Kin Gym | v1.0 | William & Darren | kin-gym.kintools.net | 🔄 | |
| KIN-028 | Scan | v1.0 | Darren & Daisy | scan.kintools.net | 🔄 | |
| KIN-029 | Nudge | — | Darren | nudge.kintools.net | 🔄 | index.html restored from git; Netlify URL fixed |
| KIN-030 | Quote | v1.0 | Darren | quote.kintools.net | 🔄 | |
| KIN-031 | Invoice | v1.0 | Darren | invoice.kintools.net | 🔄 | |
| KIN-032 | Receipt | v1.0 | Darren | receipt.kintools.net | 🔄 | |
| KIN-033 | Page Surgeon | v1.0 | Darren | page-surgeon.kintools.net | 🔄 | |
| KIN-034 | Noise Meter | v1.0 | Liam | noise-meter.kintools.net | 🔄 | |
| KIN-035 | Random Acts | v1.0 | Darren | random-acts.kintools.net | 🔄 | |

---

## Stress-test progress

- **Tested:** 8 / 35 (KIN-001, 002, 003, 006, 007, 008, 009, 010)
- **Needs rebuild:** 2 (KIN-004, 005)
- **Pending:** 25

---

## Standard fixes applied per tool (pattern from KIN-001/002)

Every compliant tool must have:

1. **Viewport** — no `maximum-scale=1` or `user-scalable=no`
2. **Blob manifest** — inline script in `<head>`, no static `manifest.json` link
3. **Blob SW** — inline `kin00N-v1` cache string, no static `sw.js` link
4. **Apple-touch-icon** — canvas-generated with tool gradient, `id="apple-touch-icon"`
5. **theme-color** — light bg value, `id="theme-color-meta"`, toggled in JS
6. **Footer** — `text-align:center` on `<footer>`, 3 rows: credit · badge · bug button
7. **Bug report** — `form_type:'bug_report'`, `mode:'no-cors'`, `Content-Type: application/json`, no email field
8. **OG block** — full Section 19 template (canonical, description, og:*, twitter:*)
9. **Theme toggle** — light-first CSS (`:root` = light, `html.dark` = dark)

---

## Known issues pending resolution

| Tool | Issue |
|------|-------|
| KIN-004 | React bundle — needs full rebuild as single-file HTML |
| KIN-005 | React bundle — needs full rebuild as single-file HTML |
