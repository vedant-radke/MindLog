"use client";

import { useState, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Get token from localStorage on first render
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !token) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botMessage = { sender: "bot", text: data.reply || "No reply" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

   return (
    <div className="flex flex-col h-screen bg-[#f0f2f5]">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-800">🧘 Self-Help Chat</h1>
        <p className="text-sm text-gray-500">Ask about yoga, mental health, etc.</p>
      </header>

      {/* Chat Body */}
      <main className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
              msg.sender === "user"
                ? "ml-auto bg-blue-100 text-right"
                : "mr-auto bg-green-100 text-left"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </main>

      {/* Input */}
      <footer className="bg-white p-4 sticky bottom-0 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          disabled={loading || !token}
          className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
        >
          {loading ? "..." : "Send"}
        </button>
      </footer>
    </div>
  );
}
