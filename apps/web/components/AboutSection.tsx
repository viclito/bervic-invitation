import Image from "next/image";
import { Heart, Sparkles, ShieldCheck, Palette, Smartphone, Globe } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: <Palette className="w-5 h-5 text-[#D9A441]" />,
      title: "Cultural & Elegant Templates",
      desc: "Thoughtfully designed for Indian weddings, pujas, birthdays, and anniversaries with vibrant motifs and typography.",
    },
    {
      icon: <Smartphone className="w-5 h-5 text-[#D9A441]" />,
      title: "Instant Mobile & WhatsApp Sharing",
      desc: "Share your customized interactive link directly on WhatsApp, Instagram, or email with one click.",
    },
    {
      icon: <Globe className="w-5 h-5 text-[#D9A441]" />,
      title: "Interactive Venues & Maps",
      desc: "Help guests navigate directly to your celebration venues with integrated Google Maps and event timelines.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#D9A441]" />,
      title: "Secure & Instant Save",
      desc: "Save your customized invitations to your personal dashboard anytime and edit details on the go.",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F3EA] text-[#221C17] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D9A441]/40 group">
              <Image
                src="/images/about-celebration.jpg"
                alt="Bervic Celebration Invitations"
                width={600}
                height={450}
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#221C17]/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-[#F8F3EA] space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9A441]">
                  CRAFTED WITH LOVE
                </span>
                <h3 className="text-xl font-accent font-bold">
                  Designed to Honor Every Indian Tradition
                </h3>
              </div>
            </div>

            {/* Overlay Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#F8F3EA] border-2 border-[#D9A441] rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7A1F2B] text-[#D9A441] flex items-center justify-center font-bold text-base">
                100+
              </div>
              <div>
                <p className="text-xs font-bold text-[#221C17]">Premium Templates</p>
                <p className="text-[10px] text-[#221C17]/60">For Weddings & Events</p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7A1F2B]/10 border border-[#7A1F2B]/20 text-[#7A1F2B] text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>About Bervic Invitations</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#221C17] leading-tight">
              Transforming Traditional Invites into <span className="font-accent text-[#7A1F2B] italic">Digital Masterpieces</span>
            </h2>

            <p className="text-sm text-[#221C17]/80 leading-relaxed">
              Bervic helps you invite your guests with warmth, cultural authenticity, and effortless style. From intimate haldi ceremonies to grand royal wedding receptions, customize your details and share interactive web invitations instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#EFE7D8]/60 border border-[#D9A441]/30 hover:border-[#7A1F2B] transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#7A1F2B]/10 text-[#7A1F2B]">
                      {feat.icon}
                    </div>
                    <h4 className="text-xs font-bold text-[#221C17]">{feat.title}</h4>
                  </div>
                  <p className="text-[11px] text-[#221C17]/70 leading-normal pl-0.5">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
