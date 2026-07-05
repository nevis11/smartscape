const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface RoomLayout {
  room: {
    width: number;
    depth: number;
    height: number;
    style: string;
    wall_color: string;
    floor_color: string;
  };
  furniture: Array<{
    type: string;
    label: string;
    position: number[];
    size: number[];
    color: string;
    rotation: number;
  }>;
}

export interface GenerateRoomResponse {
  layout: RoomLayout;
  script: string;
  blender: {
    status: string;
    script_path: string;
    message?: string;
  };
}

export interface ChatResponse {
  reply: string;
}

export interface RAGResponse {
  reply: string;
  sources: string[];
}

export async function generateRoom(description: string): Promise<GenerateRoomResponse> {
  const res = await fetch(`${API_BASE}/api/generate-room`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  if (!res.ok) throw new Error(`Failed to generate room: ${res.statusText}`);
  return res.json();
}

export async function sendChat(
  message: string,
  history: Array<{ role: string; content: string }>
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.statusText}`);
  return res.json();
}

export async function ragQuery(query: string): Promise<RAGResponse> {
  const res = await fetch(`${API_BASE}/api/rag-query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`RAG query failed: ${res.statusText}`);
  return res.json();
}

export async function saveDesign(
  name: string,
  layout: RoomLayout,
  script: string
): Promise<{ status: string; file: string }> {
  const res = await fetch(`${API_BASE}/api/save-design`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, layout, script }),
  });
  if (!res.ok) throw new Error(`Save failed: ${res.statusText}`);
  return res.json();
}
