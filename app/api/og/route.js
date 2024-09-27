import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const subtitle = searchParams.get("subtitle");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1F2937",
          fontSize: 32,
          fontWeight: 600,
        }}>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <h1
            style={{
              fontSize: 60,
              fontWeight: 800,
              background:
                "linear-gradient(to bottom right, #FDE68A, #FCA5A5, #FECACA)",
              backgroundClip: "text",
              "-webkit-background-clip": "text",
              color: "transparent",
              lineHeight: 1.2,
              marginBottom: 20,
            }}>
            {title}
          </h1>
          <h2 style={{ color: "#E5E7EB" }}>{subtitle}</h2>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
          }}>
          <span style={{ color: "#9CA3AF" }}>Powered by</span>
          <span
            style={{
              marginLeft: 8,
              fontSize: 36,
              fontWeight: 800,
              background: "linear-gradient(to bottom right, #60A5FA, #34D399)",
              backgroundClip: "text",
              "-webkit-background-clip": "text",
              color: "transparent",
            }}>
            Devsplug
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
