# Kin Tools

**35 free, browser-only tools. No accounts. No tracking. No data leaves your device.**

→ **[kintools.net](https://kintools.net)**

---

Kin is a collection of small, focused tools built for everyday use. Every tool runs entirely in the browser — there are no servers, no sign-ups, and nothing stored anywhere except your own device. Open the page, use the tool, close the tab.

---

## Tools

| # | Tool | Live |
|---|------|------|
| KIN-001 | Ukulele Tuner | [ukulele.kintools.net](https://ukulele.kintools.net) |
| KIN-002 | Metronome | [metronome.kintools.net](https://metronome.kintools.net) |
| KIN-003 | BPM Counter | [bpm.kintools.net](https://bpm.kintools.net) |
| KIN-004 | Colour Picker | [colour.kintools.net](https://colour.kintools.net) |
| KIN-005 | QR Builder | [qr.kintools.net](https://qr.kintools.net) |
| KIN-006 | Classroom Timer | [timer.kintools.net](https://timer.kintools.net) |
| KIN-007 | Ambient Mixer | [ambient.kintools.net](https://ambient.kintools.net) |
| KIN-008 | Flashcards | [flashcards.kintools.net](https://flashcards.kintools.net) |
| KIN-009 | Jet Lag Planner | [jetlag.kintools.net](https://jetlag.kintools.net) |
| KIN-010 | Audio Calculators | [audiocalc.kintools.net](https://audiocalc.kintools.net) |
| KIN-011 | Unit Price Calculator | [unitprice.kintools.net](https://unitprice.kintools.net) |
| KIN-012 | Name Picker | [namepicker.kintools.net](https://namepicker.kintools.net) |
| KIN-013 | Mood Slider | [mood.kintools.net](https://mood.kintools.net) |
| KIN-014 | Breathing Exercise | [breathing.kintools.net](https://breathing.kintools.net) |
| KIN-015 | Quiet Cycle | [quietcycle.kintools.net](https://quietcycle.kintools.net) |
| KIN-016 | Recipe Scaler | [recipescale.kintools.net](https://recipescale.kintools.net) |
| KIN-017 | Decision Flip | [decision.kintools.net](https://decision.kintools.net) |
| KIN-019 | Markdown Download | [markdown.kintools.net](https://markdown.kintools.net) |
| KIN-020 | Password Generator | [passgen.kintools.net](https://passgen.kintools.net) |
| KIN-021 | Text Counter | [textcounter.kintools.net](https://textcounter.kintools.net) |
| KIN-022 | Fair Share | [fairshare.kintools.net](https://fairshare.kintools.net) |
| KIN-023 | JSON | [json.kintools.net](https://json.kintools.net) |
| KIN-024 | Thought Loop | [thoughtloop.kintools.net](https://thoughtloop.kintools.net) |
| KIN-025 | Stretch | [stretch.kintools.net](https://stretch.kintools.net) |
| KIN-026 | Grounding | [ground.kintools.net](https://ground.kintools.net) |
| KIN-027 | Gym Log | [gym.kintools.net](https://gym.kintools.net) |
| KIN-028 | QR Scanner | [scan.kintools.net](https://scan.kintools.net) |
| KIN-029 | Nudge | [nudge.kintools.net](https://nudge.kintools.net) |
| KIN-030 | Quote Builder | [quote.kintools.net](https://quote.kintools.net) |
| KIN-031 | Invoice Builder | [invoice.kintools.net](https://invoice.kintools.net) |
| KIN-032 | Receipt Builder | [receipt.kintools.net](https://receipt.kintools.net) |
| KIN-033 | Page Surgeon | [pagesurgeon.kintools.net](https://pagesurgeon.kintools.net) |
| KIN-034 | Noise | [noise.kintools.net](https://noise.kintools.net) |
| KIN-035 | Random Acts | [randomacts.kintools.net](https://randomacts.kintools.net) |

---

## How they're built

Every tool is a single static HTML file — vanilla HTML, CSS, and JavaScript, no frameworks, no build step. If a tool needs to remember something between sessions it uses `localStorage`. Nothing is ever sent to a server.

The tools run on [Cloudflare Pages](https://pages.cloudflare.com), each deployed to its own `toolname.kintools.net` subdomain.

---

## Repo structure

```
sites/
  kin-001-ukulele/        ← one directory per tool
    index.html
    wrangler.jsonc        ← Cloudflare Pages config
    icon.svg
    manifest.json
  kin-002-metronome/
  ...
Kin Build Rules.md        ← full technical spec for building tools
Kin Catalog.md            ← notes and history for every tool
```

---

## Contributing

Read **[Kin Build Rules.md](./Kin%20Build%20Rules.md)** before opening a PR. It covers everything: file structure, design standards, colour system, footer requirements, OG meta tags, localStorage conventions, and the Cloudflare Pages deployment setup.

The short version:

- One `index.html` per tool — no bundlers, no frameworks
- Follow the existing header, footer, and colour conventions exactly
- Include the OG/canonical meta block (template in §19 of the build rules)
- Include a `wrangler.jsonc` with `"name": "kin-NNN-toolname"`
- Add your tool to the landing page, the build rules, and the catalog
- Open a PR — don't push directly to `main`

---

## Design principles

- **No friction** — the tool works the moment the page loads
- **No accounts** — nothing requires sign-in
- **Private by default** — if data is stored, it stays on the device
- **Focused** — each tool does one thing well
- **Consistent** — shared header, footer, colour system, and motion across all tools

---

*Kin is built by [Exit Records](https://exitrecords.co.uk) and friends.*
