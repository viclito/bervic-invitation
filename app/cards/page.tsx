import { Suspense } from "react";
import { Metadata } from "next";
import CardGenerator from "@/components/cards/CardGenerator";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Instagram & WhatsApp Status Announcement Card Studio | Bervic",
  description:
    "Create high-resolution (1080x1080px) Instagram & WhatsApp wedding announcement cards. Select from 31+ design presets, customize couple photos & details, and export to PNG or PDF.",
  keywords: [
    "Instagram wedding card generator",
    "WhatsApp status invite maker",
    "wedding announcement graphic creator",
    "square invitation card designer",
    "Bervic card studio",
  ],
  alternates: {
    canonical: `${baseUrl}/cards`,
  },
  openGraph: {
    title: "Instagram Announcement Card Studio | Bervic Invitations",
    description:
      "Create high-resolution 1080x1080px Instagram & WhatsApp announcement cards with 31+ design presets.",
    url: `${baseUrl}/cards`,
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/category-wedding.jpg",
        width: 1200,
        height: 630,
        alt: "Bervic Instagram Card Studio",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Announcement Card Studio | Bervic",
    description:
      "Create high-resolution 1080x1080px Instagram & WhatsApp announcement cards with 31+ design presets.",
    images: ["/images/category-wedding.jpg"],
  },
};

export default function CardsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#221C17] flex items-center justify-center text-[#F8F3EA] text-sm font-bold">
          Loading Instagram Card Studio...
        </div>
      }
    >
      <CardGenerator />
    </Suspense>
  );
}
