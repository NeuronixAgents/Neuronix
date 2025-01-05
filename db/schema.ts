import { pgTable, text, serial, integer, jsonb, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  nodes: jsonb("nodes").notNull(),
  edges: jsonb("edges").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  personality_traits: jsonb("personality_traits").$type<string[]>().default([]),
  image_url: text("image_url"),
  voice_type: text("voice_type"),
  temperature: integer("temperature").default(70),
  model_provider: text("model_provider", { enum: ["openai", "xai"] }).notNull().default("openai"),
  model_name: text("model_name").notNull().default("gpt-4o"),
  template_id: integer("template_id").references(() => templates.id),
  nodes: jsonb("nodes").notNull(),
  edges: jsonb("edges").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const collaborativeChats = pgTable("collaborative_chats", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const chatParticipants = pgTable("chat_participants", {
  id: serial("id").primaryKey(),
  chat_id: integer("chat_id").references(() => collaborativeChats.id).notNull(),
  agent_id: integer("agent_id").references(() => agents.id).notNull(),
  role: text("role").notNull().default("participant"),
  joined_at: timestamp("joined_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  chat_id: integer("chat_id").references(() => collaborativeChats.id).notNull(),
  agent_id: integer("agent_id").references(() => agents.id).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const agentInteractions = pgTable("agent_interactions", {
  id: serial("id").primaryKey(),
  agent_id: integer("agent_id").references(() => agents.id).notNull(),
  interaction_type: text("interaction_type", { enum: ["chat", "task", "collaborative"] }).notNull(),
  started_at: timestamp("started_at").defaultNow(),
  ended_at: timestamp("ended_at"),
  duration_ms: integer("duration_ms"),
  tokens_used: integer("tokens_used"),
  successful: boolean("successful").default(true),
  error_message: text("error_message"),
  metadata: jsonb("metadata"),
});

export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  interaction_id: integer("interaction_id").references(() => agentInteractions.id).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at").defaultNow(),
});

export const agentMetrics = pgTable("agent_metrics", {
  id: serial("id").primaryKey(),
  agent_id: integer("agent_id").references(() => agents.id).notNull(),
  metric_type: text("metric_type", { enum: ["response_time", "success_rate", "user_satisfaction", "tokens_per_response"] }).notNull(),
  value: decimal("value").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Define relations
export const agentRelations = relations(agents, ({ many }) => ({
  metrics: many(agentMetrics),
  interactions: many(agentInteractions),
  participations: many(chatParticipants),
  messages: many(chatMessages),
}));

export const metricsRelations = relations(agentMetrics, ({ one }) => ({
  agent: one(agents, {
    fields: [agentMetrics.agent_id],
    references: [agents.id],
  }),
}));

export const interactionsRelations = relations(agentInteractions, ({ one, many }) => ({
  agent: one(agents, {
    fields: [agentInteractions.agent_id],
    references: [agents.id],
  }),
  feedback: many(userFeedback),
}));

export const chatRelations = relations(collaborativeChats, ({ many }) => ({
  participants: many(chatParticipants),
  messages: many(chatMessages),
}));

export const participantRelations = relations(chatParticipants, ({ one }) => ({
  chat: one(collaborativeChats, {
    fields: [chatParticipants.chat_id],
    references: [collaborativeChats.id],
  }),
  agent: one(agents, {
    fields: [chatParticipants.agent_id],
    references: [agents.id],
  }),
}));

export const messageRelations = relations(chatMessages, ({ one }) => ({
  chat: one(collaborativeChats, {
    fields: [chatMessages.chat_id],
    references: [collaborativeChats.id],
  }),
  agent: one(agents, {
    fields: [chatMessages.agent_id],
    references: [agents.id],
  }),
}));

export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);

export const insertAgentSchema = createInsertSchema(agents, {
  personality_traits: z.array(z.string()),
  temperature: z.number().min(0).max(100).default(70),
  model_provider: z.enum(["openai", "xai"]),
  model_name: z.string(),
});
export const selectAgentSchema = createSelectSchema(agents);

export const insertCollaborativeChatSchema = createInsertSchema(collaborativeChats);
export const selectCollaborativeChatSchema = createSelectSchema(collaborativeChats);

export const insertChatParticipantSchema = createInsertSchema(chatParticipants);
export const selectChatParticipantSchema = createSelectSchema(chatParticipants);

export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const selectChatMessageSchema = createSelectSchema(chatMessages);

export const insertAgentInteractionSchema = createInsertSchema(agentInteractions);
export const selectAgentInteractionSchema = createSelectSchema(agentInteractions);

export const insertUserFeedbackSchema = createInsertSchema(userFeedback);
export const selectUserFeedbackSchema = createSelectSchema(userFeedback);

export const insertAgentMetricSchema = createInsertSchema(agentMetrics);
export const selectAgentMetricSchema = createSelectSchema(agentMetrics);

export type Template = typeof templates.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type CollaborativeChat = typeof collaborativeChats.$inferSelect;
export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type UserFeedback = typeof userFeedback.$inferSelect;
export type AgentMetric = typeof agentMetrics.$inferSelect;

export const debugEvents = pgTable("debug_events", {
  id: serial("id").primaryKey(),
  chat_id: integer("chat_id").references(() => collaborativeChats.id).notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  details: jsonb("details"),
  created_at: timestamp("created_at").defaultNow(),
});

export const insertDebugEventSchema = createInsertSchema(debugEvents);
export const selectDebugEventSchema = createSelectSchema(debugEvents);
export type DebugEvent = typeof debugEvents.$inferSelect;

export const debugEventRelations = relations(debugEvents, ({ one }) => ({
  chat: one(collaborativeChats, {
    fields: [debugEvents.chat_id],
    references: [collaborativeChats.id],
  }),
}));