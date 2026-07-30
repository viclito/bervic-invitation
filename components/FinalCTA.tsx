import Link from "next/link";
import { Sparkles, Heart, ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#221C17] text-[#F8F3EA] relative overflow-hidden">
      {/* Background Mandala SVG Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg
          className="w-[800px] h-[800px] text-[#D9A441] fill-current animate-spin-slow"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C11.5 5 9.5 7.5 7 9C9.5 10.5 11.5 13 12 16C12.5 13 14.5 10.5 17 9C14.5 7.5 12.5 5 12 2Z" />
          <path d="M12 15C8.5 15 5.5 17.5 4 21C6.5 21.5 9.5 22 12 22C14.5 22 17.5 21.5 20 21C18.5 17.5 15.5 15 12 15Z" />
        </svg>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F2B]/40 border border-[#D9A441]/40 text-[#D9A441] text-xs font-bold uppercase tracking-widest">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>START YOUR CELEBRATION</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F8F3EA] leading-tight max-w-3xl mx-auto">
          Ready to Create Your <span className="font-accent text-[#D9A441] italic">Unforgettable Invitation?</span>
        </h2>

        <p className="text-sm sm:text-base text-[#F8F3EA]/80 max-w-2xl mx-auto leading-relaxed">
          Choose from over 100+ cultural and modern invitation designs, customize your names, date, and venue details, and share instantly with your loved ones.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/templates"
            className="btn-gold px-8 py-4 text-sm font-bold flex items-center gap-2.5 shadow-xl group w-full sm:w-auto justify-center"
          >
            <Sparkles className="w-4 h-4 text-[#7A1F2B]" />
            <span>Create Invitation Now</span>
            <ArrowRight className="w-4 h-4 text-[#7A1F2B] group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/#how-it-works"
            className="px-8 py-4 rounded-full border border-[#D9A441]/40 text-[#F8F3EA] text-sm font-semibold hover:border-[#D9A441] hover:bg-[#F8F3EA]/5 transition-all w-full sm:w-auto justify-center"
          >
            How It Works
          </Link>
        </div>

        <div className="pt-8 flex items-center justify-center gap-8 text-xs text-[#F8F3EA]/60 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5B8C69]"></span>
            <span>No Credit Card Required</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D9A441]"></span>
            <span>Instant WhatsApp Share</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7A1F2B]"></span>
            <span>Free Templates Included</span>
          </span>
        </div>
      </div>
    </section>
  );
}
