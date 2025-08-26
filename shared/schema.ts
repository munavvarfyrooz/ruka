import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const emailSubscriptions = pgTable("email_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const callRequests = pgTable("call_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertEmailSubscriptionSchema = createInsertSchema(emailSubscriptions).pick({
  email: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
});

export const insertCallRequestSchema = createInsertSchema(callRequests).pick({
  phoneNumber: true,
  email: true,
}).extend({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number with country code (e.g., +1234567890)"),
  email: z.string().email("Please enter a valid email address"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEmailSubscription = z.infer<typeof insertEmailSubscriptionSchema>;
export type EmailSubscription = typeof emailSubscriptions.$inferSelect;
export type InsertCallRequest = z.infer<typeof insertCallRequestSchema>;
export type CallRequest = typeof callRequests.$inferSelect;
