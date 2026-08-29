"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I preview templates before paying?",
      a: "Yes! You can browse and live-preview all digital invitation templates and 31 Instagram announcement card designs anytime for Free. To customize, save, publish, export high-res PDFs, or send WhatsApp invitations, you can choose our ₹599 (Basic Pass) or ₹2000 (Cinematic Exclusive) plan.",
    },
    {
      q: "How does template locking work?",
      a: "Once you select a template for a slot included in your plan (1 template slot for ₹599, 1 exclusive cinematic sequence template slot for ₹2000), that slot is locked to that chosen template design. However, you can edit all details (names, dates, photos, venue maps, timelines) of your selected template as many times as you like!",
    },
    {
      q: "Do my invitations or assets expire after the wedding date?",
      a: "No! Your invitations, cards, and guest RSVPs do NOT auto-delete on your event date. They remain active for the full duration of your subscription (6 months for ₹599, 1 year for ₹2000), unless you manually delete them.",
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
    <section id="faq" className="py-24 bg-white text-slate-900 relative">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-[#991B1B] text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>GOT QUESTIONS?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Frequently Asked <span className="font-accent text-[#991B1B] italic">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Everything you need to know about creating invitations on Bervic.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-red-200 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-[#991B1B] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#991B1B]" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-xs text-slate-500">
            Have a question that&apos;s not answered here? Reach out to our team at{" "}
            <a href="mailto:support@bervic.app" className="text-[#991B1B] font-semibold underline">
              support@bervic.app
            </a>{" "}
            or chat with us on{" "}
            <a
              href="https://wa.me/919042127115?text=Hi%20Bervic%2C%20I%20have%20an%20enquiry%20regarding%20digital%20invitations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-emerald-700 font-bold inline-flex items-center gap-1 underline"
            >
              WhatsApp (+91 90421 27115)
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
