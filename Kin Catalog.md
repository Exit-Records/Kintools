# Kin Catalog

A record of every tool in the Kin ecosystem by Darren. Updated with each new release.

---

## KIN-001 · Ukulele Tuner

**URL:** https://mayatuner.netlify.app  
**Netlify publish dir:** `sites/kin-001-ukulele`

**Summary:** Chromatic tuner for ukulele. Listens through the device microphone and shows pitch in real time. Supports gCEA standard, aDF#B, DGBE, and fA#DG tunings. Works offline.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-002 · Metronome

**URL:** https://kinmetronome.netlify.app  
**Netlify publish dir:** `sites/kin-002-metronome`

**Summary:** Simple metronome with subdivisions and tap tempo. Beat divisions, BPM input and tap-to-set. Runs entirely in the browser.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-003 · BPM Counter

**URL:** https://kinbpm.netlify.app  
**Netlify publish dir:** `sites/kin-003-bpm`

**Summary:** Tap a button to the beat, get the BPM. Rolling average tap counter useful for DJs, musicians, and runners.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).
- Has a `sw.js` service worker. Cache bumped to `v3` after PWA icon update to clear stale cache.

---

## KIN-004 · Colour Picker

**URL:** https://kincolour.netlify.app  
**Netlify publish dir:** `artifacts/kin-colour-picker/dist/public`

**Summary:** Pick colours visually or paste hex/rgb values. Copy to clipboard. Generate simple palettes from any starting colour. Colour blindness simulation modes.

**Notes:**
- ⚠️ **React/Vite app** — does not follow the single static HTML file convention used by all other tools. Needs to be rebuilt as plain HTML to align with the rest of the catalog.
- PWA support added (icon.svg, manifest.json updated with `short_name: "KIN-004"`, meta tags, canvas apple-touch-icon).
- Source: `artifacts/kin-colour-picker/src/`

---

## KIN-005 · QR Builder

**URL:** https://kinqr.netlify.app  
**Netlify publish dir:** `sites/kin-005-qr-builder`

**Summary:** Paste a URL, email, Wi-Fi credentials, phone number, contact, or plain text and get a QR code instantly. Download as PNG or SVG. Everything stays in your browser — nothing sent anywhere.

**Notes:**
- ⚠️ **React/Vite app** — does not follow the single static HTML file convention used by all other tools. Needs to be rebuilt as plain HTML to align with the rest of the catalog.
- Has a `sw.js` service worker. Cache bumped to `v3` after light mode fix to clear stale cache.
- Light mode is now the default. Dark mode toggled via the sun/moon button.
- KIN-005 label removed from app header (already shown in footer).
- Source: `artifacts/kin-qr-builder/src/`

---

## KIN-006 · Classroom Timer

**URL:** https://kinclasstimer.netlify.app  
**Netlify publish dir:** `sites/kin-006-classroom-timer`

**Summary:** Full-screen countdown timer for classrooms. Phases shift green → amber → red as time runs down. Preset durations or set your own. Chime at the end.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-007 · Ambient Mixer

**URL:** https://kinambientmix.netlify.app  
**Netlify publish dir:** `sites/kin-007-ambient`

**Summary:** White noise, pink noise, rain, wind, waves, and fire — layered and mixed in the browser. Sleep timer, presets, and shareable mix codes. All audio generated locally.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-008 · Flashcards

**URL:** https://kinflashcards.netlify.app  
**Netlify publish dir:** `sites/kin-008-flashcards`

**Summary:** Create decks, flip cards, track what you know. Data saved in the browser. Nothing leaves the device.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-009 · Jet Lag Planner

**URL:** https://kinjetlag.netlify.app  
**Netlify publish dir:** `sites/kin-009-jetlag`

**Summary:** Enter a flight, get a circadian reset plan. Light timing, sleep schedule, fatigue windows, and a daily adjustment guide. Works offline.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-010 · Audio Calculators

**URL:** https://kinaudiocalc.netlify.app  
**Netlify publish dir:** `sites/kin-010-audio-calc`

**Summary:** 18 calculators for music producers and sound engineers. BPM to delay time, note to frequency, sample rate, latency, room modes, file size, and more. One tool, no clutter.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-011 · Unit Price Calculator

**URL:** https://kinunitcalc.netlify.app  
**Netlify publish dir:** `sites/kin-011-unit-price`

**Summary:** Find the real cost per unit of any product. Compare pack sizes instantly — 6×330ml vs 2L bottle, 500g vs 1kg. Pack size parser, best-value badge, reverse mode.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-012 · Name Picker

**URL:** https://kinnamepick.netlify.app  
**Netlify publish dir:** `sites/kin-012-name-picker`

**Summary:** Paste a list of names, pick one at random. Shuffle animation, history log, remove-after-pick option. Great for classrooms, standups, and giveaways.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).

---

## KIN-013 · Mood Slider

**URL:** https://kinmoodslider.netlify.app  
**Netlify publish dir:** `sites/kin-013-mood-slider`

**Summary:** Slide a scale from −5 to +5 to log how you're really feeling. Optional note, 7-day history, colour-coded by mood. Private, offline, no account needed.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).
- localStorage key: `kin-mood-slider`
- An earlier prototype (`sites/kin-013-mood-dot`) exists locally but is not in the catalog.

---

## KIN-014 · Breathing Exercise

**URL:** https://kinbreathing.netlify.app  
**Netlify publish dir:** `sites/kin-014-breathing`

**Summary:** Guided breathing patterns — Box Breathing, 4-7-8, ADHD Reset, Sleep Wind-Down. Expanding circle or ring guide, voice prompts, ambient gradient, daily streak. Fully offline.

**Notes:**
- Static HTML, single file.
- PWA support included from the start (built after PWA requirement was established).
- localStorage keys: `kin-breath-streak`, `kin-breath-theme`

---

## KIN-015 · Quiet Cycle

**URL:** https://kinquietcycle.netlify.app  
**Netlify publish dir:** `sites/kin-015-quiet-cycle`

**Summary:** Period tracker and cycle predictor. Calendar view with period/predicted/fertile day highlights, fertility window toggle, PIN lock, panic delete (5 taps on header), export, and inline validation. Everything stays on the device.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).
- Color scheme: purple `#7c5cbf` / `#5a3d8f`; period `#e8517a`; fertile `#0d9488`.
- localStorage key: `kin-quiet-cycle`. PIN hashed with djb2 + salt `kin-qc-v1`.
- **Timezone fix:** `ymd()` uses local date components (`getFullYear/getMonth/getDate`) — never `toISOString()` — to prevent infinite loops in UTC+ timezones.

---

## KIN-016 · Recipe Scaler

**URL:** https://kinrecipescaler.netlify.app  
**Netlify publish dir:** `sites/kin-016-recipe-scaler`

**Summary:** Scale any recipe to any number of servings. Paste ingredients, choose original and target servings, get adjusted quantities instantly. Fraction-aware (⅛, ¼, ⅓, ½ etc.), supports unicode and ASCII fractions on input. Per-ingredient lock, auto unit conversion (tsp→tbsp, g→kg, etc.), combine duplicates toggle, copy to clipboard.

**Notes:**
- Static HTML, single file.
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).
- Color scheme: amber `#b45309` / `#78350f`; background `#fffbeb`.
- localStorage key: `kin-016-rs` (stores format, precision, autoConvert, combine preferences only — no ingredient data).
- Quick ×2, ×3, ÷2, ÷3 buttons multiply from original servings.
- Ingredient locking disabled in combine-duplicates mode.

---

## KIN-017 · Decision Flip

**URL:** https://kindecisionflip.netlify.app  
**Netlify publish dir:** `sites/kin-017-decision-flip`

**Summary:** Minimal decision-paralysis breaker. Paste a list of options (one per line), hit Decide, get a randomly selected result. Shuffle animation cycles through options before revealing. Supports multi-pick (select N unique items), remove-after-flip toggle. No storage of any kind — nothing persists between sessions.

**Notes:**
- Static HTML, single file.
- Creator: Alice (not Darren).
- PWA support added (icon.svg, manifest.json, meta tags, canvas apple-touch-icon).
- Color scheme: violet `#7c3aed` / `#5b21b6`; background `#f7f5ff`.
- No localStorage — spec explicitly prohibits any storage.
- Animation: slot-machine style, interval starts at 55ms and grows by ×1.09 per step, total ~1400ms.
- Ctrl+Enter / Cmd+Enter in textarea triggers Decide.
- Edge cases handled: empty input, single option (no randomization needed but still animates), duplicates treated as separate entries.

---

## KIN-018 · Kin Nest

**URL:** https://kinnestapp.netlify.app  
**Netlify publish dir:** `sites/kin-018-kin-nest`

**Summary:** Baby routine tracker for exhausted parents. One-tap logging for feeds (5 types: breast, bottle, pumped, formula, solids), sleep (tap to start/stop), and diapers (wet/dirty/both). Dashboard shows last feed, awake time, next nap prediction, and fussiness risk score. Intelligence layer includes wake window calculator (age-adjusted), nap predictor, sleep debt tracker, meltdown scorer, daily reassurance, and routine stability indicator. Growth log, timeline view, auto night mode (20:00–06:00), export reminder, JSON export, self-contained HTML report with SVG charts, and JSON import. All data stays local.

**Notes:**
- Single HTML file, PWA (manifest.json, icon.svg, canvas apple-touch-icon).
- Creator: Alice and Darren.
- Category: Wellness (per brief; spec says Parenting/Health).
- Color scheme: emerald green `#059669` / `#047857`; background `#f0fdf4`.
- Long-press on Feed → type picker modal; long-press on Diaper → type picker modal.
- Night mode auto-switches at 20:00–06:00; manual override via Settings toggle.
- HTML export generates self-contained report with SVG bar/line charts (no libraries).
- `remindLast` timestamp updated on both export types and on banner dismiss.
- State schema: `{ baby, settings, feeds, sleep, diapers, growth, medicine }`.

---

## KIN-019 · Markdown Download

**URL:** https://kinmarkdownl.netlify.app  
**Netlify publish dir:** `sites/kin-019-markdown-download`

**Summary:** Write or paste text and download it as a .md file. Name the file, see live word and character counts, copy to clipboard. Runs entirely in the browser — no accounts, no data sent anywhere, works offline.

**Notes:**
- Static HTML, single file. PWA support (manifest.json, icon.svg, inline service worker).
- Creator: Darren. Category: Utility.
- Color scheme: dark teal `#1a3f5c` / `#0b1e2d`; tool accent: `#7eb88a`.
- Tab key inserts two spaces in the textarea; not caught by browser default.
- Download uses Blob + object URL; fallback copy via `execCommand`.

---

## KIN-020 · Password Generator

**URL:** https://kinpassgen.netlify.app
**Netlify publish dir:** `sites/kin-020-password-generator`

**Summary:** Fast, private password generator. Password mode: length slider (8–128), uppercase/lowercase/numbers/symbols toggles, ambiguous-character exclusion (0/O, 1/l/I), pronounceable mode (CV patterns), advanced include/exclude fields. Passphrase mode: 3–8 words from ~900-word bundled wordlist, configurable separator, capitalise options, optional digit+symbol injection. Strength indicator: entropy in bits, time-to-crack at 1B guesses/sec, colour bar. Batch: up to 20 passwords at once with individual and copy-all. Session history (no localStorage). Keyboard shortcuts: Space=regenerate, Cmd+Enter=copy. Nothing stored anywhere.

**Notes:**
- Single HTML file. PWA (manifest.json, icon.svg, inline service worker).
- Creator: Darren. Category: Utility.
- Color scheme: dark navy `#1a2744` / `#0a1520`; accent green `#4ade80`.
- Wordlist: ~900 curated common English words, embedded as template literal.
- All randomness via `crypto.getRandomValues()` with rejection sampling (no modulo bias).
- Dark mode default per spec.

---

## KIN-021 · Text Counter

**URL:** https://kintextcounter.netlify.app
**Netlify publish dir:** `sites/kin-021-text-counter`

**Summary:** Paste any text and get a full statistical breakdown instantly. Core stats: word count, character count (with and without spaces), sentence count, paragraph count, estimated reading time (238 wpm), speaking time (130 wpm). Readability: Flesch-Kincaid Grade Level and Reading Ease score, each with a plain-English description. Platform limits: X/Twitter (280), Instagram (2200), LinkedIn (3000), SMS (160) — each shown as a labelled progress bar that turns terracotta when over-limit. Keyword density: top 10 meaningful words (stopword-filtered, min 3 chars) shown as chips with count and percentage. Selection stats: select any passage in the textarea to see its word, character, and sentence count in a banner above the grid. Copy Stats button exports a dated plain-text summary to clipboard. No localStorage, no server calls, nothing persisted.

**Notes:**
- Single HTML file. PWA (icon.svg, inline manifest, inline service worker `kin-textcounter-v1`).
- Creator: Darren. Category: Utility.
- Color scheme: terracotta `#c45d3e` / `#8a3525`; warm cream light bg `#f5f0eb`; dark bg `#1a1614`.
- Fonts: IBM Plex Sans (UI) + IBM Plex Mono (stats/numbers).
- Readability uses approximate syllable counting (regex-based) + standard Flesch-Kincaid formulas.
- CSS fix applied on import: `@import` moved to top of `<style>` block; en dash CSS variable refs corrected to double-hyphen.
- Light mode default.

---

## KIN-022 · Fair Share

**URL:** https://kinfairshare.netlify.app
**Netlify publish dir:** `sites/kin-022-fair-share`

**Summary:** Privacy-first shared expense splitter. Create multiple groups, each with named participants and a currency symbol. Log expenses with title, amount, date, category (General/Food/Drinks/Travel/Accommodation/Activities/Shopping/Rent/Utilities/Equipment), paid-by, and split method (equal, unequal, percentage, shares). Balance view calculates net position per person and uses a greedy debt-simplification algorithm to suggest the minimum number of payments to settle up. Export group as `.fairshare.json`, copy a plain-text summary to clipboard, or import/merge groups from file. Quick Tools tab: tip calculator with preset % chips (10/15/18/20) and per-person split, plus a three-mode percentage calculator (X% of Y, X is ?% of Y, % change). Data stored in IndexedDB with localStorage fallback.

**Notes:**
- Single HTML file. PWA (icon.svg, inline manifest, inline service worker `fairshare-v1`).
- Creator: Darren. Category: Utility.
- Color scheme: forest green `#2d5a3f` / `#1a3628`; warm cream bg `#f5f0eb`; accent `#1a1a1a`.
- Fonts: DM Sans (UI) + DM Mono (numbers/balances).
- Data persists on device via IndexedDB (localStorage fallback) — unlike most Kin tools which store nothing.
- Light mode default. Service worker fixed from unsupported `data:` URI to `Blob` pattern.

---

## KIN-023 · JSON

**URL:** https://kinjson.netlify.app
**Netlify publish dir:** `sites/kin-023-json`

**Summary:** Browser-based JSON formatter, validator, and inspector. Four output modes: Formatted (syntax-highlighted with 2sp/4sp/tab indent options), Tree (collapsible node explorer with click-to-copy path), TypeScript (generates typed interfaces from the JSON shape), and Diff (side-by-side comparison of two JSON payloads with added/removed/changed highlighting). Additional features: auto-fix for common JSON errors (trailing commas, single quotes, unquoted keys), JSON path query bar (`$.data.users[0]`), sort keys alphabetically, minify, paste from clipboard, copy output. Stats bar shows byte size, key count, depth, object/array counts.

**Notes:**
- Single HTML file. PWA (icon.svg, inline manifest via Blob, inline service worker `kin-json-v1`).
- Creator: Darren. Category: Developer.
- Color scheme: deep indigo `#4b3a7c` / `#2d1f5e`; warm off-white bg `#f2f0EC`.
- Fonts: JetBrains Mono (code/UI) + DM Sans (labels).
- Light mode default. Fixed curly Unicode quotes (U+2018/2019) that caused JS syntax error.

---

## KIN-024 · Thought Loop

**URL:** https://kinthoughtloop.netlify.app
**Netlify publish dir:** `sites/kin-024-thought-loop`

**Summary:** Mindfulness thought-sorting tool that guides a user through three structured questions about a circling thought and returns one of four verdicts: Act (real and actionable now), Schedule (matters but not today), Release (a loop, not a task), or Not Yours (absorbed someone else's problem). Supports three timed modes — Now, Morning, Evening — each with tailored questions. Optional friction pause (30s countdown before questions appear). Reframe section on Release verdict lets you write the thought as someone else's situation. Schedule verdict prompts a revisit date; due reminders appear on the write screen. Patterns screen shows breakdown of verdicts and auto-generated insights (e.g. "X% of entries are speculation"). History screen lists last 50 entries with verdict colour-coding. Export all entries as plain text via clipboard.

**Notes:**
- Single HTML file. PWA (Blob manifest, apple-touch-icon canvas — slate-blue gradient `#4a5e72` / `#2d3e52`, "TL" initials, Blob SW `kin024-v1`).
- Creator: Darren. Category: Wellbeing.
- Color scheme: warm cream bg `#f5f0eb`; verdicts: terracotta Act `#c44b2b`, amber Schedule `#b08d3e`, sage Release `#4a7c6f`, slate Not Yours `#6b7b8d`.
- Fonts: DM Serif Text (headings/verdicts) + DM Sans (body/UI).
- Data stored in localStorage (`thoughtloop_entries`, `thoughtloop_settings`). Light mode default. `body.dark` class pattern.
- Fixed: en-dashes in CSS vars, broken universal selector `- {}`, markdown fences, `toISOString()` timezone bug (schedule date and due-reminder today check), dark mode toggle direction (moon in light, sun in dark).

---

*Next tool: KIN-025*
