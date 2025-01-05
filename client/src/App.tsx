import { Switch, Route } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Home } from "@/pages/Home";
import { AgentBuilder } from "@/pages/AgentBuilder";
import { PremadeAgents } from "@/pages/PremadeAgents";
import { Roadmap } from "@/pages/Roadmap";
import { Analytics } from "@/pages/Analytics";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";

function App() {
  // Initialize agents when app starts
  useEffect(() => {
    fetch('/api/agents/initialize', { method: 'POST' })
      .catch(error => console.error('Failed to initialize agents:', error));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-16"> {/* Added consistent left padding for sidebar */}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/premade" component={PremadeAgents} />
          <Route path="/builder" component={AgentBuilder} />
          <Route path="/builder/:id" component={AgentBuilder} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/analytics" component={Analytics} />
          <Route component={NotFound} />
        </Switch>
        {/* Funding text positioned at bottom left */}
        <div className="fixed bottom-4 left-20 text-white/70 text-sm">
          Funded by ai16z DAO
        </div>
      </main>
    </div>
  );
}

// fallback 404 not found page
function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;