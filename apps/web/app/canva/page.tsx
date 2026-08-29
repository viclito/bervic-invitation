import { Metadata } from "next";
import CanvaClientWrapper from "@/components/canva/CanvaClientWrapper";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Interactive Custom Wedding Invitation Designer & Studio | Bervic",
  description:
    "Design your own custom wedding invitation card from scratch with our interactive visual editor. Add luxury fonts, gold frames, floral motifs, drag & drop elements, and export high-res PNG/PDF.",
  keywords: [
    "custom invitation designer",
    "interactive wedding card studio",
    "drag and drop invitation creator",
    "Bervic design studio",
    "wedding card maker",
  ],
  alternates: {
    canonical: `${baseUrl}/canva`,
  },
  openGraph: {
    title: "Interactive Wedding Invitation Studio | Bervic",
    description:
      "Design custom luxury wedding invitation cards from scratch with drag & drop fonts, graphics, frames, and high-res PNG/PDF export.",
    url: `${baseUrl}/canva`,
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/category-wedding.jpg",
        width: 1200,
        height: 630,
        alt: "Bervic Invitation Design Studio",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function CanvaPage() {
  return <CanvaClientWrapper />;
}


