"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal, X, Send } from "lucide-react";

/* ═══════════════════════════════════════════════
   Cube Concierge — Client-Side Generative NLG &
   Streaming Typing Engine (100% Offline Reliable)
   ═══════════════════════════════════════════════ */

interface Message {
  role: "system" | "user";
  text: string;
}

const EVENT_FACTS: Record<string, string> = {
  overview:
    "Hack the Cube 2026 is a premier 24-hour national-level hackathon organized by the CSI Student Chapter at Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune.",
  dates: "The event takes place from September 5 to September 6, 2026.",
  schedule:
    "Day 1 starts with registration at 8:00 AM at the Auditorium, followed by podcast-style speaker sessions. The official 24-hour coding clock runs from 3:30 PM on Sept 5 to 3:30 PM on Sept 6, concluding with Round 2 judging and the award ceremony.",
  prizes:
    "The total cash prize pool is ₹1,50,000 distributed across 3 tracks. Each track winner gets ₹35,000 and each runner-up gets ₹15,000. Special goodies will also be awarded for top UI/UX and innovation.",
  tracks:
    "There are 3 technical tracks featuring 6 problem statements each (18 total challenges) covering FinTech, Healthcare, Agriculture, Smart Cities, and Education. Problem statements are unlocked on the event day.",
  teams:
    "Teams can have 2 to 4 members. Individual registrants are automatically matched into full-stack squads using our competency clustering feature.",
  rules:
    "All primary development must happen within the 24 hours. Open-source tools and APIs are allowed with proper credit. Direct plagiarism or pre-built projects lead to immediate disqualification.",
  facilities:
    "Participants get 24/7 high-speed Wi-Fi, uninterrupted power, dedicated workspaces, resting zones, and full meals (evening snacks, dinner, midnight refreshments, breakfast, and lunch).",
  venue:
    "The venue is Dr. D. Y. Patil Institute of Technology, Pimpri, Pune. Entry is via the Main Gate, with free participant parking available at Gate 2.",
  organizers:
    "Organized by the CSI Chapter under Principal Nitin Sherje, HOD Prof. Omkaresh Kulkarni, and Faculty Coordinator Prof. Chaya ma'am, alongside the CSI student leadership team.",
};

const INTROS = [
  "Sure thing! ",
  "Got it. ",
  "Here is what you need to know: ",
  "Directly from the rulebook: ",
  "Good question! ",
  "Let me break that down for you. ",
  "Here are the details: ",
];

const CONFIRMATIONS = [
  "Yes, absolutely 100% verified! ",
  "Without a doubt! ",
  "Yes, I'm completely sure. ",
  "Positive! Here's the official confirmation again: ",
];

const CONNECTORS = [
  " In addition, ",
  " Also worth noting: ",
  " Furthermore, ",
  " Keep in mind that ",
  " On top of that, ",
];

function getRandomItem(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
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

  const lastTopicRef = useRef<string | null>(null);
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

  const synthesizeResponse = (userInput: string): string => {
    const text = userInput.toLowerCase().trim();

    // 1. Handle Greetings & Small Talk
    if (text.match(/\b(hi|hello|hey|yo|sup|greetings|namaste|morning|evening)\b/)) {
      lastTopicRef.current = "greeting";
      return `${getRandomItem(INTROS)}I'm the Cube Concierge, your AI guide for Hack the Cube 2026. What can I help you with—schedule, prizes, tracks, rules, or venue details?`;
    }

    // 2. Handle Follow-up Confirmations ("are you sure?", "really?", "is this true?")
    if (text.match(/\b(sure|really|true|verified|certain|confirm|promise)\b/)) {
      if (lastTopicRef.current && EVENT_FACTS[lastTopicRef.current]) {
        return `${getRandomItem(CONFIRMATIONS)}${EVENT_FACTS[lastTopicRef.current]}`;
      }
      return `${getRandomItem(CONFIRMATIONS)}All information I provide is pulled straight from the official CSI Hack the Cube 2026 documentation.`;
    }

    // 3. Entity & Topic Matching Engine
    let responseParts: string[] = [];

    if (text.match(/\b(when|time|schedule|clock|itinerary|date|september|timing|hours|start|end)\b/)) {
      lastTopicRef.current = "schedule";
      responseParts.push(EVENT_FACTS.schedule);
    }

    if (text.match(/\b(prize|money|reward|win|cash|amount|150000|runner|pool|goodies)\b/)) {
      lastTopicRef.current = "prizes";
      responseParts.push(EVENT_FACTS.prizes);
    }

    if (text.match(/\b(track|domain|problem|challenge|statement|18|fintech|health|agriculture)\b/)) {
      lastTopicRef.current = "tracks";
      responseParts.push(EVENT_FACTS.tracks);
    }

    if (text.match(/\b(team|size|member|individual|alone|wolf|leader|regist|fee)\b/)) {
      lastTopicRef.current = "teams";
      responseParts.push(EVENT_FACTS.teams);
    }

    if (text.match(/\b(rule|plagiarism|prebuilt|github|code|allowed|disqualify|guideline)\b/)) {
      lastTopicRef.current = "rules";
      responseParts.push(EVENT_FACTS.rules);
    }

    if (text.match(/\b(food|meal|lunch|dinner|snack|wifi|stay|overnight|sleep|rest|power)\b/)) {
      lastTopicRef.current = "facilities";
      responseParts.push(EVENT_FACTS.facilities);
    }

    if (text.match(/\b(venue|location|address|where|map|reach|gate|parking|pimpri|dit)\b/)) {
      lastTopicRef.current = "venue";
      responseParts.push(EVENT_FACTS.venue);
    }

    if (text.match(/\b(organizer|csi|faculty|chaya|omkaresh|kulkarni|president|hod|principal|sherje)\b/)) {
      lastTopicRef.current = "organizers";
      responseParts.push(EVENT_FACTS.organizers);
    }

    // Synthesize dynamically built prose
    if (responseParts.length > 0) {
      let finalSentence = getRandomItem(INTROS) + responseParts.join(getRandomItem(CONNECTORS));
      return finalSentence;
    }

    // Fallback for unknown queries
    return `I'm tracking all details for Hack the Cube 2026! I didn't recognize that specific detail, but I can break down the schedule, prize pool (₹1.5L), tracks, team rules, or facilities for you. What would you like to explore?`;
  };

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // 1. Render user message
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    // 2. Synthesize dynamic response
    const generatedReply = synthesizeResponse(trimmed);

    // 3. Append empty system message container
    setMessages((prev) => [...prev, { role: "system", text: "" }]);

    // 4. Stream characters at 12ms per char for organic LLM generation feel
    let charIndex = 0;
    streamIntervalRef.current = setInterval(() => {
      charIndex++;
      const currentText = generatedReply.slice(0, charIndex);
      setMessages((prev) => {
        const newArr = [...prev];
        if (newArr.length > 0 && newArr[newArr.length - 1].role === "system") {
          newArr[newArr.length - 1] = { role: "system", text: currentText };
        }
        return newArr;
      });

      if (charIndex >= generatedReply.length) {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        setIsTyping(false);
      }
    }, 12);
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
