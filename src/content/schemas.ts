import { z } from "zod";

/* ============================================
   Content Schemas — Zod validation for all 
   content types from Spec Section 7
   ============================================ */

// ── Speaker (7.7) ──
export const SpeakerSchema = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string(),
  designation: z.string(),
  company: z.string(),
  bio: z.string(),
  sessionTopic: z.string(),
  links: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    website: z.string().url().optional(),
  }),
  featured: z.boolean().optional().default(false),
});
export type Speaker = z.infer<typeof SpeakerSchema>;

// ── Sponsor (7.21) ──
export const SponsorSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string(),
  tier: z.enum(["Title", "Platinum", "Gold", "Silver", "Community Partner", "Media Partner"]),
  websiteUrl: z.string().url(),
});
export type Sponsor = z.infer<typeof SponsorSchema>;

// ── Timeline Event (7.11) ──
export const TimelineEventSchema = z.object({
  id: z.string(),
  label: z.string(),
  datetime: z.string(),
  description: z.string().optional(),
  day: z.number().optional(),
  icon: z.string().optional(),
});
export type TimelineEvent = z.infer<typeof TimelineEventSchema>;

// ── Team Member (7.19) ──
export const TeamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string(),
  position: z.string(),
  category: z.enum(["core", "faculty-coordinator", "student-coordinator"]),
  department: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  contact: z.string().optional(),
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

// ── Leadership Member (7.20) ──
export const LeadershipMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  photoUrl: z.string(),
  designation: z.string(),
  message: z.string(),
});
export type LeadershipMember = z.infer<typeof LeadershipMemberSchema>;

// ── FAQ Item (7.24) ──
export const FAQItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  question: z.string(),
  answer: z.string(),
});
export type FAQItem = z.infer<typeof FAQItemSchema>;

// ── Problem Statement (7.9) ──
export const ProblemStatementSchema = z.object({
  id: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  sponsoredBy: z.string().optional(),
  pdfUrl: z.string().optional(),
  rules: z.array(z.string()).optional(),
});
export type ProblemStatement = z.infer<typeof ProblemStatementSchema>;

// ── Prize Tier (7.10) ──
export const PrizeTierSchema = z.object({
  id: z.string(),
  title: z.string(),
  cashAmount: z.string().optional(),
  perks: z.array(z.string()),
  icon: z.string().optional(),
});
export type PrizeTier = z.infer<typeof PrizeTierSchema>;

export const PrizePoolSchema = z.object({
  totalPoolDisplay: z.string(),
  tiers: z.array(PrizeTierSchema),
  generalPerks: z.array(z.string()),
});
export type PrizePool = z.infer<typeof PrizePoolSchema>;

// ── Result Entry (7.13) ──
export const ResultEntrySchema = z.object({
  tier: z.enum(["Winner", "Runner-up", "Special Mention"]),
  teamName: z.string(),
  members: z.array(z.string()),
  projectName: z.string(),
  projectDescription: z.string(),
  photoUrl: z.string().optional(),
  projectLinkUrl: z.string().url().optional(),
});
export type ResultEntry = z.infer<typeof ResultEntrySchema>;

// ── Gallery Item (7.14) ──
export const GalleryItemSchema = z.object({
  id: z.string(),
  type: z.enum(["photo", "video"]),
  url: z.string(),
  thumbnailUrl: z.string().optional(),
  caption: z.string().optional(),
  year: z.number(),
});
export type GalleryItem = z.infer<typeof GalleryItemSchema>;

// ── Downloadable Resource (7.15) ──
export const DownloadableResourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  fileUrl: z.string(),
  fileType: z.literal("pdf"),
  fileSizeLabel: z.string().optional(),
  audience: z.enum(["Participant", "Sponsor", "General"]).optional(),
});
export type DownloadableResource = z.infer<typeof DownloadableResourceSchema>;

// ── Venue Info (7.4–7.6) ──
export const VenueInfoSchema = z.object({
  name: z.string(),
  address: z.string(),
  mapEmbedUrl: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  parkingInfo: z.string().optional(),
  entryGate: z.string().optional(),
  campusNavigationNotes: z.string().optional(),
  campusMapImageUrl: z.string().optional(),
});
export type VenueInfo = z.infer<typeof VenueInfoSchema>;

export const SubVenueSchema = z.object({
  name: z.string(),
  time: z.string(),
  mapEmbedUrl: z.string(),
  floor: z.string(),
  hallInfo: z.string(),
  capacity: z.number().optional(),
});
export type SubVenue = z.infer<typeof SubVenueSchema>;

export const HackathonVenueSchema = SubVenueSchema.extend({
  seatingInfo: z.string(),
  floorPlanImageUrl: z.string(),
  checkInCounterLocation: z.string(),
  emergencyExits: z.array(z.string()),
  wifi: z.object({
    ssid: z.string(),
    passwordNote: z.string(),
  }),
});
export type HackathonVenue = z.infer<typeof HackathonVenueSchema>;

// ── Event Info (7.3) ──
export const EventInfoSchema = z.object({
  overview: z.string(),
  objectives: z.array(z.string()),
  format: z.string(),
  theme: z.string(),
  eligibility: z.array(z.string()),
  highlights: z.array(
    z.object({ icon: z.string(), title: z.string(), description: z.string() })
  ),
  whyParticipate: z.array(
    z.object({ icon: z.string(), title: z.string(), description: z.string() })
  ),
});
export type EventInfo = z.infer<typeof EventInfoSchema>;

// ── About sections (7.16–7.18) ──
export const AboutHackathonSchema = z.object({
  vision: z.string(),
  mission: z.string(),
  purpose: z.string(),
  whyHackTheCube: z.string(),
  previousEditions: z.array(
    z.object({
      year: z.number(),
      highlight: z.string(),
      statsSummary: z.string().optional(),
    })
  ),
  communityImpact: z.string(),
});
export type AboutHackathon = z.infer<typeof AboutHackathonSchema>;

export const AboutInstituteSchema = z.object({
  overview: z.string(),
  campusHighlights: z.array(z.string()),
  achievements: z.array(z.string()),
  departments: z.array(z.string()),
  innovationCulture: z.string(),
  accreditations: z.array(z.object({ name: z.string(), logoUrl: z.string().optional() })),
  rankings: z.array(z.string()),
});
export type AboutInstitute = z.infer<typeof AboutInstituteSchema>;

export const AboutCSIClubSchema = z.object({
  chapterInfo: z.string(),
  mission: z.string(),
  vision: z.string(),
  activities: z.array(z.string()),
  pastEvents: z.array(
    z.object({ name: z.string(), year: z.number(), description: z.string() })
  ),
  achievements: z.array(z.string()),
});
export type AboutCSIClub = z.infer<typeof AboutCSIClubSchema>;

// ── Contact (7.23) ──
export const ContactInfoSchema = z.object({
  generalEmail: z.string().email(),
  phoneNumbers: z.array(z.object({ label: z.string(), number: z.string() })),
  whatsappNumber: z.string().optional(),
  emergencyContacts: z.array(z.object({ label: z.string(), number: z.string() })),
  address: z.string(),
  mapEmbedUrl: z.string(),
});
export type ContactInfo = z.infer<typeof ContactInfoSchema>;

export const ContactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
export type ContactFormData = z.infer<typeof ContactFormSchema>;

// ── Registration (7.2) ──
export const RegistrationMemberSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  college: z.string().min(2, "College name is required"),
  year: z.string(),
  department: z.string(),
  role: z.enum(["leader", "member"]).optional(),
});

export const RegistrationSchema = z.object({
  type: z.enum(["individual", "team"]),
  teamName: z.string().optional(),
  members: z.array(RegistrationMemberSchema).min(1),
  problemStatementInterest: z.string().optional(),
  dietaryPreference: z.string().optional(),
  tshirtSize: z.string().optional(),
  agreedToTerms: z.literal(true, { message: "You must agree to the terms" }),
});
export type RegistrationData = z.infer<typeof RegistrationSchema>;

// ── Hype Video (7.8) ──
export const HypeVideoSchema = z.object({
  youtubeVideoId: z.string(),
  posterImageUrl: z.string(),
  title: z.string(),
});
export type HypeVideo = z.infer<typeof HypeVideoSchema>;
