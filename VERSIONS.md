# Kin Tools — Version Manifest

Canonical reference for all 37 tools in the Kin ecosystem.  
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
| KIN-011 | Unit Price Calc | v1.0 | Darren | unit-price.kintools.net | ✅ | 5 fixes: theme persistence, bug report, theme-color, OG, footer+Google Fonts; pack regex already correct |
| KIN-012 | Name Picker | v1.1 | Darren | name-picker.kintools.net | ✅ | 7 fixes: XSS in renderTeams+renderHistory (esc() added), theme persistence (kin012-theme), ⓘ storage popover, theme-color default #FAFAF7, duplicate apple-mobile metas removed, manifest→Blob URL, Google Fonts removed |
| KIN-013 | Mood Slider | v1.0 | Darren | mood-slider.kintools.net | ✅ | 5 fixes: viewport, theme-meta id, theme key→kin013-theme (migrated), showToast defined, bug report, OG |
| KIN-014 | Breathing | v1.1 | Darren | breathing.kintools.net | ✅ | 6 fixes: viewport, theme-meta id, theme key→kin014-theme + streak→kin014-streak (migrated), bug report, OG |
| KIN-015 | Quiet Cycle | v1.0 | Alice & Darren | quiet-cycle.kintools.net | ✅ | 4 fixes: viewport, XSS in renderEntries (note escaped), bug report, OG |
| KIN-016 | Recipe Scaler | v1.0 | Darren | recipe-scaler.kintools.net | ✅ | 3 fixes: viewport, bug report, OG |
| KIN-017 | Decision Flip | v1.0 | Alice | decision-flip.kintools.net | ✅ | 3 fixes: viewport, bug report, OG |
| KIN-018 | Kin Nest | v1.0 | Alice & Darren | kin-nest.kintools.net | ✅ | 3 fixes: viewport, bug report, OG; duplicate footer is inside report export template (correct) |
| KIN-019 | Markdown Download | v1.0 | Darren | markdown-download.kintools.net | ✅ | 3 fixes: Google Fonts removed, bug report, OG |
| KIN-020 | Password Generator | v1.0 | Darren | password-generator.kintools.net | ✅ | 2 fixes: bug report, OG; viewport + manifest already clean |
| KIN-021 | Text Counter | v1.0 | Darren | text-counter.kintools.net | ✅ | 5 fixes: SW key→kin021-v1, manifest icon→data URI, Google Fonts removed, bug report, OG |
| KIN-022 | Fair Share | v1.0 | Darren | fair-share.kintools.net | ✅ | 5 fixes: theme key fs-theme→kin022-theme (migrated), theme-color-meta id, Google Fonts removed, bug report, OG |
| KIN-023 | JSON | v1.0 | Darren | json.kintools.net | ✅ | 6 fixes: SW key→kin023-v1, manifest icon→data URI, theme-meta id, Google Fonts removed, bug report, OG |
| KIN-024 | Thought Loop | v1.0 | Darren | thought-loop.kintools.net | ✅ | 6 fixes: storage keys→kin024-* (migrated), theme extracted to kin024-theme, theme-color-meta id, Google Fonts removed, bug report, OG |
| KIN-025 | Stretch | v1.0 | Darren | stretch.kintools.net | ✅ | 2 fixes: bug report, OG; already best-structured in batch |
| KIN-026 | Kin Ground | v1.0 | Darren | kin-ground.kintools.net | ✅ | 7 fixes: storage keys→kin026-* (migrated), theme-color-meta id, SW activate handler, footer URL kin.tools→kintools.net, bug report, OG |
| KIN-027 | Kin Gym | v1.0 | William & Darren | kin-gym.kintools.net | ⚠️ | Deferred — see scratchpad: custom modal, esc() incomplete, OG missing |
| KIN-028 | Scan | v1.0 | Darren & Daisy | scan.kintools.net | ✅ | 3 fixes: CSS syntax error (missing { in dark mode), theme-color-meta id, OG |
| KIN-029 | Nudge | v1.0 | Darren | nudge.kintools.net | ✅ | 3 fixes: CSS unclosed .toast.show, email removed from bug report, Google Fonts removed |
| KIN-030 | Quote | v1.0 | Darren | quote.kintools.net | ✅ | 1 fix: Google Fonts removed; OG/theme-color-meta/bug report already correct |
| KIN-031 | Invoice | v1.0 | Darren | invoice.kintools.net | ✅ | 1 fix: Google Fonts removed; all else compliant |
| KIN-032 | Receipt | v1.0 | Darren | receipt.kintools.net | ✅ | 1 fix: Google Fonts removed; cleanest in business trio |
| KIN-033 | Page Surgeon | v1.0 | Darren | page-surgeon.kintools.net | ✅ | 2 fixes: missing file-info HTML element added, Google Fonts removed |
| KIN-034 | Noise Meter | v1.0 | Liam | noise-meter.kintools.net | ✅ | 1 fix: Google Fonts removed; all else compliant |
| KIN-035 | Random Acts | v1.0 | Darren | random-acts.kintools.net | ✅ | 1 fix: Google Fonts removed; kin035-* key prefix is correct |
| KIN-036 | Blood Pressure | v1.0 | Darren | bloodpressure.kintools.net | 🔄 | New — awaiting Cloudflare Pages setup |
| KIN-037 | Unclaimed | v1.0 | Darren | unclaimed.kintools.net | 🔄 | New — awaiting Cloudflare Pages setup |

---

## Stress-test progress

- **Tested:** 32 / 35 (KIN-001, 002, 003, 006, 007, 008, 009, 010, 011, 012, 013, 014, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026, 028, 029, 030, 031, 032, 033, 034, 035)
- **Needs rebuild:** 2 (KIN-004, 005)
- **Deferred:** 1 (KIN-027 — complex, user request)
- **Pending:** 0 — stress-test phase complete ✅

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
