import { useEffect, useRef, useState, useCallback } from "react";

// ─── Colour Math ────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return [r, g, b];
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
  else if (max === gn) h = (bn - rn) / d + 2;
  else h = (rn - gn) / d + 4;
  return [Math.round((h / 6) * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100, ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// ─── WCAG Contrast ──────────────────────────────────────────────────────────

function relativeLuminance(r: number, g: number, b: number): number {
  const [rn, gn, bn] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rn + 0.7152 * gn + 0.0722 * bn;
}

function contrastRatio(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const l1 = relativeLuminance(r1, g1, b1);
  const l2 = relativeLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function readableTextColor(r: number, g: number, b: number): string {
  const l = relativeLuminance(r, g, b);
  return l > 0.179 ? "#1a1a1a" : "#f5f5f5";
}

// ─── Colour Naming ──────────────────────────────────────────────────────────

function nameColour(h: number, s: number, l: number): string {
  if (s < 8) {
    if (l < 12) return "Near Black";
    if (l < 30) return "Dark Grey";
    if (l < 55) return "Grey";
    if (l < 80) return "Light Grey";
    return "Near White";
  }
  if (l < 15) return "Very Dark";
  if (l > 90) return "Very Light";
  const sat = s < 30 ? "Muted " : s > 75 ? "Vivid " : "";
  const lum = l < 35 ? "Dark " : l > 65 ? "Light " : "";
  let hname = "";
  if (h < 15 || h >= 345) hname = "Red";
  else if (h < 40) hname = "Orange";
  else if (h < 65) hname = "Yellow";
  else if (h < 80) hname = "Yellow-Green";
  else if (h < 150) hname = "Green";
  else if (h < 175) hname = "Teal";
  else if (h < 210) hname = "Cyan";
  else if (h < 255) hname = "Blue";
  else if (h < 285) hname = "Indigo";
  else if (h < 315) hname = "Violet";
  else if (h < 345) hname = "Pink";
  return `${sat}${lum}${hname}`;
}

// ─── Harmony Generation ──────────────────────────────────────────────────────

function generateHarmony(
  h: number, s: number, l: number,
  type: "complementary" | "analogous" | "triadic",
  warmCool: number
): string[] {
  const wc = warmCool * 15;
  const shift = (deg: number) => ((h + deg + wc + 360) % 360);
  if (type === "complementary") {
    return [hslToHex(shift(0), s, l), hslToHex(shift(180), s, l)];
  }
  if (type === "analogous") {
    return [hslToHex(shift(-30), s, l), hslToHex(shift(0), s, l), hslToHex(shift(30), s, l)];
  }
  return [hslToHex(shift(0), s, l), hslToHex(shift(120), s, l), hslToHex(shift(240), s, l)];
}

function generateShades(h: number, s: number): string[] {
  const steps = [5, 12, 20, 30, 40, 50, 60, 70, 80, 90, 95];
  return steps.map((l) => hslToHex(h, s, l));
}

// ─── Colour Wheel Canvas ──────────────────────────────────────────────────────

function ColourWheel({
  hue, saturation, onSelect
}: {
  hue: number;
  saturation: number;
  onSelect: (h: number, s: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 220;
  const radius = size / 2 - 4;
  const cx = size / 2, cy = size / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) {
          const idx = (y * size + x) * 4;
          imageData.data[idx + 3] = 0;
          continue;
        }
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
        const sat = (dist / radius) * 100;
        const [r, g, b] = hslToRgb(angle, sat, 50);
        const idx = (y * size + x) * 4;
        imageData.data[idx] = r;
        imageData.data[idx + 1] = g;
        imageData.data[idx + 2] = b;
        imageData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  const markerAngle = (hue * Math.PI) / 180 - Math.PI;
  const markerDist = (saturation / 100) * radius;
  const markerX = cx + Math.cos(markerAngle) * markerDist;
  const markerY = cy + Math.sin(markerAngle) * markerDist;

  const handlePointer = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!(e.buttons & 1)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;
    const dx = (e.clientX - rect.left) * scaleX - cx;
    const dy = (e.clientY - rect.top) * scaleY - cy;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
    const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
    const sat = (dist / radius) * 100;
    onSelect(Math.round(angle), Math.round(sat));
  }, [onSelect, cx, cy, radius]);

  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", borderRadius: "50%", cursor: "crosshair", touchAction: "none" }}
        onPointerDown={handlePointer}
        onPointerMove={handlePointer}
      />
      <div style={{
        position: "absolute",
        left: `${(markerX / size) * 100}%`,
        top: `${(markerY / size) * 100}%`,
        width: 16, height: 16,
        borderRadius: "50%",
        border: "2.5px solid white",
        boxShadow: "0 0 0 1.5px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.3)",
        transform: "translate(-50%,-50%)",
        pointerEvents: "none",
        background: hslToHex(hue, saturation, 50),
      }} />
    </div>
  );
}

// ─── Swatch ───────────────────────────────────────────────────────────────────

function Swatch({
  hex, size = 44, onClick, locked, onToggleLock, showCopy = false, active = false
}: {
  hex: string;
  size?: number;
  onClick?: () => void;
  locked?: boolean;
  onToggleLock?: () => void;
  showCopy?: boolean;
  active?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [rgb] = useState(() => hexToRgb(hex));

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div
      title={hex}
      onClick={onClick}
      style={{
        width: size, height: size,
        background: hex,
        borderRadius: 8,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
        border: active ? "3px solid white" : "2px solid rgba(0,0,0,0.08)",
        boxShadow: active ? "0 0 0 2px rgba(0,0,0,0.25)" : "none",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: "transform 0.1s, box-shadow 0.1s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "scale(1)"; }}
    >
      {showCopy && (
        <button
          onClick={copy}
          title="Copy hex"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, color: readableTextColor(rgb[0], rgb[1], rgb[2]),
            opacity: 0, transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.08)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0"; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          {copied ? "✓" : "copy"}
        </button>
      )}
      {onToggleLock && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
          title={locked ? "Unlock" : "Lock"}
          style={{
            position: "absolute", bottom: 3, right: 3,
            background: "rgba(0,0,0,0.35)", border: "none",
            borderRadius: 4, width: 16, height: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, color: "white", lineHeight: 1,
          }}
        >
          {locked ? "🔒" : "○"}
        </button>
      )}
    </div>
  );
}

// ─── Copy Format Panel ────────────────────────────────────────────────────────

function CopyButton({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
      style={{
        background: copied ? "#2d6a4f" : "rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 6,
        padding: "6px 10px",
        fontSize: 11,
        fontFamily: "inherit",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "flex-start",
        transition: "background 0.2s",
        color: copied ? "white" : "inherit",
        minWidth: 80,
      }}
    >
      <span style={{ opacity: 0.5, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontFamily: "monospace", fontSize: 10, wordBreak: "break-all" }}>
        {copied ? "Copied!" : value}
      </span>
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

interface HistoryEntry {
  hex: string;
  h: number;
  s: number;
  l: number;
}

export default function App() {
  const [hue, setHue] = useState(220);
  const [sat, setSat] = useState(70);
  const [lit, setLit] = useState(50);
  const [harmonyType, setHarmonyType] = useState<"complementary" | "analogous" | "triadic">("analogous");
  const [warmCool, setWarmCool] = useState(0);
  const [rotateOffset, setRotateOffset] = useState(0);
  const [lockedIndices, setLockedIndices] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hexInput, setHexInput] = useState("");
  const [rgbInput, setRgbInput] = useState("");
  const [hslInput, setHslInput] = useState("");
  const [copyFeedback, setCopyFeedback] = useState("");
  const [paletteExport, setPaletteExport] = useState("");
  const [showPaletteExport, setShowPaletteExport] = useState(false);
  const [eyedropperSupported] = useState(() => "EyeDropper" in window);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("kin004-theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("kin004-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const sectionStyle: React.CSSProperties = {
    marginTop: 28,
    paddingTop: 20,
    borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
    borderRadius: 7,
    fontSize: 12,
    fontFamily: "monospace",
    background: isDark ? "#2a2520" : "white",
    color: isDark ? "#e8e4dc" : "#2a2520",
    outline: "none",
    boxSizing: "border-box",
  };

  const activeHex = hslToHex(hue, sat, lit);
  const [ar, ag, ab] = hexToRgb(activeHex);
  const textColor = readableTextColor(ar, ag, ab);
  const contrastWhite = contrastRatio(ar, ag, ab, 255, 255, 255);
  const contrastBlack = contrastRatio(ar, ag, ab, 0, 0, 0);
  const bestContrast = Math.max(contrastWhite, contrastBlack);
  const colourName = nameColour(hue, sat, lit);

  const palette = generateHarmony((hue + rotateOffset) % 360, sat, lit, harmonyType, warmCool);
  const shades = generateShades(hue, sat);

  // Sync inputs
  useEffect(() => {
    setHexInput(activeHex);
    setRgbInput(`${ar}, ${ag}, ${ab}`);
    setHslInput(`${hue}, ${sat}%, ${lit}%`);
  }, [activeHex, ar, ag, ab, hue, sat, lit]);

  // URL hash loading
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && /^[0-9a-fA-F]{6}(-[0-9a-fA-F]{6})*$/.test(hash)) {
      try {
        const first = "#" + hash.split("-")[0];
        const [r, g, b] = hexToRgb(first);
        const [h, s, l] = rgbToHsl(r, g, b);
        setHue(h); setSat(s); setLit(l);
      } catch {}
    }
  }, []);

  // Spacebar shuffle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        shufflePalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lockedIndices, palette]);

  const setColour = useCallback((h: number, s: number, l: number) => {
    setHue(clamp(h, 0, 359));
    setSat(clamp(s, 0, 100));
    setLit(clamp(l, 0, 100));
    setHistory((prev) => {
      const hex = hslToHex(h, s, l);
      if (prev[0]?.hex === hex) return prev;
      return [{ hex, h, s, l }, ...prev].slice(0, 10);
    });
  }, []);

  const setFromHex = (hex: string) => {
    try {
      const [r, g, b] = hexToRgb(hex);
      const [h, s, l] = rgbToHsl(r, g, b);
      setColour(h, s, l);
    } catch {}
  };

  const shufflePalette = () => {
    palette.forEach((_, i) => {
      if (!lockedIndices.has(i)) {
        const newH = Math.round(Math.random() * 360);
        if (i === 0) setHue(newH);
      }
    });
    setRotateOffset(Math.round(Math.random() * 360));
  };

  const exportPalette = () => {
    const str = palette.map((h) => h.replace("#", "")).join("-");
    window.location.hash = str;
    setPaletteExport(palette.join("-"));
    setShowPaletteExport(true);
    navigator.clipboard.writeText(palette.join("-"));
    setCopyFeedback("Palette copied & URL updated!");
    setTimeout(() => { setCopyFeedback(""); setShowPaletteExport(false); }, 2500);
  };

  const pickFromScreen = async () => {
    try {
      const dropper = new (window as any).EyeDropper();
      const { sRGBHex } = await dropper.open();
      setFromHex(sRGBHex);
    } catch {}
  };

  const toggleLock = (i: number) => {
    setLockedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const randomColour = () => {
    const h = Math.round(Math.random() * 360);
    const s = 40 + Math.round(Math.random() * 50);
    const l = 35 + Math.round(Math.random() * 35);
    setColour(h, s, l);
  };

  // CSS variable name
  const cssVarName = `--color-${colourName.toLowerCase().replace(/\s+/g, "-")}`;

  const passAA = bestContrast >= 4.5;
  const passAAA = bestContrast >= 7;
  const passAALarge = bestContrast >= 3;

  return (
    <div style={{
      fontFamily: "'Georgia', 'Palatino Linotype', serif",
      maxWidth: 480,
      margin: "0 auto",
      padding: "0 0 48px",
      background: isDark ? "#1a1714" : "#faf9f7",
      minHeight: "100vh",
      color: isDark ? "#e8e4dc" : "#2a2520",
    }}>
      <button
        onClick={() => setIsDark(d => !d)}
        aria-label="Toggle light/dark mode"
        style={{
          position: "fixed", top: 14, right: 14, zIndex: 999,
          width: 36, height: 36, borderRadius: 8,
          background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"}`,
          cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isDark ? "#e8e4dc" : "#2a2520",
        }}
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      {/* ── Large Colour Preview ─────────────────────────────────────── */}
      <div style={{
        background: activeHex,
        padding: "36px 24px 28px",
        position: "relative",
      }}>
        <div style={{ color: textColor }}>
          <div style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.65,
            marginBottom: 4,
          }}>Active Colour</div>
          <div style={{ fontSize: 28, fontWeight: "normal", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
            {colourName}
          </div>
          <div style={{ fontSize: 14, marginTop: 8, fontFamily: "monospace", opacity: 0.8 }}>
            {activeHex.toUpperCase()}
          </div>
        </div>

        {/* Visual helpers row */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <div style={{
            flex: 1, borderRadius: 8, padding: "8px 12px",
            background: activeHex, border: "1.5px solid rgba(255,255,255,0.25)",
            fontSize: 12, color: textColor,
          }}>
            <div style={{ opacity: 0.55, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em" }}>Text preview</div>
            <div>True To The Craft</div>
          </div>
          <div style={{
            flex: 1, borderRadius: 8, padding: "8px 12px",
            background: textColor === "#1a1a1a" ? "#f5f5f5" : "#1a1a1a",
            fontSize: 12,
            color: activeHex,
          }}>
            <div style={{ opacity: 0.55, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em" }}>On background</div>
            <div>True To The Craft</div>
          </div>
        </div>

        {/* Gradient bar */}
        <div style={{
          height: 6,
          marginTop: 16,
          borderRadius: 3,
          background: `linear-gradient(to right, ${palette.join(", ")})`,
        }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <button onClick={randomColour} style={btnStyle("#fff", "rgba(0,0,0,0.15)", textColor === "#f5f5f5" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)")}>
            ✦ Random
          </button>
          {eyedropperSupported && (
            <button onClick={pickFromScreen} style={btnStyle("#fff", "rgba(0,0,0,0.15)", textColor === "#f5f5f5" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)")}>
              ⊙ Eyedropper
            </button>
          )}
          <button onClick={exportPalette} style={btnStyle("#fff", "rgba(0,0,0,0.15)", textColor === "#f5f5f5" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)")}>
            ↑ Export Palette
          </button>
        </div>
        {copyFeedback && (
          <div style={{ color: textColor, opacity: 0.7, fontSize: 11, marginTop: 8 }}>{copyFeedback}</div>
        )}
        {showPaletteExport && (
          <div style={{
            marginTop: 8, fontFamily: "monospace", fontSize: 11,
            color: textColor, opacity: 0.7, wordBreak: "break-all",
          }}>{paletteExport}</div>
        )}
      </div>

      <div style={{ padding: "0 20px" }}>

        {/* ── HEX / RGB / HSL Inputs ─────────────────────────────────── */}
        <section style={sectionStyle}>
          <div style={labelStyle}>Colour Values</div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={fieldLabel}>HEX</div>
              <input
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onBlur={() => setFromHex(hexInput)}
                onKeyDown={(e) => e.key === "Enter" && setFromHex(hexInput)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={fieldLabel}>RGB</div>
              <input
                value={rgbInput}
                onChange={(e) => setRgbInput(e.target.value)}
                onBlur={() => {
                  try {
                    const parts = rgbInput.split(",").map(s => parseInt(s.trim()));
                    if (parts.length === 3) {
                      const [h, s, l] = rgbToHsl(parts[0], parts[1], parts[2]);
                      setColour(h, s, l);
                    }
                  } catch {}
                }}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div style={fieldLabel}>HSL</div>
              <input
                value={hslInput}
                onChange={(e) => setHslInput(e.target.value)}
                onBlur={() => {
                  try {
                    const parts = hslInput.replace(/%/g, "").split(",").map(s => parseFloat(s.trim()));
                    if (parts.length === 3) setColour(parts[0], parts[1], parts[2]);
                  } catch {}
                }}
                style={inputStyle}
              />
            </div>
          </div>
        </section>

        {/* ── Colour Wheel ──────────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <div style={labelStyle}>Colour Wheel</div>
          <ColourWheel
            hue={hue}
            saturation={sat}
            onSelect={(h, s) => setColour(h, s, lit)}
          />
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", ...fieldLabel }}>
                <span>Lightness</span><span style={{ fontFamily: "monospace" }}>{lit}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={lit}
                onChange={(e) => setColour(hue, sat, Number(e.target.value))}
                style={sliderStyle}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", ...fieldLabel }}>
                <span>Saturation</span><span style={{ fontFamily: "monospace" }}>{sat}%</span>
              </div>
              <input
                type="range" min={0} max={100} value={sat}
                onChange={(e) => setColour(hue, Number(e.target.value), lit)}
                style={sliderStyle}
              />
            </div>
          </div>
        </section>

        {/* ── Palette ────────────────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={labelStyle}>Harmony Palette</div>
            <button onClick={shufflePalette} style={_smallBtnStyle} title="Shuffle (Spacebar)">
              ⟳ Shuffle
            </button>
          </div>

          {/* Harmony type */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {(["complementary", "analogous", "triadic"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setHarmonyType(t)}
                style={{
                  flex: 1, padding: "6px 4px", borderRadius: 6, fontSize: 10,
                  textTransform: "capitalize", letterSpacing: "0.04em",
                  border: harmonyType === t ? "1.5px solid #2a2520" : "1.5px solid rgba(0,0,0,0.12)",
                  background: harmonyType === t ? "#2a2520" : "transparent",
                  color: harmonyType === t ? "#faf9f7" : "#2a2520",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >{t}</button>
            ))}
          </div>

          {/* Swatches */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {palette.map((hex, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Swatch
                  hex={hex}
                  size={60}
                  onClick={() => setFromHex(hex)}
                  locked={lockedIndices.has(i)}
                  onToggleLock={() => toggleLock(i)}
                  showCopy
                  active={hex.toLowerCase() === activeHex.toLowerCase()}
                />
                <div style={{ fontSize: 9, fontFamily: "monospace", color: "#666" }}>{hex}</div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", ...fieldLabel }}>
                <span>Rotate Hue</span>
                <span style={{ fontFamily: "monospace" }}>{rotateOffset}°</span>
              </div>
              <input
                type="range" min={0} max={359} value={rotateOffset}
                onChange={(e) => setRotateOffset(Number(e.target.value))}
                style={sliderStyle}
              />
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", ...fieldLabel }}>
                <span>Cool</span>
                <span style={{ fontFamily: "monospace" }}>{warmCool > 0 ? `+${warmCool} warm` : warmCool < 0 ? `${warmCool} cool` : "neutral"}</span>
                <span>Warm</span>
              </div>
              <input
                type="range" min={-3} max={3} step={1} value={warmCool}
                onChange={(e) => setWarmCool(Number(e.target.value))}
                style={sliderStyle}
              />
            </div>
          </div>
        </section>

        {/* ── Shades & Tints ───────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <div style={labelStyle}>Shades & Tints</div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {shades.map((hex, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <Swatch
                  hex={hex}
                  size={38}
                  onClick={() => setFromHex(hex)}
                  showCopy
                  active={hex.toLowerCase() === activeHex.toLowerCase()}
                />
                <div style={{ fontSize: 8, fontFamily: "monospace", color: "#888" }}>
                  {[5, 12, 20, 30, 40, 50, 60, 70, 80, 90, 95][i]}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Accessibility ──────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <div style={labelStyle}>Accessibility (WCAG)</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{
              flex: 1, borderRadius: 8, padding: "10px 12px",
              background: activeHex, color: "#fff",
            }}>
              <div style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>White text</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>Sample text on colour</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, marginTop: 4, opacity: 0.8 }}>
                {contrastWhite.toFixed(2)}:1
              </div>
            </div>
            <div style={{
              flex: 1, borderRadius: 8, padding: "10px 12px",
              background: activeHex, color: "#000",
            }}>
              <div style={{ fontSize: 9, opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Black text</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>Sample text on colour</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, marginTop: 4, opacity: 0.8 }}>
                {contrastBlack.toFixed(2)}:1
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "AA Normal", pass: passAA, threshold: "4.5:1" },
              { label: "AAA Normal", pass: passAAA, threshold: "7:1" },
              { label: "AA Large", pass: passAALarge, threshold: "3:1" },
            ].map(({ label, pass, threshold }) => (
              <div key={label} style={{
                borderRadius: 6, padding: "6px 10px",
                background: pass ? "rgba(45, 106, 79, 0.12)" : "rgba(180, 60, 60, 0.08)",
                border: `1px solid ${pass ? "rgba(45, 106, 79, 0.25)" : "rgba(180, 60, 60, 0.2)"}`,
                fontSize: 11,
              }}>
                <span style={{ fontWeight: "bold", color: pass ? "#2d6a4f" : "#b43c3c" }}>
                  {pass ? "✓" : "✗"} {label}
                </span>
                <span style={{ marginLeft: 6, opacity: 0.55, fontSize: 9 }}>&gt;{threshold}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.55 }}>
            Best contrast: {bestContrast.toFixed(2)}:1 (with {contrastWhite > contrastBlack ? "white" : "black"} text)
          </div>
        </section>

        {/* ── Copy / Export ──────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <div style={labelStyle}>Copy Colour</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <CopyButton label="HEX" value={activeHex.toUpperCase()} />
            <CopyButton label="RGB" value={`rgb(${ar}, ${ag}, ${ab})`} />
            <CopyButton label="HSL" value={`hsl(${hue}, ${sat}%, ${lit}%)`} />
            <CopyButton label="RGBA" value={`rgba(${ar}, ${ag}, ${ab}, 1)`} />
            <CopyButton label="HSLA" value={`hsla(${hue}, ${sat}%, ${lit}%, 1)`} />
            <CopyButton label="CSS Var" value={`${cssVarName}: ${activeHex};`} />
          </div>
        </section>

        {/* ── Session History ─────────────────────────────────────── */}
        {history.length > 0 && (
          <section style={sectionStyle}>
            <div style={labelStyle}>Recent Colours</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {history.map((entry, i) => (
                <Swatch
                  key={i}
                  hex={entry.hex}
                  size={36}
                  onClick={() => setColour(entry.h, entry.s, entry.l)}
                  showCopy
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{
        textAlign: "center",
        padding: "32px 20px 16px",
        fontSize: 10,
        letterSpacing: "0.08em",
        color: "#999",
        textTransform: "uppercase",
      }}>
        <span>Kin</span>
        <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
        <span>KIN-004</span>
        <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
        <span style={{ textTransform: "none" }}>dBridge</span>
      </footer>
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#888",
  marginBottom: 12,
};

const fieldLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.06em",
  color: "#999",
  marginBottom: 4,
  textTransform: "uppercase",
};

const sliderStyle: React.CSSProperties = {
  width: "100%",
  height: 4,
  borderRadius: 2,
  cursor: "pointer",
  accentColor: "#2a2520",
};

function btnStyle(bg: string, border: string, _bg2: string): React.CSSProperties {
  return {
    background: "rgba(0,0,0,0.18)",
    border: `1px solid ${border}`,
    borderRadius: 6,
    padding: "7px 12px",
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "inherit",
    backdropFilter: "blur(4px)",
    letterSpacing: "0.04em",
  };
}

const _smallBtnStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid rgba(0,0,0,0.15)",
  borderRadius: 6,
  padding: "5px 10px",
  fontSize: 10,
  cursor: "pointer",
  fontFamily: "inherit",
  letterSpacing: "0.04em",
  color: "#555",
};
