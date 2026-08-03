import type { PrizePool } from "@/content/schemas";

export const prizePool: PrizePool = {
  totalPoolDisplay: "₹1,50,000",
  tiers: [
    {
      id: "prize-track1-winner",
      title: "Track 1 — Winner",
      cashAmount: "₹35,000",
      perks: ["Cash Prize", "Winner Certificate", "Trophy", "Mentorship Program"],
      icon: "Trophy",
    },
    {
      id: "prize-track1-runner",
      title: "Track 1 — Runner-Up",
      cashAmount: "₹15,000",
      perks: ["Cash Prize", "Runner-Up Certificate", "Mentorship Program"],
      icon: "Medal",
    },
    {
      id: "prize-track2-winner",
      title: "Track 2 — Winner",
      cashAmount: "₹35,000",
      perks: ["Cash Prize", "Winner Certificate", "Trophy", "Mentorship Program"],
      icon: "Trophy",
    },
    {
      id: "prize-track2-runner",
      title: "Track 2 — Runner-Up",
      cashAmount: "₹15,000",
      perks: ["Cash Prize", "Runner-Up Certificate", "Mentorship Program"],
      icon: "Medal",
    },
    {
      id: "prize-track3-winner",
      title: "Track 3 — Winner",
      cashAmount: "₹35,000",
      perks: ["Cash Prize", "Winner Certificate", "Trophy", "Mentorship Program"],
      icon: "Trophy",
    },
    {
      id: "prize-track3-runner",
      title: "Track 3 — Runner-Up",
      cashAmount: "₹15,000",
      perks: ["Cash Prize", "Runner-Up Certificate", "Mentorship Program"],
      icon: "Medal",
    },
    {
      id: "prize-special-1",
      title: "Special Recognition Award 1",
      perks: ["Exclusive Goodies", "Special Recognition Certificate", "Showcase Opportunity"],
      icon: "Award",
    },
    {
      id: "prize-special-2",
      title: "Special Recognition Award 2",
      perks: ["Exclusive Goodies", "Special Recognition Certificate", "Showcase Opportunity"],
      icon: "Star",
    },
  ],
  generalPerks: [
    "Participation Certificate for all participants",
    "Mentor, Judge & Volunteer Appreciation Certificates",
    "Networking with DIT alumni and industry professionals",
    "Free meals and refreshments during the 24-hour hackathon",
    "Interactive podcast-style sessions with industry experts",
    "Project showcase opportunity",
  ],
};
