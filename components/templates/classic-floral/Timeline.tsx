"use client";

import { motion } from "framer-motion";
import { TimelineStep } from "@/types/template";
import { Heart, Clock, Radio } from "lucide-react";

interface TimelineProps {
  timelineDay: TimelineStep[];
}

export default function Timeline({ timelineDay }: TimelineProps) {
  return (
    <section id="timeline" className="py-20 md:py-28 bg-[#F9EBEA]/60 relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-[#C9A15A] text-xs font-semibold uppercase tracking-widest block mb-2">
            DAY AT A GLANCE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-accent text-[#2B2320]">
            Event Timeline
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
            <Heart className="w-4 h-4 text-[#B85C6B] fill-current" />
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
          </div>
        </motion.div>

        {/* Timeline Layout */}
        <div className="relative">
          {/* Responsive Grid Layout for Desktop & Tablet */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch relative">
            {timelineDay.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center text-center bg-[#FDF6F3] border border-[#C9A15A]/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Icon Node */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-md border-2 transition-all mb-3 ${
                    step.status === "live"
                      ? "bg-[#B85C6B] text-[#FDF6F3] border-[#C9A15A] scale-110 shadow-lg"
                      : step.status === "done"
                      ? "bg-white text-[#2B2320] border-[#C9A15A]/60"
                      : "bg-white text-[#2B2320]/70 border-[#C9A15A]/30"
                  }`}
                >
                  {step.icon || "✨"}
                </div>

                {/* LIVE Badge */}
                {step.status === "live" && (
                  <span className="mb-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B85C6B] text-[#FDF6F3] text-[10px] font-bold uppercase tracking-wider animate-pulse shadow-sm">
                    <Radio className="w-3 h-3 text-[#C9A15A]" />
                    <span>LIVE NOW</span>
                  </span>
                )}

                {/* Time & Title */}
                <span className="text-xs font-bold text-[#B85C6B] uppercase tracking-wider block mb-1">
                  {step.date ? `${step.date} • ${step.time}` : step.time}
                </span>
                <h4 className="text-base font-accent font-bold text-[#2B2320] leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-[#2B2320]/60 mt-1 font-sans">
                  Schedule of Events
                </p>
              </motion.div>
            ))}
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="sm:hidden space-y-4 relative pl-6 border-l-2 border-[#C9A15A]/40 ml-2">
            {timelineDay.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center gap-4 bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-2xl p-4 shadow-sm"
              >
                {/* Node Bullet */}
                <div
                  className={`absolute -left-[33px] w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                    step.status === "live"
                      ? "bg-[#B85C6B] border-[#C9A15A] text-[#FDF6F3]"
                      : "bg-[#FDF6F3] border-[#C9A15A]"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#B85C6B]/10 flex items-center justify-center text-lg shrink-0">
                  {step.icon || "✨"}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-accent font-bold text-[#2B2320]">
                      {step.title}
                    </h4>
                    {step.status === "live" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B85C6B] text-[#FDF6F3] text-[9px] font-bold uppercase animate-pulse">
                        <Radio className="w-2.5 h-2.5 text-[#C9A15A]" />
                        <span>LIVE</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#B85C6B] mt-0.5 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{step.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
