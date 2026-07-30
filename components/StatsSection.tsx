"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function StatsSection() {
  const thumbnails = [
    { src: "/images/thumb-wedding.jpg", alt: "Wedding Template Preview", label: "Wedding" },
    { src: "/images/thumb-birthday.jpg", alt: "Birthday Template Preview", label: "Birthday" },
    { src: "/images/thumb-religious.jpg", alt: "Puja Template Preview", label: "Religious" },
    { src: "/images/thumb-anniversary.jpg", alt: "Anniversary Template Preview", label: "Anniversary" },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F8F3EA] relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Row of 4 Rounded Template Preview Thumbnails */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16"
        >
          {thumbnails.map((thumb, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden card-shadow border-2 border-[#D9A441]/30 group cursor-pointer"
            >
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 80px, 112px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#221C17]/70 via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2 inset-x-0 text-center text-[10px] sm:text-xs font-semibold text-[#F8F3EA] tracking-wide">
                {thumb.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Centered Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#221C17] leading-tight">
            Templates crafted with care, <br />
            <span className="font-accent text-[#D9A441]">ready in seconds.</span>
          </h2>
        </motion.div>

        {/* Two Large Stat Callouts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-8 text-center card-shadow relative overflow-hidden group hover:border-[#D9A441] transition-colors"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#D9A441]" />
            <div className="text-5xl sm:text-6xl font-extrabold text-[#7A1F2B] tracking-tight mb-2">
              500<span className="text-[#D9A441]">+</span>
            </div>
            <div className="text-lg font-semibold text-[#221C17] mb-1">Elegantly Designed Templates</div>
            <p className="text-xs text-[#221C17]/60">Across weddings, birthdays, pujas & ceremonies</p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-8 text-center card-shadow relative overflow-hidden group hover:border-[#D9A441] transition-colors"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#7A1F2B]" />
            <div className="text-5xl sm:text-6xl font-extrabold text-[#221C17] tracking-tight mb-2">
              50K<span className="text-[#D9A441]">+</span>
            </div>
            <div className="text-lg font-semibold text-[#221C17] mb-1">Invitations Created & Shared</div>
            <p className="text-xs text-[#221C17]/60">Sent happily via WhatsApp & social media</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
