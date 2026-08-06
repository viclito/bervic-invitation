"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I preview templates before paying?",
      a: "Yes! You can browse and preview all digital invitation templates and 31 Instagram announcement card designs 100% for free. To customize, save, publish, export high-res PDFs, or send WhatsApp invitations, you can select our ₹599 (Basic), ₹1799 (Pro), or ₹2000 (Cinematic Exclusive) plan.",
    },
    {
      q: "How does template locking work?",
      a: "Once you select a template for a slot included in your plan (1 template slot for ₹599, 4 slots for ₹1799, 1 exclusive template slot for ₹2000), that slot is locked to that chosen template design. However, you can edit all details (names, dates, photos, venue maps, timelines) of your selected template as many times as you like!",
    },
    {
      q: "Do my invitations or assets expire after the wedding date?",
      a: "No! Your invitations, cards, and guest RSVPs do NOT auto-delete on your event date. They remain active for the full duration of your subscription (6 months for ₹599, 1 year for ₹1799 and ₹2000), unless you manually delete them.",
    },
    {
      q: "Can I send personalized WhatsApp invitations to guests?",
      a: "Yes! Active plans include unlimited WhatsApp guest invitations with personalized guest names, unique guest links, and 1-click RSVP tracking.",
    },
    {
      q: "What payment methods are supported?",
      a: "We accept all major payment methods including UPI (Google Pay, PhonePe, Paytm), Credit & Debit Cards, and Net Banking securely processed via Razorpay.",
    },
  ];

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#F8F3EA] text-[#221C17] relative">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 text-[#7A1F2B] text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GOT QUESTIONS?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#221C17]">
            Frequently Asked <span className="font-accent text-[#7A1F2B] italic">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#221C17]/70 max-w-xl mx-auto">
            Everything you need to know about creating invitations on Bervic.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-2xl overflow-hidden card-shadow transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#221C17] hover:text-[#7A1F2B] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D9A441] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#7A1F2B]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#221C17]/80 leading-relaxed border-t border-[#D9A441]/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-xs text-[#221C17]/60">
            Have a question that's not answered here? Reach out to our team at{" "}
            <a href="mailto:support@bervic.app" className="text-[#7A1F2B] font-semibold underline">
              support@bervic.app
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
