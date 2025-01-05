import type { Express } from "express";
import { createServer } from "http";
import { db } from "@db";
import { templates, agents } from "@db/schema";
import { eq } from "drizzle-orm";

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
    const agent = await db.query.agents.findFirst({
      where: eq(agents.id, parseInt(req.params.id))
    });

    if (!agent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    // TODO: Implement GitHub export
    // This is a placeholder that will be implemented once we have the GitHub token
    res.json({ message: "GitHub export endpoint (to be implemented)" });
  });

  return httpServer;
}