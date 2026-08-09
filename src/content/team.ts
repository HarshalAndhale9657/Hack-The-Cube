import type { TeamMember, LeadershipMember } from "@/content/schemas";

const PLACEHOLDER = "/images/placeholder.png";

export const teamMembers: TeamMember[] = [
  {
    id: "tm-1",
    name: "Aarav Sharma",
    photoUrl: PLACEHOLDER,
    position: "President",
    category: "core",
    department: "Computer Science",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "tm-2",
    name: "Rhea Verma",
    photoUrl: PLACEHOLDER,
    position: "Vice President",
    category: "core",
    department: "Computer Engineering",
    linkedinUrl: "https://linkedin.com",
  },
  {
    id: "tm-3",
    name: "Dr. Chaya Jadhav",
    photoUrl: PLACEHOLDER,
    position: "Faculty Coordinator",
    category: "faculty-coordinator",
    department: "Computer Engineering",
  },
  {
    id: "tm-4",
    name: "Ishaan Mehta",
    photoUrl: PLACEHOLDER,
    position: "Secretary",
    category: "student-coordinator",
    department: "Computer Engineering",
    linkedinUrl: "https://linkedin.com",
  },
];

export const leadershipMembers: LeadershipMember[] = [
  {
    id: "lm-1",
    name: "Nitin Sherje",
    photoUrl: PLACEHOLDER,
    designation: "Principal",
    message: "Innovation is the cornerstone of progress. Hack the Cube provides our students the perfect platform to bridge the gap between theory and real-world application. I wish all the participants the very best.",
  },
  {
    id: "lm-2",
    name: "Omkaresh Kulkarni",
    photoUrl: PLACEHOLDER,
    designation: "Head of Department, Computer Engineering",
    message: "The CSI Student Chapter has always been at the forefront of technical excellence. This 24-hour hackathon will test not just your coding skills, but your endurance, teamwork, and problem-solving abilities.",
  },
];
