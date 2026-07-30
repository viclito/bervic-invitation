"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Sun, ExternalLink } from "lucide-react";

export default function TemplateCategories() {
  const categories = [
    {
      id: "wedding",
      tag: "WEDDING & ENGAGEMENT",
      tagStyle: "bg-[#D9A441]/20 text-[#8B6519] border-[#D9A441]/50",
      title: "Wedding Invitations",
      accentTitle: "Royal & Elegant",
      description:
        "From Royal Rajasthani motifs to modern minimal pastel themes, create complete multi-event wedding invite suites including Sangeet, Mehendi, Haldi, and Reception.",
      image: "/images/category-wedding.jpg",
      icon: Heart,
      reverse: false,
      link: "/templates",
      buttonText: "Browse Wedding Templates",
    },
    {
      id: "birthday",
      tag: "BIRTHDAY & MILESTONES",
      tagStyle: "bg-[#4A7B9D]/20 text-[#2C526C] border-[#4A7B9D]/50",
      title: "Birthday & Celebrations",
      accentTitle: "Joyful & Trendy",
      description:
        "Celebrate 1st birthdays, 18th milestones, 50th jubilees, and anniversaries with vibrant animated invites and custom photo upload cards.",
      image: "/images/category-birthday.jpg",
      icon: Sparkles,
      reverse: true,
      link: "/templates",
      buttonText: "Explore Birthday Designs",
    },
    {
      id: "religious",
      tag: "RELIGIOUS & FESTIVAL",
      tagStyle: "bg-[#5B8C69]/20 text-[#375B42] border-[#5B8C69]/50",
      title: "Religious & Festival Functions",
      accentTitle: "Divine & Traditional",
      description:
        "Sacred templates for Satyanarayan Puja, Griha Pravesh, Housewarming, Ganesh Chaturthi, Diwali celebrations, and Naming Ceremonies (Namkaran).",
      image: "/images/category-religious.jpg",
      icon: Sun,
      reverse: false,
      link: "/templates",
      buttonText: "Explore Puja Designs",
    },
  ];

  return (
    <section id="templates" className="py-24 md:py-32 bg-gradient-to-b from-[#F8F3EA] via-[#F4EBDB] to-[#F8F3EA] relative">
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
            EXPLORE OUR COLLECTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221C17]">
            Templates for every <span className="font-accent text-[#D9A441]">unforgettable moment.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#221C17]/75">
            Choose from hundreds of curated designs crafted specifically for Indian traditions and modern aesthetics.
          </p>
        </motion.div>

        {/* Alternating Two-Column Cards */}
        <div className="space-y-16 sm:space-y-24">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F8F3EA]/90 border border-[#D9A441]/20 rounded-3xl p-6 sm:p-10 card-shadow ${
                  cat.reverse ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Content */}
                <div className={`lg:col-span-6 ${cat.reverse ? "lg:order-2" : "lg:order-1"}`}>
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider mb-5 ${cat.tagStyle}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.tag}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#221C17] leading-tight mb-3">
                    {cat.title} — <span className="font-accent text-[#D9A441] font-normal">{cat.accentTitle}</span>
                  </h3>

                  <p className="text-base text-[#221C17]/75 leading-relaxed mb-8">
                    {cat.description}
                  </p>

                  <Link
                    href={cat.link}
                    className="btn-maroon inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold group shadow-md"
                  >
                    <span>{cat.buttonText}</span>
                    <ArrowRight className="w-4 h-4 text-[#D9A441] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Preview Image Link */}
                <div className={`lg:col-span-6 ${cat.reverse ? "lg:order-1" : "lg:order-2"}`}>
                  <Link href={cat.link} className="block relative h-[280px] sm:h-[360px] rounded-2xl overflow-hidden card-shadow group border border-[#D9A441]/20">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#221C17]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-xs font-semibold text-[#F8F3EA] bg-[#7A1F2B] px-4 py-2 rounded-full flex items-center gap-2">
                        <span>Browse Templates</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#D9A441]" />
                      </span>
                    </div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
