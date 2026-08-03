import type { PrizePool } from "@/content/schemas";

export const prizePool: PrizePool = {
  totalPoolDisplay: "₹3,00,000+",
  tiers: [
    {
      id: "prize-1",
      title: "Winner",
      cashAmount: "₹1,00,000",
      perks: ["Cash Prize", "Internship Offers", "Swag Kit", "Certificate of Excellence", "Mentorship Program"],
      icon: "Trophy",
    },
    {
      id: "prize-2",
      title: "1st Runner-up",
      cashAmount: "₹60,000",
      perks: ["Cash Prize", "Swag Kit", "Certificate of Excellence", "Mentorship Program"],
      icon: "Medal",
    },
    {
      id: "prize-3",
      title: "2nd Runner-up",
      cashAmount: "₹30,000",
      perks: ["Cash Prize", "Swag Kit", "Certificate of Merit"],
      icon: "Award",
    },
    {
      id: "prize-4",
      title: "Best AI/ML Hack",
      cashAmount: "₹25,000",
      perks: ["Cash Prize", "Special Trophy", "Certificate"],
      icon: "Bot",
    },
    {
      id: "prize-5",
      title: "Best UI/UX",
      cashAmount: "₹15,000",
      perks: ["Cash Prize", "Design Tool Subscription", "Certificate"],
      icon: "Palette",
    },
    {
      id: "prize-6",
      title: "Most Innovative",
      cashAmount: "₹20,000",
      perks: ["Cash Prize", "Incubation Support", "Certificate"],
      icon: "Lightbulb",
    },
  ],
  generalPerks: [
    "Certificate of Participation for all",
    "Networking with industry professionals",
    "Free meals and refreshments",
    "Exclusive Hack the Cube swag",
    "LinkedIn endorsements",
    "Project showcase opportunity",
  ],
};
