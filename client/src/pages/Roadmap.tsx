import { Card } from "@/components/ui/card";
import { CircuitBackground } from "@/components/CircuitBackground";

interface Milestone {
  quarter: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
}

const ROADMAP: Milestone[] = [
  {
    quarter: "Q1 2025",
    title: "Project Foundation",
    description: "Launch of initial no-code AI platform with basic agent creation capabilities",
    status: "completed"
  },
  {
    quarter: "Q1 2025",
    title: "Token Launch",
    description: "Introduction of NRX utility token and marketplace integration",
    status: "in-progress"
  },
  {
    quarter: "Q2 2025",
    title: "Advanced Features",
    description: "Multi-chain support, advanced AI model integration, and enhanced customization options",
    status: "upcoming"
  },
  {
    quarter: "Q3 2025",
    title: "Ecosystem Expansion",
    description: "Launch of decentralized agent marketplace and community governance",
    status: "upcoming"
  },
  {
    quarter: "Q4 2025",
    title: "Enterprise Solutions",
    description: "Enterprise-grade features, advanced security, and scalability improvements",
    status: "upcoming"
  }
];

export function Roadmap() {
  return (
    <div className="min-h-screen relative">
      <CircuitBackground />

      <div className="relative z-10 container mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 glow-text">Development Roadmap</h1>

        <div className="space-y-8">
          {ROADMAP.map((milestone, index) => (
            <Card key={index} className="p-6 bg-black/70 backdrop-blur border-emerald-900/40">
              <div className="flex items-start gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  milestone.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  milestone.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {milestone.quarter}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                  <p className="text-gray-300">{milestone.description}</p>
                </div>
                <div className={`text-sm font-medium ${
                  milestone.status === 'completed' ? 'text-green-400' :
                  milestone.status === 'in-progress' ? 'text-blue-400' :
                  'text-gray-400'
                }`}>
                  {milestone.status === 'completed' ? '✓ Completed' :
                   milestone.status === 'in-progress' ? '⟳ In Progress' :
                   '◇ Upcoming'}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}