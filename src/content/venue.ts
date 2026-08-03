import type { VenueInfo, SubVenue, HackathonVenue } from "@/content/schemas";

const PLACEHOLDER = "/images/placeholder.png";

export const mainVenue: VenueInfo = {
  name: "Main Campus Building, CSI Institute of Technology",
  address: "CSI Institute of Technology, Tech Park Campus, Sector 5, City, State - 400001",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153166!3d-37.816279742021665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sin!4v1628153406439!5m2!1sen!2sin",
  coordinates: { lat: -37.8162797, lng: 144.9537353 },
  parkingInfo: "Free parking available at Gate 2. Please show your registration pass to the security guard.",
  entryGate: "Gate 1 (Main Entrance) for all participants",
  campusNavigationNotes: "Follow the orange arrows from Gate 1 to reach the registration desk at the main auditorium.",
  campusMapImageUrl: PLACEHOLDER,
};

export const inaugurationVenue: SubVenue = {
  name: "Dr. APJ Abdul Kalam Auditorium",
  time: "9:00 AM - 12:00 PM",
  mapEmbedUrl: mainVenue.mapEmbedUrl,
  floor: "Ground Floor, Main Building",
  hallInfo: "Fully air-conditioned auditorium with a seating capacity of 1000. Registration desks are located just outside.",
  capacity: 1000,
};

export const hackathonHallVenue: HackathonVenue = {
  name: "Central Computing Facility & Innovation Hub",
  time: "18:00 PM (Oct 4) - 18:00 PM (Oct 5)",
  mapEmbedUrl: mainVenue.mapEmbedUrl,
  floor: "2nd Floor, IT Block",
  hallInfo: "24x7 access facility with ergonomic seating, power backups, and high-speed internet.",
  capacity: 600,
  seatingInfo: "Teams will be assigned specific tables. Table numbers will be provided at check-in.",
  floorPlanImageUrl: PLACEHOLDER,
  checkInCounterLocation: "Entrance of the Innovation Hub on the 2nd Floor.",
  emergencyExits: ["East wing staircase", "West wing fire exit"],
  wifi: {
    ssid: "HTC_2026_Hackers",
    passwordNote: "Password will be shared during the kickoff session and printed on your ID badge.",
  },
};

