import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Check,
  Sparkles,
  Star,
  Zap,
  Crown,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.bervic.in";

export const metadata: Metadata = {
  title: "Pricing & Plans | Transparent Luxury Wedding & Birthday Invitations | Bervic",
  description:
    "Explore transparent pricing plans for Bervic digital invitations, 480-frame cinematic video scrolls, Instagram announcement cards, and luxury physical printed invitation suites.",
  keywords: [
    "wedding invitation pricing",
    "digital invite cost",
    "Bervic plans",
    "cinematic invitation pass",
    "luxury wedding cards India",
    "affordable digital invitations",
  ],
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
  openGraph: {
    title: "Pricing & Plans | Bervic Invitations",
    description:
      "Choose from Basic (₹599), Pro (₹1799), or Cinematic Exclusive (₹2000) passes with unlimited edits, RSVP management, and WhatsApp delivery.",
    url: `${baseUrl}/pricing`,
    siteName: "Bervic Invitations",
    images: [
      {
        url: "/images/category-wedding.jpg",
        width: 1200,
        height: 630,
        alt: "Bervic Pricing & Plans",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function PricingPage() {
  const quickPlans = [
    {
      name: "Free Explorer Pass",
      price: "₹0",
      originalPrice: "Free Forever",
      period: "No Credit Card Needed",
      desc: "Instant access upon login to explore our full digital suite and create announcement cards.",
      badgeText: "FREE FOREVER",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      buttonText: "Start For Free",
      buttonLink: "/cards",
      isFree: true,
      features: [
        "🎁 2 Free High-Res (1080x1080px) Instagram Card Downloads",
        "👁️ Full Live Interactive Preview of all Digital Invitation Website templates",
        "🛍️ Browse & View all luxury physical cards in the Traditional Shop",
        "✏️ Live Draft Customization & Couple Photo Upload Testing",
        "⚡ Available instantly to every registered user upon login",
      ],
    },
    {
      name: "Instagram Card Pass",
      price: "₹99",
      originalPrice: "₹299",
      period: "One-Time Payment",
      desc: "Need more social announcement cards? Get an extra 5 high-res card download slots anytime.",
      badgeText: "POPULAR ADD-ON",
      badgeColor: "bg-amber-50 text-[#991B1B] border-amber-300",
      buttonText: "Get 5 Card Credits (₹99)",
      buttonLink: "/checkout?plan=CARDS_99",
      isFree: false,
      features: [
        "📸 5 Extra High-Res Instagram Announcement Card Download Slots",
        "🎨 Access to all 31+ luxury wedding & event announcement templates",
        "📥 Crystal-clear PNG & Print-Ready PDF Exports",
        "⚡ Card credits never expire — download whenever you are ready",
        "👑 Perfect for multiple functions (Haldi, Mehendi, Sangeet, Wedding, Reception)",
      ],
    },
  ];

  const plans = [
    {
      name: "Basic Pass",
      originalPrice: "₹1,499",
      price: "₹599",
      period: "6 Months Access",
      desc: "Perfect for intimate weddings and celebrations needing 1 digital invitation website.",
      popular: false,
      isCinematic: false,
      badgeText: "ENTRY PASS",
      badgeColor: "bg-red-50 text-[#991B1B] border-red-200",
      buttonText: "Choose Basic (₹599)",
      buttonLink: "/checkout?plan=BASIC_599",
      features: [
        "1 Standard Digital Invitation Website Slot",
        "Unlimited live edits to your chosen template",
        "2 High-Res (1080x1080px) Instagram Cards",
        "Personalized WhatsApp Guest Inviting with RSVP",
        "Google Maps Venue Directions & Countdown Widget",
        "Active & Hosted for 6 Full Months",
      ],
    },
    {
      name: "Pro Annual Pass",
      originalPrice: "₹3,499",
      price: "₹1,799",
      period: "1 Full Year Access",
      desc: "Our most popular suite for multi-day weddings: Mehendi, Sangeet, Ceremony & Reception.",
      popular: true,
      isCinematic: false,
      badgeText: "MOST POPULAR FOR WEDDINGS",
      badgeColor: "bg-amber-400 text-slate-950 font-black",
      buttonText: "Get Pro Access (₹1,799)",
      buttonLink: "/checkout?plan=PRO_1799",
      features: [
        "4 Standard Digital Invitation Website Slots",
        "Unlimited live edits to all 4 templates anytime",
        "6 High-Res (1080x1080px) Instagram Cards",
        "Personalized WhatsApp Guest Inviting with RSVP",
        "8 High-Res Printable PDF Announcement Exports",
        "Background Music, Audio Player & Photo Gallery",
        "Priority Customer Support via WhatsApp",
        "Active & Hosted for 1 Full Year (12 Months)",
      ],
    },
    {
      name: "Cinematic Pass",
      originalPrice: "₹4,999",
      price: "₹2,000",
      period: "1 Full Year Access",
      desc: "The pinnacle of luxury: 480-Frame Apple-style smooth video scroll sequence invitation.",
      popular: false,
      isCinematic: true,
      badgeText: "CINEMATIC EXCLUSIVE",
      badgeColor: "bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 text-slate-950 font-black",
      buttonText: "Unlock Cinematic (₹2,000)",
      buttonLink: "/checkout?plan=CINEMATIC_2000",
      features: [
        "1 Exclusive 480-Frame Video Scroll Sequence Template",
        "1 Premium Digital Invitation Template Slot",
        "10 High-Res (1080x1080px) Instagram Cards",
        "Personalized WhatsApp Guest Inviting with RSVP",
        "Seamless 60FPS Mobile & Desktop Interactive Video Scrubbing",
        "Full Photo Timeline & Story Chapters",
        "Active & Hosted for 1 Full Year (12 Months)",
      ],
    },
  ];

  const comparisonFeatures = [
    { feature: "Live Preview All Website Templates", free: "Free", basic: "Free", pro: "Free", cinematic: "Free" },
    { feature: "Browse Traditional Cards Shop", free: "Included", basic: "Included", pro: "Included", cinematic: "Included" },
    { feature: "Instagram 1080x1080 Cards", free: "2 Cards Free", basic: "2 Cards", pro: "6 Cards", cinematic: "10 Cards" },
    { feature: "Hosted Digital Website Slots", free: "—", basic: "1 Website", pro: "4 Websites", cinematic: "1 Cinematic + 1 Premium" },
    { feature: "Access Duration", free: "Forever", basic: "6 Months", pro: "12 Months", cinematic: "12 Months" },
    { feature: "Apple-Style Scroll Sequence", free: "—", basic: "—", pro: "—", cinematic: "480-Frame Included" },
    { feature: "Custom Music & RSVP Tracking", free: "—", basic: "Included", pro: "Included", cinematic: "Included" },
    { feature: "WhatsApp Personalized Invites", free: "—", basic: "Included", pro: "Included", cinematic: "Included" },
    { feature: "Printable PDF Vector Export", free: "—", basic: "—", pro: "8 Exports", cinematic: "10 Exports" },
    { feature: "Priority WhatsApp Assistance", free: "—", basic: "Standard", pro: "VIP WhatsApp", cinematic: "VIP WhatsApp" },
  ];

  const faqs = [
    {
      q: "What do I get with the Free Plan?",
      a: "Every registered and logged-in user automatically gets 2 Free High-Res Instagram Card downloads (1080x1080 PNG & PDF), full live preview access to all digital website templates, and complete browsing access to our Traditional Print Shop catalog.",
    },
    {
      q: "How does the ₹99 Instagram Card Pass work?",
      a: "The ₹99 Card Pass grants you 5 additional High-Resolution Instagram Card download credits. The credits never expire, and you can use them across any of our 31+ luxury announcement templates.",
    },
    {
      q: "Can I preview my invitation website before purchasing a pass?",
      a: "Yes, 100%! You can customize and live-preview every wedding, birthday, and religious function template on your own mobile and desktop devices completely free before activating your pass.",
    },
    {
      q: "What happens when I share my invitation link on WhatsApp?",
      a: "Your guests will receive a customized WhatsApp message with their names and a sleek invitation preview card. When they click the link, they experience your interactive website with RSVP, Google Maps directions, music, countdown, and event schedule.",
    },
    {
      q: "Can I edit the details after purchasing?",
      a: "Absolutely! You have unlimited edits anytime during your pass period. Updates to your venue, timing, or photos reflect instantly on your live invitation URL with zero downtime.",
    },
    {
      q: "How does the Cinematic 480-Frame Pass work?",
      a: "The Cinematic Pass features an Apple-style interactive image sequence that scrubs smoothly at 60 frames per second as the user scrolls, creating a cinematic storytelling experience unmatched by standard invitations.",
    },
    {
      q: "Are physical printed cards included in digital passes?",
      a: "Digital passes cover website hosting, live RSVPs, and digital card exports. Physical printed cards can be ordered separately through our Traditional Print Shop starting from ₹45/card.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-20">
        {/* Header Hero */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#991B1B] text-xs font-bold tracking-wide shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>TRANSPARENT, ONE-TIME PRICING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-serif max-w-3xl mx-auto">
            Choose the Perfect{" "}
            <span
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
                color: "#991B1B",
                fontStyle: "italic",
                fontWeight: 700,
              }}
            >
              Invitation Pass
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            No hidden subscription renewals. Pay once to unlock, customize, and host your celebration websites, RSVP trackers, and digital card suites.
          </p>
        </section>

        {/* SECTION 1: Free Starter Tier & ₹99 Card Pass */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              Starter &amp; Instagram Card Options
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Try for free or get individual social card packs without a full website subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
            {quickPlans.map((plan, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-slate-200 shadow-md hover:border-[#991B1B]/40 hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between"
              >
                {/* Badge */}
                <div
                  className={`absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-xs border ${plan.badgeColor}`}
                >
                  <span>{plan.badgeText}</span>
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-[#991B1B]">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-xs line-through text-slate-400">
                      {plan.originalPrice}
                    </span>
                    <span className="text-xs font-semibold ml-auto px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {plan.period}
                    </span>
                  </div>

                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Features Included:
                    </span>
                    <ul className="space-y-2">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <div className="w-4 h-4 rounded-full bg-red-100 text-[#991B1B] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={plan.buttonLink}
                    className={`w-full py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center ${
                      plan.isFree
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: Full Digital Website Passes */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 mb-20">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#991B1B] text-xs font-bold mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>FULL INVITATION SUITES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Full Hosted Digital Invitation Passes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              Get published digital websites with personalized WhatsApp guest inviting, RSVP tracking, countdowns, and music.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-7 sm:p-8 relative flex flex-col justify-between transition-all duration-300 ${
                  plan.isCinematic
                    ? "bg-slate-950 text-white border-2 border-amber-400 shadow-2xl hover:scale-[1.02]"
                    : plan.popular
                    ? "bg-slate-900 text-white border-2 border-amber-400 scale-[1.02] shadow-2xl hover:scale-[1.04]"
                    : "bg-white text-slate-900 border-2 border-slate-200 shadow-md hover:border-[#991B1B]/40 hover:scale-[1.01]"
                }`}
              >
                {/* Badge */}
                <div
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-md border ${plan.badgeColor}`}
                >
                  {plan.popular ? (
                    <Star className="w-3 h-3 fill-current" />
                  ) : plan.isCinematic ? (
                    <Sparkles className="w-3 h-3 fill-current text-slate-950" />
                  ) : null}
                  <span>{plan.badgeText}</span>
                </div>

                {/* Plan Header */}
                <div className="space-y-4 pt-2">
                  <div>
                    <h3
                      className={`text-2xl font-bold font-serif ${
                        plan.isCinematic
                          ? "text-amber-300"
                          : plan.popular
                          ? "text-amber-300"
                          : "text-[#991B1B]"
                      }`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        plan.isCinematic || plan.popular
                          ? "text-slate-300"
                          : "text-slate-600"
                      }`}
                    >
                      {plan.desc}
                    </p>
                  </div>

                  {/* Price */}
                  <div
                    className={`flex items-baseline gap-2 pt-2 border-t ${
                      plan.isCinematic || plan.popular ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs line-through ${
                        plan.isCinematic || plan.popular ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      {plan.originalPrice}
                    </span>
                    <span
                      className={`text-xs font-semibold ml-auto px-2.5 py-0.5 rounded-full border ${
                        plan.isCinematic || plan.popular
                          ? "bg-white/10 text-amber-300 border-amber-300/30"
                          : "bg-red-50 text-[#991B1B] border-red-200"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  {/* Features List */}
                  <div
                    className={`space-y-3 pt-4 border-t ${
                      plan.isCinematic || plan.popular ? "border-slate-800" : "border-slate-100"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                        plan.isCinematic
                          ? "text-amber-300"
                          : plan.popular
                          ? "text-amber-300"
                          : "text-[#991B1B]"
                      }`}
                    >
                      Everything Included:
                    </span>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              plan.isCinematic
                                ? "bg-amber-400 text-slate-950"
                                : plan.popular
                                ? "bg-amber-400 text-slate-950"
                                : "bg-[#991B1B] text-white"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span
                            className={
                              plan.isCinematic || plan.popular
                                ? "text-slate-200"
                                : "text-slate-700"
                            }
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-8">
                  <Link
                    href={plan.buttonLink}
                    className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all text-center ${
                      plan.isCinematic
                        ? "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 hover:brightness-110 font-extrabold"
                        : plan.popular
                        ? "bg-amber-400 text-slate-950 hover:bg-amber-300 font-extrabold"
                        : "bg-[#991B1B] text-white hover:bg-[#7F1D1D]"
                    }`}
                  >
                    <span>{plan.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Feature Comparison Table */}
        <section className="max-w-[1000px] mx-auto px-4 sm:px-6 mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Detailed Plan Comparison
            </h2>
          </div>

          <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-lg">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 sm:p-5 font-bold text-slate-900">Features</th>
                  <th className="p-4 sm:p-5 font-bold text-emerald-800 bg-emerald-50/50">Free (₹0)</th>
                  <th className="p-4 sm:p-5 font-bold text-[#991B1B]">Basic (₹599)</th>
                  <th className="p-4 sm:p-5 font-bold text-amber-700 bg-amber-50/70">Pro (₹1,799)</th>
                  <th className="p-4 sm:p-5 font-bold text-slate-900">Cinematic (₹2,000)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonFeatures.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-slate-800">{row.feature}</td>
                    <td className="p-4 sm:p-5 font-medium text-emerald-700 bg-emerald-50/20">{row.free}</td>
                    <td className="p-4 sm:p-5 text-slate-600">{row.basic}</td>
                    <td className="p-4 sm:p-5 font-bold text-amber-800 bg-amber-50/40">{row.pro}</td>
                    <td className="p-4 sm:p-5 font-bold text-slate-900">{row.cinematic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#991B1B] text-xs font-bold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-[#991B1B] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-4">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
