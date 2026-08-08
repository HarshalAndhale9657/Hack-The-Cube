"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send } from "lucide-react";

/* ═══════════════════════════════════════════════
   Cube Concierge — Master Offline Intent Engine &
   Fuzzy Math Algorithm (Strict Regex Word Boundaries)
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

// =====================================================================
// 1. THE MASTER KNOWLEDGE MATRIX (COLLISION-PROOFED)
// =====================================================================

const KNOWLEDGE_MATRIX: KnowledgeItem[] = [
  {
    intent: "greeting",
    phrases: ["hi", "hello", "hey", "yo", "sup", "greetings", "good morning", "what is your name", "who are you", "what can you do"],
    keywords: ["hello", "hey", "concierge", "bot", "assistant", "help"],
    response: "Hello! I am the Cube Concierge, your instant assistant for Hack the Cube 2026. Ask me about the schedule, prize money, problem statements, team rules, registration steps, or venue location!"
  },
  {
    intent: "dates_and_time",
    phrases: ["when is the hackathon", "what is the date", "what days", "hackathon dates", "what is the schedule", "inauguration ceremony", "when is the inauguration"],
    keywords: ["date", "dates", "when", "time", "timing", "schedule", "itinerary", "clock", "september", "inauguration", "ceremony", "start", "end"],
    response: "Timeline & Inauguration:\n• Sept 5, 8:00 AM: Registration at the Auditorium, followed by the Inauguration Ceremony.\n• Sept 5, 3:30 PM: Official 24-Hour Hackathon Clock Starts!\n• Sept 6, 3:30 PM: Coding Ends.\n• Sept 6, Evening: Award Ceremony."
  },
  {
    intent: "prizes",
    phrases: ["what is the prize pool", "how much money can i win", "first prize", "runner up prize", "cash rewards", "winning amount", "is there a cash prize"],
    keywords: ["prize", "prizes", "money", "cash", "reward", "rewards", "win", "winning", "amount", "150000", "35000", "15000", "pool", "goodies"],
    response: "The total cash prize pool is ₹1,50,000 distributed equally across 3 tracks:\n• Track Winner (3 teams): ₹35,000 each\n• Track Runner-Up (3 teams): ₹15,000 each\n• Special Recognition: 2 additional teams win exclusive goodies for top UI/UX and innovation!"
  },
  {
    intent: "tracks_and_problems",
    phrases: ["what are the tracks", "how many problem statements", "show problem statements", "what domains", "type of problem statement", "what are the problems"],
    keywords: ["track", "tracks", "domain", "domains", "statement", "statements", "challenge", "challenges", "18", "fintech", "healthcare", "agriculture", "smart city", "education"],
    response: "There are 3 Technical Tracks featuring 6 problem statements each (18 total challenges!). Domains include FinTech, Healthcare, Agriculture, Smart Cities, Social Media, and Education. To ensure fairness, exact problem statements will be unlocked on the event day."
  },
  {
    intent: "team_size_and_registration",
    phrases: ["what is the team size", "how to register", "how to fill the form", "guide me how to fill", "registration steps", "guide me to register", "is team compulsory"],
    keywords: ["team", "teams", "size", "member", "members", "register", "registration", "process", "form", "steps", "guide", "apply", "compulsory", "solo", "alone", "individual"],
    response: "Registration & Team Rules:\n1. Team size is 2 to 4 members. You cannot compete completely solo, but individual registrants will be matched into teams via our matchmaking feature!\n2. To apply, click 'Register Now' on the top right and fill out the form.\n3. All members must carry valid college IDs."
  },
  {
    intent: "food_and_dietary",
    phrases: ["will food be provided", "veg or non veg", "am vegetarian", "what meals are included", "will we get dinner", "jain food", "what type of food"],
    keywords: ["food", "meal", "meals", "eat", "veg", "vegetarian", "non-veg", "chicken", "dinner", "lunch", "breakfast", "snacks", "diet", "dietary"],
    response: "Full hospitality is provided throughout the 24 hours!\n• Meals Included: Evening snacks, dinner, midnight refreshments, breakfast, and lunch.\n• Dietary Options: Both Vegetarian and Non-Vegetarian options are available (you specify this during registration)."
  },
  {
    intent: "facilities_and_stay",
    phrases: ["where will we sleep", "is there overnight stay", "resting facilities", "is wifi provided", "will there be power outlets", "what type of facilities"],
    keywords: ["stay", "overnight", "sleep", "rest", "resting", "wifi", "internet", "power", "charging", "plug", "extension", "washroom", "facilities", "facility"],
    response: "We provide complete 24-hour infrastructure support:\n• High-speed Wi-Fi & continuous electricity with backup power.\n• Dedicated team workspaces with extension boards.\n• Designated overnight resting areas and washrooms.\n• First-aid medical support and 24/7 campus security."
  },
  {
    intent: "venue_and_location",
    phrases: ["where is the venue", "how to reach the college", "what is the address", "which gate to enter", "where to park"],
    keywords: ["venue", "location", "address", "map", "reach", "gate", "parking", "pimpri", "dit", "akurdi", "station", "auditorium"],
    response: "Venue Information:\n• Location: Dr. D. Y. Patil Institute of Technology (DIT), Survey No. 27/A, Near Akurdi Railway Station, Pimpri-Chinchwad, Pune - 411044.\n• Entry Gate: Main Gate.\n• Free Parking: Gate 2 for all registered participants."
  },
  {
    intent: "rules_and_plagiarism",
    phrases: ["can we use github", "is prebuilt code allowed", "can I use open source", "what are the rules", "plagiarism policy"],
    keywords: ["rule", "rules", "plagiarism", "prebuilt", "existing", "github", "opensource", "cheating", "disqualify", "guideline"],
    response: "Strict Coding Rules:\n1. All major code development must be done during the official 24-hour window.\n2. Open-source libraries, APIs, and frameworks are allowed with proper credit.\n3. Plagiarism or submitting pre-built projects results in immediate disqualification."
  },
  {
    intent: "technical_issues_and_refunds",
    phrases: ["my id is not matching", "facing error", "website glitch", "payment failed", "form not working", "problem in registering", "there is a problem", "i want my money back", "can i get a refund", "accidentally submitted", "made a mistake", "wrong details", "edit form"],
    keywords: ["error", "bug", "glitch", "issue", "problem", "problems", "failed", "matching", "support", "help", "id", "refund", "cancel", "money back", "stuck", "accidentally", "mistake", "wrong"],
    response: "Support & Troubleshooting:\n• Technical Glitches (ID matching, accidental submissions, form edits): Email hackthecube@csiclub.org with a screenshot/details so our tech team can resolve it manually.\n• Refunds: Registration fees are generally non-refundable. Contact support for severe emergencies."
  }
];

// =====================================================================
// 2. FUZZY MATH ENGINE (LEVENSHTEIN DISTANCE)
// =====================================================================

function getEditDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i][j - 1] + 1,
        matrix[i - 1][j] + 1,
        matrix[i - 1][j - 1] + indicator
      );
    }
  }
  return matrix[a.length][b.length];
}

// =====================================================================
// 3. MULTI-LAYER QUERY ENGINE
// =====================================================================

function queryMatrix(userInput: string): string {
  if (!userInput || !userInput.trim()) return "";

  const rawText = userInput.toLowerCase().trim();
  const tokens = rawText
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((t) => t.length > 1);

  // LAYER 1: Strict Regex Word Boundaries (Prevents "which" from triggering "hi")
  for (const entry of KNOWLEDGE_MATRIX) {
    if (entry.phrases) {
      for (const phrase of entry.phrases) {
        const strictRegex = new RegExp(`\\b${phrase}\\b`, "i");
        if (strictRegex.test(rawText)) {
          return entry.response;
        }
      }
    }
  }

  // LAYER 2: Mathematical Fuzzy Scoring
  let bestEntry: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const entry of KNOWLEDGE_MATRIX) {
    let score = 0;

    tokens.forEach((token) => {
      entry.keywords.forEach((kw) => {
        if (token === kw) {
          score += 10;
        } else if (token.length > 3 && kw.includes(token)) {
          score += 5;
        } else if (token.length > 4) {
          const distance = getEditDistance(token, kw);
          if (distance === 1) score += 8;
          if (distance === 2 && token.length > 6) score += 4;
        }
      });
    });

    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  // LAYER 3: Threshold
  if (highestScore >= 8 && bestEntry) {
    return (bestEntry as KnowledgeItem).response;
  }

  // LAYER 4: Fallback
  return "I am trained exclusively on the Hack the Cube 2026 rulebook! I didn't quite catch that. You can ask me directly about:\n• Schedule & Inauguration\n• Prize Pool (₹1.5 Lakhs) & 18 Problems\n• Registration Steps & Team Rules\n• Food, Facilities & Venue Location\n• Tech Support or Glitches";
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
          border: "1px solid #f97316",
          boxShadow: isOpen
            ? "0 0 25px rgba(249, 115, 22, 0.7)"
            : "0 0 15px rgba(249, 115, 22, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
        }}
      >
        {isOpen ? (
          <X size={24} color="white" />
        ) : (
          <Bot size={28} color="#f97316" />
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(249, 115, 22, 0.15)",
                  border: "1px solid rgba(249, 115, 22, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 10px rgba(249, 115, 22, 0.3)",
                }}
              >
                <Bot size={20} color="#f97316" />
              </div>
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
                  Agentic AI Assistant
                </span>
              </div>
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
