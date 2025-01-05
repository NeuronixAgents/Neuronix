import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CircuitBackground } from "@/components/CircuitBackground";
import { TemplateCard } from "@/components/TemplateCard";
import { Plus, Twitter, Github, Copy, Check } from "lucide-react";
import { SiTelegram } from "react-icons/si";
import { Link } from "wouter";
import { useState } from "react";

export function Home() {
  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  const [copied, setCopied] = useState(false);
  const contractAddress = "XXXX...XXXX";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <CircuitBackground />

      <div className="relative z-10 p-8 flex-1">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl glow-text">Neuronix</h1>
            <Link href="/builder">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-medium">
                <Plus className="mr-2 h-4 w-4 stroke-black" />
                New Agent
              </Button>
            </Link>
          </div>

          {/* Contract Address with Copy Button */}
          <div className="flex items-center gap-2 self-start bg-white/5 rounded-lg p-2">
            <span className="text-white/60 text-sm">Contract:</span>
            <code className="font-mono text-sm text-white">{contractAddress}</code>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={copyToClipboard}
            >
              {copied ? 
                <Check className="h-4 w-4" /> :
                <Copy className="h-4 w-4" />
              }
              <span className="sr-only">Copy contract address</span>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 self-start">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template: any) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </div>
  );
}