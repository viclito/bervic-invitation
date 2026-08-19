import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TraditionalShopClient from "@/components/shop/TraditionalShopClient";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Traditional Physical Wedding & Celebration Invitations Print Shop | Bervic",
  description:
    "Shop handcrafted physical wedding invitation cards, luxury gold foil suites, 350+ GSM textured boards, and boxed wedding cards with express doorstep delivery across India.",
  keywords: [
    "canva printed cards",
    "digital invite printing",
    "digital studio print shop",
    "traditional wedding cards",
    "physical wedding invitations India",
    "gold foil wedding cards",
    "handcrafted wedding cards",
    "Bervic print shop",
    "luxury wedding card box sets",
  ],
  alternates: {
    canonical: `${baseUrl}/shop`,
  },
  openGraph: {
    title: "Traditional Physical Wedding Invitations Print Shop | Bervic",
    description:
      "Order handcrafted physical wedding invitation suites printed on 350+ GSM textured board with real gold foil stamping and matching envelopes.",
    url: `${baseUrl}/shop`,
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/canva/template2-thumb.webp",
        width: 1200,
        height: 630,
        alt: "Bervic Traditional Wedding Invitations Shop",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <TraditionalShopClient />
      <Footer />
    </>
  );
}
