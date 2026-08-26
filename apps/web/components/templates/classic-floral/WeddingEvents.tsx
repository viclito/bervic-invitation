"use client";

import { motion } from "framer-motion";
import { WeddingEvent } from "@/types/template";
import { Heart, Clock, Calendar } from "lucide-react";

interface WeddingEventsProps {
  events: WeddingEvent[];
}

export default function WeddingEvents({ events }: WeddingEventsProps) {
  return (
    <section id="events" className="py-24 md:py-32 bg-[#FDF6F3] relative">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
            <Heart className="w-4 h-4 text-[#B85C6B] fill-current" />
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-accent text-[#2B2320]">
            Wedding Celebrations
          </h2>
          <p className="text-sm sm:text-base text-[#2B2320]/75 mt-3">
            Join us in honor of these special ceremonies and festivities.
          </p>
        </motion.div>

        {/* Dynamic Grid of Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((evt, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-3xl p-6 shadow-sm hover:border-[#B85C6B] transition-all hover:-translate-y-1 group text-center flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#B85C6B]/10 text-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#B85C6B]/20 transition-colors">
                  {evt.icon || "💍"}
                </div>

                <h3 className="text-xl font-accent font-semibold text-[#2B2320] mb-3">
                  {evt.title}
                </h3>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#C9A15A]/20 text-xs font-medium text-[#2B2320]/80">
                <div className="flex items-center justify-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B85C6B]" />
                  <span>{evt.date}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B85C6B]" />
                  <span>{evt.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
