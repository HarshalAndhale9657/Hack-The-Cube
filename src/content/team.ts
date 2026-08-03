import type { TeamMember, LeadershipMember } from "@/content/schemas";

const PLACEHOLDER = "/images/placeholder.png";

export const teamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Aarav Sharma",
    photoUrl: PLACEHOLDER,
    position: "Lead Organizer",
    category: "core",
    department: "Computer Science",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "tm-2",
    name: "Rhea Verma",
    photoUrl: PLACEHOLDER,
    position: "Technical Lead",
    category: "core",
    department: "Information Technology",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "tm-3",
    name: "Prof. K. R. Raman",
    photoUrl: PLACEHOLDER,
    position: "Faculty Coordinator",
    category: "faculty-coordinator",
    department: "Computer Science",
  },
  {
    id: "tm-4",
    name: "Ishaan Mehta",
    photoUrl: PLACEHOLDER,
    position: "Marketing & Operations Lead",
    category: "student-coordinator",
    department: "Computer Science",
    linkedinUrl: "https://linkedin.com",
  },
];

export const leadershipMembers: LeadershipMember[] = [
  {
    id: "lm-1",
    name: "Dr. V. K. Sundaram",
    photoUrl: PLACEHOLDER,
    designation: "Director",
    message: "Innovation is the cornerstone of progress. Hack the Cube provides our students the perfect platform to bridge the gap between theory and real-world application. I wish all the participants the very best.",
  },
  {
    id: "lm-2",
    name: "Dr. Ananya Sen",
    photoUrl: PLACEHOLDER,
    designation: "Head of Department, CSE",
    message: "The CSI Club has always been at the forefront of technical excellence. This 24-hour hackathon will test not just your coding skills, but your endurance, teamwork, and problem-solving abilities.",
  },
];

