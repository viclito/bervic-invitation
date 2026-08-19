import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Explore 31+ Premium Indian Invitation Templates | Bervic",
  description:
    "Browse our curated collection of 31+ luxury Indian invitation templates for weddings, birthdays, puja ceremonies, and anniversaries. Customize and preview in real-time.",
  keywords: [
    "canva invitation templates",
    "digital invite templates",
    "digital studio templates",
    "canva wedding studio",
    "Indian wedding invitation templates",
    "digital invitation designs",
    "WhatsApp invitation templates",
    "Royal Gold wedding invite",
    "Botanical Luxe invitation",
    "Boho wedding invite template",
    "Griha Pravesh invitation card",
  ],
  alternates: {
    canonical: `${baseUrl}/templates`,
  },
  openGraph: {
    title: "Explore 31+ Premium Indian Invitation Templates | Bervic",
    description:
      "Handcrafted luxury digital invitation templates for Indian weddings, birthdays, and religious ceremonies.",
    url: `${baseUrl}/templates`,
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/category-wedding.jpg",
        width: 1200,
        height: 630,
        alt: "Bervic Template Catalog",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore 31+ Indian Invitation Templates | Bervic",
    description:
      "Handcrafted luxury digital invitation templates for Indian weddings, birthdays & religious functions.",
    images: ["/images/category-wedding.jpg"],
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
