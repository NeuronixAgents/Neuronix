import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface DebugEvent {
  id: string;
  type: "error" | "success" | "info";
  message: string;
  timestamp: Date;
  details?: Record<string, any>;
}

interface DebugPanelProps {
  chatId: number | null;
}

export function DebugPanel({ chatId }: DebugPanelProps) {
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!chatId) return;

    const fetchDebugEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/collaborative-chats/${chatId}/debug`);
        if (!response.ok) throw new Error("Failed to fetch debug events");
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
        console.error("Debug event fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to load debug events",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDebugEvents();
    const interval = setInterval(fetchDebugEvents, 5000);

    return () => clearInterval(interval);
  }, [chatId]);

  return (
    <Card className="p-4 bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Debug Panel</h3>
        {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-2 p-2 rounded-lg bg-background/50"
            >
              {event.type === "error" ? (
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-1" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{event.message}</p>
                  <Badge variant={event.type === "error" ? "destructive" : "secondary"} className="shrink-0">
                    {event.type}
                  </Badge>
                </div>

                {event.details && (
                  <pre className="mt-2 p-2 rounded bg-muted text-xs overflow-x-auto">
                    {JSON.stringify(event.details, null, 2)}
                  </pre>
                )}

                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}