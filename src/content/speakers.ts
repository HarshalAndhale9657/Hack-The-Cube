import type { Speaker } from "@/content/schemas";

export const speakers: Speaker[] = [
  {
    id: "speaker-1",
    name: "Atharva Patil",
    photoUrl: "/images/speakers/Atharva Patil.jpg",
    designation: "Industry Professional",
    company: "Tech Innovations",
    bio: "An experienced industry professional who will share insights on emerging technologies, career growth, and innovation through an interactive podcast-style session followed by a live Q&A.",
    sessionTopic: "Podcast Session 1 — 30 min Discussion + 15 min Q&A",
    links: { linkedin: "https://linkedin.com" },
    featured: true,
  },
  {
    id: "speaker-2",
    name: "Manav Gupta",
    photoUrl: "/images/speakers/Manav Gupta.jpg",
    designation: "Technology Expert",
    company: "Digital Solutions",
    bio: "A technology expert bringing deep domain knowledge and professional experience to an engaging podcast-style discussion with questions sourced from registered participants.",
    sessionTopic: "Podcast Session 2 — 30 min Discussion + 15 min Q&A",
    links: { linkedin: "https://linkedin.com" },
    featured: true,
  },
  {
    id: "speaker-3",
    name: "Shridhar Mankar",
    photoUrl: "/images/speakers/Shridhar Mankar.jpeg",
    designation: "Entrepreneur & Innovator",
    company: "Future Tech",
    bio: "An entrepreneur and innovator who will discuss real-world challenges, startup ecosystems, and the intersection of technology and business through interactive dialogue.",
    sessionTopic: "Podcast Session 3 — 30 min Discussion + 15 min Q&A",
    links: { linkedin: "https://linkedin.com" },
    featured: true,
  },
];
