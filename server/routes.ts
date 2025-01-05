import type { Express } from "express";
import { createServer } from "http";
import { db } from "@db";
import { templates, agents, collaborativeChats, chatParticipants, chatMessages } from "@db/schema";
import { eq, and } from "drizzle-orm";

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);

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

  app.post("/api/collaborative-chats/:id/messages", async (req, res) => {
    const { agent_id, content } = req.body;
    const chat_id = parseInt(req.params.id);

    // Verify the agent is a participant
    const participant = await db.query.chatParticipants.findFirst({
      where: and(
        eq(chatParticipants.chat_id, chat_id),
        eq(chatParticipants.agent_id, agent_id)
      ),
    });

    if (!participant) {
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

    res.json(messageWithAgent);
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

  return httpServer;
}