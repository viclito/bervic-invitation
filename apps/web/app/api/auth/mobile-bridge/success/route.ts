import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      // If not logged in, redirect to Google Auth sign-in
      const url = new URL(req.url);
      const host = url.origin;
      return NextResponse.redirect(
        `${host}/api/auth/signin/google?callbackUrl=${encodeURIComponent(
          `${host}/api/auth/mobile-bridge/success`
        )}`
      );
    }

    const cleanEmail = session.user.email.toLowerCase().trim();

    let user = await prisma.user.findFirst({
      where: { email: { equals: cleanEmail, mode: "insensitive" } },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: session.user.name || cleanEmail.split("@")[0],
          email: cleanEmail,
          image: session.user.image || null,
          emailVerified: new Date(),
          plan: "NONE",
          role: "USER",
        },
      });
    }

    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
        issuedAt: Date.now(),
      })
    ).toString("base64url");

    const userData = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        plan: user.plan,
      })
    );

    // Render an automatic redirection page back to the mobile app
    const deepLink = `bervic://oauth?token=${token}&user=${userData}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Authenticating with Bervic...</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #ffffff; color: #0f172a; }
            .card { text-align: center; padding: 2rem; }
            .btn { display: inline-block; margin-top: 1.5rem; padding: 0.8rem 1.8rem; background: #dc2626; color: white; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 14px; }
            .spinner { width: 36px; height: 36px; border: 3px solid #f3f4f6; border-top: 3px solid #dc2626; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1.5rem auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h2 style="margin-bottom: 6px;">Connected to Google</h2>
            <p style="color: #64748b; font-size: 14px;">Redirecting back to Bervic Invitation app...</p>
            <a href="${deepLink}" class="btn">Open App</a>
          </div>
          <script>
            window.location.href = "${deepLink}";
            setTimeout(function() {
              window.location.href = "${deepLink}";
            }, 500);
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
