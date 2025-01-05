import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CircuitBackground } from "@/components/CircuitBackground";
import { TemplateCard } from "@/components/TemplateCard";
import { Plus, Twitter, Github } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { Link } from "wouter";

export function Home() {
  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  const contractAddress = "0x1234...5678"; // Replace with actual contract address

  return (
    <div className="min-h-screen relative flex flex-col">
      <CircuitBackground />

      <div className="relative z-10 p-8 flex-1">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl glow-text">Neuronix</h1>
          <Link href="/builder">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-medium">
              <Plus className="mr-2 h-4 w-4 stroke-black" />
              New Agent
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template: any) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {/* Footer with social links and contract address */}
      <footer className="relative z-10 border-t border-white/10 bg-black/80 backdrop-blur">
        <div className="container mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://twitter.com/neuronix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://t.me/neuronix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-blue-500 transition-colors"
              >
                <SiTelegram className="h-6 w-6" />
              </a>
              <a 
                href="https://github.com/neuronix" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-400 transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>

            {/* Contract Address */}
            <div className="flex items-center gap-2">
              <span className="text-white/60">Contract:</span>
              <code className="bg-white/5 px-3 py-1 rounded text-white font-mono text-sm">
                {contractAddress}
              </code>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}