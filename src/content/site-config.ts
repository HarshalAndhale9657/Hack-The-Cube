/**
 * Site-wide configuration — Single source of truth
 * for all dates, URLs, social links, and event metadata.
 * 
 * Update these values and they propagate everywhere:
 * countdown timer, registration status, timeline, footer, etc.
 */

export const siteConfig = {
  // ── Event Identity ──
  name: "Hack the Cube 2026",
  tagline: "Where Innovation Meets Execution",
  description:
    "CSI Club's flagship national-level 24-hour hackathon featuring a Technical Talk Show, industry speakers, and ₹3,00,000+ in prizes.",
  url: "https://hackthecube.tech", // Update with actual domain

  // ── Event Dates (ISO 8601, IST) ──
  dates: {
    registrationOpens: "2026-08-15T00:00:00+05:30",
    registrationCloses: "2026-09-15T23:59:59+05:30",
    eventStart: "2026-10-04T09:00:00+05:30",
    eventEnd: "2026-10-05T17:00:00+05:30",
    hackathonStart: "2026-10-04T18:00:00+05:30",
    hackathonEnd: "2026-10-05T18:00:00+05:30",
    resultsAnnouncement: "2026-10-05T16:00:00+05:30",
  },

  // ── Registration ──
  registration: {
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationFee: 500, // INR per team/individual
    spotsTotal: 500,
    // spotsRemaining will be dynamic if connected to a backend
  },

  // ── Social Media Handles ──
  social: {
    instagram: "https://instagram.com/hackthecube",
    linkedin: "https://linkedin.com/company/hackthecube",
    twitter: "https://x.com/hackthecube",
    youtube: "https://youtube.com/@hackthecube",
    facebook: "", // Optional
  },

  // ── Contact ──
  contact: {
    generalEmail: "hackthecube@csiclub.org",
    phone: [
      { label: "Event Coordinator", number: "+91 98201 54321" },
      { label: "Registration Help", number: "+91 98202 87654" },
    ],
    whatsapp: "+919820154321",
    emergencyContacts: [
      { label: "Medical Emergency", number: "+91 98203 11223" },
      { label: "Security", number: "+91 98204 99887" },
      { label: "Event Helpdesk", number: "+91 98205 33445" },
    ],
    address:
      "CSI Club, Department of Computer Science, CSI Institute of Technology, Tech Park Campus, Sector 5, City, State - 400001",
  },

  // ── Stats (for homepage counters) ──
  stats: [
    { label: "Participants", value: 500, suffix: "+" },
    { label: "Prize Pool", value: 300000, prefix: "₹", suffix: "+" },
    { label: "Hours", value: 24, suffix: "" },
    { label: "Speakers", value: 10, suffix: "+" },
    { label: "Problem Statements", value: 15, suffix: "+" },
  ],

  // ── Navigation Links (Single-page anchors & Mega-menu) ──
  // Restructured to match the new section order
  navLinks: [
    {
      label: "About",
      href: "#about",
      subItems: [
        { label: "Event Overview", href: "#about", description: "Vision, mission, and why to participate" },
        { label: "Hype Trailer", href: "#video", description: "Full-screen event trailer" },
        { label: "Gallery & Memories", href: "#gallery", description: "Last year's highlights and photos" },
      ],
    },
    {
      label: "Tracks & Challenges",
      href: "#tracks",
      subItems: [
        { label: "Domain Tracks", href: "#tracks", description: "AI/ML, FinTech, Web3, CyberSecurity" },
        { label: "Problem Statements", href: "#problems", description: "Released on hackathon day" },
        { label: "Prize Pool & Perks", href: "#prizes", description: "₹3,00,000+ cash prizes & internships" },
      ],
    },
    {
      label: "Schedule & People",
      href: "#timeline",
      subItems: [
        { label: "24-Hour Timeline", href: "#timeline", description: "Keynote, hackathon kickoff & judging" },
        { label: "Speakers Panel", href: "#speakers", description: "Industry keynotes & talk show guests" },
        { label: "Organizing Team", href: "#team", description: "CSI Club student & faculty leads" },
        { label: "College Leadership", href: "#leadership", description: "Messages from Director & HOD" },
      ],
    },
    {
      label: "Venue & More",
      href: "#venue",
      subItems: [
        { label: "Main Venue & Maps", href: "#venue", description: "Campus address, parking & entry gates" },
        { label: "Sponsors & Partners", href: "#sponsors", description: "Title, Co-Sponsor & Associate" },
        { label: "FAQs", href: "#faq", description: "Registration, food, wifi & eligibility" },
      ],
    },
  ],

  // ── Footer Navigation ──
  footerLinks: {
    event: [
      { label: "About Event", href: "#about" },
      { label: "Event Trailer", href: "#video" },
      { label: "Tracks", href: "#tracks" },
      { label: "Timeline", href: "#timeline" },
      { label: "Problem Statements", href: "#problems" },
      { label: "Prizes & Rewards", href: "#prizes" },
    ],
    about: [
      { label: "Speakers", href: "#speakers" },
      { label: "Organizing Team", href: "#team" },
      { label: "Leadership", href: "#leadership" },
      { label: "Sponsors", href: "#sponsors" },
      { label: "Gallery Memories", href: "#gallery" },
    ],
    resources: [
      { label: "Register", href: "/register" },
      { label: "Venue Details", href: "#venue" },
      { label: "FAQs", href: "#faq" },
    ],
    legal: [
      { label: "Terms & Conduct", href: "#faq" },
    ],
  },
} as const;

export type SiteConfig = typeof siteConfig;
