"use client";

import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ChatList } from "./components/chat/ChatList";
import { ChatInput } from "./components/chat/ChatInput";
import { ChatHistory } from "./lib/gemini";
import { TrashIcon } from "@radix-ui/react-icons";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Add welcome message on initial load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hello! How can I assist you today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const pendingMessage: Message = {
      role: "assistant",
      content: "Thinking...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, pendingMessage]);

    try {
      // Filter history to exclude the initial assistant message and ensure user starts
      const history: ChatHistory[] = messages
        .filter((msg) => msg.role === "user" || (msg.role === "assistant" && messages.some(m => m.role === "user" && m.timestamp! < msg.timestamp!)))
        .map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [
          ...prev.filter((msg) => msg.content !== "Thinking..."),
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.content !== "Thinking..."),
        {
          role: "assistant",
          content: `⚠️ Error: ${error instanceof Error ? error.message : "Something went wrong."} [Retry?]`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex-1 flex flex-col relative">
        <ChatList messages={messages} loading={loading} />
        {messages.length > 1 && (
          <button
            onClick={handleClearChat}
            className="absolute top-2 right-2 px-3 py-1 text-sm text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center gap-1 shadow-md"
          >
            <TrashIcon className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
      <ChatInput
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}