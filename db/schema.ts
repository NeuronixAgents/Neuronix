import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

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
  model_provider: text("model_provider").notNull().default("openai"),
  model_name: text("model_name").notNull().default("gpt-4o"),
  template_id: integer("template_id").references(() => templates.id),
  nodes: jsonb("nodes").notNull(),
  edges: jsonb("edges").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates);
export const selectTemplateSchema = createSelectSchema(templates);

export const insertAgentSchema = createInsertSchema(agents, {
  personality_traits: z.array(z.string()),
  temperature: z.number().min(0).max(100).default(70),
  model_provider: z.enum(["openai", "xai"]),
  model_name: z.string(),
});
export const selectAgentSchema = createSelectSchema(agents);

export type Template = typeof templates.$inferSelect;
export type Agent = typeof agents.$inferSelect;