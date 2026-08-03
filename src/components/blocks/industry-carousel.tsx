"use client";

import Image from "next/image";
import { StaggerContainer, StaggerItem } from "@/components/motion/scroll-reveal";

interface TrackCard {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

const tracks: TrackCard[] = [
  {
    id: "track-1",
    number: "01",
    title: "Track 1 — Domain To Be Announced",
    description: "6 real-world problem statements spanning sectors like FinTech, Healthcare, Education, and more. Evaluated by a dedicated 4-judge panel.",
    image: "/images/domains/fintech-web3.png",
  },
  {
    id: "track-2",
    number: "02",
    title: "Track 2 — Domain To Be Announced",
    description: "6 real-world problem statements spanning sectors like Social Media, Agriculture, Smart Cities, and more. Evaluated by a dedicated 4-judge panel.",
    image: "/images/domains/ai-robotics.png",
  },
  {
    id: "track-3",
    number: "03",
    title: "Track 3 — Domain To Be Announced",
    description: "6 real-world problem statements spanning emerging technology domains. Evaluated by a dedicated 4-judge panel. Winner: ₹35,000 | Runner-Up: ₹15,000.",
    image: "/images/domains/cloud-cybersecurity.png",
  },
];

export function IndustryCarousel() {
  return (
    <StaggerContainer className="w-full flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] px-1">
      {tracks.map((track) => (
        <StaggerItem key={track.id} className="snap-start shrink-0 min-w-[320px] w-[320px] sm:min-w-[360px] sm:w-[360px]">
          <div className="group relative h-[420px] sm:h-[440px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-navy-900 transition-all duration-300 hover:border-orange-500/40 shadow-lg">
            {/* Background Image with subtle scale & high contrast overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={track.image}
                alt={track.title}
                fill
                className="object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500 ease-out"
                sizes="360px"
              />
            </div>

            {/* Subtle Watermark seal overlay with ~5-8% opacity */}
            <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />

            {/* Dark Gradient Overlay for optimal legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-bg-surface-1/70 to-transparent" />

            {/* Card Content Overlay */}
            <div className="relative z-10 h-full p-7 sm:p-9 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-overline text-orange-500 font-mono tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  Track / {track.number}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-heading-2 text-gray-050 font-display group-hover:text-orange-400 transition-colors line-clamp-2">
                  {track.title}
                </h3>
                <p className="text-body text-gray-300 leading-relaxed line-clamp-2 overflow-hidden text-ellipsis">
                  {track.description}
                </p>
              </div>
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
