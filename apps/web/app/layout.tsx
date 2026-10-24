import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import WhatsAppEnquiryButton from "@/components/WhatsAppEnquiryButton";
import OrderedCardStatusPopup from "@/components/OrderedCardStatusPopup";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-83TR44K9KN";
const fbPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1059240449093088";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Bervic — Beautiful Indian Invitation Generator for Every Celebration",
    template: "%s | Bervic Invitations",
  },
  description:
    "Create stunning digital invitations for Indian weddings, birthdays, religious functions, and all celebrations in minutes. Premium interactive designs crafted with elegance.",
  keywords: [
    "invitation",
    "invitations",
    "invitation cards",
    "wedding invitations",
    "traditional wedding cards",
    "buy invitation cards online",
    "digital invite",
    "digital studio",
    "custom invitation studio",
    "wedding invitation design studio",
    "card generator",
    "luxury wedding card creator",
    "online digital studio",
    "website invitation",
    "digital invitation",
    "online invitation",
    "indian invitation",
    "digital invitation website",
    "wedding invitation website",
    "invitation website maker",
    "online invitation maker",
    "digital invitation card",
    "WhatsApp invitation generator",
    "e-invitation website",
    "Indian invitation card generator",
    "wedding invite maker",
    "digital wedding invitation card",
    "online invitation maker India",
    "Bervic invitations",
    "Bervic digital studio",
    "puja invitation maker",
    "birthday digital invitation maker",
    "Griha Pravesh invitation maker",
    "interactive digital invite",
  ],
  authors: [{ name: "Bervic App", url: baseUrl }],
  creator: "Bervic Invitations",
  publisher: "Bervic Invitations",
  category: "Event Management & Design",
  alternates: {
    canonical: baseUrl,
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    "ICBM": "20.5937, 78.9629",
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
    "Bervic is India's leading digital invitation platform and print studio for weddings, birthdays, and religious celebrations.",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
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
    highPrice: "2000",
    offerCount: "4",
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
      name: "Can I preview templates before paying?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can browse and live-preview all digital invitation templates and 31 Instagram announcement card designs anytime for free before choosing a plan.",
      },
    },
    {
      "@type": "Question",
      name: "Can I track guest RSVPs with Bervic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Bervic provides built-in guest RSVP tracking where guests can confirm attendance, plus-ones, and dietary preferences directly from their personalized link.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download Instagram and WhatsApp status announcement cards?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Bervic includes an Instagram Card Studio (/cards) that lets you generate 1080x1080px high-resolution PNG or PDF cards for Instagram posts, stories, and WhatsApp statuses.",
      },
    },
    {
      "@type": "Question",
      name: "Can I order physical printed invitation cards and return gifts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Bervic's Traditional Cards Shop (/shop) offers 250+ luxury gold foil, floral, and vintage physical wedding cards on heavy 350 GSM cardstock, plus festive return gifts like brass diyas and sweet hampers with doorstep delivery across India.",
      },
    },
    {
      "@type": "Question",
      name: "Do my invitations or assets expire after the event date?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! Your invitations, cards, and guest RSVPs do NOT auto-delete on your event date. They remain active for the full duration of your pass (6 months for Basic Pass ₹599, 1 year for Cinematic Exclusive ₹2000).",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods are supported on Bervic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, and Net Banking securely processed via Razorpay.",
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Strip browser-extension injected attributes (e.g. bis_skin_checked, bis_register) before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var clean = function() {
                    var els = document.querySelectorAll('[bis_skin_checked]');
                    for (var i = 0; i < els.length; i++) {
                      els[i].removeAttribute('bis_skin_checked');
                    }
                    if (document.body) {
                      document.body.removeAttribute('bis_register');
                      for (var a = 0; a < document.body.attributes.length; a++) {
                        var attr = document.body.attributes[a];
                        if (attr && attr.name && (attr.name.indexOf('__processed_') === 0 || attr.name.indexOf('bis_') === 0)) {
                          document.body.removeAttribute(attr.name);
                        }
                      }
                    }
                  };
                  clean();
                  var obs = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName && m.target && m.target.removeAttribute) {
                        if (m.attributeName === 'bis_skin_checked' || m.attributeName.indexOf('__processed_') === 0 || m.attributeName.indexOf('bis_') === 0) {
                          m.target.removeAttribute(m.attributeName);
                        }
                      }
                    }
                  });
                  if (document.body) {
                    obs.observe(document.body, { attributes: true, subtree: true });
                  } else {
                    document.addEventListener('DOMContentLoaded', function() {
                      clean();
                      if (document.body) {
                        obs.observe(document.body, { attributes: true, subtree: true });
                      }
                    });
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alex+Brush&family=Amatic+SC:wght@700&family=Bodoni+Moda:ital,wght@0,400..900;1,400..900&family=Caveat:wght@600&family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Dancing+Script:wght@700&family=Fredericka+the+Great&family=Great+Vibes&family=Inter:wght@300;400;500;600;700;800;900&family=Marcellus&family=Monoton&family=Montserrat:wght@400..900&family=Noto+Sans+Bengali:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Gujarati:wght@400;600;700&family=Noto+Sans+Kannada:wght@400;600;700&family=Noto+Sans+Malayalam:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Outfit:wght@400..900&family=Pacifico&family=Parisienne&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Poiret+One&family=Prata&family=Rozha+One&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&family=Special+Elite&family=UnifrakturMaguntia&display=swap"
        />
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
        {/* Official Razorpay Checkout Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-[#991B1B] selection:text-white"
      >
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

        {/* Meta Pixel (Facebook Pixel) */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <SessionProviderWrapper>
          <LenisProvider>{children}</LenisProvider>
          <WhatsAppEnquiryButton />
          <OrderedCardStatusPopup />
        </SessionProviderWrapper>

        {/* Razorpay Official Checkout SDK */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
