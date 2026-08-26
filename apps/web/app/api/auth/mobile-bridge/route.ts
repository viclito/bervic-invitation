import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const host = url.origin;
  const callbackUrl = `${host}/api/auth/mobile-bridge/success`;

  return NextResponse.redirect(
    `${host}/api/auth/signin/google?callbackUrl=${encodeURIComponent(callbackUrl)}`
  );
}
