import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
export const alt =
  "ONEGOODJUNE — Raising the bar in faith-based African fiction. Helping creative minds flourish.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const font = await readFile(
    path.join(process.cwd(), "public/fonts/tan-songbird.ttf"),
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 70,
        background: "#000000",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Songbird",
          fontSize: 66,
          letterSpacing: -6,
          marginBottom: 55,
        }}
      >
        ONEGOODJUNE
      </div>
      <div style={{ display: "flex", fontSize: 30 }}>
        Raising the bar in faith-based African fiction.
      </div>
      <div style={{ display: "flex", fontSize: 30, marginTop: 12 }}>
        Helping creative minds flourish.
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Songbird", data: font, weight: 400, style: "normal" }],
    },
  );
}
