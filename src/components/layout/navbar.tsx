"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/content/site-config";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Section Observer for Active Nav Highlight
  useEffect(() => {
    const sectionIds = [
      "hero",
      "video",
      "speakers",
      "gallery",
      "about",
      "tracks",
      "timeline",
      "prizes",
      "problems",
      "sponsors",
      "team",
      "leadership",
      "venue",
      "faq",
      "register",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setActiveDropdown(null);
      setIsMobileOpen(false);
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Elevated z-index to z-[60] and increased opacity to bg-bg-surface-1/95 to prevent prize glow bleed */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-300",
          isScrolled
            ? "glass-panel rounded-none border-t-0 border-x-0 bg-bg-surface-1/95 backdrop-blur-xl shadow-2xl"
            : "bg-transparent"
        )}
        style={{ height: "var(--navbar-h)" }}
      >
        <nav
          className="w-full mx-auto h-full flex items-center justify-between"
          style={{
            maxWidth: "var(--container-max)",
            paddingInline: "var(--container-padding)",
          }}
        >
          {/* Logo — Left */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="flex items-center gap-2 font-display font-bold text-lg md:text-xl text-gray-050 hover:text-orange-500 transition-colors z-10 shrink-0"
          >
            <span className="text-orange-500 font-mono text-xl">◆</span>
            Hack the Cube
          </a>

          {/* Desktop Navigation — Mega Menu */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {siteConfig.navLinks.map((item) => {
              const hasSub = item.subItems && item.subItems.length > 0;
              const isGroupActive =
                activeSection === item.href ||
                item.subItems?.some((sub) => sub.href === activeSection);

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasSub && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap",
                      isGroupActive
                        ? "text-orange-500 font-semibold bg-orange-500/10"
                        : "text-gray-300 hover:text-gray-050 hover:bg-white/5"
                    )}
                  >
                    {item.label}
                    {hasSub && (
                      <ChevronDown
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          activeDropdown === item.label && "rotate-180 text-orange-500"
                        )}
                      />
                    )}
                  </a>

                  {/* Mega Menu Dropdown */}
                  {hasSub && (
                    <AnimatePresence>
                      {activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-0 mt-1 w-80 p-3 rounded-2xl glass-panel bg-bg-surface-2/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50"
                        >
                          <div className="space-y-1">
                            {item.subItems?.map((sub) => (
                              <a
                                key={sub.label}
                                href={sub.href}
                                onClick={(e) => handleNavClick(e, sub.href)}
                                className={cn(
                                  "block p-3 rounded-xl transition-all group/sub",
                                  activeSection === sub.href
                                    ? "bg-orange-500/15 border border-orange-500/30"
                                    : "hover:bg-white/5 border border-transparent"
                                )}
                              >
                                <div className="text-sm font-semibold text-gray-050 group-hover/sub:text-orange-500 transition-colors flex items-center justify-between">
                                  {sub.label}
                                  <ArrowRight
                                    size={12}
                                    className="opacity-0 -translate-x-1 group-hover/sub:opacity-100 group-hover/sub:translate-x-0 transition-all text-orange-500"
                                  />
                                </div>
                                <p className="text-caption text-gray-400 mt-0.5 line-clamp-1">
                                  {sub.description}
                                </p>
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA + Mobile Hamburger — added shrink-0 to container so button never clips at intermediate viewports */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/register"
              className="btn-primary text-sm py-2.5 px-6 hidden lg:inline-flex shrink-0 whitespace-nowrap"
            >
              Register Now
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-gray-050 transition-colors"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg-void/95 backdrop-blur-2xl"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Content */}
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col justify-between h-full pt-24 pb-8 px-6 overflow-y-auto"
            >
              <div className="space-y-4">
                {siteConfig.navLinks.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="block text-xl font-display font-bold text-orange-500 border-b border-white/5 pb-1"
                    >
                      {item.label}
                    </a>
                    {item.subItems && (
                      <div className="pl-3 space-y-1.5 border-l border-white/10">
                        {item.subItems.map((sub) => (
                          <a
                            key={sub.label}
                            href={sub.href}
                            onClick={(e) => handleNavClick(e, sub.href)}
                            className="block text-sm text-gray-300 hover:text-orange-400 py-1 transition-colors"
                          >
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10">
                <Link
                  href="/register"
                  onClick={() => setIsMobileOpen(false)}
                  className="btn-primary w-full py-4 text-center text-lg"
                >
                  Register Now
                </Link>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
