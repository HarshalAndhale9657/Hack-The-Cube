import type { Speaker } from "@/content/schemas";

export const speakers: Speaker[] = [
  {
    id: "speaker-1",
    name: "Elon Musk",
    photoUrl: "/images/speakers/Elon Musk.jpg",
    designation: "Technologist & Entrepreneur",
    company: "Tesla / xAI / SpaceX",
    bio: "Pioneering research and engineering lead driving breakthroughs in AI, space exploration, and sustainable energy.",
    sessionTopic: "Architecting Next-Gen Autonomous Systems & AI",
    links: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    featured: true,
  },
  {
    id: "speaker-2",
    name: "Narendra Modi",
    photoUrl: "/images/speakers/narendra modi.jpg",
    designation: "Keynote Speaker",
    company: "Government of India",
    bio: "Championing Digital India, tech innovation ecosystems, and youth entrepreneurship on a global scale.",
    sessionTopic: "Empowering Youth Innovation & Digital Transformation",
    links: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    featured: true,
  },
  {
    id: "speaker-3",
    name: "Harshal Andhale",
    photoUrl: "/images/speakers/harshal andhale.jpg",
    designation: "Tech Lead, CSI",
    company: "CSI Club",
    bio: "Most humble developer and good human, leading technical architecture, full-stack infrastructure, and community engineering.",
    sessionTopic: "Building High-Impact Scalable Products",
    links: { linkedin: "https://linkedin.com" },
    featured: true,
  },
];
