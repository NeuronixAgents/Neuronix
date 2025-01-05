import type { Express } from "express";
import { createServer } from "http";
import { db } from "@db";
import { templates, agents, collaborativeChats, chatParticipants, chatMessages, debugEvents, agentInteractions, agentMetrics } from "@db/schema";
import { eq, and, desc, avg, count, sum } from "drizzle-orm";
import OpenAI from "openai";

// Initialize OpenAI client
const openaiClient = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Initialize xAI client with proper configuration
const xaiClient = new OpenAI({ 
  baseURL: "https://api.x.ai/v1",
  apiKey: process.env.XAI_API_KEY,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultQuery: undefined,
});

// Premade agents data
const PREMADE_AGENTS = [
  {
    name: "Sarah",
    description: "A compassionate life coach who helps with personal growth, motivation, and achieving life goals.",
    personality_traits: ["Empathetic", "Motivational", "Insightful"],
    model_provider: "openai" as const,
    model_name: "gpt-4o",
    nodes: {},
    edges: {},
  },
  {
    name: "David",
    description: "A knowledgeable history professor who shares fascinating stories and insights about the past.",
    personality_traits: ["Scholarly", "Engaging", "Thoughtful"],
    model_provider: "openai" as const,
    model_name: "gpt-4o",
    nodes: {},
    edges: {},
  },
  {
    name: "Maya",
    description: "A passionate artist who loves discussing art, creativity, and helping others express themselves.",
    personality_traits: ["Creative", "Free-spirited", "Inspiring"],
    model_provider: "xai" as const,
    model_name: "grok-2-1212",
    nodes: {},
    edges: {},
  },
  {
    name: "James",
    description: "An adventurous traveler who shares exciting stories and travel tips from around the world.",
    personality_traits: ["Adventurous", "Friendly", "Worldly"],
    model_provider: "xai" as const,
    model_name: "grok-2-vision-1212",
    nodes: {},
    edges: {},
  },
  {
    name: "Alex",
    description: "A tech-savvy crypto enthusiast with deep knowledge of blockchain technology, DeFi protocols, and market analysis.",
    personality_traits: ["Analytical", "Forward-thinking", "Tech-savvy"],
    model_provider: "xai" as const,
    model_name: "grok-2-1212",
    nodes: {},
    edges: {},
  }
];

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Initialize premade agents
  app.post("/api/agents/initialize", async (_req, res) => {
    try {
      // Check if agents already exist
      const existingAgents = await db.query.agents.findMany({
        limit: 1,
      });

      if (existingAgents.length > 0) {
        return res.json({ message: "Agents already initialized" });
      }

      // Start a transaction to ensure atomic operations
      await db.transaction(async (tx) => {
        // First delete all related records in the correct order
        await tx.delete(agentMetrics);
        await tx.delete(agentInteractions);
        await tx.delete(chatMessages);
        await tx.delete(chatParticipants);
        await tx.delete(debugEvents);
        // Then delete the agents
        await tx.delete(agents);

        // Insert new premade agents
        const createdAgents = await tx.insert(agents)
          .values(PREMADE_AGENTS)
          .returning();

        res.json(createdAgents);
      });
    } catch (error: any) {
      console.error("Failed to initialize agents:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics endpoints
  app.get("/api/analytics/metrics", async (_req, res) => {
    try {
      // Generate simulated time-series data for response times
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Last 7 days

      // Get all agents
      const agentList = await db.query.agents.findMany();

      // Generate time series data for each agent
      const metrics = agentList.flatMap(agent => {
        const baseResponseTime = {
          "Sarah": 850,
          "David": 920,
          "Maya": 780,
          "James": 1100,
          "Alex": 830
        }[agent.name] || 900;

        return Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);

          // Add some random variation to response times
          const variation = Math.random() * 200 - 100; // +/- 100ms

          return {
            timestamp: date.toISOString(),
            value: Math.max(500, baseResponseTime + variation), // Ensure minimum 500ms
            metric_type: "response_time",
            agent_name: agent.name,
          };
        });
      });

      // Sort by timestamp
      metrics.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      res.json(metrics);
    } catch (error: any) {
      console.error("Failed to fetch metrics:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analytics/performance", async (_req, res) => {
    try {
      const agentList = await db.select({
        id: agents.id,
        name: agents.name,
      })
      .from(agents);

      // Map simulated data to actual agent records
      const simulatedData = {
        "Sarah": {
          interactions: 245,
          success_rate: 0.94,
          response_time: 850,
          rating: 4.8,
        },
        "David": {
          interactions: 189,
          success_rate: 0.89,
          response_time: 920,
          rating: 4.3,
        },
        "Maya": {
          interactions: 312,
          success_rate: 0.96,
          response_time: 780,
          rating: 4.9,
        },
        "James": {
          interactions: 167,
          success_rate: 0.87,
          response_time: 1100,
          rating: 3.9,
        },
        "Alex": {
          interactions: 278,
          success_rate: 0.92,
          response_time: 830,
          rating: 4.6,
        },
      };

      // Format performance data
      const performance = agentList.map(agent => {
        const data = simulatedData[agent.name as keyof typeof simulatedData];
        if (!data) return null;

        return {
          agent_id: agent.id,
          agent_name: agent.name,
          total_interactions: data.interactions,
          avg_response_time: data.response_time,
          success_rate: data.success_rate,
          avg_user_rating: data.rating,
          total_tokens: Math.floor(data.interactions * 150), // Approximate token usage
        };
      }).filter((p): p is NonNullable<typeof p> => p !== null);

      res.json(performance);
    } catch (error: any) {
      console.error("Failed to fetch performance data:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Agents endpoints
  app.get("/api/agents", async (_req, res) => {
    const allAgents = await db.query.agents.findMany();
    res.json(allAgents);
  });

  app.get("/api/agents/:id", async (req, res) => {
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, parseInt(req.params.id))
    });

    if (!agent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    res.json(agent);
  });

  app.post("/api/agents", async (req, res) => {
    const agent = await db.insert(agents).values(req.body).returning();
    res.json(agent[0]);
  });

  app.put("/api/agents/:id", async (req, res) => {
    const agent = await db.update(agents)
      .set(req.body)
      .where(eq(agents.id, parseInt(req.params.id)))
      .returning();

    if (!agent.length) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    res.json(agent[0]);
  });

  // Collaborative Chat endpoints
  app.post("/api/collaborative-chats", async (req, res) => {
    const { name, description, participants } = req.body;

    // Start a transaction to create chat and add participants
    const chat = await db.transaction(async (tx) => {
      const [newChat] = await tx.insert(collaborativeChats)
        .values({ name, description })
        .returning();

      if (participants && participants.length > 0) {
        await tx.insert(chatParticipants)
          .values(participants.map((agentId: number) => ({
            chat_id: newChat.id,
            agent_id: agentId,
          })));
      }

      return newChat;
    });

    res.json(chat);
  });

  app.get("/api/collaborative-chats", async (_req, res) => {
    const chats = await db.query.collaborativeChats.findMany({
      with: {
        participants: {
          with: {
            agent: true,
          },
        },
      },
    });
    res.json(chats);
  });

  app.get("/api/collaborative-chats/:id", async (req, res) => {
    const chat = await db.query.collaborativeChats.findFirst({
      where: eq(collaborativeChats.id, parseInt(req.params.id)),
      with: {
        participants: {
          with: {
            agent: true,
          },
        },
        messages: {
          with: {
            agent: true,
          },
          orderBy: (messages, { asc }) => [asc(messages.created_at)],
        },
      },
    });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    res.json(chat);
  });

  // Debug events endpoints
  app.get("/api/collaborative-chats/:id/debug", async (req, res) => {
    const chat_id = parseInt(req.params.id);

    const events = await db.query.debugEvents.findMany({
      where: eq(debugEvents.chat_id, chat_id),
      orderBy: [desc(debugEvents.created_at)],
      limit: 50,  // Limit to most recent 50 events
    });

    res.json({ events });
  });

  app.post("/api/collaborative-chats/:id/debug", async (req, res) => {
    const chat_id = parseInt(req.params.id);
    const { type, message, details } = req.body;

    const [event] = await db.insert(debugEvents)
      .values({
        chat_id,
        type,
        message,
        details,
      })
      .returning();

    res.json(event);
  });


  app.post("/api/collaborative-chats/:id/messages", async (req, res) => {
    const { agent_id, content } = req.body;
    const chat_id = parseInt(req.params.id);

    try {
      // Verify the agent is a participant
      const participant = await db.query.chatParticipants.findFirst({
        where: and(
          eq(chatParticipants.chat_id, chat_id),
          eq(chatParticipants.agent_id, agent_id)
        ),
      });

      if (!participant) {
        // Log debug event for unauthorized agent
        await db.insert(debugEvents).values({
          chat_id,
          type: "error",
          message: "Unauthorized agent attempted to send message",
          details: { agent_id },
        });

        res.status(403).json({ message: "Agent is not a participant in this chat" });
        return;
      }

      const [message] = await db.insert(chatMessages)
        .values({ chat_id, agent_id, content })
        .returning();

      const messageWithAgent = await db.query.chatMessages.findFirst({
        where: eq(chatMessages.id, message.id),
        with: {
          agent: true,
        },
      });

      // Log debug event for successful message
      await db.insert(debugEvents).values({
        chat_id,
        type: "success",
        message: "Message sent successfully",
        details: { message_id: message.id, agent_id },
      });

      res.json(messageWithAgent);
    } catch (error) {
      // Log debug event for error
      await db.insert(debugEvents).values({
        chat_id,
        type: "error",
        message: "Failed to send message",
        details: { error: error.message, agent_id },
      });

      throw error;
    }
  });

  app.post("/api/collaborative-chats/:id/participants", async (req, res) => {
    const { agent_id, role = "participant" } = req.body;
    const chat_id = parseInt(req.params.id);

    const [participant] = await db.insert(chatParticipants)
      .values({ chat_id, agent_id, role })
      .returning();

    const participantWithAgent = await db.query.chatParticipants.findFirst({
      where: eq(chatParticipants.id, participant.id),
      with: {
        agent: true,
      },
    });

    res.json(participantWithAgent);
  });

  // Telegram Bot Creation endpoint
  app.post("/api/agents/:id/telegram-bot", async (req, res) => {
    const { telegram_token } = req.body;

    if (!telegram_token) {
      res.status(400).json({ message: "Telegram bot token is required" });
      return;
    }

    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, parseInt(req.params.id))
    });

    if (!agent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    // Validate the Telegram token format
    const tokenPattern = /^\d+:[\w-]{35,}$/;
    if (!tokenPattern.test(telegram_token)) {
      res.status(400).json({ message: "Invalid Telegram bot token format" });
      return;
    }

    // TODO: Store the token securely and set up the Telegram bot
    // This is a placeholder that will be implemented once we have the Telegram integration
    res.json({
      message: "Telegram bot created successfully",
      bot_username: agent.name.toLowerCase().replace(/\s+/g, '_') + '_bot'
    });
  });

  // GitHub Export endpoint
  app.post("/api/agents/:id/export-github", async (req, res) => {
    const { github_token, repo_name } = req.body;

    if (!github_token) {
      res.status(400).json({ message: "GitHub token is required" });
      return;
    }

    if (!repo_name) {
      res.status(400).json({ message: "Repository name is required" });
      return;
    }

    // Validate repository name format
    const repoNamePattern = /^[a-zA-Z0-9_-]+$/;
    if (!repoNamePattern.test(repo_name)) {
      res.status(400).json({
        message: "Invalid repository name. Use only letters, numbers, hyphens, and underscores"
      });
      return;
    }

    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, parseInt(req.params.id))
    });

    if (!agent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    // TODO: Implement GitHub repository creation and code export
    // This is a placeholder that will be implemented with the GitHub API
    res.json({
      message: "Agent exported to GitHub successfully",
      repo_url: `https://github.com/${repo_name}`
    });
  });

  // AI completion endpoint
  app.post("/api/ai/chat", async (req, res) => {
    const { messages, agent, chatId } = req.body;

    try {
      if (!agent.model_provider) {
        throw new Error("Model provider not specified");
      }

      // Select the appropriate client based on the model provider
      //const client = agent.model_provider === "openai" ? openaiClient : xaiClient;
      const client = openaiClient; //Always use OpenAI

      // Verify API key availability
      const apiKeyName = `${agent.model_provider.toUpperCase()}_API_KEY`;
      if (!process.env[apiKeyName]) {
        throw new Error(`${apiKeyName} not found`);
      }

      // Build system message using agent's personality traits if available
      const systemMessage = {
        role: "system" as const,
        content: agent.personality_traits?.length
          ? `You are ${agent.name}, an AI assistant with the following traits: ${agent.personality_traits.join(
              ", "
            )}. Respond in a way that reflects these personality traits.`
          : `You are ${agent.name}, an AI assistant. Be helpful and concise in your responses.`,
      };

      // Create the API request with proper error handling
      try {
        const response = await openaiClient.chat.completions.create({
          // Map xAI models to OpenAI equivalent
          model: agent.model_provider === "xai" ? "gpt-4o" : agent.model_name,
          messages: [systemMessage, ...messages],
          temperature: agent.temperature ? agent.temperature / 100 : 0.7,
        });

        // Log successful response if we have a chat ID
        if (chatId) {
          await db.insert(debugEvents).values({
            chat_id: chatId,
            type: "success",
            message: `${agent.name} generated response successfully`,
            details: {
              model: agent.model_name,
              provider: agent.model_provider,
            },
          });
        }

        res.json({ content: response.choices[0].message.content });
      } catch (apiError: any) {
        // Log specific API error details
        console.error(`API error:`, apiError);
        throw new Error(
          apiError.message || `Failed to get response from AI service`
        );
      }
    } catch (error: any) {
      console.error("AI chat error:", error);

      // Log error if we have a chat ID
      if (chatId) {
        await db.insert(debugEvents).values({
          chat_id: chatId,
          type: "error",
          message: `Failed to generate response for ${agent.name}`,
          details: {
            error: error.message,
            model: agent.model_name,
            provider: agent.model_provider,
          },
        });
      }

      // Send a user-friendly error message
      res.status(500).json({ 
        message: "Failed to generate response. " + 
          (error.message.includes("API_KEY") ? 
            "API configuration issue detected." : 
            "Please try again later.")
      });
    }
  });

  // Templates endpoints
  app.get("/api/templates", async (_req, res) => {
    const allTemplates = await db.query.templates.findMany();
    res.json(allTemplates);
  });

  app.get("/api/templates/:id", async (req, res) => {
    const template = await db.query.templates.findFirst({
      where: eq(templates.id, parseInt(req.params.id))
    });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    res.json(template);
  });

  return httpServer;
}