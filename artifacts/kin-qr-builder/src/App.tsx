import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";

type InputType = "auto" | "url" | "text" | "email" | "phone" | "wifi" | "contact";
type ErrorLevel = "L" | "M" | "Q" | "H";
type WifiEncryption = "WPA" | "WEP" | "nopass";

interface WifiFields {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

interface ContactFields {
  name: string;
  phone: string;
  email: string;
  website: string;
}

const MAX_QR_CHARS = 2953;

function detectType(value: string): InputType {
  if (!value.trim()) return "auto";
  if (/^https?:\/\//i.test(value) || /^www\./i.test(value)) return "url";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email";
  if (/^[\+\d][\d\s\-\(\)]{6,}$/.test(value.trim())) return "phone";
  return "text";
}

function buildQRString(
  rawText: string,
  type: InputType,
  detectedType: InputType,
  wifi: WifiFields,
  contact: ContactFields
): string {
  const effective = type === "auto" ? detectedType : type;
  if (effective === "wifi") {
    const enc = wifi.encryption === "nopass" ? "nopass" : wifi.encryption;
    return `WIFI:T:${enc};S:${wifi.ssid};P:${wifi.password};H:${wifi.hidden ? "true" : "false"};;`;
  }
  if (effective === "contact") {
    const lines = ["BEGIN:VCARD", "VERSION:3.0"];
    if (contact.name) lines.push(`FN:${contact.name}`);
    if (contact.phone) lines.push(`TEL:${contact.phone}`);
    if (contact.email) lines.push(`EMAIL:${contact.email}`);
    if (contact.website) lines.push(`URL:${contact.website}`);
    lines.push("END:VCARD");
    return lines.join("\n");
  }
  if (effective === "email" && !rawText.startsWith("mailto:")) {
    return `mailto:${rawText}`;
  }
  if (effective === "phone" && !rawText.startsWith("tel:")) {
    return `tel:${rawText.replace(/\s/g, "")}`;
  }
  return rawText;
}

function contrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const linear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  };
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const TYPE_LABELS: Record<InputType, string> = {
  auto: "Auto",
  url: "URL",
  text: "Text",
  email: "Email",
  phone: "Phone",
  wifi: "Wi-Fi",
  contact: "Contact",
};

export default function App() {
  const [rawText, setRawText] = useState("");
  const [type, setType] = useState<InputType>("auto");
  const [detectedType, setDetectedType] = useState<InputType>("text");
  const [errorLevel, setErrorLevel] = useState<ErrorLevel>("M");
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#1a1714");
  const [bgColor, setBgColor] = useState("#f5f0eb");
  const [quietZone, setQuietZone] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [wifi, setWifi] = useState<WifiFields>({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [contact, setContact] = useState<ContactFields>({ name: "", phone: "", email: "", website: "" });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrString = buildQRString(rawText, type, detectedType, wifi, contact);
  const charCount = qrString.length;
  const isOverLimit = charCount > MAX_QR_CHARS;

  const effectiveType = type === "auto" ? detectedType : type;
  const showWifi = effectiveType === "wifi";
  const showContact = effectiveType === "contact";
  const showTextInput = !showWifi && !showContact;

  const contrast = contrastRatio(fgColor, bgColor);
  const lowContrast = contrast < 3;

  const generateQR = useCallback(async () => {
    if (isOverLimit) return;
    const content = qrString || " ";
    const margin = quietZone ? 4 : 0;
    try {
      const dataUrl = await QRCode.toDataURL(content, {
        errorCorrectionLevel: errorLevel,
        width: size,
        margin,
        color: { dark: fgColor, light: bgColor },
      });
      setQrDataUrl(dataUrl);
    } catch {
      setQrDataUrl("");
    }
    try {
      const svg = await QRCode.toString(content, {
        type: "svg",
        errorCorrectionLevel: errorLevel,
        margin,
        color: { dark: fgColor, light: bgColor },
      });
      setSvgString(svg);
    } catch {
      setSvgString("");
    }
  }, [qrString, errorLevel, size, fgColor, bgColor, quietZone, isOverLimit]);

  useEffect(() => {
    const detected = detectType(rawText);
    setDetectedType(detected);
  }, [rawText]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  const downloadPNG = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "kin-qr-code.png";
    a.click();
  };

  const downloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kin-qr-code.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const print = () => window.print();

  return (
    <div className="min-h-screen" style={{ background: "hsl(30 8% 9%)" }}>
      {/* Print area */}
      <div className="print-area hidden print:flex">
        {qrDataUrl && <img src={qrDataUrl} alt="QR Code" style={{ width: 400, height: 400 }} />}
        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: "0.75rem", color: "#888", marginTop: "1rem" }}>
          Generated with Kin QR Builder · KIN-005
        </p>
      </div>

      <div className="no-print max-w-2xl mx-auto px-4 pt-8 pb-16 flex flex-col gap-6">

        {/* Header */}
        <header className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="hsl(35 60% 55%)" />
              <rect x="5" y="5" width="8" height="8" rx="1.5" fill="hsl(30 8% 9%)" />
              <rect x="15" y="5" width="8" height="8" rx="1.5" fill="hsl(30 8% 9%)" />
              <rect x="5" y="15" width="8" height="8" rx="1.5" fill="hsl(30 8% 9%)" />
              <rect x="16.5" y="16.5" width="2.5" height="2.5" rx="0.5" fill="hsl(30 8% 9%)" />
              <rect x="20.5" y="16.5" width="2.5" height="2.5" rx="0.5" fill="hsl(30 8% 9%)" />
              <rect x="16.5" y="20.5" width="2.5" height="2.5" rx="0.5" fill="hsl(30 8% 9%)" />
              <rect x="20.5" y="20.5" width="2.5" height="2.5" rx="0.5" fill="hsl(30 8% 9%)" />
            </svg>
            <span className="text-base font-semibold tracking-tight" style={{ color: "hsl(36 20% 88%)" }}>Kin QR Builder</span>
            <span className="kin-label ml-auto" style={{ fontSize: "0.625rem" }}>KIN-005</span>
          </div>
          <p className="text-sm" style={{ color: "hsl(36 10% 55%)" }}>
            Privacy-first QR code generator. Everything stays in your browser.
          </p>
        </header>

        {/* Input section */}
        <section className="kin-card p-5 flex flex-col gap-4">
          {/* Type selector */}
          <div className="flex flex-col gap-2">
            <span className="kin-label">Type</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TYPE_LABELS) as InputType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`kin-pill ${type === t ? "kin-pill-active" : "kin-pill-inactive"}`}
                >
                  {TYPE_LABELS[t]}
                  {t === "auto" && type === "auto" && detectedType !== "text" && (
                    <span style={{ marginLeft: "0.25rem", opacity: 0.7 }}>→ {TYPE_LABELS[detectedType]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          {showTextInput && (
            <div className="flex flex-col gap-2">
              <span className="kin-label">
                {effectiveType === "url" ? "URL" :
                 effectiveType === "email" ? "Email address" :
                 effectiveType === "phone" ? "Phone number" : "Content"}
              </span>
              <textarea
                className="kin-input w-full p-3 text-sm resize-none"
                style={{ minHeight: 88, fontFamily: "var(--app-font-sans)" }}
                placeholder={
                  effectiveType === "url" ? "https://example.com" :
                  effectiveType === "email" ? "hello@example.com" :
                  effectiveType === "phone" ? "+44 7700 900000" :
                  "Paste text, a URL, email, or phone number…"
                }
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                spellCheck={false}
              />
              <div className="flex justify-between items-center">
                <span
                  className="text-xs"
                  style={{ color: isOverLimit ? "hsl(0 62% 60%)" : "hsl(36 10% 45%)", fontFamily: "var(--app-font-mono)" }}
                >
                  {charCount.toLocaleString()} / {MAX_QR_CHARS.toLocaleString()} chars
                </span>
                {isOverLimit && (
                  <span className="text-xs" style={{ color: "hsl(0 62% 60%)" }}>Content too long for a QR code</span>
                )}
              </div>
            </div>
          )}

          {/* Wi-Fi form */}
          {showWifi && (
            <div className="flex flex-col gap-3">
              <span className="kin-label">Wi-Fi Details</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs" style={{ color: "hsl(36 10% 55%)" }}>Network name (SSID)</label>
                  <input
                    className="kin-input w-full px-3 h-11 text-sm"
                    value={wifi.ssid}
                    onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })}
                    placeholder="MyNetwork"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs" style={{ color: "hsl(36 10% 55%)" }}>Password</label>
                  <input
                    className="kin-input w-full px-3 h-11 text-sm"
                    type="password"
                    value={wifi.password}
                    onChange={(e) => setWifi({ ...wifi, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs" style={{ color: "hsl(36 10% 55%)" }}>Encryption</label>
                  <select
                    className="kin-input px-3 h-11 text-sm pr-8"
                    value={wifi.encryption}
                    onChange={(e) => setWifi({ ...wifi, encryption: e.target.value as WifiEncryption })}
                    style={{ minWidth: 120 }}
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-auto" style={{ height: 44 }}>
                  <input
                    type="checkbox"
                    checked={wifi.hidden}
                    onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "hsl(35 60% 55%)" }}
                  />
                  <span className="text-sm" style={{ color: "hsl(36 20% 75%)" }}>Hidden network</span>
                </label>
              </div>
            </div>
          )}

          {/* Contact form */}
          {showContact && (
            <div className="flex flex-col gap-3">
              <span className="kin-label">Contact Details</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { key: "name", label: "Full name", placeholder: "Jane Smith" },
                  { key: "phone", label: "Phone", placeholder: "+44 7700 900000" },
                  { key: "email", label: "Email", placeholder: "jane@example.com" },
                  { key: "website", label: "Website", placeholder: "https://example.com" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-xs" style={{ color: "hsl(36 10% 55%)" }}>{label}</label>
                    <input
                      className="kin-input w-full px-3 h-11 text-sm"
                      value={contact[key as keyof ContactFields]}
                      onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* QR Preview */}
        <section className="kin-card p-5 flex flex-col items-center gap-5">
          <canvas ref={canvasRef} className="hidden" />
          {qrDataUrl ? (
            <div
              className="rounded-lg overflow-hidden"
              style={{
                padding: quietZone ? 0 : 8,
                background: bgColor,
                boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
              }}
            >
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                style={{ display: "block", width: Math.min(size, 320), height: Math.min(size, 320) }}
              />
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width: 240, height: 240, background: "hsl(30 8% 15%)", border: "1px dashed hsl(30 8% 25%)" }}
            >
              <span className="text-sm" style={{ color: "hsl(36 10% 40%)" }}>Enter content above</span>
            </div>
          )}

          {lowContrast && (
            <div className="contrast-warning w-full">
              ⚠ Low contrast — some scanners may struggle to read this code. Try darker foreground or lighter background colours.
            </div>
          )}

          {/* Export buttons */}
          {qrDataUrl && (
            <div className="flex flex-wrap gap-2 w-full justify-center">
              <button onClick={downloadPNG} className="kin-btn kin-btn-primary flex-1" style={{ minWidth: 80, maxWidth: 140 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8m0 0L4 6m3 3 3-3M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                PNG
              </button>
              <button onClick={downloadSVG} className="kin-btn kin-btn-secondary flex-1" style={{ minWidth: 80, maxWidth: 140 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8m0 0L4 6m3 3 3-3M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                SVG
              </button>
              <button onClick={copyToClipboard} className="kin-btn kin-btn-secondary flex-1" style={{ minWidth: 80, maxWidth: 140 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="5" y="1" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 4.5v7A1.5 1.5 0 0 0 2.5 13H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={print} className="kin-btn kin-btn-secondary flex-1" style={{ minWidth: 80, maxWidth: 140 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="4" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M4 4V2.5A.5.5 0 0 1 4.5 2h5a.5.5 0 0 1 .5.5V4M4 9h6M4 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Print
              </button>
            </div>
          )}
        </section>

        {/* Options */}
        <section className="kin-card p-5 flex flex-col gap-5">
          <span className="kin-label">Options</span>

          {/* Size */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-sm" style={{ color: "hsl(36 20% 75%)" }}>Size</label>
              <span className="text-xs" style={{ color: "hsl(36 10% 50%)", fontFamily: "var(--app-font-mono)" }}>{size}px</span>
            </div>
            <input
              type="range"
              className="kin-slider"
              min={128}
              max={512}
              step={16}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            />
          </div>

          {/* Error correction */}
          <div className="flex flex-col gap-2.5">
            <label className="text-sm" style={{ color: "hsl(36 20% 75%)" }}>Error correction</label>
            <div className="flex gap-2">
              {(["L", "M", "Q", "H"] as ErrorLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setErrorLevel(lvl)}
                  className={`kin-pill ${errorLevel === lvl ? "kin-pill-active" : "kin-pill-inactive"}`}
                  title={
                    lvl === "L" ? "Low — 7% recovery" :
                    lvl === "M" ? "Medium — 15% recovery" :
                    lvl === "Q" ? "Quartile — 25% recovery" :
                    "High — 30% recovery"
                  }
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "hsl(36 10% 42%)" }}>
              {errorLevel === "L" ? "Low — 7% of the code can be damaged and still scan" :
               errorLevel === "M" ? "Medium — 15% damage tolerance. Good default." :
               errorLevel === "Q" ? "Quartile — 25% damage tolerance. Good for busy environments." :
               "High — 30% damage tolerance. Best for printed labels and posters."}
            </p>
          </div>

          {/* Colour controls */}
          <div className="flex flex-col gap-3">
            <label className="text-sm" style={{ color: "hsl(36 20% 75%)" }}>Colours</label>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  className="w-9 h-9 rounded overflow-hidden"
                  style={{ border: "2px solid hsl(30 8% 25%)" }}
                >
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer"
                    style={{ transform: "translate(-4px,-4px)", border: "none", background: "none" }}
                  />
                </div>
                <span className="text-sm" style={{ color: "hsl(36 20% 75%)" }}>Foreground</span>
                <span className="text-xs" style={{ color: "hsl(36 10% 45%)", fontFamily: "var(--app-font-mono)" }}>{fgColor}</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  className="w-9 h-9 rounded overflow-hidden"
                  style={{ border: "2px solid hsl(30 8% 25%)" }}
                >
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer"
                    style={{ transform: "translate(-4px,-4px)", border: "none", background: "none" }}
                  />
                </div>
                <span className="text-sm" style={{ color: "hsl(36 20% 75%)" }}>Background</span>
                <span className="text-xs" style={{ color: "hsl(36 10% 45%)", fontFamily: "var(--app-font-mono)" }}>{bgColor}</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "hsl(36 10% 45%)" }}>Contrast ratio:</span>
              <span
                className="text-xs"
                style={{ fontFamily: "var(--app-font-mono)", color: lowContrast ? "hsl(0 62% 60%)" : "hsl(120 40% 55%)" }}
              >
                {contrast.toFixed(1)}:1
              </span>
              <span className="text-xs" style={{ color: lowContrast ? "hsl(0 62% 60%)" : "hsl(36 10% 45%)" }}>
                {lowContrast ? "— may not scan reliably" : "— good"}
              </span>
            </div>
          </div>

          {/* Quiet zone */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setQuietZone(!quietZone)}
              className="relative w-10 h-6 rounded-full transition-colors duration-200"
              style={{ background: quietZone ? "hsl(35 60% 55%)" : "hsl(30 8% 25%)", minWidth: 40 }}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
                style={{
                  background: "white",
                  left: 4,
                  transform: quietZone ? "translateX(16px)" : "translateX(0)",
                }}
              />
            </div>
            <div>
              <div className="text-sm" style={{ color: "hsl(36 20% 75%)" }}>Quiet zone</div>
              <div className="text-xs" style={{ color: "hsl(36 10% 45%)" }}>Border padding that helps scanners locate the code</div>
            </div>
          </label>
        </section>

        {/* Privacy notice */}
        <div
          className="flex gap-3 px-4 py-3 rounded-lg"
          style={{ background: "hsl(30 8% 12%)", border: "1px solid hsl(30 8% 16%)" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
            <path d="M8 1.5C8 1.5 2.5 4 2.5 8.5V12l5.5 2.5L13.5 12V8.5C13.5 4 8 1.5 8 1.5Z" stroke="hsl(35 60% 55%)" strokeWidth="1.25" strokeLinejoin="round"/>
            <path d="M5.5 8l2 2 3-3" stroke="hsl(35 60% 55%)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-xs leading-relaxed" style={{ color: "hsl(36 10% 50%)" }}>
            All QR generation happens in your browser. No data is sent, stored, or tracked. Works offline after first load.
          </p>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center pt-2">
          <span className="text-xs" style={{ color: "hsl(36 10% 35%)" }}>Kin · KIN-005</span>
          <span className="text-xs" style={{ color: "hsl(36 10% 35%)" }}>dBridge</span>
        </footer>
      </div>
    </div>
  );
}
