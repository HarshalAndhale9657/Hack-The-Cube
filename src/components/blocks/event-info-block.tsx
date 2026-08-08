"use client";

import { GlassCard } from "@/components/shared/glass-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";
import { eventInfo } from "@/content/event-info";
import { Zap, Users, Trophy, Lightbulb, Rocket, GraduationCap, Target, Briefcase, Share2, CheckCircle2 } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Zap,
  Users,
  Trophy,
  Lightbulb,
  Rocket,
  GraduationCap,
  Target,
  Briefcase,
  Share2,
};

export function EventInfoBlock() {
  return (
    <div className="w-full space-y-16 pt-4">
      {/* Overview & Format */}
      <div className="grid gap-8 md:grid-cols-2 items-stretch">
        <GlassCard className="p-10 lg:p-12 flex flex-col justify-center space-y-6 border-white/10 text-center items-center">
          <div className="space-y-4 flex flex-col items-center">
            <span className="text-overline text-orange-500 font-mono tracking-widest">Overview</span>
            <h3 className="text-heading-2 font-bold font-display text-gray-050">What is Hack the Cube?</h3>
            <p className="text-body text-gray-300 leading-relaxed font-normal max-w-sm">{eventInfo.overview}</p>
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col items-center gap-3 text-xs text-gray-400 mt-auto">
            <CheckCircle2 className="text-orange-500" size={20} />
            <span className="max-w-xs">National-level event open to all engineering & tech disciplines across India.</span>
          </div>
        </GlassCard>

        <GlassCard className="p-10 lg:p-12 flex flex-col justify-center space-y-6 border-white/10 text-center items-center">
          <div className="space-y-4 flex flex-col items-center">
            <span className="text-overline text-orange-500 font-mono tracking-widest">Format & Theme</span>
            <h3 className="text-heading-2 font-bold font-display text-gray-050">{eventInfo.theme}</h3>
            <p className="text-xs font-mono font-semibold text-orange-400 bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-500/20 inline-block">
              {eventInfo.format}
            </p>
            <ul className="space-y-3 pt-4 text-sm text-gray-300">
              {eventInfo.eligibility.map((item, i) => (
                <li key={i} className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>
              <br></br>
      {/* Core Objectives */}
      <div className="space-y-12">
        <h3 className="text-heading-1 text-gray-050 text-center font-display">Core Objectives</h3><br></br>
        <StaggerContainer className="grid md:grid-cols-2 gap-8">
          {eventInfo.objectives.map((obj, i) => {
            const objectiveIcons = [Target, Lightbulb, Users, Rocket];
            const objectiveTitles = [
              "Technical Problem Solving",
              "Industry Execution",
              "Mentorship & Network",
              "Product Innovation",
            ];
            const Icon = objectiveIcons[i % objectiveIcons.length];
            const title = objectiveTitles[i % objectiveTitles.length];

            return (
              <StaggerItem key={i}>
                <GlassCard className="p-10 h-full flex flex-col items-center text-center justify-center space-y-5 border-white/10">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center shrink-0 mb-2">
                    <Icon size={28} />
                  </div>
                  <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-orange-400 font-mono font-bold text-xs tracking-widest uppercase">
                    Objective 0{i + 1}
                  </span>
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xl font-bold font-display text-gray-050">{title}</h4>
                    <p className="text-body text-gray-300 leading-relaxed font-normal max-w-sm mx-auto">{obj}</p>
                  </div>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
        <br></br>
      {/* Why Participate */}
      <div className="space-y-12">
        <h3 className="text-heading-1 text-gray-050 text-center font-display">Why Participate</h3><br></br>
        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          {eventInfo.whyParticipate.map((benefit, i) => {
            const Icon = iconMap[benefit.icon] || Target;
            return (
              <StaggerItem key={i}>
                <GlassCard className="p-10 h-full flex flex-col items-center text-center space-y-6 border-white/10 min-h-[280px]">
                  <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center shrink-0 shadow-lg glow-orange-sm">
                    <Icon size={28} />
                  </div>
                  <div className="space-y-4 flex flex-col items-center">
                    <h4 className="text-xl font-bold font-display text-gray-050">{benefit.title}</h4>
                    <p className="text-body text-gray-300 leading-relaxed max-w-[260px] mx-auto">{benefit.description}</p>
                  </div>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
}
