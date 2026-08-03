import type { TimelineEvent } from "@/content/schemas";

export const timelineEvents: TimelineEvent[] = [
  { id: "tl-1", label: "Registration Opens", datetime: "2026-08-15T00:00:00+05:30", description: "Sign up individually or as a team", day: 0, icon: "FileText" },
  { id: "tl-2", label: "Registration Closes", datetime: "2026-09-15T23:59:59+05:30", description: "Last day to register — don't miss out!", day: 0, icon: "Clock" },
  { id: "tl-3", label: "Shortlisting & Confirmation", datetime: "2026-09-20T12:00:00+05:30", description: "Selected teams will be notified via email", day: 0, icon: "CheckCircle2" },
  { id: "tl-4", label: "Inauguration & Talk Show", datetime: "2026-10-04T09:00:00+05:30", description: "Opening ceremony with keynote speakers", day: 1, icon: "Mic" },
  { id: "tl-5", label: "Networking Session", datetime: "2026-10-04T12:00:00+05:30", description: "Meet fellow hackers, mentors, and sponsors", day: 1, icon: "Users" },
  { id: "tl-6", label: "Hackathon Starts", datetime: "2026-10-04T18:00:00+05:30", description: "24 hours of non-stop coding begins!", day: 1, icon: "Rocket" },
  { id: "tl-7", label: "Mentoring Sessions", datetime: "2026-10-04T21:00:00+05:30", description: "Get guidance from industry experts", day: 1, icon: "Lightbulb" },
  { id: "tl-8", label: "Midnight Activities", datetime: "2026-10-05T00:00:00+05:30", description: "Fun activities to keep the energy high", day: 2, icon: "Moon" },
  { id: "tl-9", label: "Submission Deadline", datetime: "2026-10-05T18:00:00+05:30", description: "Final project submissions", day: 2, icon: "Package" },
  { id: "tl-10", label: "Judging", datetime: "2026-10-05T18:30:00+05:30", description: "Presentations and evaluation by judges", day: 2, icon: "Scale" },
  { id: "tl-11", label: "Results & Closing Ceremony", datetime: "2026-10-05T16:00:00+05:30", description: "Winner announcements, prizes, and celebration!", day: 2, icon: "Trophy" },
];
