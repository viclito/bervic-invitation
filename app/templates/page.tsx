"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { templatesRegistry } from "@/data/templatesRegistry";
import TemplateCardGraphic from "@/components/templates/TemplateCardGraphic";
import { Search, ExternalLink, Edit3, Crown, Palette } from "lucide-react";

export default function TemplateGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "wedding", label: "Weddings" },
    { id: "birthday", label: "Birthdays" },
    { id: "religious", label: "Religious & Pujas" },
    { id: "anniversary", label: "Anniversaries" },
  ];

  const filteredTemplates = templatesRegistry.filter((tpl) => {
    const matchesCategory =
      selectedCategory === "all" || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.styleTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5EEE0" }}>
      <Navbar />

      {/* ── Hero Header ── */}
      <section className="pt-36 pb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A84C]/60 bg-white/60 text-[#7A6520] text-[11px] font-semibold uppercase tracking-widest mb-6 shadow-sm">
          <Palette className="w-3.5 h-3.5" />
          <span>Design Library</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight text-[#1A1410] leading-tight">
          Select Your{" "}
          <span
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              color: "#C9A84C",
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            Invitation Template
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#1A1410]/65 max-w-md mx-auto leading-relaxed">
          Choose from our curated collection, personalize details, and create stunning
          invitations for any occasion.
        </p>

        {/* Search Bar */}
        <div className="mt-7 max-w-sm mx-auto relative">
          <Search className="w-4 h-4 text-[#8B7345] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border border-[#D9C88A]/50 text-sm text-[#1A1410] placeholder-[#A89060] focus:outline-none focus:border-[#C9A84C] shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all border ${
                selectedCategory === cat.id
                  ? "bg-[#7A1F2B] text-white border-[#7A1F2B] shadow-sm"
                  : "bg-white text-[#1A1410]/70 border-[#D9C88A]/50 hover:border-[#C9A84C] hover:text-[#1A1410]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Templates Grid ── */}
      <main className="flex-1 max-w-[1380px] mx-auto px-4 sm:px-6 pb-20 w-full">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#D9C88A]/30 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#1A1410]">No templates found</h3>
            <p className="text-sm text-[#1A1410]/60 mt-1">
              Try clearing your search query or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="btn-maroon mt-4 px-6 py-2.5 text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="flex flex-col group transition-all duration-300"
              >
                {/* ── Card Graphic Container ── */}
                <Link
                  href={`/templates/customize/${tpl.slug}?from=templates`}
                  className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden flex-shrink-0 cursor-pointer block group-hover:scale-[1.02] transition-transform duration-300"
                  style={{
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(217,200,138,0.4)",
                  }}
                >
                  <TemplateCardGraphic template={tpl} />

                  {/* Bottom-Right Overlay Quick Action Buttons */}
                  <div
                    className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href={`/templates/${tpl.slug}`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7A1F2B] text-white flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all"
                      title="Live Preview Demo"
                    >
                      <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                    </Link>
                    <Link
                      href={`/templates/customize/${tpl.slug}?from=templates`}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#F8F3EA] text-[#7A1F2B] border border-[#D9A441]/50 flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all"
                      title="Customize Template"
                    >
                      <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7A1F2B]" />
                    </Link>
                  </div>
                </Link>

                {/* ── Card Title Below Graphic ── */}
                <Link
                  href={`/templates/customize/${tpl.slug}?from=templates`}
                  className="text-xs sm:text-sm font-bold text-[#1A1410] mt-2 px-0.5 leading-tight line-clamp-1 group-hover:text-[#7A1F2B] transition-colors"
                >
                  {tpl.title}
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
