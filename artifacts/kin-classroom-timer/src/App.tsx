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

  const bgColour =
    phase === "green" ? "#0a1f13"
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
    background: "#1c1c1c",
    border: "1px solid #2a2a2a",
    color: "#e8e4dc",
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
        color: "#e8e4dc",
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
            background: "#2a2a2a",
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
            color: isDone ? phaseColour : "#666",
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
            <span style={{ fontSize: 13, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>
              min
            </span>
            {PRESETS.map(m => (
              <button
                key={m}
                onClick={() => handlePreset(m)}
                disabled={running}
                style={{
                  background: selectedMins === m ? phaseColour : "#1c1c1c",
                  border: `1px solid ${selectedMins === m ? phaseColour : "#2a2a2a"}`,
                  color: selectedMins === m ? "#000" : "#e8e4dc",
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
            <span style={{ fontSize: 13, color: "#555", letterSpacing: "0.08em", textTransform: "uppercase" }}>Custom</span>
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
                background: soundOn ? "#3ddc84" : "#2a2a2a",
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
          <span style={{ fontSize: 14, color: "#666" }}>Chime at end</span>
        </label>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: "fixed",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 11,
          color: "#444",
          letterSpacing: "0.1em",
          userSelect: "none",
        }}
      >
        <span>Kin</span>
        <span style={{ margin: "0 6px", color: "#333" }}>·</span>
        <span>KIN-004</span>
        <span style={{ margin: "0 6px", color: "#333" }}>·</span>
        <span>dBridge</span>
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
  );
}
