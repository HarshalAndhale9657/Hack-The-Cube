"use client";

import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/glass-card";
import { Counter } from "@/components/motion/counter";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";
import { Trophy, Gift, Award, CheckCircle2, Medal, Bot, Palette, Lightbulb } from "lucide-react";
import type { PrizePool } from "@/content/schemas";

interface PrizePodiumProps {
  prizePool: PrizePool;
}

// Icon mapping for prize tiers using brand-consistent Lucide line-icons
const prizeIconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Trophy,
  Medal,
  Award,
  Bot,
  Palette,
  Lightbulb,
};

const tierStyles: Record<number, { glow: boolean; order: string; badge: string }> = {
  // Switched relative z-20 to relative z-10 to keep podium card below navbar z-50 context
  0: { glow: true, order: "order-1 md:order-2 relative z-10", badge: "bg-gradient-to-r from-orange-500 to-amber-400 text-bg-void border-orange-300 font-extrabold shadow-md inline-flex items-center justify-center" }, // Winner — center
  1: { glow: false, order: "order-2 md:order-1", badge: "bg-white/10 text-gray-200 border-white/20 font-semibold inline-flex items-center justify-center" },    // 1st Runner-up — left
  2: { glow: false, order: "order-3 md:order-3", badge: "bg-white/10 text-gray-200 border-white/20 font-semibold inline-flex items-center justify-center" },    // 2nd Runner-up — right
};

export function PrizePodium({ prizePool }: PrizePodiumProps) {
  const topTiers = prizePool.tiers.slice(0, 3);
  const specialAwards = prizePool.tiers.slice(3);

  return (
    <div className="w-full space-y-16 pt-4">
      {/* Total Pool Counter Header */}
      <ScrollReveal>
        <div className="text-center bg-white/5 p-6 sm:p-8 rounded-3xl border border-white/10 max-w-2xl mx-auto space-y-2" style={{ marginLeft: "22%" }}>
          <span className="text-overline text-orange-500 font-mono tracking-widest block">Total Prize Pool</span>
          <div className="text-display-xl text-orange-500 font-display">
            <Counter value={300000} prefix="₹" suffix="+" />
          </div>
          <p className="text-body text-gray-300 font-medium">in cash prizes, internships, incubation & perks</p>
        </div><br></br><br></br>
      </ScrollReveal>

      {/* Top 3 — Podium Layout */}
      <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4 pb-4">
        {topTiers.map((tier, i) => {
          const style = tierStyles[i] || { glow: false, order: "", badge: "" };
          const IconComp = prizeIconMap[tier.icon || ""] || Trophy;
          return (
            <ScrollReveal key={tier.id} delay={i * 0.15} className={style.order}>
              <GlassCard
                glow={style.glow}
                className={cn(
                  "p-7 sm:p-8 text-center h-full flex flex-col justify-between space-y-6 border-white/10 transition-all duration-300",
                  i === 0 && "border-2 border-orange-500 bg-orange-500/10 shadow-2xl glow-orange md:scale-105 md:-translate-y-3 ring-1 ring-orange-500/50 p-8 sm:p-9 relative z-10"
                )}
              >
                <div className="space-y-4">
                  {/* Clean Icon & Rank Badge — switched to flex centering so rank badge stays optical center */}
                  <div className="flex items-center justify-center gap-2.5">
                    <span className={cn("p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0", i === 0 && "p-3 bg-orange-500/20 border-orange-500/40 text-orange-300 scale-110")}>
                      <IconComp size={i === 0 ? 32 : 24} />
                    </span>
                    <span className={cn("px-3 py-1 rounded-full text-xs font-mono border", style.badge)}>
                      Rank #{i === 0 ? "1 (Winner)" : i === 1 ? "2" : "3"}
                    </span>
                  </div>

                  <h3 className={cn("font-bold font-display text-gray-050", i === 0 ? "text-2xl sm:text-3xl text-orange-400" : "text-xl sm:text-2xl")}>{tier.title}</h3>

                  {tier.cashAmount && (
                    <div className={cn("py-2.5 px-4 rounded-xl border inline-block", i === 0 ? "bg-orange-500/20 border-orange-500/40 shadow-inner" : "bg-orange-500/10 border-orange-500/20")}>
                      <span className={cn("font-display font-bold text-orange-400", i === 0 ? "text-3xl sm:text-4xl" : "text-2xl")}>{tier.cashAmount}</span>
                    </div>
                  )}

                  <ul className="space-y-2.5 pt-3 flex flex-col items-center w-full">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="text-xs sm:text-sm text-gray-300 flex items-center justify-center gap-2.5">
                        <CheckCircle2 size={16} className="text-orange-500 shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </ScrollReveal>
          );
        })}
      </div><br></br>

      {/* Special Awards */}
      {specialAwards.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-heading-1 text-gray-050 text-center font-display flex items-center justify-center gap-2">
            <Award size={24} className="text-orange-500" />
            Special Category Awards
          </h3><br></br>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialAwards.map((tier) => {
              const IconComp = prizeIconMap[tier.icon || ""] || Award;
              return (
                <StaggerItem key={tier.id}>
                  <GlassCard className="p-6 sm:p-8 h-full flex flex-col justify-between space-y-5 border-white/10">
                    <div className="space-y-4 flex flex-col items-center text-center">
                      <div className="flex flex-col items-center gap-3">
                        <span className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                          <IconComp size={24} />
                        </span>
                        <h4 className="text-lg font-bold font-display text-gray-050">{tier.title}</h4>
                      </div>

                      {tier.cashAmount && (
                        <p className="text-xl font-display font-bold text-orange-400">{tier.cashAmount}</p>
                      )}

                      <ul className="space-y-2 pt-2 flex flex-col items-center w-full">
                        {tier.perks.map((perk) => (
                          <li key={perk} className="text-xs sm:text-sm text-gray-300 flex items-center justify-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      )}

      <br></br>

      {/* General Perks for All Participants */}
      <ScrollReveal>
        <GlassCard className="p-8 sm:p-10 border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <Gift size={28} className="text-orange-500 mx-auto" />
            <h3 className="text-heading-1 text-gray-050 font-display">Perks for All Participants</h3>
            <p className="text-body text-gray-300">Every single participating team receives exclusive perks and certificates</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prizePool.generalPerks.map((perk) => (
              <div key={perk} className="flex items-center justify-center text-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-gray-200 font-medium">
                <Trophy size={16} className="text-orange-500 shrink-0" />
                <span>{perk}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  );
}
