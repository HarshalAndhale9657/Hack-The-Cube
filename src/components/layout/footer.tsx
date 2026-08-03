"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, ArrowRight, Check } from "lucide-react";
import { siteConfig } from "@/content/site-config";

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
const XIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
  </svg>
);
const YoutubeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const socialIcons = [
  { href: siteConfig.social.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: siteConfig.social.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
  { href: siteConfig.social.twitter, icon: XIcon, label: "X (Twitter)" },
  { href: siteConfig.social.youtube, icon: YoutubeIcon, label: "YouTube" },
].filter((s) => s.href);

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) setSubscribed(true);
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <footer className="border-t border-white/5 bg-bg-void">
      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent" />

      <div
        className="w-full mx-auto"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--container-padding)",
          paddingBlock: "var(--section-padding)",
        }}
      >
        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand & Newsletter column */}
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-1 mb-2 lg:mb-0 space-y-4">
            <a
              href="#hero"
              onClick={(e) => handleAnchorClick(e, "#hero")}
              className="flex items-center gap-2 font-display font-bold text-xl text-gray-050"
            >
              <span className="text-orange-500 font-mono text-xl">◆</span>
              Hack the Cube
            </a>
            <p className="text-caption text-gray-400 leading-relaxed">
              {siteConfig.description}
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-overline text-gray-400 block mb-2 font-mono">Newsletter</span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-caption text-emerald-400 font-semibold">
                  <Check size={16} /> Subscribed to updates!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-caption text-gray-050 placeholder:text-gray-600 focus:border-orange-500 outline-none"
                  />
                  <button type="submit" className="p-2 rounded-lg bg-orange-500 text-bg-void hover:bg-orange-600 transition-colors">
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 pt-2">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-white/5 transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Event links */}
          <div>
            <h3 className="text-overline text-orange-500 mb-4 font-mono">Event</h3>
            <ul className="space-y-2">
              {siteConfig.footerLinks.event.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-caption text-gray-400 hover:text-gray-100 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About links */}
          <div>
            <h3 className="text-overline text-orange-500 mb-4 font-mono">People & Team</h3>
            <ul className="space-y-2">
              {siteConfig.footerLinks.about.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="text-caption text-gray-400 hover:text-gray-100 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-overline text-orange-500 mb-4 font-mono">Resources</h3>
            <ul className="space-y-2">
              {siteConfig.footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith("/") ? (
                    <Link href={link.href} className="text-caption text-gray-400 hover:text-gray-100 transition-colors">
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleAnchorClick(e, link.href)}
                      className="text-caption text-gray-400 hover:text-gray-100 transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-overline text-orange-500 mb-4 font-mono">Support</h3>
            <div className="space-y-3">
              <a
                href={`mailto:${siteConfig.contact.generalEmail}`}
                className="flex items-center gap-2 text-caption text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Mail size={16} />
                {siteConfig.contact.generalEmail}
              </a>
              {siteConfig.contact.phone.map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.number.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-caption text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <Phone size={16} />
                  <span className="truncate">
                    {p.label}: {p.number}
                  </span>
                </a>
              ))}
              <p className="text-caption text-gray-500 pt-1 leading-relaxed">
                For queries, sponsorships, or support — reach out via email or phone.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-caption text-gray-500">
            © {new Date().getFullYear()} Hack the Cube 2026. CSI Student Chapter, DIT Pimpri, Pune.
          </p>
          <p className="text-caption text-gray-500">
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
