"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";
import { Search } from "lucide-react";
import type { FAQItem } from "@/content/schemas";

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filtered = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      search === "" ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "2rem", overflow: "hidden" }}>
      {/* Search Bar */}
      <div className="relative max-w-md mx-auto">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-050 placeholder:text-gray-500 focus:border-orange-500 outline-none transition-all text-body"
        />
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer",
              activeCategory === cat
                ? "bg-orange-500 text-bg-void glow-orange-sm"
                : "bg-white/5 text-gray-300 hover:bg-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <StaggerContainer className="space-y-4">
        {filtered.map((faq) => (
          <StaggerItem key={faq.id}>
            <GlassCard hover={false} className="overflow-hidden border-white/10">
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left group cursor-pointer"
              >
                <span className="text-body text-gray-050 group-hover:text-orange-400 transition-colors font-semibold font-display">
                  {faq.question}
                </span>
                <span
                  className={cn(
                    "w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 transition-transform duration-300 shrink-0 font-bold text-lg",
                    openId === faq.id && "rotate-45 bg-orange-500/20 text-orange-400"
                  )}
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openId === faq.id ? "max-h-[600px] pb-5 px-5 sm:px-6" : "max-h-0"
                )}
              >
                <p className="text-body text-gray-300 border-t border-white/10 pt-4 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {filtered.length === 0 && (
        <p className="text-center text-body text-gray-400 py-8">
          No questions match your search. Try different keywords.
        </p>
      )}
    </div>
  );
}
