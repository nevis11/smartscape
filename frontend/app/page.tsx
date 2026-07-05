"use client";
import Link from "next/link";

const FEATURES = [
  {
    icon: "✦",
    title: "Natural Language → 3D Room",
    desc: "Describe any room in plain English. Our LLaMA AI converts it into a full structured layout.",
    badge: "badge-violet",
    badgeText: "LLaMA AI",
  },
  {
    icon: "◈",
    title: "Auto-Launch Blender",
    desc: "The 3D room opens in Blender automatically — no manual steps. Full scene with furniture, lighting, and camera.",
    badge: "badge-teal",
    badgeText: "Blender",
  },
  {
    icon: "◉",
    title: "RAG Design Assistant",
    desc: "Chat with an AI trained on interior design knowledge. Get color advice, layout tips, and style suggestions.",
    badge: "badge-amber",
    badgeText: "RAG + LLaMA",
  },
  {
    icon: "⬡",
    title: "Save & Export",
    desc: "Save room layouts to disk. Download Blender scripts (.py) or full JSON layouts for reuse.",
    badge: "badge-violet",
    badgeText: "Export",
  },
];

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid var(--border-glass)",
        background: "rgba(10,11,15,0.8)",
        backdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
          }}>S</div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
            AI <span className="gradient-text">SmartScape</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/designer" className="btn btn-primary">
            Launch Designer →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        background: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,95,230,0.25) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(62,207,207,0.12) 0%, transparent 50%)
        `,
      }}>
        <span className="badge badge-violet fade-in" style={{ marginBottom: 24 }}>
          <span className="pulse-dot" /> Powered by Local LLaMA + Blender
        </span>

        <h1 className="fade-in" style={{
          fontSize: "clamp(2.4rem, 6vw, 5rem)",
          fontWeight: 900,
          lineHeight: 1.08,
          marginBottom: 28,
          maxWidth: 820,
        }}>
          Design Rooms with{" "}
          <span className="gradient-text">AI Intelligence</span>
          <br />
          Visualise in{" "}
          <span style={{ color: "var(--accent-2)" }}>Blender</span>
        </h1>

        <p className="fade-in" style={{
          fontSize: "1.15rem",
          color: "var(--text-secondary)",
          maxWidth: 560,
          marginBottom: 44,
          lineHeight: 1.7,
        }}>
          Describe any room in plain English. AI SmartScape generates a complete
          3D scene and opens it in Blender — automatically.
        </p>

        <div className="fade-in" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/designer" className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
            Start Designing →
          </Link>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: "1rem", padding: "14px 28px" }}
          >
            API Docs
          </a>
        </div>

        {/* Example prompt pill */}
        <div className="fade-in glass" style={{
          marginTop: 52, padding: "14px 24px",
          display: "inline-flex", alignItems: "center", gap: 12,
          borderRadius: 99,
          maxWidth: 520, textAlign: "left",
        }}>
          <span style={{ color: "var(--accent-1)", fontSize: "1.1rem" }}>✦</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            <span style={{ color: "var(--text-primary)", fontStyle: "italic" }}>
              "Design a minimalist bedroom with a queen bed and study area"
            </span>
            {" "}→ opens in Blender
          </span>
        </div>
      </section>

      {/* Feature grid */}
      <section style={{
        padding: "60px 40px 80px",
        maxWidth: 1100, margin: "0 auto", width: "100%",
      }}>
        <h2 style={{ textAlign: "center", fontSize: "1.8rem", marginBottom: 44 }}>
          Everything you need, <span className="gradient-text">built-in</span>
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 24,
        }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="glass fade-in" style={{ padding: 28 }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 12 }}>{f.icon}</div>
              <div style={{ marginBottom: 10 }}>
                <span className={`badge ${f.badge}`}>{f.badgeText}</span>
              </div>
              <h3 style={{ fontSize: "1rem", marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-glass)",
        padding: "20px 40px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: "0.82rem",
      }}>
        AI SmartScape — Local LLaMA · FAISS RAG · Blender 3D · FastAPI
      </footer>
    </main>
  );
}
