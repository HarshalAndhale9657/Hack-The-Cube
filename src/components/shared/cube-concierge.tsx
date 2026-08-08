"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, X, Send } from "lucide-react";

/* ═══════════════════════════════════════════════
   Cube Concierge — Hyper-Granular Micro-Intent
   Offline Engine & Fuzzy Math Algorithm
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
// 1. HYPER-GRANULAR MICRO-INTENT MATRIX
// =====================================================================

const KNOWLEDGE_MATRIX: KnowledgeItem[] = [
  // --- GREETINGS & IDENTITY ---
  {
    intent: "greeting",
    phrases: ["hi", "hello", "hey", "yo", "sup", "greetings", "good morning"],
    keywords: ["hello", "hey", "help"],
    response: "Hello! I am the Cube Concierge. I can give you exact details on the schedule, prizes, rules, or logistics for Hack the Cube 2026. What do you need to know?"
  },
  {
    intent: "bot_identity",
    phrases: ["what is your name", "who are you", "what can you do", "are you ai"],
    keywords: ["name", "who", "concierge", "bot"],
    response: "I'm the Cube Concierge! I'm a local logic engine engineered specifically for Hack the Cube 2026. I know the rulebook inside and out."
  },

  // --- DATES, TIMING & INAUGURATION ---
  {
    intent: "exact_dates",
    phrases: ["what is the date", "what days", "hackathon dates", "when is the hackathon"],
    keywords: ["date", "dates", "september", "days"],
    response: "Hack the Cube 2026 takes place over two days: September 5th and September 6th, 2026."
  },
  {
    intent: "start_time",
    phrases: ["when does it start", "what time does the coding start", "when is the clock starting"],
    keywords: ["start", "timing", "clock", "begins"],
    response: "The official 24-hour coding clock starts exactly at 3:30 PM on September 5th!"
  },
  {
    intent: "inauguration",
    phrases: ["inauguration ceremony", "when is the inauguration", "where is the inauguration", "podcast format", "who is speaking"],
    keywords: ["inauguration", "ceremony", "podcast", "speaker", "speakers"],
    response: "The Inauguration happens on the morning of Sept 5th at the Auditorium. Instead of boring lectures, we are hosting a podcast-style speaker series featuring 3 industry leaders doing interactive Q&A!"
  },

  // --- PRIZES (SPLIT INTO POOL VS AMOUNTS) ---
  {
    intent: "total_prize_pool",
    phrases: ["what is the prize pool", "total prize", "is there a cash prize"],
    keywords: ["pool", "total", "150000", "lakhs"],
    response: "The total cash prize pool for the event is a massive ₹1,50,000, distributed across our 3 tracks!"
  },
  {
    intent: "specific_prize_amounts",
    phrases: ["how much money can i win", "first prize", "runner up prize", "winning amount", "prize breakdown"],
    keywords: ["prize", "prizes", "money", "cash", "reward", "win", "amount", "35000", "15000"],
    response: "For each of the 3 tracks, the Winner receives ₹35,000 and the Runner-Up receives ₹15,000. Plus, two special teams will win exclusive goodies for top UI/UX and Innovation."
  },

  // --- TRACKS & PROBLEM STATEMENTS ---
  {
    intent: "track_domains",
    phrases: ["what are the tracks", "what domains", "themes"],
    keywords: ["track", "tracks", "domain", "domains", "fintech", "healthcare", "agriculture"],
    response: "We have 3 Technical Tracks covering exciting domains: FinTech, Healthcare, Agriculture, Smart Cities, Social Media, and Education."
  },
  {
    intent: "problem_statements",
    phrases: ["how many problem statements", "show problem statements", "what are the problems", "when will challenges be unlocked"],
    keywords: ["statement", "statements", "challenge", "challenges", "18"],
    response: "There are 6 problem statements per track (18 total challenges!). To ensure a fair 24-hour competition, the exact problem statements are locked and will only be revealed on the event day."
  },

  // --- REGISTRATION & TEAMS (SPLIT INTO FEE, SIZE, SOLO, STEPS) ---
  {
    intent: "registration_fee",
    phrases: ["what is the registration fee", "is it free", "how much does it cost to register"],
    keywords: ["fee", "cost", "price", "pay", "rupees"],
    response: "The exact registration fee details are listed on the official portal. Note that fees are non-refundable once paid, as they cover your food and 24-hour infrastructure logistics."
  },
  {
    intent: "registration_steps",
    phrases: ["how to register", "how to fill the form", "registration steps", "guide me to register"],
    keywords: ["register", "registration", "form", "apply", "steps", "portal"],
    response: "To register, click the 'Register Now' button on our portal. Fill in your team details, college info, and preferred technical track. You will receive a confirmation email once approved."
  },
  {
    intent: "team_size",
    phrases: ["what is the team size", "how many members", "maximum members", "minimum members"],
    keywords: ["team", "teams", "size", "member", "members"],
    response: "Teams must consist of 2 to 4 members. All members must be currently enrolled college students and carry valid college IDs."
  },
  {
    intent: "solo_participation",
    phrases: ["can i participate solo", "what if i am an individual", "can i join alone", "i want to participate solo", "is team compulsory"],
    keywords: ["solo", "alone", "individual", "single"],
    response: "You cannot compete completely solo for the 24 hours. HOWEVER, you can register as an individual! Our system will automatically match you with other solo developers to form a complete team."
  },
  {
    intent: "eligibility",
    phrases: ["who can participate", "who is eligible", "can school students join"],
    keywords: ["participate", "eligible", "eligibility", "students", "college"],
    response: "The hackathon is open to currently enrolled undergraduate and postgraduate students from recognized technical colleges and universities."
  },

  // --- FOOD & ACCOMMODATION (SPLIT) ---
  {
    intent: "food_general",
    phrases: ["will food be provided", "what meals are included", "will we get dinner", "is food free"],
    keywords: ["food", "meal", "meals", "dinner", "lunch", "breakfast", "snacks"],
    response: "Yes, full hospitality is provided! You will get evening snacks, dinner, midnight refreshments, breakfast, and lunch during the 24-hour sprint."
  },
  {
    intent: "food_dietary",
    phrases: ["veg or non veg", "am vegetarian", "jain food", "what type of food"],
    keywords: ["veg", "vegetarian", "non-veg", "chicken", "diet", "dietary"],
    response: "We cater to both! Both Vegetarian and Non-Vegetarian meal options will be available. You can specify your exact dietary preference when filling out the registration form."
  },
  {
    intent: "accommodation",
    phrases: ["is accommodation available", "where will we sleep", "resting facilities", "can we sleep"],
    keywords: ["accommodation", "stay", "overnight", "sleep", "rest", "bed", "washroom"],
    response: "Since this is a continuous 24-hour event, there are no hotel rooms, but we provide designated overnight resting areas, washrooms, and 24/7 campus security so you can rest safely when needed."
  },

  // --- INFRASTRUCTURE & HARDWARE ---
  {
    intent: "wifi_and_power",
    phrases: ["is wifi provided", "will there be power outlets", "internet access"],
    keywords: ["wifi", "internet", "power", "charging", "plug", "extension"],
    response: "Absolutely. We provide 24/7 high-speed Wi-Fi, dedicated team workspaces, and continuous electricity with backup power generators to ensure zero interruptions."
  },
  {
    intent: "hardware_laptop",
    phrases: ["do i need to bring my own laptop", "what should i bring", "hardware provided", "laptops"],
    keywords: ["bring", "laptop", "laptops", "charger", "hardware", "gear"],
    response: "Yes, you must bring your own laptops, chargers, and any specific hardware your prototype needs. We also highly recommend bringing a personal extension board for your team's desk!"
  },
  {
    intent: "venue_location",
    phrases: ["where is the venue", "how to reach the college", "what is the address", "where to park"],
    keywords: ["venue", "location", "address", "map", "parking", "pimpri", "dit"],
    response: "The event is at Dr. D. Y. Patil Institute of Technology (DIT), Near Akurdi Railway Station, Pimpri-Chinchwad, Pune. Free parking is available at Gate 2."
  },

  // --- RULES, JUDGING & TECH SUPPORT ---
  {
    intent: "rules_plagiarism",
    phrases: ["can we use github", "is prebuilt code allowed", "can I use open source", "plagiarism policy"],
    keywords: ["rule", "rules", "plagiarism", "prebuilt", "github", "opensource", "cheating", "disqualify"],
    response: "All major code development must happen during the 24 hours. Open-source libraries are allowed with credit, but submitting pre-built projects or direct plagiarism will result in immediate disqualification."
  },
  {
    intent: "judging_and_mentorship",
    phrases: ["how will projects be judged", "what are the judging criteria", "mentorship program"],
    keywords: ["judge", "judges", "judging", "evaluation", "criteria", "mentor", "mentorship"],
    response: "Projects are judged on Innovation, Technical Complexity, Impact, and Presentation. Mentors will do an initial checkpoint at 6:30 PM (Day 1), followed by Round 1 (Morning, Day 2) and the Final Demo (Afternoon, Day 2)."
  },
  {
    intent: "certificates",
    phrases: ["will certificates be provided", "will i get a certificate", "participation certificate"],
    keywords: ["certificate", "certificates", "participation", "cert"],
    response: "Yes! All eligible participants who attend the full 24 hours and present their prototype in Round 2 will receive official National-Level Participation Certificates."
  },
  {
    intent: "technical_issues",
    phrases: ["my id is not matching", "facing error", "payment failed", "form not working", "accidentally submitted", "made a mistake"],
    keywords: ["error", "bug", "glitch", "issue", "problem", "failed", "matching", "support", "help", "mistake"],
    response: "For technical glitches (ID matching, accidental form submissions, payment errors), please email hackthecube@csiclub.org with a screenshot so our tech team can resolve it manually."
  },
  {
    intent: "refunds",
    phrases: ["i want my money back", "can i get a refund", "cancel my registration"],
    keywords: ["refund", "refunds", "cancel", "money back"],
    response: "Registration fees are generally non-refundable as the funds are pre-committed to venue logistics and catering. If you have a severe medical emergency, contact our support email directly."
  }
];

// =====================================================================
// 2. MATH ENGINE (LEVENSHTEIN DISTANCE)
// =====================================================================

function getEditDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) { matrix[i][0] = i; }
  for (let j = 0; j <= b.length; j += 1) { matrix[0][j] = j; }

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

  const cleanInput = userInput.toLowerCase().trim();
  const rawText = cleanInput.replace(/[^\w\s]/g, "");
  const tokens = rawText.split(/\s+/).filter((t) => t.length > 1);

  // LAYER 1: Strict Regex Phrase Boundaries (Prevents "which" triggering "hi")
  for (const entry of KNOWLEDGE_MATRIX) {
    if (entry.phrases) {
      for (const phrase of entry.phrases) {
        const cleanPhrase = phrase.replace(/[^\w\s]/g, "");
        const strictRegex = new RegExp(`\\b${cleanPhrase}\\b`, "i");
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

  // LAYER 3: Threshold Validation
  if (highestScore >= 8 && bestEntry) {
    return (bestEntry as KnowledgeItem).response;
  }

  // LAYER 4: Conversational Fallback
  return "I'm the offline Cube Concierge! I didn't quite catch that. You can ask me highly specific questions like 'What is the team size?', 'Is there veg food?', 'When does it start?', or 'Do I bring my laptop?'";
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
  const [showBubble, setShowBubble] = useState(false);

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

  // =====================================================================
  // 5. PROACTIVE ENGAGEMENT BUBBLE (ATTENTION GRABBER)
  // =====================================================================
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Hide bubble when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowBubble(false);
    }
  }, [isOpen]);

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
      {/* ── Proactive Engagement Bubble ── */}
      {showBubble && !isOpen && (
        <div
          id="cube-proactive-bubble"
          onClick={() => {
            setShowBubble(false);
            setIsOpen(true);
          }}
          style={{
            position: "fixed",
            bottom: 92,
            right: 20,
            background: "rgba(15, 15, 15, 0.92)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "#ffffff",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid rgba(249, 115, 22, 0.5)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.4), 0 0 15px rgba(249, 115, 22, 0.2)",
            fontSize: 14,
            fontFamily: "sans-serif",
            lineHeight: 1.4,
            cursor: "pointer",
            zIndex: 9998,
            maxWidth: 220,
            animation: "concierge-bubble-in 0.4s ease forwards",
          }}
        >
          <strong style={{ color: "#f97316" }}>Psst! 👋</strong>
          <br />
          Want to know how to win the ₹1.5 Lakh prize pool? Ask me!
          {/* Triangle pointer */}
          <div
            style={{
              position: "absolute",
              bottom: -7,
              right: 20,
              width: 0,
              height: 0,
              borderWidth: "7px 7px 0",
              borderStyle: "solid",
              borderColor: "rgba(15, 15, 15, 0.92) transparent transparent transparent",
            }}
          />
        </div>
      )}

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
        @keyframes concierge-bubble-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
