import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#059669",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", width: 14, gap: 2 }}>
          <div
            style={{
              width: 6,
              height: 7,
              background: "rgba(255,255,255,0.9)",
              borderRadius: 1.5,
            }}
          />
          <div
            style={{
              width: 6,
              height: 4,
              background: "rgba(255,255,255,0.7)",
              borderRadius: 1.5,
            }}
          />
          <div
            style={{
              width: 6,
              height: 4,
              background: "rgba(255,255,255,0.7)",
              borderRadius: 1.5,
            }}
          />
          <div
            style={{
              width: 6,
              height: 7,
              background: "rgba(255,255,255,0.9)",
              borderRadius: 1.5,
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
