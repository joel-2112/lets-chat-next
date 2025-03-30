"use client";

import { useEffect, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  avatar?: string;
}

interface ChatListProps {
  messages: Message[];
  loading: boolean;
}

export function ChatList({ messages, loading }: ChatListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLength.current = messages.length;
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <ChatBubble
          key={index}
          role={msg.role}
          content={msg.content}
          timestamp={msg.timestamp}
          avatar={msg.avatar}
        />
      ))}
      {loading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}