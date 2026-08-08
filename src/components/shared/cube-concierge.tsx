"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal, X, Send } from "lucide-react";

/* ═══════════════════════════════════════════════
   Cube Concierge — Exhaustive Intent Matrix Engine
   3-Layer Matcher & 10ms Streaming Renderer
   ═══════════════════════════════════════════════ */

interface Message {
  role: "system" | "user";
  text: string;
}

interface KnowledgeItem {
  intent: string;
  phrases: string[];
  keywords: string[];
  response: string;
}

const KNOWLEDGE_MATRIX: KnowledgeItem[] = [
  // 1. GREETINGS & INTRODUCTIONS
  {
    intent: "greeting",
    phrases: ["hi", "hello", "hey", "yo", "sup", "greetings", "good morning", "good afternoon", "good evening", "namaste", "who are you", "what is your name", "what can you do"],
    keywords: ["hi", "hello", "hey", "yo", "bot", "assistant", "concierge", "help"],
    response: "Hello! I am the Cube Concierge, your instant assistant for Hack the Cube 2026. You can ask me about dates, schedule, prize money, problem statements, team rules, food, Wi-Fi, or venue location!"
  },

  // 2. DATES & TIMING
  {
    intent: "dates_and_time",
    phrases: ["when is the hackathon", "what is the date", "exact date", "what days", "hackathon dates", "when will it be conducted", "time of the hackathon", "what is the schedule"],
    keywords: ["date", "dates", "when", "day", "days", "time", "timing", "schedule", "itinerary", "clock", "september", "duration", "hours"],
    response: "Hack the Cube 2026 takes place from September 5 to September 6, 2026 (Saturday to Sunday):\n• Sept 5, 8:00 AM: Registration & Verification at Auditorium\n• Sept 5, 3:30 PM: Official 24-Hour Hackathon Clock Starts!\n• Sept 6, 3:30 PM: Coding Ends & Round 2 Judging Starts\n• Sept 6, Evening: Award Ceremony & Results."
  },

  // 3. PRIZE POOL & CASH REWARDS
  {
    intent: "prizes",
    phrases: ["what is the prize pool", "how much money can i win", "first prize", "runner up prize", "cash rewards", "winning amount", "prize breakdown", "is there a cash prize"],
    keywords: ["prize", "prizes", "money", "cash", "reward", "rewards", "win", "winning", "amount", "150000", "35000", "15000", "pool", "goodies", "stipend"],
    response: "The total cash prize pool is ₹1,50,000 distributed equally across 3 tracks:\n• Track Winner (3 teams): ₹35,000 each\n• Track Runner-Up (3 teams): ₹15,000 each\n• Total: 6 main cash prize winning teams.\n• Special Recognition: 2 additional teams win exclusive goodies for top UI/UX and innovation!"
  },

  // 4. PROBLEM STATEMENTS & TRACKS
  {
    intent: "tracks_and_problems",
    phrases: ["what are the tracks", "how many problem statements", "show problem statements", "what domains", "when will challenges be unlocked", "type of problem statements", "what topics"],
    keywords: ["track", "tracks", "domain", "domains", "problem", "problems", "statement", "statements", "challenge", "challenges", "18", "fintech", "healthcare", "agriculture", "smart city", "education"],
    response: "There are 3 Technical Tracks featuring 6 problem statements each (18 total challenges!). Domains include FinTech, Healthcare, Agriculture, Smart Cities, Social Media, and Education. To ensure fairness, exact problem statements will be unlocked on the event day."
  },

  // 5. SOLO PARTICIPATION vs TEAM MANDATE
  {
    intent: "solo_and_team_rules",
    phrases: ["can i participate solo", "can i join alone", "is team compulsory", "i want to attend alone", "can i come single", "can 1 person participate", "must i have a team"],
    keywords: ["solo", "alone", "single", "individual", "compulsory", "mandatory", "lone", "wolf", "force"],
    response: "Team size is strictly 2 to 4 members. You cannot compete completely solo during the 24 hours. However, if you register as an individual, our Competency Matchmaking feature will automatically group you into a full-stack squad with complementary skill sets!"
  },

  // 6. GENERAL TEAM SIZE & REGISTRATION
  {
    intent: "team_size_and_registration",
    phrases: ["what is the team size", "how many members per team", "minimum team size", "maximum team size", "how to register", "registration process", "is registration free"],
    keywords: ["team", "teams", "size", "member", "members", "register", "registration", "fee", "cost", "ticket", "process"],
    response: "Registration Details:\n• Team Size: 2 to 4 participants per team.\n• Process: Click 'Register Now' on the top right, fill in team details, and submit.\n• All team members must carry valid college identity cards during reporting."
  },

  // 7. DIETARY PREFERENCES & FOOD
  {
    intent: "food_and_dietary",
    phrases: ["will food be provided", "is food free", "veg or non veg", "am vegetarian", "what meals are included", "what is on the menu", "will we get dinner", "jain food", "breakfast"],
    keywords: ["food", "meal", "meals", "eat", "eating", "veg", "vegetarian", "non-veg", "dinner", "lunch", "breakfast", "snacks", "tea", "coffee", "water", "diet", "dietary"],
    response: "Yes! Full hospitality is provided throughout the 24 hours:\n• Meals Included: Evening snacks, dinner, midnight refreshments, breakfast, and lunch.\n• Dietary Options: Both Vegetarian and Non-Vegetarian options are available. You can specify your choice during registration!"
  },

  // 8. FACILITIES & OVERNIGHT STAY
  {
    intent: "facilities_and_stay",
    phrases: ["where will we sleep", "is there overnight stay", "resting facilities", "is wifi provided", "will there be power outlets", "can we stay at night", "washroom facilities"],
    keywords: ["stay", "overnight", "sleep", "rest", "resting", "wifi", "internet", "power", "charging", "plug", "extension", "washroom", "facility", "facilities"],
    response: "We provide complete 24-hour infrastructure support:\n• High-speed Wi-Fi & continuous electricity with backup power.\n• Dedicated team workspaces with extension boards.\n• Designated overnight resting areas and washrooms.\n• First-aid medical support and 24/7 campus security."
  },

  // 9. VENUE, LOCATION & PARKING
  {
    intent: "venue_and_location",
    phrases: ["where is the venue", "how to reach the college", "what is the address", "which gate to enter", "is parking available", "where to park", "nearest station"],
    keywords: ["venue", "location", "address", "map", "reach", "gate", "parking", "pimpri", "dit", "akurdi", "station", "building", "auditorium"],
    response: "Venue Information:\n• Location: Dr. D. Y. Patil Institute of Technology (DIT), Survey No. 27/A, Near Akurdi Railway Station, Pimpri-Chinchwad, Pune - 411044.\n• Entry Gate: Main Gate.\n• Free Parking: Gate 2 for all registered participants."
  },

  // 10. RULES, CODE OF CONDUCT & PLAGIARISM
  {
    intent: "rules_and_plagiarism",
    phrases: ["can we use github", "is prebuilt code allowed", "can I use open source", "what are the rules", "plagiarism policy", "what happens if caught cheating", "can we use templates"],
    keywords: ["rule", "rules", "plagiarism", "prebuilt", "existing", "github", "opensource", "open-source", "cheating", "disqualify", "disqualification", "guideline", "guidelines"],
    response: "Strict Coding Rules:\n1. All major code development must be done during the official 24-hour window.\n2. Open-source libraries, APIs, and frameworks are allowed with proper credit.\n3. Plagiarism or submitting pre-built projects results in immediate disqualification.\n4. Teams must be able to explain their code to the judging panel."
  },

  // 11. WHAT TO BRING & HARDWARE
  {
    intent: "what_to_bring",
    phrases: ["what should i bring", "do i need my own laptop", "hardware provided", "things to carry", "checklist for participants"],
    keywords: ["bring", "carry", "laptop", "gear", "hardware", "checklist", "id", "card", "charger"],
    response: "Participant Checklist:\n• Valid College Identity Card (Mandatory for entry).\n• Laptops, chargers, and hardware components needed for your prototype.\n• Extension boards (recommended).\n• Personal toiletries for overnight stay."
  },

  // 12. JUDGING & EVALUATION ROUNDS
  {
    intent: "judging_and_evaluation",
    phrases: ["how will we be judged", "what are the judging criteria", "how many evaluation rounds", "who are the judges", "when is evaluation"],
    keywords: ["judge", "judges", "judging", "evaluation", "eval", "criteria", "marks", "scoring", "round", "rounds", "mentor", "mentorship"],
    response: "Evaluation Structure:\n• Mentorship Checkpoint: Sept 5, 6:30 PM (Initial approach review).\n• Round 1 Evaluation: Sept 6, 8:00 AM (Core progress check).\n• Round 2 Evaluation: Sept 6, 3:30 PM (Final working prototype demo).\n• Criteria: Innovation, Technical Depth, Feasibility, Impact, and Presentation."
  },

  // 13. REFUNDS & CANCELLATIONS
  {
    intent: "refunds_and_cancellation",
    phrases: ["can i get a refund", "i want my money back", "can i cancel my registration", "refund policy", "how to withdraw"],
    keywords: ["refund", "refunds", "cancel", "cancellation", "withdraw", "return", "money back"],
    response: "All event registration fees are generally non-refundable as funds are committed to venue logistics and food arrangements. If you have a severe medical emergency, please contact hackthecube@csiclub.org with proof."
  },

  // 14. TECHNICAL GLITCHES & ID ISSUES
  {
    intent: "technical_issues",
    phrases: ["my id is not matching", "facing error during registration", "website glitch", "payment failed", "cannot upload details", "form not working"],
    keywords: ["error", "bug", "glitch", "issue", "problem", "failed", "matching", "not matching", "support", "help", "id"],
    response: "If you are experiencing a technical error or ID matching issue on the portal, please send an email to hackthecube@csiclub.org with a screenshot of the error and your team name so our technical team can fix it manually."
  },

  // 15. ORGANIZERS & FACULTY
  {
    intent: "organizers_and_faculty",
    phrases: ["who is organizing this", "faculty coordinators", "who is the hod", "who is the principal", "csi club details"],
    keywords: ["organizer", "organizers", "csi", "faculty", "chaya", "omkaresh", "kulkarni", "president", "hod", "principal", "nitin", "sherje", "contact"],
    response: "Hack the Cube 2026 is organized by the Computer Society of India (CSI) Chapter at DIT Pimpri:\n• Institutional Leadership: Principal Nitin Sherje & HOD Prof. Omkaresh Kulkarni\n• Faculty Coordinator: Prof. Chaya ma'am\n• Student Committee: CSI President, Vice President, Secretary, and Technical Team."
  },

  // 16. CERTIFICATES & PARTICIPATION
  {
    intent: "certificates",
    phrases: ["will i get a certificate", "is participation certificate provided", "who gets certificates", "certificate for all"],
    keywords: ["certificate", "certificates", "participation", "cert", "appreciation"],
    response: "Yes! All eligible participants who attend the full 24-hour hackathon and present their prototype in Round 2 will receive official National-Level Participation Certificates from the CSI Chapter."
  }
];

function queryMatrix(userInput: string): string {
  if (!userInput || !userInput.trim()) return "";

  const rawText = userInput.toLowerCase().trim();
  const tokens = rawText.replace(/[^\w\s]/g, "").split(/\s+/).filter(t => t.length > 1);

  // LAYER 1: Exact / Partial Phrase Match (Highest Accuracy)
  for (const entry of KNOWLEDGE_MATRIX) {
    for (const phrase of entry.phrases) {
      if (rawText.includes(phrase) || phrase.includes(rawText)) {
        return entry.response;
      }
    }
  }

  // LAYER 2: Weighted Keyword Token Overlap
  let bestEntry: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const entry of KNOWLEDGE_MATRIX) {
    let score = 0;

    tokens.forEach(token => {
      entry.keywords.forEach(kw => {
        if (token === kw) {
          score += 3; // Direct keyword match
        } else if (token.length >= 4 && kw.includes(token)) {
          score += 1; // Substring match
        }
      });
    });

    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  // LAYER 3: Threshold Validation
  if (highestScore >= 3 && bestEntry) {
    return (bestEntry as KnowledgeItem).response;
  }

  // LAYER 4: Smart Fallback (Informative & Direct)
  return "I am trained on the official Hack the Cube 2026 dataset! I didn't recognize that exact phrasing, but I can assist you with:\n• Schedule & Timings (Sept 5-6)\n• ₹1.5 Lakhs Prize Breakdown\n• Problem Statements & 3 Tracks\n• Team Size (2-4 Members) & Solo Matchmaking\n• Food, Wi-Fi & Overnight Stay\n• Venue & Parking (Gate 2)";
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */

export function CubeConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      text: "> System initialized. Ingested 24-Hour Hackathon rulebook. Awaiting query...",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to newest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
    };
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // 1. Render User Input
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    // 2. Match Against Matrix
    const answer = queryMatrix(trimmed);

    // 3. Create UI Container for System Output
    setMessages((prev) => [...prev, { role: "system", text: "" }]);

    // 4. Stream Output at 10ms per char
    let charIndex = 0;
    streamIntervalRef.current = setInterval(() => {
      charIndex++;
      const currentText = answer.slice(0, charIndex);
      setMessages((prev) => {
        const newArr = [...prev];
        if (newArr.length > 0 && newArr[newArr.length - 1].role === "system") {
          newArr[newArr.length - 1] = { role: "system", text: currentText };
        }
        return newArr;
      });

      if (charIndex >= answer.length) {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        setIsTyping(false);
      }
    }, 10);
  }, [input, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ── Floating Action Button ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close Cube Concierge" : "Open Cube Concierge"}
        id="cube-concierge-fab"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#111",
          border: "1px solid #333",
          boxShadow: isOpen
            ? "0 0 20px rgba(249, 115, 22, 0.6)"
            : "0 0 15px rgba(249, 115, 22, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        {isOpen ? (
          <X size={24} color="white" />
        ) : (
          <Terminal size={24} color="white" />
        )}
      </button>

      {/* ── Chat Interface ── */}
      {isOpen && (
        <div
          id="cube-concierge-chat"
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            zIndex: 9998,
            width: 350,
            height: 500,
            maxHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: "rgba(15, 15, 15, 0.85)",
            borderRadius: 12,
            border: "1px solid #333",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            overflow: "hidden",
            animation: "concierge-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 16,
              borderBottom: "1px solid #333",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontWeight: "bold", color: "white", fontSize: 15 }}
              >
                Cube Concierge
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  textTransform: "uppercase",
                  color: "#f97316",
                  letterSpacing: "0.1em",
                }}
              >
                Agentic RAG System
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={18} color="#666" />
            </button>
          </div>

          {/* ── Chat History ── */}
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius:
                    msg.role === "user"
                      ? "8px 8px 0 8px"
                      : "8px 8px 8px 0",
                  background: msg.role === "user" ? "#f97316" : "#222",
                  color: msg.role === "user" ? "white" : "#ddd",
                  fontFamily:
                    msg.role === "user" ? "sans-serif" : "monospace",
                  fontSize: msg.role === "user" ? 14 : 13,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.text}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: "8px 8px 8px 0",
                  background: "#222",
                  color: "#f97316",
                  fontFamily: "monospace",
                  fontSize: 13,
                  display: "flex",
                  gap: 4,
                }}
              >
                <span style={{ animation: "concierge-blink 1s infinite 0s" }}>
                  ▮
                </span>
                <span
                  style={{ animation: "concierge-blink 1s infinite 0.2s" }}
                >
                  ▮
                </span>
                <span
                  style={{ animation: "concierge-blink 1s infinite 0.4s" }}
                >
                  ▮
                </span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ── Input Area ── */}
          <div
            style={{
              display: "flex",
              padding: 12,
              borderTop: "1px solid #333",
              background: "rgba(0,0,0,0.4)",
              gap: 8,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query rules or schedule..."
              id="cube-concierge-input"
              style={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: 6,
                padding: "10px 12px",
                color: "white",
                flexGrow: 1,
                fontFamily: "sans-serif",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
              id="cube-concierge-send"
              style={{
                width: 40,
                height: 40,
                background:
                  isTyping || !input.trim() ? "#7c3a12" : "#f97316",
                border: "none",
                borderRadius: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor:
                  isTyping || !input.trim() ? "not-allowed" : "pointer",
                transition: "background 0.2s ease",
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>
      )}

      {/* ── Injected keyframes (isolated, no globals touched) ── */}
      <style jsx global>{`
        @keyframes concierge-slide-up {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes concierge-blink {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
        #cube-concierge-chat ::-webkit-scrollbar {
          width: 4px;
        }
        #cube-concierge-chat ::-webkit-scrollbar-track {
          background: transparent;
        }
        #cube-concierge-chat ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        #cube-concierge-input::placeholder {
          color: #666;
        }
      `}</style>
    </>
  );
}
