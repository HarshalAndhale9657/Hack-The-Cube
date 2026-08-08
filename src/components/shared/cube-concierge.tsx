"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal, X, Send } from "lucide-react";

/* ═══════════════════════════════════════════════
   Cube Concierge — Gemini Conversational AI Engine
   Persistent multi-turn chat memory + system_instruction
   ═══════════════════════════════════════════════ */

interface Message {
  role: "system" | "user";
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_INSTRUCTION = `You are the 'Cube Concierge', the elite AI assistant for 'Hack the Cube 2026', a 24-hour national-level hackathon at Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune. 

CONVERSATIONAL RULES:
1. You have conversational memory. Answer follow-ups, confirmations ('are you sure?'), and natural dialogue seamlessly.
2. Maintain a professional, concise, enthusiastic, and hacker/terminal-themed tone.
3. Use ONLY the official event data below to answer. If a query is completely outside this event's scope, state that you don't have that info and suggest contacting hackthecube@csiclub.org.

MASTER HACKATHON DATABASE:
- Event: Hack the Cube 2026 (24-Hour National-Level Hackathon).
- Dates: September 5 to September 6, 2026.
- Venue: Dr. D. Y. Patil Institute of Technology (DIT), Survey No. 27/A, Near Akurdi Railway Station, Pimpri-Chinchwad, Pune. Free participant parking at Gate 2. Entry at Main Gate.
- Organizers: CSI Student Chapter. Core Organizers: President, Vice President, Secretary. Faculty Coordinators: Prof. Chaya ma'am and HOD Prof. Omkaresh Kulkarni. Leadership: Principal Nitin Sherje.
- Total Prize Pool: ₹1,50,000 across 3 Technical Tracks.
  * Track 1: Winner ₹35,000 | Runner-Up ₹15,000
  * Track 2: Winner ₹35,000 | Runner-Up ₹15,000
  * Track 3: Winner ₹35,000 | Runner-Up ₹15,000
  * Special Recognition: 2 additional teams get exclusive goodies for top innovation/UI.
- Tracks & Problems: 3 Tracks, 6 problem statements each (18 total challenges). Tracks cover FinTech, Healthcare, Education, Social Media, Agriculture, and Smart Cities. Unlocked on the hackathon day.
- Timeline:
  * Sept 5, 8:00 AM: Registration & Verification at Auditorium.
  * Sept 5, Morning: Inauguration & Podcast-style Speaker Interactions (3 sessions).
  * Sept 5, 1:30 PM - 3:00 PM: Lunch & Transition to venue.
  * Sept 5, 3:30 PM: Official 24-Hour Hackathon Clock Starts!
  * Sept 5, 6:30 PM: Mentorship & Initial Approach Evaluation.
  * Sept 6, 8:00 AM: Evaluation Round 1.
  * Sept 6, 3:30 PM: Evaluation Round 2 & Hackathon Clock Ends.
  * Sept 6, Finale: Results & Award Ceremony.
- Rules & Logistics: Open to undergraduate/postgraduate college students. Team size: 2 to 4 members. Plagiarism leads to disqualification. 24/7 WiFi, power, meals (dinner, midnight snacks, breakfast, lunch), and resting areas are provided.`;

/* ── Smart Fallback Engine (Used if API quota/rate limits occur) ── */
const FALLBACK_KNOWLEDGE = [
  {
    keywords: ["who", "organizer", "csi", "college", "dit", "pimpri", "about", "what is"],
    response: "Hack the Cube 2026 is a 24-Hour National-Level Hackathon organized by the CSI Student Chapter at Dr. D. Y. Patil Institute of Technology (DIT), Pimpri, Pune."
  },
  {
    keywords: ["sure", "confirm", "really", "certain", "true"],
    response: "Affirmative! All details provided are directly verified against the official Hack the Cube 2026 Master Database."
  },
  {
    keywords: ["time", "schedule", "itinerary", "when", "start", "end", "clock", "date", "september"],
    response: "The event kicks off on Sept 5 with registration at 8:00 AM at the Auditorium, followed by speaker sessions. The official 24-Hour Hackathon Clock runs from 3:30 PM Sept 5 to 3:30 PM Sept 6!"
  },
  {
    keywords: ["prize", "money", "reward", "win", "cash", "amount", "150000", "runner up", "goodies"],
    response: "The total prize pool is ₹1,50,000 across 3 tracks! Each track features a Winner prize of ₹35,000 and a Runner-Up prize of ₹15,000, plus Special Recognition Awards and goodies for exceptional builds."
  },
  {
    keywords: ["track", "domain", "problem", "challenge", "statement", "18"],
    response: "There are 3 Technical Tracks with 6 problem statements each (18 total!). Domains span FinTech, Healthcare, Education, Social Media, Agriculture, and Smart Cities."
  },
  {
    keywords: ["team", "size", "member", "individual", "alone", "wolf", "regist"],
    response: "Teams consist of 2 to 4 members. Valid college IDs are required during reporting."
  },
  {
    keywords: ["rule", "open source", "github", "plagiarism", "prebuilt", "code", "guideline"],
    response: "All primary development must occur during the official 24 hours. Open-source libraries and APIs are permitted with proper credit. Plagiarism results in disqualification."
  },
  {
    keywords: ["food", "lunch", "dinner", "snack", "stay", "overnight", "facility", "wifi", "power"],
    response: "We provide 24/7 high-speed Wi-Fi, uninterrupted power, dedicated workspaces, evening refreshments, dinner, midnight snacks, breakfast, and lunch."
  },
  {
    keywords: ["judge", "evaluation", "mentor", "scoring", "marks", "round"],
    response: "Projects are evaluated across Mentorship Eval (6:30 PM Day 1), Round 1 (8:00 AM Day 2), and Round 2 (3:30 PM Day 2) by a panel of industry experts."
  },
  {
    keywords: ["venue", "location", "address", "map", "reach", "gate", "parking"],
    response: "The event takes place at Dr. D. Y. Patil Institute of Technology, Survey No. 27/A, Near Akurdi Railway Station, Pimpri-Chinchwad, Pune. Free participant parking is at Gate 2."
  },
  {
    keywords: ["contact", "help", "email", "support", "faculty", "coordinator", "organizer"],
    response: "For urgent support, contact the CSI Student Chapter at hackthecube@csiclub.org or reach out to Faculty Coordinators Prof. Chaya ma'am and HOD Prof. Omkaresh Kulkarni."
  }
];

function getFallbackAnswer(query: string): string {
  const lower = query.toLowerCase();
  for (const entry of FALLBACK_KNOWLEDGE) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.response;
    }
  }
  return "I am trained on the Hack the Cube 2026 Master Database. You can ask me about tracks, schedule, prize pool, team rules, or venue logistics! For custom queries, email hackthecube@csiclub.org.";
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
  
  // Persistent conversational memory for multi-turn dialogue
  const chatHistoryRef = useRef<GeminiContent[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    // 1. Append user message to UI state
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    // 2. Append message to local conversational memory
    chatHistoryRef.current.push({
      role: "user",
      parts: [{ text: trimmed }],
    });

    // 3. Query Gemini API with system_instruction + chatHistory
    const processQuery = async () => {
      const payload = {
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: chatHistoryRef.current,
      };

      try {
        const response = await fetch(GEMINI_API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
          // Append AI response to conversational memory
          chatHistoryRef.current.push({
            role: "model",
            parts: [{ text: aiResponse }],
          });

          // Render AI message to UI
          setMessages((prev) => [...prev, { role: "system", text: aiResponse }]);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.warn("Gemini API fallback engaged:", error);

        // Fallback response for continuity
        const fallbackText = getFallbackAnswer(trimmed);
        chatHistoryRef.current.push({
          role: "model",
          parts: [{ text: fallbackText }],
        });

        setMessages((prev) => [...prev, { role: "system", text: fallbackText }]);
      } finally {
        setIsTyping(false);
      }
    };

    processQuery();
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
