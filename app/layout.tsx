import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-83TR44K9KN";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Bervic — Beautiful Indian Invitation Generator for Every Celebration",
    template: "%s | Bervic Invitations",
  },
  description:
    "Create stunning digital invitations for Indian weddings, birthdays, religious functions, and all celebrations in minutes. Premium interactive designs crafted with elegance.",
  keywords: [
    "Indian invitation card generator",
    "wedding invite maker",
    "digital wedding invitation card",
    "birthday digital invitation maker",
    "puja invitation maker",
    "Bervic invitations",
    "WhatsApp wedding invitation generator",
    "online invitation maker India",
    "Griha Pravesh invitation maker",
  ],
  authors: [{ name: "Bervic App", url: baseUrl }],
  creator: "Bervic Invitations",
  publisher: "Bervic Invitations",
  category: "Event Management & Design",
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Bervic — Beautiful Indian Invitation Generator for Every Celebration",
    description:
      "Create stunning interactive digital invitations for weddings, birthdays, religious functions, and all celebrations in minutes.",
    url: baseUrl,
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/category-wedding.jpg",
        width: 1200,
        height: 630,
        alt: "Bervic Indian Digital Invitation Templates",
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
    creator: "@bervicapp",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

// Structured Data (JSON-LD) Schemas for Google Rich Results & AI Search (GEO / AIO)
const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bervic Invitations",
  url: baseUrl,
  logo: `${baseUrl}/logo.png`,
  description:
    "Bervic is India's leading digital invitation platform for weddings, birthdays, and religious celebrations.",
  sameAs: [
    "https://instagram.com/bervicapp",
    "https://facebook.com/bervicapp",
  ],
};

const jsonLdWebApplication = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bervic Digital Invitation Suite",
  url: baseUrl,
  applicationCategory: "DesignApplication",
  operatingSystem: "All (Web Browser)",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: "0",
    highPrice: "999",
    offerCount: "3",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "1280",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I create a digital wedding invitation on Bervic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Select a design from our 31+ premium Indian wedding templates, customize your couple names, wedding date, venue maps, and event schedule in our live builder, and get an instant shareable WhatsApp link.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track guest RSVPs with Bervic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Bervic provides built-in guest RSVP tracking where guests can confirm their attendance, plus-ones, and dietary preferences directly from your invitation link.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download Instagram announcement cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Bervic includes an Instagram Card Studio (/cards) that lets you generate 1080x1080px high-resolution PNG or PDF cards for Instagram posts, stories, and WhatsApp status updates.",
      },
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApplication) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F3EA] text-[#221C17] font-sans selection:bg-[#D9A441] selection:text-[#221C17]">
        {/* Google Analytics (gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gaId}');
          `}
        </Script>

        <SessionProviderWrapper>
          <LenisProvider>{children}</LenisProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
