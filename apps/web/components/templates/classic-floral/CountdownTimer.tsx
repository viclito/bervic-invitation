"use client";

import { useState, useEffect } from "react";
import { getWeddingTargetDate } from "@/lib/dateUtils";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";

interface CountdownTimerProps {
  weddingDate: string; // ISOString
  weddingTime?: string;
  coupleImage: string;
  partnerTwoImage?: string;
  partnerOne: string;
  partnerTwo: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export default function CountdownTimer({
  weddingDate,
  weddingTime,
  coupleImage,
  partnerTwoImage,
  partnerOne,
  partnerTwo,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const target = getWeddingTargetDate(weddingDate, weddingTime).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPassed: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [weddingDate, weddingTime]);

  return (
    <section id="countdown" className="py-20 md:py-28 bg-[#F9EBEA]/60 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <span className="text-[#C9A15A] text-xs font-semibold uppercase tracking-widest block mb-2">
            COUNTING DOWN THE SECONDS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-accent text-[#2B2320]">
            Our Big Day
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
            <Heart className="w-4 h-4 text-[#B85C6B] fill-current" />
            <div className="w-10 h-[1px] bg-[#C9A15A]" />
          </div>
        </motion.div>

        {/* Side-by-Side Bride & Groom Circular Photos */}
        <div className="flex flex-row items-center justify-center gap-4 sm:gap-10 mb-12">
          {/* Partner 1 (Bride) Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative w-36 h-36 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#C9A15A]/50 shadow-xl ring-4 ring-[#C9A15A]/10 bg-slate-100">
              <Image
                src={coupleImage?.trim() || "/images/templates/couple-photo.jpg"}
                alt={partnerOne}
                fill
                loading="lazy"
                unoptimized={(coupleImage?.trim() || "").startsWith("http")}
                sizes="(max-width: 640px) 144px, 208px"
                className="object-cover"
              />
            </div>
            <span className="font-serif italic text-base sm:text-xl font-semibold text-[#2B2320]">
              {partnerOne}
            </span>
          </motion.div>

          {/* Floating Heart Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center text-[#B85C6B] z-10 shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FDF6F3] border-2 border-[#C9A15A]/40 flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#B85C6B]" />
            </div>
          </motion.div>

          {/* Partner 2 (Groom) Photo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative w-36 h-36 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#C9A15A]/50 shadow-xl ring-4 ring-[#C9A15A]/10 bg-slate-100">
              <Image
                src={partnerTwoImage?.trim() || "/images/templates/groom-bride-2.jpg"}
                alt={partnerTwo}
                fill
                loading="lazy"
                unoptimized={(partnerTwoImage?.trim() || "").startsWith("http")}
                sizes="(max-width: 640px) 144px, 208px"
                className="object-cover"
              />
            </div>
            <span className="font-serif italic text-base sm:text-xl font-semibold text-[#2B2320]">
              {partnerTwo}
            </span>
          </motion.div>
        </div>

        {/* Live Countdown Cards OR Married Life Celebration Banner */}
        {timeLeft.isPassed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FDF6F3] border-2 border-[#C9A15A] rounded-3xl p-8 max-w-xl mx-auto shadow-lg"
          >
            <h3 className="text-2xl sm:text-3xl font-accent font-bold text-[#B85C6B]">
              🎊 Happy Married Life {partnerOne} & {partnerTwo}! 🎊
            </h3>
            <p className="text-sm text-[#2B2320]/75 mt-2">
              Thank you for celebrating this beautiful milestone with us.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto"
          >
            {/* Days */}
            <div className="bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-2xl p-4 sm:p-6 shadow-sm">
              <span className="text-3xl sm:text-5xl font-accent font-bold text-[#B85C6B]">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs text-[#2B2320]/70 uppercase tracking-wider font-semibold block mt-1">
                Days
              </span>
            </div>

            {/* Hours */}
            <div className="bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-2xl p-4 sm:p-6 shadow-sm">
              <span className="text-3xl sm:text-5xl font-accent font-bold text-[#B85C6B]">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs text-[#2B2320]/70 uppercase tracking-wider font-semibold block mt-1">
                Hours
              </span>
            </div>

            {/* Minutes */}
            <div className="bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-2xl p-4 sm:p-6 shadow-sm">
              <span className="text-3xl sm:text-5xl font-accent font-bold text-[#B85C6B]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs text-[#2B2320]/70 uppercase tracking-wider font-semibold block mt-1">
                Mins
              </span>
            </div>

            {/* Seconds */}
            <div className="bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-2xl p-4 sm:p-6 shadow-sm">
              <span className="text-3xl sm:text-5xl font-accent font-bold text-[#B85C6B]">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs text-[#2B2320]/70 uppercase tracking-wider font-semibold block mt-1">
                Secs
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
