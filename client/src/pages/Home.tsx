import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CircuitBackground } from "@/components/CircuitBackground";
import { TemplateCard } from "@/components/TemplateCard";
import { Plus } from "lucide-react";
import { Link } from "wouter";

export function Home() {
  const { data: templates } = useQuery({
    queryKey: ["/api/templates"],
  });

  return (
    <div className="min-h-screen relative">
      <CircuitBackground />

      <div className="relative z-10 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl glow-text">Neuronix</h1>
          <Link href="/builder">
            <Button className="bg-white text-primary hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
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
    </div>
  );
}