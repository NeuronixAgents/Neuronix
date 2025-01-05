import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { CircuitBackground } from "@/components/CircuitBackground";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AgentMetric {
  timestamp: string;
  value: number;
  metric_type: string;
  agent_name: string;
}

interface AgentPerformance {
  agent_id: number;
  agent_name: string;
  total_interactions: number;
  avg_response_time: number | null;
  success_rate: number;
  avg_user_rating: number;
  total_tokens: number | null;
}

export function Analytics() {
  const { data: metrics = [] } = useQuery<AgentMetric[]>({
    queryKey: ["/api/analytics/metrics"],
  });

  const { data: performance = [] } = useQuery<AgentPerformance[]>({
    queryKey: ["/api/analytics/performance"],
  });

  return (
    <div className="min-h-screen relative">
      <CircuitBackground />

      <div className="relative z-10 container mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 glow-text">Agent Performance Analytics</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performance.map((agent) => (
            <Card key={agent.agent_id} className="p-6 bg-black/70 backdrop-blur border-emerald-900/40">
              <h3 className="font-semibold text-lg mb-2">{agent.agent_name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interactions:</span>
                  <span>{agent.total_interactions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span>{((agent.success_rate || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response:</span>
                  <span>{agent.avg_response_time ? `${Math.round(agent.avg_response_time)}ms` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Rating:</span>
                  <span>⭐ {agent.avg_user_rating?.toFixed(1) || 'N/A'}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Response Time Trend */}
        <Card className="p-6 mb-8 bg-black/70 backdrop-blur border-emerald-900/40">
          <h2 className="text-xl font-semibold mb-4">Response Time Trend</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={metrics.filter((m) => m.metric_type === "response_time")}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  contentStyle={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Response Time (ms)"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Success Rate Graph */}
        <Card className="p-6 bg-black/70 backdrop-blur border-emerald-900/40">
          <h2 className="text-xl font-semibold mb-4">Success Rate by Agent</h2>
          <div className="h-[300px]">
            {performance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="agent_name" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "Success Rate"]}
                  />
                  <Bar dataKey="success_rate" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}