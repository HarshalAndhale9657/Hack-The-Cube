import type { TimelineEvent } from "@/content/schemas";

export const timelineEvents: TimelineEvent[] = [
  { id: "tl-1", label: "Registration Opens", datetime: "2026-08-15T00:00:00+05:30", description: "Sign up individually or as a team via the official registration portal", day: 0, icon: "FileText" },
  { id: "tl-2", label: "Registration Closes", datetime: "2026-09-15T23:59:59+05:30", description: "Last day to register — don't miss out!", day: 0, icon: "Clock" },
  { id: "tl-3", label: "Team Registration & Verification", datetime: "2026-10-04T08:00:00+05:30", description: "Check-in at the Auditorium — teams complete verification and registration formalities", day: 1, icon: "CheckCircle2" },
  { id: "tl-4", label: "Inauguration Ceremony", datetime: "2026-10-04T09:00:00+05:30", description: "Opening ceremony kicks off the event", day: 1, icon: "Mic" },
  { id: "tl-5", label: "Speaker 1 — Podcast + Q&A", datetime: "2026-10-04T09:30:00+05:30", description: "30-minute interactive podcast discussion + 15-minute live Q&A session", day: 1, icon: "Podcast" },
  { id: "tl-6", label: "Speaker 2 — Podcast + Q&A", datetime: "2026-10-04T10:15:00+05:30", description: "30-minute interactive podcast discussion + 15-minute live Q&A session", day: 1, icon: "Podcast" },
  { id: "tl-7", label: "Speaker 3 — Podcast + Q&A", datetime: "2026-10-04T11:00:00+05:30", description: "30-minute interactive podcast discussion + 15-minute live Q&A session", day: 1, icon: "Podcast" },
  { id: "tl-8", label: "Inauguration Concludes", datetime: "2026-10-04T13:30:00+05:30", description: "Performances, audience engagement, and closing of the inauguration program", day: 1, icon: "PartyPopper" },
  { id: "tl-9", label: "Lunch Break & Transition", datetime: "2026-10-04T13:30:00+05:30", description: "Lunch and movement from Auditorium to the hackathon venue (1.5 hours)", day: 1, icon: "Coffee" },
  { id: "tl-10", label: "Team Reporting at Hackathon Venue", datetime: "2026-10-04T15:00:00+05:30", description: "Mandatory reporting — seating, workspace allocation, internet & power checks, rule briefing", day: 1, icon: "MapPin" },
  { id: "tl-11", label: "24-Hour Hackathon Starts", datetime: "2026-10-04T15:30:00+05:30", description: "Official hackathon clock begins — 24 hours of non-stop development!", day: 1, icon: "Rocket" },
  { id: "tl-12", label: "Mentorship & Initial Evaluation", datetime: "2026-10-04T18:30:00+05:30", description: "DIT alumni and industry mentors evaluate team approach, problem understanding, and technical feasibility", day: 1, icon: "Lightbulb" },
  { id: "tl-13", label: "Continuous Development", datetime: "2026-10-04T21:00:00+05:30", description: "Overnight coding, building, and iterating on solutions", day: 1, icon: "Code" },
  { id: "tl-14", label: "Evaluation Round 1", datetime: "2026-10-05T08:00:00+05:30", description: "First formal judging — progress, implementation, architecture, core functionality, and innovation", day: 2, icon: "Scale" },
  { id: "tl-15", label: "Development & Refinement", datetime: "2026-10-05T10:00:00+05:30", description: "Final implementation, bug fixes, and presentation preparation", day: 2, icon: "Wrench" },
  { id: "tl-16", label: "Evaluation Round 2 & Hackathon Ends", datetime: "2026-10-05T15:30:00+05:30", description: "Final evaluation — working prototype, live demo, presentation, and Q&A with judges (4 per track)", day: 2, icon: "Package" },
  { id: "tl-17", label: "Results & Award Ceremony", datetime: "2026-10-05T16:30:00+05:30", description: "Winner announcements across all 3 tracks, special recognition awards, prize distribution, and certificates!", day: 2, icon: "Trophy" },
];
