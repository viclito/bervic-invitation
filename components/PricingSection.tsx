import Link from "next/link";
import { Check, Sparkles, Star, Zap } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Basic Pass",
      originalPrice: "₹900",
      price: "₹299",
      period: "6 Months",
      desc: "Perfect for couples looking for 1 luxury wedding invitation & Instagram card.",
      popular: false,
      buttonText: "Choose Basic Plan (₹299)",
      buttonLink: "/checkout?plan=BASIC_299",
      features: [
        "1 Wedding Invitation Template Slot",
        "Template locked to chosen design once selected",
        "Unlimited Edits to your chosen template anytime",
        "1 High-Res Instagram Announcement Card (31 styles)",
        "Invite Unlimited Guests via WhatsApp with personalized guest names",
        "Active for 6 Full Months (No auto-delete on event date)",
      ],
    },
    {
      name: "Pro Annual Pass",
      originalPrice: "₹2,000",
      price: "₹999",
      period: "1 Full Year",
      desc: "Ideal for grand wedding celebrations with multiple function templates & card suites.",
      popular: true,
      buttonText: "Choose Pro Plan (₹999)",
      buttonLink: "/checkout?plan=PRO_999",
      features: [
        "4 Wedding Invitation Template Slots",
        "Templates locked per selected slot",
        "Unlimited Edits to all selected templates anytime",
        "6 High-Res Instagram Announcement Cards",
        "Invite Unlimited Guests via WhatsApp with personalized guest names",
        "8 High-Res Printable PDF & Image Export Designs",
        "Active for 1 Full Year (12 Months) (No auto-delete)",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#F8F3EA] text-[#221C17] relative">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 text-[#7A1F2B] text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>TRANSPARENT PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#221C17]">
            Simple & Affordable <span className="font-accent text-[#7A1F2B] italic">Plans</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#221C17]/70 max-w-xl mx-auto">
            Browse and preview designs for free. Subscribe to ₹299 (6 Months) or ₹999 (1 Year) to customize, publish & send personalized WhatsApp invites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 card-shadow relative flex flex-col justify-between transition-all ${
                plan.popular
                  ? "bg-[#221C17] text-[#F8F3EA] border-2 border-[#D9A441] scale-102"
                  : "bg-[#F8F3EA] text-[#221C17] border border-[#D9A441]/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D9A441] text-[#221C17] text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-current" />
                  <span>MOST POPULAR FOR WEDDINGS</span>
                </div>
              )}

              <div>
                <h3 className={`text-xl font-bold ${plan.popular ? "text-[#D9A441]" : "text-[#7A1F2B]"}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mt-1 ${plan.popular ? "text-[#F8F3EA]/70" : "text-[#221C17]/70"}`}>
                  {plan.desc}
                </p>

                <div className="my-6 flex items-baseline gap-2">
                  <span className="line-through text-lg font-semibold opacity-50 text-stone-500">
                    {plan.originalPrice}
                  </span>
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className={`text-xs ${plan.popular ? "text-[#F8F3EA]/60" : "text-[#221C17]/60"}`}>
                    / {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 my-8">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-3 text-xs">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          plan.popular
                            ? "bg-[#D9A441]/20 text-[#D9A441]"
                            : "bg-[#7A1F2B]/10 text-[#7A1F2B]"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className={plan.popular ? "text-[#F8F3EA]/90" : "text-[#221C17]/90"}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.buttonLink}
                className={`w-full py-3.5 rounded-full text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md transition-all ${
                  plan.popular
                    ? "btn-gold text-[#7A1F2B]"
                    : "btn-maroon text-[#F8F3EA]"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{plan.buttonText}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
