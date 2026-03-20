# QIR Landing Page Cards -- Option C (Badge)

## CSS to add

Add this CSS to the landing page stylesheet (both `index.html` and `sites/kin-landing/index.html`):

```css
.qir-badge{
  display:inline-flex;align-items:center;gap:4px;
  font-size:10px;font-weight:600;
  color:#888;background:#f0efeb;
  border-radius:10px;padding:2px 8px;
  letter-spacing:0.5px;
  text-transform:uppercase;
}
.qir-dots{display:flex;gap:3px;align-items:center}
.qir-dots span{width:5px;height:5px;border-radius:50%}
```

If the landing page has dark mode, add:

```css
body.dark .qir-badge,
html.dark .qir-badge,
[data-theme="dark"] .qir-badge{
  color:#888 !important;
  background:#2a2a2a !important;
}
```

## Card HTML

Insert after KIN-029 card in BOTH `index.html` (root) and `sites/kin-landing/index.html`.

The category row needs a flex wrapper to position the badge opposite the category tag. Check how the existing cards handle the category -- if it's just a plain div, wrap it:

```html
<a href="/sites/kin-030/" class="tool-card" style="animation-delay: 1.65s">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div class="tool-cat">Business</div>
    <div class="qir-badge">
      <div class="qir-dots">
        <span style="background:#c00"></span>
        <span style="background:#1a56db"></span>
        <span style="background:#117a55"></span>
      </div>
      QIR
    </div>
  </div>
  <div class="tool-number">KIN-030 · Kin</div>
  <div class="tool-name">Quote</div>
  <div class="tool-creator">by Darren</div>
  <div class="tool-desc">Generate quotes with flexible line items. Set your numbering, save defaults, export to Invoice via clipboard. Nothing leaves your device.</div>
  <div class="tool-replaces">Replaces invoice apps that require accounts and monthly fees</div>
</a>

<a href="/sites/kin-031/" class="tool-card" style="animation-delay: 1.70s">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div class="tool-cat">Business</div>
    <div class="qir-badge">
      <div class="qir-dots">
        <span style="background:#c00"></span>
        <span style="background:#1a56db"></span>
        <span style="background:#117a55"></span>
      </div>
      QIR
    </div>
  </div>
  <div class="tool-number">KIN-031 · Kin</div>
  <div class="tool-name">Invoice</div>
  <div class="tool-creator">by Darren</div>
  <div class="tool-desc">Turn quotes into invoices and track payment. Import from Quote, mark paid or partial, export to Receipt. Nothing leaves your device.</div>
  <div class="tool-replaces">Replaces Wave, FreshBooks, Xero for simple invoicing</div>
</a>

<a href="/sites/kin-032/" class="tool-card" style="animation-delay: 1.75s">
  <div style="display:flex;justify-content:space-between;align-items:center">
    <div class="tool-cat">Business</div>
    <div class="qir-badge">
      <div class="qir-dots">
        <span style="background:#c00"></span>
        <span style="background:#1a56db"></span>
        <span style="background:#117a55"></span>
      </div>
      QIR
    </div>
  </div>
  <div class="tool-number">KIN-032 · Kin</div>
  <div class="tool-name">Receipt</div>
  <div class="tool-creator">by Darren</div>
  <div class="tool-desc">Confirm payment with a clean receipt. Import from Invoice, traces the full chain back to the original quote. Nothing leaves your device.</div>
  <div class="tool-replaces">Replaces PDF receipt generators with ad-walls</div>
</a>
```

## Notes

- The QIR badge is the same on all three cards -- three dots (red, blue, green) + "QIR" text
- Cards sit in the normal grid, no container or special layout needed
- The badge replaces the earlier plain card snippets in the individual push zips
- The three coloured dots in the badge echo the constellation icon colours
