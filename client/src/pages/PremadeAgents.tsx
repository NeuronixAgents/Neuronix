import { Card } from "@/components/ui/card";
import { CircuitBackground } from "@/components/CircuitBackground";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { ChatDialog } from "@/components/ChatDialog";

const PREMADE_AGENTS = [
  {
    id: "creative-writer",
    name: "Creative Writer",
    description: "An imaginative AI that helps with creative writing, storytelling, and brainstorming ideas.",
    personality_traits: ["Creative", "Imaginative", "Supportive"],
    model_provider: "openai",
    model_name: "gpt-4o",
  },
  {
    id: "tech-expert",
    name: "Tech Expert",
    description: "A knowledgeable AI assistant for programming, debugging, and technical discussions.",
    personality_traits: ["Analytical", "Technical", "Detail-oriented"],
    model_provider: "openai",
    model_name: "gpt-4o",
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "Specializes in analyzing data, creating visualizations, and deriving insights.",
    personality_traits: ["Analytical", "Precise", "Explanatory"],
    model_provider: "xai",
    model_name: "grok-2-1212",
  },
  {
    id: "image-expert",
    name: "Image Expert",
    description: "An AI assistant specialized in image analysis, generation, and visual tasks.",
    personality_traits: ["Visual", "Creative", "Descriptive"],
    model_provider: "xai",
    model_name: "grok-2-vision-1212",
  }
];

export function PremadeAgents() {
  const [selectedAgent, setSelectedAgent] = useState<typeof PREMADE_AGENTS[0] | null>(null);

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

              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => setSelectedAgent(agent)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat Now
              </Button>
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
    </div>
  );
}