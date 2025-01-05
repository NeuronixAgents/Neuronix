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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#6366F1", "#8B5CF6"];

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
  avg_response_time: number;
  success_rate: number;
  avg_user_rating: number;
  total_tokens: number;
}

export function Analytics() {
  const { data: metrics } = useQuery<AgentMetric[]>({
    queryKey: ["/api/analytics/metrics"],
  });

  const { data: performance } = useQuery<AgentPerformance[]>({
    queryKey: ["/api/analytics/performance"],
  });

  return (
    <div className="min-h-screen relative">
      <CircuitBackground />

      <div className="relative z-10 container mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 glow-text">Agent Performance Analytics</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performance?.map((agent) => (
            <Card key={agent.agent_id} className="p-6 bg-black/70 backdrop-blur border-emerald-900/40">
              <h3 className="font-semibold text-lg mb-2">{agent.agent_name}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interactions:</span>
                  <span>{agent.total_interactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Success Rate:</span>
                  <span>{(agent.success_rate * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response:</span>
                  <span>{agent.avg_response_time.toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User Rating:</span>
                  <span>⭐ {agent.avg_user_rating.toFixed(1)}</span>
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
                data={metrics?.filter((m) => m.metric_type === "response_time")}
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

        {/* Success Rate & User Satisfaction */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-black/70 backdrop-blur border-emerald-900/40">
            <h2 className="text-xl font-semibold mb-4">Success Rate by Agent</h2>
            <div className="h-[300px]">
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
            </div>
          </Card>

          <Card className="p-6 bg-black/70 backdrop-blur border-emerald-900/40">
            <h2 className="text-xl font-semibold mb-4">Token Usage Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performance}
                    dataKey="total_tokens"
                    nameKey="agent_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.agent_name}
                  >
                    {performance?.map((entry, index) => (
                      <Cell key={entry.agent_id} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
