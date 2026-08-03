import type { AboutInstitute, AboutCSIClub } from "@/content/schemas";

export const aboutInstitute: AboutInstitute = {
  overview: "Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune is a premier engineering institution committed to academic excellence, innovation, and holistic student development. The institute nurtures future leaders through rigorous academics combined with hands-on practical experience.",
  campusHighlights: [
    "State-of-the-art research and computing labs",
    "Dedicated innovation cell for student-led projects",
    "24/7 central library and digital resource center",
    "Incubation center supporting student startups",
  ],
  achievements: [
    "NAAC A+ Grade Accreditation",
    "NBA Accredited programs",
    "Recognized for excellence in engineering education",
  ],
  departments: [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication",
    "Artificial Intelligence and Data Science",
  ],
  innovationCulture: "DIT Pimpri believes in learning by doing. The innovation cell supports student-led projects, providing funding, mentorship, and resources to turn ideas into prototypes — creating a pipeline from academia to industry.",
  accreditations: [
    { name: "NBA Accredited" },
    { name: "NAAC A+ Grade" },
    { name: "AICTE Approved" },
  ],
  rankings: [
    "Recognized among top engineering institutions in Pune",
    "Active contributor to national innovation frameworks",
  ],
};

export const aboutCSIClub: AboutCSIClub = {
  chapterInfo: "The Computer Society of India (CSI) Student Chapter at Dr. D. Y. Patil Institute of Technology, Pimpri, Pune is one of the most active technical clubs on campus, dedicated to fostering a culture of coding, development, and technological exploration among students.",
  mission: "To empower students with industry-relevant skills, bridge the academia-industry gap, and build a vibrant community of developers through hackathons, workshops, and speaker sessions.",
  vision: "To be the premier platform for technical innovation and professional growth for engineering students.",
  activities: [
    "Weekly coding contests and competitive programming",
    "Hands-on workshops on emerging technologies",
    "Guest lectures by DIT alumni and industry experts",
    "Hackathons, project showcases, and tech meetups",
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
