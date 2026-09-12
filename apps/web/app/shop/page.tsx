import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TraditionalShopClient from "@/components/shop/TraditionalShopClient";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Invitation Cards - Buy Wedding & Event Invitations Online | Bervic Shop",
  description:
    "Buy premium wedding invitation cards, traditional marriage invites, birthday cards, house warming & celebration cards online at Bervic. Explore luxury gold foil designs, custom textured cardstock, and door-step delivery starting at ₹10 across India.",
  keywords: [
    "invitation",
    "invitations",
    "invitation cards",
    "buy invitation cards online",
    "wedding invitations",
    "traditional wedding cards",
    "marriage invitation cards",
    "wedding card printing",
    "Indian wedding invitations",
    "custom invitation cards",
    "gold foil wedding cards",
    "handcrafted invitations",
    "house warming invitation card",
    "Griha Pravesh invitation card",
    "birthday invitation card",
    "luxury wedding card box sets",
    "Bervic shop",
    "Bervic print store",
  ],
  alternates: {
    canonical: `${baseUrl}/shop`,
  },
  openGraph: {
    title: "Invitation Cards - Buy Wedding & Event Invitations Online | Bervic Shop",
    description:
      "Buy handcrafted physical wedding invitation cards, luxury gold foil suites, 350+ GSM textured boards, and boxed wedding cards with express doorstep delivery across India.",
    url: `${baseUrl}/shop`,
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/canva/template2-thumb.webp",
        width: 1200,
        height: 630,
        alt: "Bervic Wedding Invitation Cards & Print Store",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Invitation Cards - Buy Wedding & Event Invitations Online | Bervic Shop",
    description:
      "Explore 250+ luxury gold foil wedding invitations, traditional marriage cards, and custom printed invitations with doorstep delivery across India.",
    images: ["/images/canva/template2-thumb.webp"],
  },
};

export default function ShopPage() {
  const shopJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/shop#webpage`,
        url: `${baseUrl}/shop`,
        name: "Invitation Cards - Buy Wedding & Event Invitations Online | Bervic Shop",
        description:
          "Buy premium wedding invitation cards, traditional marriage invites, and celebration cards online at Bervic with doorstep delivery across India.",
        isPartOf: {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          name: "Bervic Invitations",
          url: baseUrl,
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: baseUrl,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Invitation Cards Shop",
              item: `${baseUrl}/shop`,
            },
          ],
        },
      },
      {
        "@type": "Store",
        "@id": `${baseUrl}/shop#store`,
        name: "Bervic Invitation Cards & Print Store",
        url: `${baseUrl}/shop`,
        description:
          "India's premier print studio for handcrafted physical wedding invitation cards, gold foil suites, and celebration invites.",
        image: `${baseUrl}/images/canva/template2-thumb.webp`,
        priceRange: "₹10 - ₹250",
        currenciesAccepted: "INR",
        paymentAccepted: "Cash, Credit Card, UPI, Net Banking",
        areaServed: "IN",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Physical Invitation Cards & Return Gifts",
          itemListElement: [
            {
              "@type": "OfferCatalog",
              name: "Wedding Invitation Cards",
            },
            {
              "@type": "OfferCatalog",
              name: "Traditional Marriage Invitations",
            },
            {
              "@type": "OfferCatalog",
              name: "House Warming & Pooja Invitations",
            },
            {
              "@type": "OfferCatalog",
              name: "Return Gifts & Hampers",
            },
          ],
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopJsonLd) }}
      />
      <Navbar />
      <TraditionalShopClient />
      <Footer />
    </>
  );
}
