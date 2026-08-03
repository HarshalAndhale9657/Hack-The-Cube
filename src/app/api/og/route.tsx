import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site-config";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : siteConfig.name;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            backgroundImage: "linear-gradient(160deg, #0A0E12 0%, #101B24 40%, #1C3040 75%, #284457 100%)",
            letterSpacing: "-.02em",
            fontWeight: 700,
            textAlign: "center",
            color: "white",
            padding: "80px",
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#FF7F2A" />
              <path d="M2 17L12 22L22 17" stroke="#FF7F2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#FF7F2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 40, color: "#F2F2F3" }}>
              {siteConfig.name}
            </span>
          </div>

          {/* Dynamic Title */}
          <div
            style={{
              fontSize: 72,
              fontStyle: "normal",
              color: "#F2F2F3",
              lineHeight: 1.2,
              whiteSpace: "pre-wrap",
            }}
          >
            {title}
          </div>

          {/* Tagline / Subtitle */}
          <div
            style={{
              fontSize: 32,
              fontStyle: "normal",
              color: "#A7BCC9",
              marginTop: "30px",
              fontWeight: 400,
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
