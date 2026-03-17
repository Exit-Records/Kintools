import { useState, useEffect, useRef, useCallback } from "react";

const PRESETS = [1, 2, 3, 5, 10, 15, 20, 30];

type Phase = "green" | "amber" | "red" | "done" | "idle";

function getPhase(remaining: number, total: number): Phase {
  if (total === 0) return "idle";
  if (remaining <= 0) return "done";
  const pct = remaining / total;
  if (pct > 0.5) return "green";
  if (pct > 0.2) return "amber";
  return "red";
}

function formatTime(secs: number): string {
  const s = Math.max(0, secs);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

async function playChime(ctx: AudioContext) {
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  const notes = [523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.32);
    const t = ctx.currentTime + i * 0.32;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.38, t + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);
    osc.start(t);
    osc.stop(t + 1.4);
  });
}

export default function App() {
  const [selectedMins, setSelectedMins] = useState(5);
  const [customMins, setCustomMins] = useState("");
  const [customSecs, setCustomSecs] = useState("");
  const [totalSecs, setTotalSecs] = useState(5 * 60);
  const [remaining, setRemaining] = useState(5 * 60);
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [chimeFired, setChimeFired] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const [bugSuccess, setBugSuccess] = useState(false);
  const [isLight, setIsLight] = useState(() => {
    const saved = localStorage.getItem("kin006-theme");
    return saved === "light";
  });

  useEffect(() => {
    localStorage.setItem("kin006-theme", isLight ? "light" : "dark");
  }, [isLight]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const phase = getPhase(remaining, totalSecs);

  const getAudioCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }, []);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          stop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, stop]);

  useEffect(() => {
    if (remaining === 0 && !chimeFired && soundOn) {
      setChimeFired(true);
      playChime(getAudioCtx()).catch(() => {});
    }
  }, [remaining, chimeFired, soundOn, getAudioCtx]);

  const applyDurationSecs = useCallback((secs: number) => {
    stop();
    const clamped = Math.max(1, Math.min(5940, secs));
    setTotalSecs(clamped);
    setRemaining(clamped);
    setChimeFired(false);
  }, [stop]);

  const handlePreset = (mins: number) => {
    setSelectedMins(mins);
    setCustomMins("");
    setCustomSecs("");
    applyDurationSecs(mins * 60);
  };

  const handleCustomChange = (mins: string, secs: string) => {
    const m = parseInt(mins, 10) || 0;
    const s = parseInt(secs, 10) || 0;
    const total = m * 60 + s;
    if (total >= 1) {
      setSelectedMins(-1);
      applyDurationSecs(total);
    }
  };

  const handleCustomMins = (val: string) => {
    setCustomMins(val);
    setSelectedMins(-1);
    handleCustomChange(val, customSecs);
  };

  const handleCustomSecs = (val: string) => {
    const clamped = val === "" ? "" : String(Math.min(59, Math.max(0, parseInt(val, 10) || 0)));
    setCustomSecs(clamped);
    setSelectedMins(-1);
    handleCustomChange(customMins, clamped);
  };

  const handleStart = () => {
    if (running || remaining <= 0) return;
    const ctx = getAudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    setChimeFired(false);
    setRunning(true);
  };

  const handlePause = () => stop();

  const handleReset = () => {
    stop();
    setRemaining(totalSecs);
    setChimeFired(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (running) handlePause();
        else handleStart();
      } else if (e.code === "KeyR") {
        handleReset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const progress = totalSecs > 0 ? (remaining / totalSecs) * 100 : 0;
  const isDone = phase === "done";
  const isPaused = !running && remaining < totalSecs && !isDone;

  const phaseColour =
    phase === "green" ? "#3ddc84"
    : phase === "amber" ? "#f0a500"
    : phase === "red"   ? "#e8402a"
    : phase === "done"  ? "#e8402a"
    : "#888888";

  const bgColour = isLight
    ? phase === "green" ? "#e8f5ee"
      : phase === "amber" ? "#fff8e4"
      : phase === "red"   ? "#fde8e4"
      : phase === "done"  ? "#fde8e4"
      : "#f5f5f0"
    : phase === "green" ? "#0a1f13"
      : phase === "amber" ? "#1f1500"
      : phase === "red"   ? "#1f0a07"
      : phase === "done"  ? "#0d0605"
      : "#111111";

  const statusText =
    isDone    ? "Time's up"
    : running  ? "Running"
    : isPaused ? "Paused"
    : "Ready";

  const inputStyle: React.CSSProperties = {
    background: isLight ? "#e8e8e8" : "#1c1c1c",
    border: `1px solid ${isLight ? "#cccccc" : "#2a2a2a"}`,
    color: isLight ? "#1a1a1a" : "#e8e4dc",
    borderRadius: 8,
    fontSize: 15,
    fontFamily: "inherit",
    width: 64,
    height: 48,
    textAlign: "center",
    padding: "0 8px",
    outline: "none",
    opacity: running ? 0.4 : 1,
    MozAppearance: "textfield",
  };

  return (
    <>
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: bgColour,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 1.2s ease",
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: isLight ? "#1a1a1a" : "#e8e4dc",
        userSelect: "none",
        WebkitUserSelect: "none",
        padding: "32px 24px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(20px, 3.5vh, 44px)",
          width: "100%",
          maxWidth: 900,
        }}
      >
        {/* Timer display */}
        <div
          role="timer"
          aria-live="off"
          style={{
            fontSize: "clamp(96px, 22vw, 260px)",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
            color: phaseColour,
            transition: "color 1.2s ease",
            animation: isDone ? "pulseDone 1.2s ease-in-out infinite" : "none",
          }}
        >
          {formatTime(remaining)}
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            maxWidth: 640,
            height: 6,
            background: isLight ? "#d0d0d0" : "#2a2a2a",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: isDone ? "0%" : `${progress}%`,
              background: isDone ? "#e8402a" : phaseColour,
              borderRadius: 99,
              transition: "width 0.5s linear, background 1.2s ease",
            }}
          />
        </div>

        {/* Status */}
        <div
          style={{
            fontSize: 13,
            color: isDone ? phaseColour : (isLight ? "#555" : "#666"),
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            height: 20,
            transition: "color 0.4s",
            animation: isDone ? "pulseDone 1.2s ease-in-out infinite" : "none",
          }}
        >
          {statusText}
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width: "100%",
            maxWidth: 680,
          }}
        >
          {/* Preset buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 13, color: isLight ? "#777" : "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>
              min
            </span>
            {PRESETS.map(m => (
              <button
                key={m}
                onClick={() => handlePreset(m)}
                disabled={running}
                style={{
                  background: selectedMins === m ? phaseColour : (isLight ? "#e0e0e0" : "#1c1c1c"),
                  border: `1px solid ${selectedMins === m ? phaseColour : (isLight ? "#cccccc" : "#2a2a2a")}`,
                  color: selectedMins === m ? "#000" : (isLight ? "#1a1a1a" : "#e8e4dc"),
                  borderRadius: 8,
                  fontSize: 15,
                  fontFamily: "inherit",
                  fontWeight: selectedMins === m ? 700 : 400,
                  width: 52,
                  height: 48,
                  cursor: running ? "not-allowed" : "pointer",
                  opacity: running ? 0.4 : 1,
                  transition: "background 0.15s, border-color 0.15s, color 0.15s",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Custom min + sec inputs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: isLight ? "#777" : "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>Custom</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <input
                type="number"
                min={0}
                max={99}
                value={customMins}
                onChange={e => handleCustomMins(e.target.value)}
                placeholder="0"
                disabled={running}
                aria-label="Custom minutes"
                style={inputStyle}
              />
              <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>min</span>
            </div>
            <span style={{ fontSize: 22, color: "#444", fontWeight: 700, lineHeight: 1, marginBottom: 16 }}>:</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <input
                type="number"
                min={0}
                max={59}
                value={customSecs}
                onChange={e => handleCustomSecs(e.target.value)}
                placeholder="00"
                disabled={running}
                aria-label="Custom seconds"
                style={inputStyle}
              />
              <span style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>sec</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={handleStart}
            disabled={running || isDone}
            style={{
              background: phaseColour,
              border: "none",
              color: "#000",
              borderRadius: 12,
              fontSize: 16,
              fontFamily: "inherit",
              fontWeight: 600,
              height: 52,
              padding: "0 36px",
              cursor: running || isDone ? "not-allowed" : "pointer",
              opacity: running || isDone ? 0.35 : 1,
              transition: "opacity 0.15s, transform 0.1s",
              letterSpacing: "0.02em",
            }}
          >
            {isPaused ? "Resume" : "Start"}
          </button>

          <button
            onClick={handlePause}
            disabled={!running}
            style={{
              background: "#1c1c1c",
              border: "1px solid #2a2a2a",
              color: "#e8e4dc",
              borderRadius: 12,
              fontSize: 16,
              fontFamily: "inherit",
              fontWeight: 600,
              height: 52,
              padding: "0 28px",
              cursor: !running ? "not-allowed" : "pointer",
              opacity: !running ? 0.35 : 1,
              transition: "opacity 0.15s",
              letterSpacing: "0.02em",
            }}
          >
            Pause
          </button>

          <button
            onClick={handleReset}
            style={{
              background: "#1c1c1c",
              border: "1px solid #2a2a2a",
              color: "#e8e4dc",
              borderRadius: 12,
              fontSize: 16,
              fontFamily: "inherit",
              fontWeight: 600,
              height: 52,
              padding: "0 28px",
              cursor: "pointer",
              transition: "opacity 0.15s",
              letterSpacing: "0.02em",
            }}
          >
            Reset
          </button>
        </div>

        {/* Sound toggle */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            gap: 10,
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
              width: 40,
              height: 24,
              flexShrink: 0,
            }}
          >
            <input
              type="checkbox"
              checked={soundOn}
              onChange={e => setSoundOn(e.target.checked)}
              style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                inset: 0,
                background: soundOn ? "#3ddc84" : (isLight ? "#d0d0d0" : "#2a2a2a"),
                borderRadius: 99,
                transition: "background 0.2s",
              }}
            />
            <span
              style={{
                position: "absolute",
                top: 3,
                left: soundOn ? 19 : 3,
                width: 18,
                height: 18,
                background: soundOn ? "#000" : "#666",
                borderRadius: "50%",
                transition: "left 0.2s, background 0.2s",
              }}
            />
          </span>
          <span style={{ fontSize: 14, color: isLight ? "#666" : "#888" }}>Chime at end</span>
        </label>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setIsLight(l => !l)}
        aria-label="Toggle light/dark mode"
        style={{
          position: "fixed", top: 14, right: 14, zIndex: 999,
          width: 36, height: 36, borderRadius: 8,
          background: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)"}`,
          cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isLight ? "#1a1a1a" : "#e8e4dc",
        }}
      >
        {isLight ? "🌙" : "☀️"}
      </button>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "20px", fontSize: 12, color: isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.35)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, background: "rgba(46,160,67,0.1)", border: "1px solid rgba(46,160,67,0.25)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#2ea043" }}>
            <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 0.5L0.5 2.25V5.25C0.5 7.75 2.25 10.05 4.5 10.5C6.75 10.05 8.5 7.75 8.5 5.25V2.25L4.5 0.5Z" fill="#2ea043" fillOpacity="0.15" stroke="#2ea043" strokeWidth="0.75"/><path d="M2.5 5.5L3.75 6.75L6.5 4" stroke="#2ea043" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Local Only · Verified
          </span>
        </div>
        <div>
          <button onClick={() => { setBugOpen(true); setBugSuccess(false); }} style={{ background: "none", border: "none", padding: 0, color: "inherit", font: "inherit", opacity: 0.4, fontSize: 11, cursor: "pointer", letterSpacing: "0.04em", textDecoration: "underline", textUnderlineOffset: 3 }}>Report a bug</button>
        </div>
        <div style={{ marginTop: 8, opacity: 0.5, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Kin · KIN-006 · dBridge</div>
      </footer>

      <style>{`
        @keyframes pulseDone {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        button:active:not(:disabled) { transform: scale(0.97); }
      `}</style>
    </div>

    {/* Bug report backdrop */}
    {bugOpen && (
      <div onClick={() => setBugOpen(false)} style={{ display: "block", position: "fixed", inset: 0, zIndex: 901, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }} />
    )}

    {/* Bug report sheet */}
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 902, background: "#17171f", borderRadius: "20px 20px 0 0", border: "1px solid rgba(255,255,255,0.08)", borderBottom: "none", padding: "0 20px 40px", boxShadow: "0 -8px 40px rgba(0,0,0,0.6)", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", transform: bugOpen ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s cubic-bezier(0.32,0.72,0,1)" }}>
      {!bugSuccess ? (
        <>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} /></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 8px" }}>
            <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 600, margin: 0 }}>Report a bug</h2>
            <button onClick={() => setBugOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 22, cursor: "pointer", padding: "0 4px", lineHeight: 1, flex: "none", minHeight: 0 }}>×</button>
          </div>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            await fetch("https://script.google.com/macros/s/AKfycbxBRGfOmtQUxyaBGjYVj2mtKinI7qlGm1v921K49TiBDP5RUY9CWK_M-vpLCm2HWJxhuA/exec", { method: "POST", body: fd });
            setBugSuccess(true);
          }} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input type="hidden" name="tool" value="KIN-006 Classroom Timer" />
            <textarea name="description" required placeholder="What went wrong? What did you expect?" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none", resize: "none", height: 90 }} />
            <input type="email" name="email" placeholder="Email for follow-up (optional)" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }} />
            <button type="submit" style={{ width: "100%", padding: 13, borderRadius: 12, background: "#5b5ef4", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.02em" }}>Send report</button>
          </form>
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}><div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} /></div>
          <div style={{ textAlign: "center", padding: "28px 0 8px" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ display: "block", margin: "0 auto 16px" }}><circle cx="12" cy="12" r="11" stroke="#2ea043" strokeWidth="1.5"/><path d="M7 12.5l3.5 3.5L17 9" stroke="#2ea043" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>Thanks for the report</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.5, margin: "0 0 28px" }}>We'll take a look. Your feedback<br/>helps make Kin better for everyone.</p>
            <button onClick={() => setBugOpen(false)} style={{ padding: "11px 32px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Done</button>
          </div>
        </>
      )}
    </div>
    </>
  );
}
