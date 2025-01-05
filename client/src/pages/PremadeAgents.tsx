import { Card } from "@/components/ui/card";
import { CircuitBackground } from "@/components/CircuitBackground";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users } from "lucide-react";
import { useState } from "react";
import { ChatDialog } from "@/components/ChatDialog";
import { CollaborativeChat } from "@/components/CollaborativeChat";

const PREMADE_AGENTS = [
  {
    id: 1,
    name: "Sarah",
    description: "A compassionate life coach who helps with personal growth, motivation, and achieving life goals.",
    personality_traits: ["Empathetic", "Motivational", "Insightful"],
    model_provider: "openai",
    model_name: "gpt-4o",
  },
  {
    id: 2,
    name: "David",
    description: "A knowledgeable history professor who shares fascinating stories and insights about the past.",
    personality_traits: ["Scholarly", "Engaging", "Thoughtful"],
    model_provider: "openai",
    model_name: "gpt-4o",
  },
  {
    id: 3,
    name: "Maya",
    description: "A passionate artist who loves discussing art, creativity, and helping others express themselves.",
    personality_traits: ["Creative", "Free-spirited", "Inspiring"],
    model_provider: "xai",
    model_name: "grok-2-1212",
  },
  {
    id: 4,
    name: "James",
    description: "An adventurous traveler who shares exciting stories and travel tips from around the world.",
    personality_traits: ["Adventurous", "Friendly", "Worldly"],
    model_provider: "xai",
    model_name: "grok-2-vision-1212",
  }
];

export function PremadeAgents() {
  const [selectedAgent, setSelectedAgent] = useState<typeof PREMADE_AGENTS[0] | null>(null);
  const [selectedAgents, setSelectedAgents] = useState<typeof PREMADE_AGENTS[]>([]);
  const [showCollaborativeChat, setShowCollaborativeChat] = useState(false);

  const toggleAgentSelection = (agent: typeof PREMADE_AGENTS[0]) => {
    setSelectedAgents(prev => {
      const isSelected = prev.some(a => a.id === agent.id);
      if (isSelected) {
        return prev.filter(a => a.id !== agent.id);
      } else {
        return [...prev, agent];
      }
    });
  };

  return (
    <div className="min-h-screen relative">
      <CircuitBackground />

      <div className="relative z-10 p-8">
        <div className="mb-8">
          <h1 className="text-3xl glow-text">Premade Agents</h1>
          <p className="text-muted-foreground mt-2">
            Start chatting with our collection of specialized AI agents
          </p>
        </div>

        {selectedAgents.length > 0 && (
          <div className="mb-6">
            <Button 
              onClick={() => setShowCollaborativeChat(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Users className="mr-2 h-4 w-4" />
              Start Multi-Agent Chat ({selectedAgents.length})
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PREMADE_AGENTS.map((agent) => (
            <Card key={agent.id} className="p-6 hover:border-primary/50 transition-colors">
              <h2 className="text-xl font-semibold mb-2">{agent.name}</h2>
              <p className="text-muted-foreground mb-4">{agent.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {agent.personality_traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-2 py-1 rounded-full bg-primary/10 text-xs"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                Using {agent.model_provider === 'openai' ? 'OpenAI' : 'xAI'}'s {agent.model_name}
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat Now
                </Button>

                <Button
                  variant={selectedAgents.some(a => a.id === agent.id) ? "secondary" : "outline"}
                  onClick={() => toggleAgentSelection(agent)}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedAgent && (
        <ChatDialog
          open={!!selectedAgent}
          onOpenChange={(open) => !open && setSelectedAgent(null)}
          agent={selectedAgent}
        />
      )}

      <CollaborativeChat
        open={showCollaborativeChat}
        onOpenChange={(open) => {
          setShowCollaborativeChat(open);
          if (!open) {
            setSelectedAgents([]);
          }
        }}
        initialAgents={selectedAgents}
      />
    </div>
  );
}