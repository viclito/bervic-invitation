import Link from "next/link";
import { Check, Sparkles, Star, Zap } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Basic Pass",
      originalPrice: "₹1,499",
      price: "₹599",
      period: "6 Months",
      desc: "Perfect for couples looking for 1 luxury wedding invitation & Instagram card.",
      popular: false,
      isCinematic: false,
      buttonText: "Choose Basic (₹599)",
      buttonLink: "/checkout?plan=BASIC_599",
      features: [
        "1 Standard Wedding Invitation Slot",
        "Unlimited Edits to chosen template",
        "2 High-Res Instagram Cards",
        "WhatsApp Guests with personalized names",
        "Active for 6 Full Months",
      ],
    },
    {
      name: "Pro Annual Pass",
      originalPrice: "₹3,499",
      price: "₹1799",
      period: "1 Full Year",
      desc: "Ideal for grand wedding celebrations with multiple function templates & card suites.",
      popular: true,
      isCinematic: false,
      buttonText: "Choose Pro (₹1799)",
      buttonLink: "/checkout?plan=PRO_1799",
      features: [
        "4 Standard Invitation Slots",
        "Unlimited Edits to all templates anytime",
        "6 High-Res Instagram Cards",
        "WhatsApp Guests with personalized names",
        "8 High-Res Printable PDF Exports",
        "Active for 1 Full Year (12 Months)",
      ],
    },
    {
      name: "Cinematic Pass",
      originalPrice: "₹4,999",
      price: "₹2000",
      period: "1 Full Year",
      desc: "Exclusive 480-Frame Apple-Style Video Scroll invitation.",
      popular: false,
      isCinematic: true,
      buttonText: "Choose Cinematic (₹2000)",
      buttonLink: "/checkout?plan=CINEMATIC_2000",
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
    <section id="pricing" className="py-24 bg-[#F8F3EA] text-[#221C17] relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 text-[#7A1F2B] text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#221C17]">
            Simple & Affordable <span className="font-accent text-[#7A1F2B] italic">Plans</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#221C17]/70 max-w-xl mx-auto">
            Browse and live-preview all designs anytime. Choose ₹599 (Basic), ₹1799 (Pro), or ₹2000 (Cinematic Exclusive) to customize & publish.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-7 card-shadow relative flex flex-col justify-between transition-all ${
                plan.isCinematic
                  ? "bg-[#0D0D0D] text-[#FDF6F3] border-2 border-[#D9A441] shadow-2xl"
                  : plan.popular
                  ? "bg-[#221C17] text-[#F8F3EA] border-2 border-[#D9A441] scale-102"
                  : "bg-[#F8F3EA] text-[#221C17] border border-[#D9A441]/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D9A441] text-[#221C17] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  <span>MOST POPULAR FOR WEDDINGS</span>
                </div>
              )}

              {plan.isCinematic && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 fill-current text-[#070707]" />
                  <span>CINEMATIC MASTERPIECE</span>
                </div>
              )}

              <div>
                <h3
                  className={`text-xl font-bold ${
                    plan.isCinematic
                      ? "text-[#F7E7C4]"
                      : plan.popular
                      ? "text-[#D9A441]"
                      : "text-[#7A1F2B]"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    plan.isCinematic || plan.popular
                      ? "text-[#F8F3EA]/70"
                      : "text-[#221C17]/70"
                  }`}
                >
                  {plan.desc}
                </p>

                <div className="my-6 flex items-baseline gap-2">
                  <span className="line-through text-lg font-semibold opacity-50 text-stone-500">
                    {plan.originalPrice}
                  </span>
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      plan.isCinematic ? "text-[#D9A441]" : ""
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-xs ${
                      plan.isCinematic || plan.popular
                        ? "text-[#F8F3EA]/60"
                        : "text-[#221C17]/60"
                    }`}
                  >
                    / {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 my-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-xs">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.isCinematic || plan.popular
                            ? "bg-[#D9A441]/20 text-[#D9A441]"
                            : "bg-[#7A1F2B]/10 text-[#7A1F2B]"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={
                          plan.isCinematic || plan.popular
                            ? "text-[#F8F3EA]/90"
                            : "text-[#221C17]/90"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.buttonLink}
                className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  plan.isCinematic
                    ? "bg-gradient-to-r from-[#D9A441] via-[#F7E7C4] to-[#D9A441] text-[#070707] hover:scale-[1.02]"
                    : plan.popular
                    ? "bg-[#D9A441] text-[#221C17] hover:bg-[#c49235]"
                    : "bg-[#7A1F2B] text-[#F8F3EA] hover:bg-[#601822]"
                }`}
              >
                <span>{plan.buttonText}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
