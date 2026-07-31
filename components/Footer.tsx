import Link from "next/link";
import { Sparkles, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#221C17] text-[#F8F3EA] border-t border-[#D9A441]/20 pt-16 pb-12 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#7A1F2B]/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#D9A441]/20">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full bg-[#7A1F2B] flex items-center justify-center text-[#D9A441] shadow-md">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C11.5 5 9.5 7.5 7 9C9.5 10.5 11.5 13 12 16C12.5 13 14.5 10.5 17 9C14.5 7.5 12.5 5 12 2Z" />
                  <path d="M12 15C8.5 15 5.5 17.5 4 21C6.5 21.5 9.5 22 12 22C14.5 22 17.5 21.5 20 21C18.5 17.5 15.5 15 12 15Z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#F8F3EA] tracking-tight">Bervic</span>
            </Link>
            <p className="text-xs text-[#F8F3EA]/70 leading-relaxed">
              Crafting timeless digital invitations for life's most cherished celebrations. Elegance, culture, and modern design combined.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs text-[#F8F3EA]/80">
              <li>
                <Link href="/templates" className="hover:text-[#D9A441] transition-colors">
                  Wedding Templates
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D9A441] transition-colors">
                  Birthday Invitations
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-[#D9A441] transition-colors">
                  Religious & Puja Invites
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#D9A441] transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-xs text-[#F8F3EA]/80">
              <li>
                <a href="mailto:support@bervic.app" className="hover:text-[#D9A441] transition-colors">Contact Support</a>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#D9A441] transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <a href="#" className="hover:text-[#D9A441] transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#D9A441] transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-2 text-xs text-[#F8F3EA]/80">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D9A441]" />
                <a href="mailto:berglin1998@gmail.com" className="hover:text-[#D9A441] transition-colors">
                  berglin1998@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                <a href="tel:+919042127115" className="hover:text-[#D9A441] transition-colors">
                  +91 90421 27115
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Bengaluru & Kochi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F3EA]/50">
          <p>© Bervic 2026. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#7A1F2B] fill-current" />
            <span>for Indian Celebrations</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
