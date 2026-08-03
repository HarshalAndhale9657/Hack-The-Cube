"use client";

import { Counter } from "@/components/motion/counter";
import { siteConfig } from "@/content/site-config";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

export function StatBar() {
  return (
    <section id="stats" className="relative overflow-hidden py-10 md:py-12 border-y border-white/5 bg-bg-surface-2/40">
      <div
        className="relative w-full mx-auto"
        style={{
          maxWidth: "var(--container-max)",
          paddingInline: "var(--container-padding)",
        }}
      >
        <ScrollReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 items-center text-center">
            {siteConfig.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  "flex flex-col items-center group transition-all duration-300",
                  /* Center the last item if odd count on 2-col mobile */
                  siteConfig.stats.length % 2 !== 0 && i === siteConfig.stats.length - 1 && "col-span-2 sm:col-span-1"
                )}
              >
                <Counter
                  value={stat.value}
                  prefix={"prefix" in stat ? String(stat.prefix) : ""}
                  suffix={stat.suffix}
                  className="whitespace-nowrap inline-flex items-center justify-center text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-050 group-hover:text-orange-500 transition-colors duration-300"
                />
                <span className="text-caption text-gray-400 font-mono mt-1.5 tracking-wide uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
