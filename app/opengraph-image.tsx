import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const alt = `${brand.name} — Less Software. Better Systems. More Revenue.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(ellipse at top, #1a4fae 0%, #060a15 60%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#2f7cf6" }} />
          {brand.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 78, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>Less Software.</span>
          <span>Better Systems.</span>
          <span style={{ color: "#86b6ff" }}>More Revenue.</span>
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8" }}>Custom technology for established sports organizations</div>
      </div>
    ),
    size,
  );
}
