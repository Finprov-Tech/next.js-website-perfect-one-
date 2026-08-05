'use client';

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, X, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { searchRAG, RAGMessage } from "@/lib/ragEngine";
import { Course } from "@/data/courses";
import { EnquireModal } from "./EnquireModal";

const quickPrompts = [
  "Top 3 SAP Courses",
  "Tally Prime + GST details",
  "Courses for Gulf jobs",
  "Digital Marketing fees",
];

export function RAGChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [enquireCourse, setEnquireCourse] = useState<Course | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<RAGMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hi! I am Finprov's AI Course Advisor powered by RAG across all 70 official courses. Ask me anything about syllabus, tools (Tally, SAP, Excel), fees, or Gulf opportunities!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: RAGMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = searchRAG(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: response.response,
          recommendedCourses: response.recommendedCourses,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Launcher */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full border border-gold/40 bg-navy px-4 py-2.5 text-white shadow-2xl backdrop-blur-xl ring-2 ring-gold/30 hover:bg-navy-dark transition-all"
      >
        <div className="relative grid h-7 w-7 place-items-center rounded-full bg-gradient-to-tr from-teal to-gold text-navy">
          <Bot className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
          </span>
        </div>
        <span className="text-xs font-extrabold tracking-wide text-white flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-gold" /> FIN BOT
        </span>
      </motion.button>

      {/* Floating Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent="true"
            data-lenis-prevent-wheel="true"
            data-lenis-prevent-touch="true"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-5 z-50 flex h-[450px] w-[88vw] max-w-[350px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-navy/95 text-white shadow-2xl backdrop-blur-xl sm:w-[350px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-navy-dark p-3">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-teal/20 text-teal ring-1 ring-teal/30">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1">
                    Fin Bot <Sparkles className="h-3 w-3 text-gold" />
                  </h3>
                  <p className="text-[10px] text-white/70">70 Courses Knowledge Base</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-3 [scrollbar-width:thin]"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl p-3 text-[11px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-cta text-white rounded-br-none shadow-sm"
                        : "bg-white/10 text-white/95 border border-white/15 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="mt-1 block text-[8px] text-white/50 text-right">{msg.timestamp}</span>
                  </div>

                  {/* Course Cards inside Chat */}
                  {msg.recommendedCourses && msg.recommendedCourses.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2">
                      {msg.recommendedCourses.map((c) => (
                        <div
                          key={c.slug}
                          className="group relative overflow-hidden rounded-xl border border-white/15 bg-white/10 p-2.5 transition-all hover:bg-white/15 hover:border-gold/50"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold text-gold">
                              {c.badge}
                            </span>
                            <span className="text-[9px] font-semibold text-white/60">{c.duration}</span>
                          </div>

                          <h4 className="mt-1.5 text-xs font-bold text-white group-hover:text-gold transition-colors">
                            {c.title}
                          </h4>
                          <p className="mt-0.5 text-[10px] text-white/70 line-clamp-2">{c.shortDesc}</p>

                          <div className="mt-2 flex items-center justify-between gap-2 border-t border-white/10 pt-1.5 text-[9px]">
                            <span className="font-semibold text-teal">{c.tool}</span>
                            <div className="flex gap-1.5">
                              <Link
                                href={`/courses/${c.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="font-bold text-white hover:underline flex items-center"
                              >
                                View <ChevronRight className="h-2.5 w-2.5" />
                              </Link>
                              <button
                                onClick={() => setEnquireCourse(c)}
                                className="rounded bg-cta px-2 py-0.5 font-bold text-white shadow hover:bg-cta-hover"
                              >
                                Enquire
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 rounded-xl bg-white/10 p-2.5 text-[11px] text-white/70 w-fit">
                  <Bot className="h-3.5 w-3.5 text-teal animate-spin" />
                  <span>Searching knowledge base...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="border-t border-white/10 bg-navy/80 px-2.5 py-1.5 overflow-x-auto whitespace-nowrap flex gap-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-white/20 bg-white/5 px-2.5 py-0.5 text-[9px] font-medium text-white/90 hover:bg-white/15 hover:border-gold/40 transition-colors shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="border-t border-white/10 bg-navy-dark p-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about courses, fees..."
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white placeholder-white/50 focus:border-gold focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="grid h-8 w-8 place-items-center rounded-full bg-cta text-white shadow-md disabled:opacity-50 hover:bg-cta-hover transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enquire Modal when clicked from RAG Chat */}
      {enquireCourse && (
        <EnquireModal
          open={!!enquireCourse}
          onClose={() => setEnquireCourse(null)}
          defaultCourse={enquireCourse.title}
        />
      )}
    </>
  );
}
