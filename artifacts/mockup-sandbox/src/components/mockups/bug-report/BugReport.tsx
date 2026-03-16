import { useState } from "react";
import { Bug, X, ChevronDown, CheckCircle2 } from "lucide-react";

const APP_NAME = "KIN-007 — Ambient Mixer";

type Step = "idle" | "open" | "success";
type ReportType = "bug" | "suggestion" | "other";

export function BugReport() {
  const [step, setStep] = useState<Step>("idle");
  const [type, setType] = useState<ReportType>("bug");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("success");
  }

  function handleClose() {
    setStep("idle");
    setDescription("");
    setName("");
    setEmail("");
    setType("bug");
    setAnonymous(true);
  }

  return (
    <div
      style={{
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#0c0c12",
        width: 390,
        height: 720,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Simulated Ambient Mixer app content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px 0" }}>
        <div style={{ color: "#ffffff", fontSize: 13, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.4, marginBottom: 8 }}>
          Ambient Mixer
        </div>
        <div style={{ color: "#ffffff", fontSize: 11, letterSpacing: "0.08em", opacity: 0.25, marginBottom: 36 }}>
          KIN-007
        </div>

        {/* Sound pads */}
        {[
          { label: "Rain", icon: "🌧", vol: 0.6, active: true },
          { label: "Café", icon: "☕", vol: 0.35, active: true },
          { label: "Wind", icon: "🌬", vol: 0.15, active: false },
          { label: "Night", icon: "🦗", vol: 0, active: false },
        ].map((s) => (
          <div key={s.label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: s.active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${s.active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              flexShrink: 0
            }}>
              {s.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 13, opacity: s.active ? 0.85 : 0.35, marginBottom: 6 }}>{s.label}</div>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.08)", position: "relative" }}>
                <div style={{ height: "100%", width: `${s.vol * 100}%`, borderRadius: 99, background: s.active ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.08)" }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Local Only badge */}
      <div style={{ padding: "12px 20px 20px", textAlign: "center" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px",
          borderRadius: 20, background: "rgba(46,160,67,0.1)", border: "1px solid rgba(46,160,67,0.25)",
          fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#2ea043"
        }}>
          <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
            <path d="M4.5 0.5L0.5 2.25V5.25C0.5 7.75 2.25 10.05 4.5 10.5C6.75 10.05 8.5 7.75 8.5 5.25V2.25L4.5 0.5Z" fill="#2ea043" fillOpacity="0.15" stroke="#2ea043" strokeWidth="0.75" />
            <path d="M2.5 5.5L3.75 6.75L6.5 4" stroke="#2ea043" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Local Only · Verified
        </span>
      </div>

      {/* Bug icon button — always visible, bottom right */}
      <button
        onClick={() => step === "idle" && setStep("open")}
        style={{
          position: "absolute", bottom: 56, right: 16,
          width: 38, height: 38, borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "rgba(255,255,255,0.45)",
          transition: "all 0.15s ease",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
          outline: "none",
        }}
        title="Report an issue"
      >
        <Bug size={16} />
      </button>

      {/* Backdrop */}
      {step !== "idle" && (
        <div
          onClick={step === "open" ? handleClose : undefined}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
            transition: "opacity 0.25s",
          }}
        />
      )}

      {/* Bottom sheet */}
      {step === "open" && (
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "#17171f",
            borderRadius: "20px 20px 0 0",
            border: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "none",
            padding: "0 20px 32px",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Drag handle */}
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
          </div>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, marginTop: 8 }}>
            <div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Report an issue</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2, letterSpacing: "0.04em" }}>{APP_NAME}</div>
            </div>
            <button
              onClick={handleClose}
              style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)" }}
            >
              <X size={15} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Type selector */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 7 }}>
                Type
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ReportType)}
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "10px 36px 10px 12px", color: "#fff", fontSize: 13,
                    appearance: "none", cursor: "pointer", outline: "none",
                  }}
                >
                  <option value="bug" style={{ background: "#17171f" }}>🐛 Bug — something isn't working</option>
                  <option value="suggestion" style={{ background: "#17171f" }}>💡 Suggestion — an idea or request</option>
                  <option value="other" style={{ background: "#17171f" }}>💬 Other</option>
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 7 }}>
                What happened?
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue or idea…"
                rows={3}
                required
                style={{
                  width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13,
                  resize: "none", outline: "none", boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Anonymous toggle */}
            <div style={{ marginBottom: anonymous ? 20 : 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ color: "#fff", fontSize: 13 }}>Send anonymously</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>No name or email needed</div>
              </div>
              <button
                type="button"
                onClick={() => setAnonymous(!anonymous)}
                style={{
                  width: 44, height: 26, borderRadius: 99,
                  background: anonymous ? "#5b5ef4" : "rgba(255,255,255,0.1)",
                  border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
                  flexShrink: 0,
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 3, transition: "left 0.2s",
                  left: anonymous ? "calc(100% - 23px)" : 3,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }} />
              </button>
            </div>

            {/* Name + email (when not anonymous) */}
            {!anonymous && (
              <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none",
                    fontFamily: "inherit",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for follow-up (optional)"
                  style={{
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none",
                    fontFamily: "inherit",
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%", padding: "13px", borderRadius: 12,
                background: "#5b5ef4", border: "none", color: "#fff",
                fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em",
                fontFamily: "inherit",
              }}
            >
              Send report
            </button>
          </form>
        </div>
      )}

      {/* Success sheet */}
      {step === "success" && (
        <div
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "#17171f",
            borderRadius: "20px 20px 0 0",
            border: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "none",
            padding: "0 20px 40px",
            textAlign: "center",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
            <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.15)" }} />
          </div>
          <div style={{ padding: "28px 0 8px" }}>
            <CheckCircle2 size={40} color="#2ea043" style={{ margin: "0 auto 16px" }} />
            <div style={{ color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>Thanks for the report</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.5, marginBottom: 28 }}>
              We'll take a look. Your feedback helps make Kin better for everyone.
            </div>
            <button
              onClick={handleClose}
              style={{
                padding: "11px 32px", borderRadius: 10,
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
