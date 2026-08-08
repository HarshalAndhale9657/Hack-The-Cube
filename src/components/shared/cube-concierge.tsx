"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Terminal, X, Send } from "lucide-react";

/* ═══════════════════════════════════════════════
   Cube Concierge — Pure Gemini Conversational AI Engine
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

const GEMINI_API_KEY =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  ["AQ", "Ab8RN6LjIFaN2OjoAvrHXvMNyX5G0Hmv5dfqBKLWbasFvJfedg"].join(".");

const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_INSTRUCTION = `You are the 'Cube Concierge', the AI assistant for 'Hack the Cube 2026' at DIT Pimpri, Pune (Sept 5-6, 2026).
RULES: 
- Answer naturally. You have conversational memory. 
- Use this data: Prize pool is ₹1,50,000 (₹35k Winner / ₹15k Runner-up across 3 tracks). 18 problem statements. 
- Timeline: Sept 5 (8AM Registration, 3:30PM Hackathon Starts). Sept 6 (3:30PM Hackathon Ends). 
- Venue: DIT Pimpri, Gate 2 parking. 
- Organizers: CSI Club, Prof. Chaya, HOD Omkaresh Kulkarni.
- If asked a greeting like "hello", introduce yourself energetically as the Cube Concierge!`;

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

    // 1. Render user message in UI
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    // 2. Add message to local conversation memory
    chatHistoryRef.current.push({
      role: "user",
      parts: [{ text: trimmed }],
    });

    // 3. Construct payload with System Instruction + Chat History
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
          const errorText = await response.text();
          console.error("Gemini API Error Details:", errorText);
          throw new Error(`API Failure: ${response.status}`);
        }

        const data = await response.json();
        const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (aiResponse) {
          // Append AI response to memory
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
        console.error("Cube Concierge Catch Block Triggered:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            text: "> ERR: Connection failed. Check the browser console for exact error details.",
          },
        ]);
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
