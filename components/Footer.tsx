import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#110507] text-white border-t border-red-900/40 pt-16 pb-12 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#991B1B]/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-red-900/40">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-sm border border-red-800/50 group-hover:scale-105 transition-transform duration-300">
                <Image src="/images/logo.svg" alt="Bervic Logo" width={80} height={80} className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Bervic</span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed">
              Crafting timeless digital invitations for life&apos;s most cherished celebrations. Elegance, culture, and modern design combined.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/templates" className="hover:text-amber-300 transition-colors">
                  Digital Invitations
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-300 transition-colors">
                  Traditional Cards Shop
                </Link>
              </li>
              <li>
                <Link href="/cards" className="hover:text-amber-300 transition-colors">
                  Instagram Cards
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-300 transition-colors">
                  Pricing &amp; Plans
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-amber-300 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="mailto:support@bervic.app" className="hover:text-amber-300 transition-colors">Contact Support</a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-amber-300 transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-300 transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <a href="mailto:berglin1998@gmail.com" className="hover:text-amber-300 transition-colors">
                  berglin1998@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href="tel:+919042127115" className="hover:text-amber-300 transition-colors">
                  +91 90421 27115
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Bengaluru &amp; Kochi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© Bervic 2026. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Indian Celebrations</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
