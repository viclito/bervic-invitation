"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, Palette, Share2, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Choose & Preview.",
      subtitle: "Browse all designs for free",
      description: "Explore luxury wedding invitation templates and 31 Instagram announcement cards with live instant previews.",
      icon: LayoutGrid,
    },
    {
      step: "02",
      title: "Customize & Select Plan.",
      subtitle: "Personalize text, photos & details",
      description: "Select ₹299 (6 Months) or ₹999 (1 Year) plan to edit host names, photos, venue maps, and event timelines.",
      icon: Palette,
    },
    {
      step: "03",
      title: "Share & Invite.",
      subtitle: "Personalized WhatsApp invites & PDF exports",
      description: "Send personalized WhatsApp invites with guest names and download 8 High-Res Printable PDF designs & Instagram Cards.",
      icon: Share2,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-[#F8F3EA] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[#D9A441] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 block">
            EFFORTLESS PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221C17] leading-tight">
            From blank page to beautiful invite, <br />
            <span className="font-accent text-[#D9A441]">in three simple steps.</span>
          </h2>
        </motion.div>

        {/* 3-Step Cards Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-8 card-shadow relative flex flex-col justify-between group hover:border-[#D9A441] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-extrabold text-[#D9A441]/40 font-accent group-hover:text-[#D9A441] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#7A1F2B]/10 flex items-center justify-center text-[#7A1F2B] group-hover:bg-[#7A1F2B] group-hover:text-[#D9A441] transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#221C17] mb-1">
                    {item.title}
                  </h3>
                  <span className="text-sm font-semibold text-[#7A1F2B] mb-3 block">
                    {item.subtitle}
                  </span>
                  <p className="text-sm text-[#221C17]/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center Graphic Card & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center justify-center gap-8 text-center"
        >
          {/* Small Gold Rounded Card with App-Icon Placeholder Graphic */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden card-shadow border-2 border-[#D9A441] p-2 bg-[#7A1F2B]">
            <Image
              src="/images/how-it-works-icon.jpg"
              alt="Utsav App Icon"
              fill
              loading="lazy"
              sizes="112px"
              className="object-cover rounded-2xl"
            />
          </div>

          <Link
            href="/templates"
            className="btn-maroon px-8 py-4 text-base font-semibold flex items-center gap-3 shadow-xl"
          >
            <Sparkles className="w-5 h-5 text-[#D9A441]" />
            <span>Start Designing Free</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
