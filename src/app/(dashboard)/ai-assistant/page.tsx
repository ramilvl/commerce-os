"use client";

import { useEffect, useRef, useState } from "react";
import {
  Boxes, Loader2, Megaphone, Send, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAiChat, useAiInsights } from "@/features/ai-assistant/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiInsight } from "@/types/domain";

const CATEGORY_ICON: Record<AiInsight["category"], typeof TrendingUp> = {
  sales: TrendingUp,
  inventory: Boxes,
  marketing: Megaphone,
  customer: Users,
};

const IMPACT_VARIANT: Record<AiInsight["impact"], "danger" | "warning" | "default"> = {
  high: "danger",
  medium: "warning",
  low: "default",
};

const SUGGESTED_PROMPTS = [
  "How is revenue trending this month?",
  "Which products need reordering soon?",
  "Suggest a marketing campaign for this week",
  "Which customers are at risk of churning?",
];

export default function AiAssistantPage() {
  const { messages, sendMessage, isSending } = useAiChat();
  const { data: insights, isLoading: insightsLoading } = useAiInsights();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    sendMessage(content);
    setInput("");
  };

  return (
    <div>
      <PageHeader
        title="AI Assistant"
        description="Ask questions about your store, generate content, and get proactive recommendations."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="flex h-[640px] flex-col lg:col-span-2">
          <CardHeader className="flex-row items-center gap-2 space-y-0 border-b border-border">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5">
            <div className="flex flex-col gap-4 py-5">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}>
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className={message.role === "assistant" ? "bg-accent-subtle text-accent" : ""}>
                      {message.role === "assistant" ? <Sparkles className="h-3.5 w-3.5" /> : "You"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                      message.role === "assistant" ? "bg-muted text-foreground" : "bg-accent text-accent-foreground"
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex gap-3">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-accent-subtle text-accent">
                      <Sparkles className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1 rounded-xl bg-muted px-3.5 py-2.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-border p-4">
            {messages.length <= 1 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-border-strong px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about sales, inventory, marketing, or customers..."
                disabled={isSending}
              />
              <Button type="submit" size="icon" disabled={isSending || !input.trim()} aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <p className="text-xs text-muted-foreground">Generated from your live store data</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {insightsLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : (
              insights?.map((insight) => {
                const Icon = CATEGORY_ICON[insight.category];
                return (
                  <div key={insight.id} className="rounded-lg border border-border p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" />
                        <span className="capitalize">{insight.category}</span>
                      </div>
                      <Badge variant={IMPACT_VARIANT[insight.impact]} className="capitalize">
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium leading-snug">{insight.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
