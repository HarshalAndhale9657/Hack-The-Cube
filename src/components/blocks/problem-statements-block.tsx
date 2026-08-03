"use client";

import { Lock, CalendarClock } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function ProblemStatementsBlock() {
  return (
    <ScrollReveal>
      <GlassCard className="max-w-3xl mx-auto p-12 md:p-16 text-center space-y-6 border-white/10">
        <div className="w-20 h-20 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
          <Lock className="text-orange-500" size={36} />
        </div>

        <h3 className="text-heading-1 text-gray-050 font-display">
          Released on the Day of Hackathon
        </h3>

        <p className="text-body-lg text-gray-300 leading-relaxed max-w-lg mx-auto">
          Problem statements will be revealed during the inaugural session on the day
          of the event. Stay tuned and come prepared to innovate!
        </p>

        <div className="flex items-center justify-center gap-2 text-caption text-gray-400 font-mono pt-2">
          <CalendarClock size={16} className="text-orange-500" />
          <span>October 4, 2026 — Event Day</span>
        </div>
      </GlassCard>
    </ScrollReveal>
  );
}
