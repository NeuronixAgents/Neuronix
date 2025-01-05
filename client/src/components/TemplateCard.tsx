import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Link } from "wouter";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description: string;
    nodes: number;
  };
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {template.nodes} nodes
        </p>
      </CardContent>
      <CardFooter>
        <Link href={`/builder?template=${template.id}`}>
          <Button variant="outline" className="w-full">
            <Copy className="mr-2 h-4 w-4" />
            Use Template
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
