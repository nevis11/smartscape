"use client";
import { useState } from "react";
import { generateRoom, type GenerateRoomResponse } from "@/lib/api";

interface Props {
  onResult: (result: GenerateRoomResponse) => void;
}

const EXAMPLES = [
  "A modern bedroom with a queen bed, study desk, and wardrobe",
  "Cozy minimalist living room with a sofa, coffee table, and bookshelf",
  "Scandinavian home office with a standing desk, ergonomic chair, and plant",
  "Luxury master bedroom with king bed, TV unit, two bedside lamps, and wardrobe",
];

export default function NLInput({ onResult }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const result = await generateRoom(text.trim());
      onResult(result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 4 }}>
          ✦ Describe Your Room
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
          Natural language → AI layout → Blender opens automatically
        </p>
      </div>

      <textarea
        className="input"
        rows={4}
        placeholder='e.g. "A modern bedroom with a queen bed, study table, and floor lamp"'
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
        }}
        disabled={loading}
        style={{ marginBottom: 10 }}
      />

      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={loading || !text.trim()}
        style={{ width: "100%", justifyContent: "center", marginBottom: 14 }}
        id="generate-room-btn"
      >
        {loading ? (
          <>
            <span className="spinner" />
            Generating &amp; Launching Blender…
          </>
        ) : (
          "✦ Generate Room → Open in Blender"
        )}
      </button>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          color: "#f87171",
          fontSize: "0.82rem",
          marginBottom: 14,
        }}>
          {error}
        </div>
      )}

      {/* Example prompts */}
      <div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 8 }}>
          Try an example:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              className="btn btn-ghost"
              onClick={() => setText(ex)}
              disabled={loading}
              style={{
                textAlign: "left", fontSize: "0.78rem",
                padding: "8px 12px", justifyContent: "flex-start",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              "{ex}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
