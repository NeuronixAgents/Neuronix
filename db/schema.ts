import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
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

// New tables for collaborative chats
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
  role: text("role").notNull().default("participant"), // can be 'moderator' or 'participant'
  joined_at: timestamp("joined_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  chat_id: integer("chat_id").references(() => collaborativeChats.id).notNull(),
  agent_id: integer("agent_id").references(() => agents.id).notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

// Relations
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

export type Template = typeof templates.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type CollaborativeChat = typeof collaborativeChats.$inferSelect;
export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

// New debug events table
export const debugEvents = pgTable("debug_events", {
  id: serial("id").primaryKey(),
  chat_id: integer("chat_id").references(() => collaborativeChats.id).notNull(),
  type: text("type").notNull(),  // 'error' | 'success' | 'info'
  message: text("message").notNull(),
  details: jsonb("details"),
  created_at: timestamp("created_at").defaultNow(),
});

// Add to existing export statements
export const insertDebugEventSchema = createInsertSchema(debugEvents);
export const selectDebugEventSchema = createSelectSchema(debugEvents);
export type DebugEvent = typeof debugEvents.$inferSelect;

// Add relations
export const debugEventRelations = relations(debugEvents, ({ one }) => ({
  chat: one(collaborativeChats, {
    fields: [debugEvents.chat_id],
    references: [collaborativeChats.id],
  }),
}));