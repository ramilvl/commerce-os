"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchInsights, sendChatMessage } from "./api";
import type { ChatMessage } from "@/types/domain";

const WELCOME_MESSAGE: ChatMessage = {
  id: "msg_welcome",
  role: "assistant",
  content:
    "Hi, I'm your CommerceOS AI assistant. I can generate product descriptions, surface sales insights, forecast inventory needs, and suggest marketing campaigns based on your live store data. What would you like help with?",
  createdAt: new Date().toISOString(),
};

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);

  const mutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(messages, content),
    onMutate: (content: string) => {
      const userMessage: ChatMessage = {
        id: `msg_${Math.random().toString(36).slice(2, 9)}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
    },
    onSuccess: (assistantMessage) => {
      setMessages((prev) => [...prev, assistantMessage]);
    },
  });

  return {
    messages,
    sendMessage: mutation.mutate,
    isSending: mutation.isPending,
  };
}

export function useAiInsights() {
  return useQuery({ queryKey: ["ai-insights"], queryFn: fetchInsights });
}
