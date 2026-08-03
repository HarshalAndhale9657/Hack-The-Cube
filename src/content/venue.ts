import type { VenueInfo, SubVenue, HackathonVenue } from "@/content/schemas";

const PLACEHOLDER = "/images/placeholder.png";

export const mainVenue: VenueInfo = {
  name: "Dr. D. Y. Patil Institute of Technology, Pimpri, Pune",
  address: "Dr. D. Y. Patil Institute of Technology, Pimpri, Pune, Maharashtra - 411018",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.003610571409!2d73.79561531489396!3d18.628643087337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9002d81abc5%3A0x79e6fc6c31f5f6da!2sDr.%20D.%20Y.%20Patil%20Institute%20of%20Technology%2C%20Pimpri!5e0!3m2!1sen!2sin!4v1628153406439!5m2!1sen!2sin",
  coordinates: { lat: 18.6286438, lng: 73.7978040 },
  parkingInfo: "Free parking available at the main gate. Please show your registration pass to the security guard.",
  entryGate: "Main Entrance Gate for all participants",
  campusNavigationNotes: "Follow the signage from the main gate to reach the registration desk at the Auditorium.",
  campusMapImageUrl: PLACEHOLDER,
};

export const inaugurationVenue: SubVenue = {
  name: "Auditorium — Inauguration & Speaker Sessions",
  time: "8:00 AM - 1:30 PM",
  mapEmbedUrl: mainVenue.mapEmbedUrl,
  floor: "Main Building, DIT Pimpri Campus",
  hallInfo: "Inauguration ceremony with 3 interactive podcast-style speaker sessions (30 min podcast + 15 min Q&A each), performances, and audience engagement.",
  capacity: 1000,
};

export const hackathonHallVenue: HackathonVenue = {
  name: "Hackathon Development Venue",
  time: "3:30 PM (Day 1) - 3:30 PM (Day 2)",
  mapEmbedUrl: mainVenue.mapEmbedUrl,
  floor: "Designated Hackathon Area, DIT Pimpri Campus",
  hallInfo: "24-hour access facility with dedicated development areas, power backups, and high-speed internet. Teams will be assigned specific workspaces.",
  capacity: 600,
  seatingInfo: "Teams will be assigned specific tables and workspace areas. Table numbers will be provided during the 3:00 PM – 3:30 PM setup window.",
  floorPlanImageUrl: PLACEHOLDER,
  checkInCounterLocation: "Mandatory team reporting at the hackathon venue by 3:00 PM on Day 1.",
  emergencyExits: ["Marked emergency exits throughout the venue", "Security personnel available 24 hours"],
  wifi: {
    ssid: "HTC_2026_Hackers",
    passwordNote: "Wi-Fi credentials will be shared during the 3:00 PM – 3:30 PM setup session and printed on your ID badge.",
  },
};
