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
- Creator: Alice Anthony (not Darren).
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

*Next tool: KIN-019*
