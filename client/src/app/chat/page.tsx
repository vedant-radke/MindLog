"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../componenets/Navbar";
import { getToken } from "../../lib/auth";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MessageCircle, Send } from "lucide-react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const storedToken = getToken();
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // Keep the input focused so the user can continue typing without clicking
  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading, messages]);

  const handleSend = async () => {
    if (!input.trim() || !token) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: userMessage.text,
          isFirstMessage: messages.length === 0,
        }),
      });

      const data = await res.json();
      const reply = data.reply?.trim() || "I’m still reflecting on that.";

      const botMessage: Message = { sender: "bot", text: reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong while reaching MindLog. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const introMessage = useMemo(
    () => ({
      sender: "bot" as const,
      text: "Hi there! I’m MindLog’s companion. Ask anything about mindfulness, journaling prompts, or emotional wellbeing.",
    }),
    []
  );

  const renderedMessages = messages.length ? messages : [introMessage];

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/60">
      <Navbar />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.12),transparent_70%)]" />

        <header className="relative z-10 border-b border-emerald-100/60 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-0.5">
                <h1 className="text-base font-semibold text-slate-900">
                  MindLog Companion
                </h1>
                <p className="text-xs text-slate-500">
                  Your mindful reflection partner
                </p>
              </div>
            </div>
            <Badge className="flex items-center gap-2 bg-emerald-100 text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </Badge>
          </div>
        </header>

        <main
          ref={listRef}
          className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6"
        >
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 pb-16">
            {renderedMessages.map((message, index) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={`${message.sender}-${index}-${message.text.slice(
                    0,
                    10
                  )}`}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                      isUser
                        ? "bg-emerald-600 text-white"
                        : "border border-emerald-100/60 bg-white/90 text-slate-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100/60 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 [animation-delay:0.2s]" />
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 [animation-delay:0.4s]" />
                  </div>
                  <span>MindLog is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="relative border-t border-emerald-100/60 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-4 sm:px-6">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what’s on your mind... (Press Enter to send)"
                className="h-12 flex-1 rounded-2xl border-emerald-200 bg-white/90 text-base focus:border-emerald-400 focus:ring-emerald-300"
                disabled={loading || !token}
                autoFocus
              />
              <Button
                type="submit"
                disabled={loading || !token || !input.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 p-0 text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            <p className="text-center text-xs text-slate-500">
              This space is private. Your reflections stay between you and
              MindLog.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
