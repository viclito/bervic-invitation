import Link from "next/link";
import { Check, Sparkles, Star, Zap, ArrowRight, Crown } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Free Explorer",
      price: "₹0",
      originalPrice: "Free Forever",
      period: "No Card Needed",
      desc: "Instantly create & export announcement cards with full interactive website previews.",
      badgeText: "FREE FOREVER",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
      buttonText: "Start Free (2 Cards)",
      buttonLink: "/cards",
      popular: false,
      isCinematic: false,
      features: [
        "2 Free High-Res (1080x1080px) Instagram Cards",
        "Live interactive preview of all website templates",
        "Browse full Traditional Print Shop catalog",
        "Live draft customization & photo testing",
      ],
    },
    {
      name: "Basic Pass",
      originalPrice: "₹1,499",
      price: "₹599",
      period: "6 Months",
      desc: "Perfect for couples looking for 1 luxury wedding invitation website & Instagram cards.",
      badgeText: "MOST POPULAR",
      badgeColor: "bg-amber-400 text-slate-900 border-amber-400",
      buttonText: "Choose Basic (₹599)",
      buttonLink: "/checkout?plan=BASIC_599",
      popular: true,
      isCinematic: false,
      features: [
        "1 Standard Wedding Invitation Website Slot",
        "Unlimited Edits to chosen template",
        "2 High-Res Instagram Cards",
        "WhatsApp Guests with personalized names & RSVPs",
        "Active for 6 Full Months",
      ],
    },
    {
      name: "Cinematic Pass",
      originalPrice: "₹4,999",
      price: "₹2000",
      period: "1 Full Year",
      desc: "Exclusive 480-Frame Apple-Style Video Scroll invitation with 3D depth & effects.",
      badgeText: "CINEMATIC MASTERPIECE",
      badgeColor: "bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707]",
      buttonText: "Choose Cinematic (₹2000)",
      buttonLink: "/checkout?plan=CINEMATIC_2000",
      popular: false,
      isCinematic: true,
      features: [
        "1 Exclusive 480-Frame Scroll Sequence Template",
        "1 Premium Invitation Template Slot",
        "10 High-Res Instagram Cards",
        "WhatsApp Guests with personalized RSVP",
        "Active for 1 Full Year (12 Months)",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white text-slate-900 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#991B1B] text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-serif">
            Simple &amp; Affordable <span className="font-accent text-[#991B1B] italic">Plans</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Get started for free with Instagram cards, or choose a complete digital invitation pass with live WhatsApp RSVPs.
          </p>
        </div>

        {/* 3 Main Pricing Passes Grid: Free, ₹599, ₹2000 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-7 relative flex flex-col justify-between transition-all ${
                plan.isCinematic
                  ? "bg-[#0D0D0D] text-[#FDF6F3] border-2 border-amber-400 shadow-2xl hover:scale-[1.02]"
                  : plan.popular
                  ? "bg-[#991B1B] text-white border-2 border-amber-300 shadow-2xl md:scale-105"
                  : "bg-white text-slate-900 border-2 border-slate-200 shadow-md hover:border-[#991B1B]/40 hover:shadow-xl"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{plan.badgeText}</span>
                </div>
              )}

              {plan.isCinematic && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 fill-current text-[#070707]" />
                  <span>{plan.badgeText}</span>
                </div>
              )}

              {!plan.popular && !plan.isCinematic && (
                <div
                  className={`absolute -top-3.5 left-6 px-3.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-xs border ${plan.badgeColor}`}
                >
                  <span>{plan.badgeText}</span>
                </div>
              )}

              <div>
                <h3
                  className={`text-xl font-bold font-serif ${
                    plan.isCinematic
                      ? "text-[#F7E7C4]"
                      : plan.popular
                      ? "text-amber-300"
                      : "text-[#991B1B]"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    plan.isCinematic || plan.popular
                      ? "text-white/80"
                      : "text-slate-600"
                  }`}
                >
                  {plan.desc}
                </p>

                <div className="my-6 flex items-baseline gap-2 pt-2 border-t border-slate-100/20">
                  {plan.originalPrice && (
                    <span
                      className={`text-sm font-semibold ${
                        plan.price === "₹0"
                          ? "hidden"
                          : "line-through opacity-60 text-slate-400"
                      }`}
                    >
                      {plan.originalPrice}
                    </span>
                  )}
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      plan.isCinematic
                        ? "text-amber-300"
                        : plan.popular
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-xs ${
                      plan.isCinematic || plan.popular
                        ? "text-white/70"
                        : "text-slate-500"
                    }`}
                  >
                    {plan.price === "₹0" ? "" : `/ ${plan.period}`}
                  </span>
                  {plan.price === "₹0" && (
                    <span className="text-xs font-semibold ml-auto px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {plan.period}
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                      plan.isCinematic || plan.popular
                        ? "text-white/60"
                        : "text-slate-400"
                    }`}
                  >
                    Features Included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            plan.isCinematic || plan.popular
                              ? "bg-white/20 text-white"
                              : "bg-red-100 text-[#991B1B]"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span
                          className={
                            plan.isCinematic || plan.popular
                              ? "text-white"
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

              <div className="pt-8">
                <Link
                  href={plan.buttonLink}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all text-center ${
                    plan.isCinematic
                      ? "bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] hover:scale-[1.02]"
                      : plan.popular
                      ? "bg-white text-[#991B1B] hover:bg-red-50"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
