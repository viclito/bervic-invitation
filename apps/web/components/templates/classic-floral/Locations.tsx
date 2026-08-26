"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LocationVenue } from "@/types/template";
import { Heart, MapPin, ExternalLink } from "lucide-react";

interface LocationsProps {
  locations: LocationVenue[];
}

const DEFAULT_LOCATIONS_FALLBACK = [
  "/templates/ceremony-wedding-bg.png",
  "/templates/peach-mandap-bg.png",
];

export default function Locations({ locations }: LocationsProps) {
  const safeLocations = Array.isArray(locations) && locations.length > 0 ? locations : [];

  if (safeLocations.length === 0) {
    return null;
  }

  return (
    <section id="locations" className="py-24 md:py-32 bg-[#F9EBEA]/60 relative overflow-hidden">
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
            Venues &amp; Locations
          </h2>
          <p className="text-sm sm:text-base text-[#2B2320]/75 mt-3">
            Find directions and map locations for our wedding celebrations.
          </p>
        </motion.div>

        {/* Side-by-Side Venue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {safeLocations.map((loc, idx) => {
            const locImage =
              loc?.image && typeof loc.image === "string" && loc.image.trim() !== ""
                ? loc.image.trim()
                : DEFAULT_LOCATIONS_FALLBACK[idx % DEFAULT_LOCATIONS_FALLBACK.length];
            const locName = loc?.name?.trim() || loc?.venueLabel?.trim() || `Venue ${idx + 1}`;
            const venueLabel = loc?.venueLabel?.trim() || loc?.name?.trim() || "Celebration Venue";
            const address = loc?.address?.trim() || "Address details to be shared";
            const mapLink = loc?.mapLink?.trim() || "https://maps.google.com";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#FDF6F3] border border-[#C9A15A]/30 rounded-3xl overflow-hidden card-shadow flex flex-col justify-between group hover:border-[#B85C6B] transition-all"
              >
                {/* Venue Photo */}
                <div className="relative h-[220px] sm:h-[260px] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={locImage}
                    alt={locName}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2B2320]/70 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 bg-[#B85C6B] text-[#FDF6F3] text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {locName}
                  </span>
                </div>

                {/* Venue Info */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-accent font-bold text-[#2B2320] mb-2">
                      {venueLabel}
                    </h3>

                    <div className="flex items-start gap-2 text-xs sm:text-sm text-[#2B2320]/80 mb-6 leading-relaxed">
                      <MapPin className="w-4 h-4 text-[#B85C6B] shrink-0 mt-0.5" />
                      <span>{address}</span>
                    </div>
                  </div>

                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-5 rounded-full border border-[#B85C6B] text-[#B85C6B] text-xs sm:text-sm font-semibold hover:bg-[#B85C6B] hover:text-[#FDF6F3] transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C9A15A] group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
