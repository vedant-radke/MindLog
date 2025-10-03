"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../componenets/Navbar";
import { getToken } from "../../lib/auth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ArrowUpCircle, MessageCircle } from "lucide-react";

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
        body: JSON.stringify({ message: userMessage.text }),
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

  const introMessage = useMemo(
    () => ({
      sender: "bot" as const,
      text: "Hi there! I’m MindLog’s companion. Ask anything about mindfulness, journaling prompts, or emotional wellbeing.",
    }),
    []
  );

  const renderedMessages = messages.length ? messages : [introMessage];

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/60 px-4 py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_65%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col gap-8">
          <div className="space-y-3 text-center">
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            >
              Guided conversations
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Chat with your mindfulness companion
            </h1>
            <p className="mx-auto max-w-xl text-sm text-slate-600">
              Explore grounding exercises, emotional check-ins, and reflections
              tailored to how you’re feeling right now.
            </p>
          </div>

          <Card className="flex min-h-[28rem] max-h-[calc(100vh-260px)] flex-col overflow-hidden border-emerald-100 bg-white/80 shadow-lg shadow-emerald-100/30 backdrop-blur">
            <CardHeader className="flex flex-col gap-3 border-b border-emerald-100/60 bg-white/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">
                  MindLog companion
                </CardTitle>
                <Badge className="flex items-center gap-1 bg-emerald-100 text-emerald-700">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Online
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                This space is private. Responses synthesize mindfulness research
                and friendly guidance—never medical advice.
              </p>
            </CardHeader>

            <CardContent
              className="flex-1 space-y-4 overflow-y-auto bg-white/50 px-6 py-6"
              ref={listRef}
            >
              {renderedMessages.map((message, index) => {
                const isUser = message.sender === "user";

                return (
                  <div
                    key={`${message.sender}-${index}-${message.text.slice(
                      0,
                      10
                    )}`}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                      isUser
                        ? "ml-auto bg-emerald-600 text-white"
                        : "mr-auto bg-emerald-50 text-slate-800"
                    }`}
                  >
                    {message.text}
                  </div>
                );
              })}
            </CardContent>

            <CardFooter className="border-t border-emerald-100/60 bg-white/70 px-6 py-4">
              <form
                className="flex w-full items-center gap-3"
                onSubmit={handleSubmit}
              >
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Share what’s on your mind..."
                  className="h-11 flex-1 rounded-2xl border-emerald-100 bg-white/80 focus:border-emerald-300 focus:ring-emerald-200"
                  disabled={loading || !token}
                />
                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-emerald-600 px-5 text-white transition hover:bg-emerald-500 disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send"}
                  <ArrowUpCircle className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
