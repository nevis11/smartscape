import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI SmartScape – AI-Driven Interior Design",
  description:
    "Generate 3D room layouts from natural language and visualize them in Blender. Powered by local LLaMA + RAG.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
