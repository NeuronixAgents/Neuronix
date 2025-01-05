import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: {
    name: string;
    image_url?: string;
    model_provider: string;
    model_name: string;
  };
}

export function ChatDialog({ open, onOpenChange, agent }: ChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { role: "user", content: input.trim() },
      // Simulate AI response for now
      { 
        role: "assistant", 
        content: `This is a simulated response from ${agent.name} using ${agent.model_provider}'s ${agent.model_name} model.` 
      },
    ];
    
    setMessages(newMessages);
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <img
                src={agent.image_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`}
                alt={agent.name}
              />
            </Avatar>
            {agent.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "assistant" ? (
                    <img
                      src={agent.image_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.name}`}
                      alt={agent.name}
                    />
                  ) : (
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                      alt="User"
                    />
                  )}
                </Avatar>
                <div
                  className={`rounded-lg px-3 py-2 max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
