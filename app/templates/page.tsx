"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { templatesRegistry } from "@/data/templatesRegistry";
import { Search, Sparkles, ExternalLink, Edit3, Crown } from "lucide-react";

export default function TemplateGalleryPage() {
  const { data: session } = useSession();
  const router = useRouter();

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
    <div className="min-h-screen flex flex-col bg-[#F8F3EA] text-[#221C17]">
      <Navbar />

      {/* Gallery Header */}
      <section className="pt-36 md:pt-40 pb-12 bg-gradient-to-b from-[#F8F3EA] via-[#F4EBDB] to-[#F8F3EA] text-center border-b border-[#D9A441]/20">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A441]/20 text-[#8B6519] border border-[#D9A441]/40 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DESIGN LIBRARY</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#221C17]">
            Select Your <span className="font-accent text-[#D9A441]">Invitation Template</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#221C17]/75 max-w-xl mx-auto">
            Choose a design, customize couple names, photos, timings, and map locations, and save to your account.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-[#7A1F2B] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates (e.g. Royal, Floral, Puja)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#F8F3EA] border-2 border-[#D9A441]/40 text-sm focus:outline-none focus:border-[#7A1F2B] shadow-sm"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#7A1F2B] text-[#F8F3EA] shadow-md"
                    : "bg-[#EFE7D8] text-[#221C17]/70 hover:text-[#221C17] border border-[#D9A441]/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <main className="flex-1 max-w-[1200px] mx-auto px-4 sm:px-6 py-16 w-full">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-20 bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-[#221C17]">No templates found</h3>
            <p className="text-sm text-[#221C17]/60 mt-1">Try clearing your search query or selecting a different category filter.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-[#F8F3EA] border border-[#D9A441]/30 rounded-3xl overflow-hidden card-shadow flex flex-col justify-between hover:border-[#D9A441] transition-all group"
              >
                {/* Template Image Header */}
                <div className="relative h-[240px] w-full overflow-hidden bg-[#221C17]">
                  <Image
                    src={tpl.previewImage}
                    alt={tpl.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#221C17]/70 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${tpl.badgeColor} backdrop-blur-md`}>
                      {tpl.categoryLabel}
                    </span>

                    {tpl.isPremium ? (
                      <span className="px-3 py-1 rounded-full bg-[#D9A441] text-[#221C17] text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Crown className="w-3.5 h-3.5" />
                        <span>PREMIUM</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#5B8C69] text-[#F8F3EA] text-xs font-bold uppercase tracking-wider shadow-md">
                        FREE
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-3 left-4 text-xs font-accent italic text-[#D9A441]">
                    {tpl.styleTag}
                  </span>
                </div>

                {/* Template Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#221C17] mb-2">{tpl.title}</h3>
                    <p className="text-xs sm:text-sm text-[#221C17]/70 leading-relaxed mb-6">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#D9A441]/20">
                    <Link
                      href={`/templates/${tpl.slug}`}
                      className="py-2.5 px-3 rounded-full border border-[#D9A441] text-[#221C17] text-xs font-semibold hover:bg-[#D9A441]/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#7A1F2B]" />
                      <span>Preview</span>
                    </Link>

                    <Link
                      href={`/templates/customize/${tpl.slug}?from=templates`}
                      className="btn-maroon py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span>Customize</span>
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
