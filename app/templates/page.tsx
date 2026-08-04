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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
                style={{
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(217,200,138,0.35)",
                }}
              >
                {/* Preview Area */}
                <div className="relative h-[190px] w-full overflow-hidden flex-shrink-0">
                  <TemplateCardGraphic template={tpl} />

                  {/* Category badge – top-left */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/90 text-[#1A1410]/70 border border-black/10 backdrop-blur-sm shadow-sm">
                    {tpl.categoryLabel}
                  </span>

                  {/* Bottom bar: BERVIC SUITE | LIVE DEMO */}
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-between px-3 py-1.5 bg-white/85 backdrop-blur-sm border-t border-black/5">
                    <span className="text-[8px] font-bold tracking-widest text-[#1A1410]/35 uppercase">
                      Bervic Suite
                    </span>
                    <Link
                      href={`/templates/${tpl.slug}`}
                      className="text-[8px] font-bold tracking-widest text-[#7A1F2B]/60 uppercase hover:text-[#7A1F2B] transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live Demo →
                    </Link>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex flex-col flex-1">
                  <h3 className="text-[13px] font-bold text-[#1A1410] leading-snug mb-1 group-hover:text-[#7A1F2B] transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-[11px] text-[#1A1410]/55 leading-relaxed mb-3 line-clamp-2 flex-1">
                    {tpl.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                    <Link
                      href={`/templates/${tpl.slug}`}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-[#D9C88A]/60 text-[10px] font-semibold text-[#1A1410]/70 bg-white hover:border-[#C9A84C] hover:text-[#1A1410] transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Preview
                    </Link>
                    <Link
                      href={`/templates/customize/${tpl.slug}?from=templates`}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "#7A1F2B" }}
                    >
                      <Edit3 className="w-3 h-3" />
                      Customize
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
