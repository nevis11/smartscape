"use client";
import { useState } from "react";
import { saveDesign, type RoomLayout } from "@/lib/api";

interface Props {
  script: string;
  layout: RoomLayout | null;
  blenderStatus: string;
}

export default function ScriptPanel({ script, layout, blenderStatus }: Props) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDownload = () => {
    if (!script) return;
    const blob = new Blob([script], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smartscape_room.py";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
  };

  const handleSave = async () => {
    if (!layout) return;
    setSaving(true);
    try {
      await saveDesign(
        layout.room.style + " room",
        layout,
        script,
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* ignore */
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = () => {
    if (!layout) return;
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smartscape_layout.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!script) {
    return (
      <div style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        border: "1px dashed var(--border-glass)",
        borderRadius: "var(--radius-md)",
        padding: 32,
        color: "var(--text-muted)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "2.5rem" }}>◈</div>
        <div>
          <p style={{ fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
            No room generated yet
          </p>
          <p style={{ fontSize: "0.8rem" }}>
            Describe a room above to generate a Blender Python script and open it automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {blenderStatus === "launched" && (
            <span className="badge badge-teal">✓ Blender launched</span>
          )}
          {blenderStatus === "blender_not_found" && (
            <span className="badge badge-amber">⚠ Blender not found on PATH</span>
          )}
          {layout && (
            <span className="badge badge-violet">
              {layout.room.style} · {layout.room.width}m × {layout.room.depth}m
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={handleCopy}
            style={{ fontSize: "0.75rem", padding: "6px 12px" }} id="copy-script-btn">
            Copy
          </button>
          <button className="btn btn-ghost" onClick={handleDownload}
            style={{ fontSize: "0.75rem", padding: "6px 12px" }} id="download-script-btn">
            ↓ .py
          </button>
          <button className="btn btn-ghost" onClick={handleExportJson}
            style={{ fontSize: "0.75rem", padding: "6px 12px" }} id="export-json-btn">
            ↓ JSON
          </button>
          <button
            className={`btn ${saved ? "btn-teal" : "btn-primary"}`}
            onClick={handleSave}
            disabled={saving || !layout}
            style={{ fontSize: "0.75rem", padding: "6px 14px" }}
            id="save-design-btn"
          >
            {saving ? <><span className="spinner" /> Saving</> : saved ? "✓ Saved!" : "Save"}
          </button>
        </div>
      </div>

      {/* Script preview */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px",
          background: "#0d0e14",
          borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
          border: "1px solid var(--border-glass)",
          borderBottom: "none",
        }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
            smartscape_room.py
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: "var(--text-muted)" }}>
            {script.split("\n").length} lines
          </span>
        </div>
        <pre className="code-block" style={{
          flex: 1, borderRadius: "0 0 var(--radius-sm) var(--radius-sm)",
          margin: 0, overflowY: "auto",
        }}>
          <code>{script}</code>
        </pre>
      </div>

      {/* Furniture list */}
      {layout && layout.furniture.length > 0 && (
        <div style={{ flexShrink: 0 }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>
            Furniture in scene:
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {layout.furniture.map((f, i) => (
              <span key={i} className="badge badge-violet" style={{ borderRadius: 6 }}>
                <span style={{
                  display: "inline-block", width: 8, height: 8,
                  borderRadius: "50%", background: f.color, marginRight: 4,
                }} />
                {f.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
