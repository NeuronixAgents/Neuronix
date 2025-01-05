import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Send, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DebugPanel } from "@/components/DebugPanel";

interface Agent {
  id: number;
  name: string;
  image_url?: string;
  model_provider: string;
  model_name: string;
}

interface Message {
  id: number;
  content: string;
  agent: Agent;
  created_at: string;
}

interface CollaborativeChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAgents?: Agent[];
}

export function CollaborativeChat({
  open,
  onOpenChange,
  initialAgents = [],
}: CollaborativeChatProps) {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [chatId, setChatId] = useState<number | null>(null);
  const [showAgentSelect, setShowAgentSelect] = useState(false);

  const { data: agents } = useQuery({
    queryKey: ["/api/agents"],
    enabled: showAgentSelect,
  });

  // Create a new collaborative chat
  const createChat = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/collaborative-chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Multi-Agent Chat",
          description: "A collaborative chat between multiple AI agents",
          participants: initialAgents.map((agent) => agent.id),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setChatId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/collaborative-chats"] });
    },
  });

  // Add a new participant to the chat
  const addParticipant = useMutation({
    mutationFn: async (agentId: number) => {
      if (!chatId) throw new Error("No active chat");

      const response = await fetch(
        `/api/collaborative-chats/${chatId}/participants`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: agentId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add participant");
      }

      return response.json();
    },
    onSuccess: () => {
      setShowAgentSelect(false);
      queryClient.invalidateQueries({
        queryKey: [`/api/collaborative-chats/${chatId}`],
      });
    },
  });

  // Send a message in the chat
  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!chatId || !selectedAgent) throw new Error("No active chat or agent selected");

      const response = await fetch(
        `/api/collaborative-chats/${chatId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agent_id: selectedAgent,
            content: input,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.json();
    },
    onSuccess: (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      queryClient.invalidateQueries({
        queryKey: [`/api/collaborative-chats/${chatId}`],
      });
    },
  });

  // Initialize chat when opened
  useEffect(() => {
    if (open && initialAgents.length > 0) {
      createChat.mutate();
    }
  }, [open, initialAgents.length]);

  // Load chat messages
  useEffect(() => {
    if (chatId) {
      fetch(`/api/collaborative-chats/${chatId}`)
        .then((res) => res.json())
        .then((data) => {
          setMessages(data.messages || []);
        });
    }
  }, [chatId]);

  const handleSend = () => {
    if (!input.trim() || !selectedAgent) return;
    sendMessage.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Multi-Agent Chat</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAgentSelect(true)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {showAgentSelect && (
          <div className="mb-4">
            <Select
              value={selectedAgent?.toString()}
              onValueChange={(value) => {
                const agentId = parseInt(value);
                addParticipant.mutate(agentId);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an agent to add" />
              </SelectTrigger>
              <SelectContent>
                {agents?.map((agent: Agent) => (
                  <SelectItem key={agent.id} value={agent.id.toString()}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <img
                    src={
                      message.agent.image_url ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${message.agent.name}`
                    }
                    alt={message.agent.name}
                  />
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    {message.agent.name}
                  </span>
                  <div className="rounded-lg px-3 py-2 bg-muted">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Select
            value={selectedAgent?.toString()}
            onValueChange={(value) => setSelectedAgent(parseInt(value))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select speaking agent" />
            </SelectTrigger>
            <SelectContent>
              {initialAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id.toString()}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          <Button onClick={handleSend} size="icon" disabled={!selectedAgent}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4">
          <DebugPanel chatId={chatId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}