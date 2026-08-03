import type { AboutInstitute, AboutCSIClub } from "@/content/schemas";

export const aboutInstitute: AboutInstitute = {
  overview: "Our institution has been a beacon of technical education and innovation for over two decades. We focus on holistic development, combining rigorous academics with hands-on practical experience.",
  campusHighlights: [
    "100+ acre lush green campus",
    "State-of-the-art research labs",
    "24/7 central library",
    "Incubation center for startups",
  ],
  achievements: [
    "NAAC A+ Grade Accreditation",
    "Ranked among top 50 engineering colleges nationally",
    "100+ patents filed by students and faculty",
  ],
  departments: [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication",
    "Artificial Intelligence and Data Science",
  ],
  innovationCulture: "We believe in learning by doing. Our innovation cell supports student-led projects, providing funding, mentorship, and resources to turn ideas into prototypes.",
  accreditations: [
    { name: "NBA Accredited" },
    { name: "NAAC A+ Grade" },
    { name: "AICTE Approved" },
  ],
  rankings: [
    "Top 10 in State Engineering Rankings",
    "Top 50 in National Innovation Framework",
  ],
};

export const aboutCSIClub: AboutCSIClub = {
  chapterInfo: "The Computer Society of India (CSI) Student Chapter is the largest and most active technical club on campus, dedicated to fostering a culture of coding, development, and technological exploration.",
  mission: "To empower students with industry-relevant skills, bridge the academia-industry gap, and build a vibrant community of developers.",
  vision: "To be the premier platform for technical innovation and professional growth for students.",
  activities: [
    "Weekly coding contests",
    "Hands-on workshops on emerging tech",
    "Guest lectures by industry experts",
    "Hackathons and project showcases",
  ],
  pastEvents: [
    {
      name: "CodeRush 2025",
      year: 2025,
      description: "A 12-hour competitive programming contest with 500+ participants.",
    },
    {
      name: "WebDev Bootcamp",
      year: 2024,
      description: "A month-long intensive training program on MERN stack.",
    },
    {
      name: "Hack the Cube 2024",
      year: 2024,
      description: "Our inaugural national-level hackathon with 1000+ registrations.",
    },
  ],
  achievements: [
    "Awarded 'Best Student Chapter' in the region (2024)",
    "Successfully trained 1000+ students in modern web technologies",
    "Placed top 3 in multiple national hackathons",
  ],
};
