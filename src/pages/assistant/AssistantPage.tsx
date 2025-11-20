import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Dumbbell, Apple } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-fitness-assistant", {
        body: { message: input, userId: user?.id },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-2">AI Fitness Assistant</h1>
        <p className="text-muted-foreground">
          Get personalized workout and diet recommendations based on your fitness data
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
              <div className="flex gap-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <Dumbbell className="h-8 w-8 text-primary" />
                </div>
                <div className="p-4 rounded-full bg-primary/10">
                  <Apple className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome to Your AI Fitness Assistant!</h3>
                <p className="text-muted-foreground max-w-md">
                  Ask me anything about workouts, diet plans, or fitness advice. I'll provide personalized
                  recommendations based on your progress data.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-2xl">
                <Button
                  variant="outline"
                  onClick={() => setInput("Create a workout plan for me")}
                  className="h-auto py-3 px-4 text-left"
                >
                  Create a workout plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setInput("Suggest a diet plan based on my goals")}
                  className="h-auto py-3 px-4 text-left"
                >
                  Suggest a diet plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setInput("Analyze my recent progress")}
                  className="h-auto py-3 px-4 text-left"
                >
                  Analyze my progress
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setInput("What exercises should I focus on?")}
                  className="h-auto py-3 px-4 text-left"
                >
                  Exercise recommendations
                </Button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about workouts, diet plans, or fitness advice..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssistantPage;
