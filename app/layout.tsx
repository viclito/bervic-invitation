import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bervic.app"),
  title: "Bervic — Beautiful Indian Invitation Generator for Every Celebration",
  description:
    "Create stunning digital invitations for weddings, birthdays, religious functions, and all celebrations in minutes. Free & premium designs crafted with elegance.",
  keywords: [
    "Indian invitation card generator",
    "wedding invite maker",
    "birthday digital invitation",
    "puja invitation maker",
    "Bervic invitations",
    "WhatsApp invitation generator",
  ],
  authors: [{ name: "Bervic App" }],
  openGraph: {
    title: "Bervic — Beautiful Indian Invitation Generator for Every Celebration",
    description:
      "Create stunning digital invitations for weddings, birthdays, religious functions, and all celebrations in minutes.",
    url: "https://bervic.app",
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/category-wedding.jpg",
        width: 1200,
        height: 630,
        alt: "Bervic Invitation Templates",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bervic — Indian Invitation Generator",
    description:
      "Create stunning digital invitations for weddings, birthdays, religious functions & all celebrations.",
    images: ["/images/category-wedding.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8F3EA] text-[#221C17] font-sans selection:bg-[#D9A441] selection:text-[#221C17]">
        <SessionProviderWrapper>
          <LenisProvider>{children}</LenisProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
