import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Log In to Your Account | Bervic Invitations",
  description:
    "Log in to your Bervic account to manage your digital invitations, track guest RSVPs, and create Instagram announcement cards.",
  alternates: {
    canonical: `${baseUrl}/auth/login`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
