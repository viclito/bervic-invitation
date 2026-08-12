import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const THEME_BG_MAP: Record<string, string> = {
  peach: "/templates/peach-mandap-bg.png",
  church: "/templates/church-wedding-bg.png",
  islamic: "/templates/islamic-wedding-bg.png",
  hindu: "/templates/hindu-wedding-bg.png",
  haldi: "/templates/haldi-wedding-bg.png",
  ceremony: "/templates/ceremony-wedding-bg.png",
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const invitation = await prisma.userInvitation.findUnique({
      where: { slug },
    });

    const hostOne = invitation?.partnerOne || "Couple";
    const hostTwo = invitation?.partnerTwo || "";
    const coupleNames = hostTwo ? `${hostOne} & ${hostTwo}` : hostOne;

    let weddingDateStr = invitation?.weddingDate || "";
    if (weddingDateStr.includes("T")) {
      try {
        const d = new Date(weddingDateStr);
        weddingDateStr = d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      } catch {}
    }

    // Read selected theme card from DB
    let cardTheme = "peach";
    try {
      const social = JSON.parse(invitation?.socialLinksJson || "{}");
      if (social.cardTheme) cardTheme = social.cardTheme;
    } catch {}

    const bgPath = THEME_BG_MAP[cardTheme] || "/templates/peach-mandap-bg.png";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";
    const bgUrl = `${baseUrl}${bgPath}`;

    // Theme specific color styling
    let nameColor = "#58440C";
    let subColor = "#725C22";
    let dateBg = "rgba(255, 255, 255, 0.88)";

    if (cardTheme === "hindu") {
      nameColor = "#E1C37F";
      subColor = "#F7E7C4";
      dateBg = "rgba(0, 0, 0, 0.7)";
    } else if (cardTheme === "church") {
      nameColor = "#725C22";
      subColor = "#5F5E5E";
      dateBg = "rgba(255, 255, 255, 0.8)";
    } else if (cardTheme === "peach") {
      nameColor = "#4A2E1B";
      subColor = "#5C4033";
      dateBg = "rgba(255, 255, 255, 0.88)";
    }

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
            backgroundImage: `url(${bgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "40px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: cardTheme === "church" ? "rgba(255, 255, 255, 0.45)" : "transparent",
              borderRadius: cardTheme === "church" ? "120px" : "0px",
              padding: cardTheme === "church" ? "30px 60px" : "0px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "4px",
                color: subColor,
                textTransform: "uppercase",
                margin: "0 0 10px 0",
              }}
            >
              TOGETHER WITH THEIR FAMILIES
            </p>

            <h1
              style={{
                fontSize: "64px",
                fontWeight: 800,
                fontFamily: "serif",
                color: nameColor,
                margin: "0 0 10px 0",
                lineHeight: 1.1,
              }}
            >
              {coupleNames}
            </h1>

            <p
              style={{
                fontSize: "22px",
                fontStyle: "italic",
                color: subColor,
                margin: "0 0 20px 0",
              }}
            >
              invite you to celebrate their wedding
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: dateBg,
                padding: "12px 28px",
                borderRadius: "30px",
                border: "1px solid rgba(114, 92, 34, 0.3)",
                fontSize: "20px",
                fontWeight: 700,
                color: nameColor,
              }}
            >
              📅 {weddingDateStr || "Save the Date"}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
