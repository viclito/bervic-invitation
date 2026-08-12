import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Create an Account | Bervic Digital Invitation Suite",
  description:
    "Sign up for a free Bervic account and start creating beautiful Indian digital invitations for weddings, birthdays, and religious functions.",
  alternates: {
    canonical: `${baseUrl}/auth/signup`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
