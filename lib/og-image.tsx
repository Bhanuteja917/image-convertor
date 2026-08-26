import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export function renderOgImage(title: string, badge: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#2563eb",
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 600,
            padding: "10px 24px",
            borderRadius: 9999,
            marginBottom: 32,
          }}
        >
          {badge}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color: "#111827", lineHeight: 1.15 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#4b5563", marginTop: 28 }}>
          Converted entirely in your browser. Nothing is ever uploaded.
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#2563eb", marginTop: 48 }}>
          Image Convertor
        </div>
      </div>
    ),
    { ...ogImageSize },
  );
}
