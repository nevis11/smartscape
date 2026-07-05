"use client";
import { useState, useRef, useEffect } from "react";
import { sendChat, ragQuery } from "@/lib/api";

interface Message {
  role: "user" | "ai";
  content: string;
  sources?: string[];
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I'm your AI interior design assistant, powered by local LLaMA. Ask me anything about room design, color palettes, furniture arrangement, or toggle RAG mode for knowledge-base-backed answers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ragMode, setRagMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      if (ragMode) {
        const res = await ragQuery(msg);
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: res.reply, sources: res.sources },
        ]);
      } else {
        const history = messages.map((m) => ({
          role: m.role === "ai" ? "assistant" : "user",
          content: m.content,
        }));
        const res = await sendChat(msg, history);
        setMessages((prev) => [...prev, { role: "ai", content: res.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I couldn't reach the backend. Is it running on port 8000?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "16px 18px 12px",
        borderBottom: "1px solid var(--border-glass)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700 }}>AI Chat</h3>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Local LLaMA · FAISS RAG</p>
        </div>
        {/* RAG toggle */}
        <button
          id="rag-toggle-btn"
          onClick={() => setRagMode(!ragMode)}
          className={`badge ${ragMode ? "badge-teal" : "badge-violet"}`}
          style={{ cursor: "pointer", border: "none", userSelect: "none" }}
        >
          {ragMode ? "◉ RAG ON" : "◎ RAG OFF"}
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "16px 14px",
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        {messages.map((msg, i) => (
          <div key={i} className="fade-in" style={{
            display: "flex",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            gap: 8, alignItems: "flex-start",
          }}>
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: msg.role === "ai"
                ? "linear-gradient(135deg, var(--accent-1), var(--accent-2))"
                : "rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700,
              color: msg.role === "ai" ? "#fff" : "var(--text-secondary)",
            }}>
              {msg.role === "ai" ? "AI" : "U"}
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: "78%", display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{
                background: msg.role === "user"
                  ? "rgba(124,95,230,0.15)"
                  : "var(--bg-glass)",
                border: "1px solid",
                borderColor: msg.role === "user"
                  ? "rgba(124,95,230,0.25)"
                  : "var(--border-glass)",
                borderRadius: msg.role === "user"
                  ? "var(--radius-sm) 4px var(--radius-sm) var(--radius-sm)"
                  : "4px var(--radius-sm) var(--radius-sm) var(--radius-sm)",
                padding: "10px 13px",
                fontSize: "0.84rem",
                lineHeight: 1.65,
                color: "var(--text-primary)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>
                {msg.content}
              </div>

              {/* RAG sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ padding: "6px 10px" }}>
                  <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: 4 }}>
                    Sources:
                  </p>
                  {msg.sources.slice(0, 2).map((s, si) => (
                    <p key={si} style={{
                      fontSize: "0.68rem",
                      color: "var(--text-muted)",
                      borderLeft: "2px solid var(--accent-2)",
                      paddingLeft: 6,
                      marginBottom: 3,
                    }}>
                      {s.slice(0, 80)}…
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="fade-in" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, color: "#fff",
            }}>AI</div>
            <div style={{
              display: "flex", gap: 4, padding: "12px 16px",
              background: "var(--bg-glass)", borderRadius: "4px var(--radius-sm) var(--radius-sm) var(--radius-sm)",
              border: "1px solid var(--border-glass)",
            }}>
              {[0, 1, 2].map((d) => (
                <div key={d} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--accent-1)",
                  animation: `pulse 1.4s ease-in-out ${d * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        padding: "12px 14px 16px",
        borderTop: "1px solid var(--border-glass)",
        flexShrink: 0,
        display: "flex", gap: 8,
      }}>
        <input
          id="chat-input"
          className="input"
          type="text"
          placeholder={ragMode ? "Ask with knowledge base…" : "Ask about interior design…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          disabled={loading}
          style={{ borderRadius: "var(--radius-sm)", resize: "none" }}
        />
        <button
          id="chat-send-btn"
          className="btn btn-primary"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{ flexShrink: 0, padding: "10px 16px" }}
        >
          {loading ? <span className="spinner" /> : "→"}
        </button>
      </div>
    </div>
  );
}
