"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Sun, ExternalLink, CheckCircle2 } from "lucide-react";

export default function TemplateCategories() {
  const categories = [
    {
      id: "wedding",
      tag: "WEDDING & ENGAGEMENT SUITES",
      tagStyle: "bg-[#D9A441]/20 text-[#8B6519] border-[#D9A441]/50",
      title: "Wedding Invitations",
      accentTitle: "Royal & Modern",
      description:
        "From Royal Rajasthani motifs to modern minimal pastel themes, create complete multi-event wedding invite suites for Sangeet, Mehendi, Haldi, Holy Matrimony, and Reception. Share 1-click personalized guest links on WhatsApp with live RSVP tracking.",
      highlights: [
        "💬 1-Click WhatsApp Broadcast",
        "📍 Google Maps Venue Link",
        "📊 Live RSVP Counter",
        "📸 Our Moments Gallery",
      ],
      image: "/images/category-wedding.jpg",
      icon: Heart,
      reverse: false,
      link: "/templates",
      buttonText: "Browse Wedding Templates",
    },
    {
      id: "birthday",
      tag: "BIRTHDAYS & MILESTONES",
      tagStyle: "bg-[#4A7B9D]/20 text-[#2C526C] border-[#4A7B9D]/50",
      title: "Birthday & Celebrations",
      accentTitle: "Joyful & Vibrant",
      description:
        "Make 1st birthdays, 18th milestones, 50th jubilees, and anniversary parties unforgettable. Add animated countdowns, photo timelines, venue maps, and downloadable Instagram story cards for your guests.",
      highlights: [
        "📸 Photo Timelines",
        "⏳ Live Countdown Timer",
        "🗺️ Direct Venue Maps",
        "📱 Instagram Story Cards",
      ],
      image: "/images/category-birthday.jpg",
      icon: Sparkles,
      reverse: true,
      link: "/templates",
      buttonText: "Explore Birthday Designs",
    },
    {
      id: "religious",
      tag: "PUJA & FESTIVAL FUNCTIONS",
      tagStyle: "bg-[#5B8C69]/20 text-[#375B42] border-[#5B8C69]/50",
      title: "Religious & Housewarming",
      accentTitle: "Sacred & Auspicious",
      description:
        "Auspicious invitation websites for Satyanarayan Puja, Griha Pravesh, Housewarming, Namkaran (Naming Ceremony), Ganesh Chaturthi, and Diwali gatherings. Designed with traditional motifs, shlokas, and warm family invites.",
      highlights: [
        "🪔 Traditional Motifs",
        "📜 Shloka & Verse Options",
        "📅 Muhurat Timeline",
        "📍 Simple Map Directions",
      ],
      image: "/images/category-religious.jpg",
      icon: Sun,
      reverse: false,
      link: "/templates",
      buttonText: "Explore Puja & Festival Designs",
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
          <span className="text-[#D9A441] text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 block">
            EXPLORE OUR COLLECTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#221C17]">
            Designs for every <span className="font-accent text-[#D9A441]">cherished celebration.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#221C17]/80 leading-relaxed">
            Whether it's a grand royal wedding, an intimate milestone birthday, or a sacred Griha Pravesh puja — create beautiful interactive digital invitation websites that your guests will love.
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
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#F8F3EA]/90 border border-[#D9A441]/25 rounded-3xl p-6 sm:p-10 card-shadow ${
                  cat.reverse ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Text Content */}
                <div className={`lg:col-span-6 ${cat.reverse ? "lg:order-2" : "lg:order-1"}`}>
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-5 ${cat.tagStyle}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.tag}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#221C17] leading-tight mb-3">
                    {cat.title} — <span className="font-accent text-[#D9A441] font-normal">{cat.accentTitle}</span>
                  </h3>

                  <p className="text-base text-[#221C17]/80 leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-8">
                    {cat.highlights.map((hl, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-2 bg-[#EFE7D8]/70 border border-[#D9A441]/20 px-3 py-2 rounded-xl text-xs font-semibold text-[#221C17]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5B8C69] shrink-0" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

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
                  <Link href={cat.link} className="block relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden card-shadow group border border-[#D9A441]/30">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#221C17]/70 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                      <span className="text-xs font-bold text-[#F8F3EA] bg-[#7A1F2B] px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-[#D9A441]/30">
                        <span>Browse Collection</span>
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
