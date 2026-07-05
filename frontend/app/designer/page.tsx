"use client";
import { useState } from "react";
import NLInput from "@/components/NLInput";
import ScriptPanel from "@/components/ScriptPanel";
import ChatPanel from "@/components/ChatPanel";
import Link from "next/link";
import type { RoomLayout } from "@/lib/api";

export default function DesignerPage() {
  const [layout, setLayout] = useState<RoomLayout | null>(null);
  const [script, setScript] = useState<string>("");
  const [blenderStatus, setBlenderStatus] = useState<string>("");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Top Bar */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
        height: 56,
        borderBottom: "1px solid var(--border-glass)",
        background: "rgba(10,11,15,0.9)",
        backdropFilter: "blur(16px)",
        flexShrink: 0,
        zIndex: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{
            display: "flex", alignItems: "center", gap: 10,
            textDecoration: "none", color: "var(--text-primary)",
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 900, color: "#fff",
            }}>S</div>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              AI <span className="gradient-text">SmartScape</span>
            </span>
          </Link>
          <span style={{ color: "var(--border-glass)", fontSize: "1rem" }}>/</span>
          <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>Designer</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {blenderStatus && (
            <span className={`badge ${blenderStatus === "launched" ? "badge-teal" : "badge-amber"}`}>
              {blenderStatus === "launched" ? "✓ Blender Launched" : "⚠ Check Blender Path"}
            </span>
          )}
          {layout && (
            <span className="badge badge-violet">
              ✦ {layout.furniture.length} furniture items
            </span>
          )}
        </div>
      </header>

      {/* Main 2-column layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        flex: 1,
        overflow: "hidden",
        gap: 0,
      }}>
        {/* Left: NL Input + Script Panel */}
        <div style={{
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          borderRight: "1px solid var(--border-glass)",
          background: "var(--bg-secondary)",
        }}>
          <div style={{ padding: "20px 20px 0" }}>
            <NLInput
              onResult={(result) => {
                setLayout(result.layout);
                setScript(result.script);
                setBlenderStatus(result.blender?.status ?? "");
              }}
            />
          </div>
          <div style={{ flex: 1, overflow: "hidden", padding: 20 }}>
            <ScriptPanel
              script={script}
              layout={layout}
              blenderStatus={blenderStatus}
            />
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div style={{ overflow: "hidden", background: "var(--bg-primary)" }}>
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
