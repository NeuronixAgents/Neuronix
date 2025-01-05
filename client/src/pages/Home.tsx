import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CircuitBackground } from "@/components/CircuitBackground";
import { TemplateCard } from "@/components/TemplateCard";
import { Twitter, Github, Copy, Check } from "lucide-react";
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
    <div className="min-h-screen relative flex flex-col pl-16">
      <CircuitBackground />

      {/* Header Section */}
      <header className="relative z-10 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl glow-text text-white">Neuronix</h1>

            <div className="flex items-center gap-6">
              {/* Contract Address */}
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                <span className="text-white/80 text-sm">Contract:</span>
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
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8">
        {/* Hero Section */}
        <div className="mt-12 mb-16 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text text-white">
            Create Intelligent AI Agents with No Code
          </h2>
          <p className="text-xl text-white mb-8">
            Design, customize, and deploy sophisticated AI workflows using our intuitive no-code platform. 
            Harness the power of artificial intelligence without writing a single line of code.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/builder">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-6">
                Start Building
              </Button>
            </Link>
            <Link href="/premade">
              <Button variant="outline" className="border-white hover:bg-white/10 px-8 py-6 text-white">
                Explore Templates
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-black/40 backdrop-blur rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-3 text-white">Visual Workflow Builder</h3>
            <p className="text-white">
              Create complex AI workflows using our intuitive drag-and-drop interface.
              Connect nodes, define logic, and bring your AI agents to life.
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-3 text-white">Multi-Platform Export</h3>
            <p className="text-white">
              Deploy your AI agents across multiple platforms. From web apps to
              mobile devices, your agents work everywhere.
            </p>
          </div>
          <div className="bg-black/40 backdrop-blur rounded-lg p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-3 text-white">Real-Time Collaboration</h3>
            <p className="text-white">
              Work together with your team in real-time. Share, edit, and improve
              your AI agents collaboratively.
            </p>
          </div>
        </div>

        {/* Templates Section */}
        {templates?.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-white">Popular Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template: any) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}