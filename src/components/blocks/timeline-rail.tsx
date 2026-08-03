"use client";

import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/content/schemas";

import {
  FileText,
  Clock,
  CheckCircle2,
  Mic,
  Users,
  Rocket,
  Lightbulb,
  Moon,
  Package,
  Scale,
  Trophy,
} from "lucide-react";

// Icon mapping to convert icon string keys into Lucide SVG icons
const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileText,
  Clock,
  CheckCircle2,
  Mic,
  Users,
  Rocket,
  Lightbulb,
  Moon,
  Package,
  Scale,
  Trophy,
};

interface TimelineRailProps {
  events: TimelineEvent[];
}

export function TimelineRail({ events }: TimelineRailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });

  // Group events by day
  const grouped = events.reduce<Record<number, TimelineEvent[]>>((acc, ev) => {
    const day = ev.day ?? 0;
    if (!acc[day]) acc[day] = [];
    acc[day].push(ev);
    return acc;
  }, {});

  const dayLabels: Record<number, string> = {
    0: "PRE-EVENT PHASE",
    1: "DAY 1 — KICKOFF & HACKING",
    2: "DAY 2 — SUBMISSION & JUDGING",
  };

  return (
    <div ref={containerRef} className="relative max-w-5xl mx-auto py-8">
      {/* Central Progress rail */}
      <div className="absolute left-[18px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-white/10">
        <motion.div
          className="w-full bg-gradient-to-b from-orange-500 via-orange-400 to-orange-600 origin-top"
          style={{ scaleY: scrollYProgress, height: "100%" }}
        />
      </div>

      {Object.entries(grouped).map(([day, dayEvents]) => (
        <div key={day} className="mb-16 relative">
          {/* Day label badge - cleanly centered with flex centering so badge remains aligned regardless of label length */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 relative z-30 flex items-center justify-center"
          >
            <span className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-bg-surface-2 border border-orange-500/40 text-orange-400 text-xs font-mono font-bold tracking-widest shadow-2xl">
              {dayLabels[Number(day)] || `DAY ${day}`}
            </span>
          </motion.div>

          {dayEvents.map((event, i) => {
            const isLeft = i % 2 === 0;
            const IconComponent = iconMap[event.icon || ""] || FileText;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative flex items-start mb-8 md:mb-12",
                  "pl-12 md:pl-0",
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Node dot - centered flex container for exact optical alignment on timeline rail */}
                <div className="absolute left-[12px] md:left-1/2 md:-translate-x-1/2 w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-bg-surface-1 z-20 mt-5 glow-orange-sm flex items-center justify-center" />

                {/* Content card */}
                <div className={cn("md:w-[calc(50%-2rem)]", isLeft ? "md:text-right" : "md:text-left")}>
                  <div className="glass-panel p-6 card-hover glass-panel-hover border-white/10 space-y-3 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Switched to Lucide SVG line icon to ensure brand consistency */}
                      <span className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                        <IconComponent size={16} />
                      </span>
                      <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20">
                        {new Date(event.datetime).toLocaleTimeString("en-IN", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>

                    <h3 className="text-heading-3 font-display text-gray-050">
                      {event.label}
                    </h3>

                    {event.description && (
                      <p className="text-caption text-gray-300 leading-relaxed font-normal line-clamp-2 mx-auto">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
