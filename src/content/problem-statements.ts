import type { ProblemStatement } from "@/content/schemas";

export const problemStatements: ProblemStatement[] = [
  {
    id: "ps-1",
    category: "AI / ML",
    title: "Autonomous Agent Workflow Orchestration",
    description:
      "Design a lightweight, localized multi-agent orchestrator capable of parsing multi-step natural language commands and safely executing system operations with full rollback capabilities.",
    difficulty: "Advanced",
    sponsoredBy: "Title Sponsor",
    rules: [
      "Must operate with zero external API dependencies for base tasks.",
      "Must include structured JSON logging of all agent tool invocations.",
    ],
  },
  {
    id: "ps-2",
    category: "FinTech",
    title: "Real-time Fraud & Anomaly Detection in Micro-transactions",
    description:
      "Build a low-latency fraud detection system analyzing streaming transaction data to flag suspicious patterns under 50ms response times.",
    difficulty: "Intermediate",
    sponsoredBy: "Platinum Sponsor",
    rules: [
      "Simulated throughput of at least 1,000 requests/sec.",
      "Visual dashboard for live alert metrics.",
    ],
  },
  {
    id: "ps-3",
    category: "Cybersecurity",
    title: "Zero-Trust API Gateway & Policy Engine",
    description:
      "Develop a dynamic reverse proxy gateway enforcing granular cryptographic request verification, IP throttling, and automated threat blocking.",
    difficulty: "Advanced",
    sponsoredBy: "Gold Sponsor",
  },
  {
    id: "ps-4",
    category: "EdTech & Accessibility",
    title: "Multilingual Offline Learning Companion",
    description:
      "Engineered for low-connectivity regions, an interactive educational portal providing compressed media and speech-to-text translation capabilities.",
    difficulty: "Beginner",
  },
  {
    id: "ps-5",
    category: "Open Innovation",
    title: "Smart Campus Energy & Resource Management",
    description:
      "IoT data ingestion platform monitoring real-time campus utility consumption with predictive maintenance alerts.",
    difficulty: "Intermediate",
  },
];
