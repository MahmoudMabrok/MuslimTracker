import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Tracking Quran reading entries
export const quranEntries = pgTable("quran_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  startPage: integer("start_page").notNull(),
  endPage: integer("end_page").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertQuranEntrySchema = createInsertSchema(quranEntries).pick({
  userId: true,
  startPage: true,
  endPage: true,
  date: true,
});

export const quranEntrySchema = insertQuranEntrySchema.extend({
  startPage: z.number().min(1).max(614),
  endPage: z.number().min(1).max(614).refine(data => data >= z.number().parse(data), {
    message: "End page must be greater than or equal to start page"
  }),
});

// Tracking Fajr prayer status
export const fajrEntries = pgTable("fajr_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  date: timestamp("date").notNull().defaultNow(),
  prayed: boolean("prayed").notNull(),
});

export const insertFajrEntrySchema = createInsertSchema(fajrEntries).pick({
  userId: true,
  date: true,
  prayed: true,
});

// User achievements and badges
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  type: text("type").notNull(), // e.g., "quran_streak", "fajr_streak", "pages_milestone"
  value: integer("value").notNull(), // e.g., 7 for 7-day streak, 100 for 100 pages
  achieved: boolean("achieved").notNull(),
  achievedDate: timestamp("achieved_date"),
  progress: integer("progress").notNull(),
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  type: true,
  value: true,
  achieved: true,
  achievedDate: true,
  progress: true,
});

// Define achievement types
export const ACHIEVEMENT_TYPES = {
  QURAN_STREAK: "quran_streak",
  FAJR_STREAK: "fajr_streak",
  PAGES_MILESTONE: "pages_milestone",
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuranEntry = z.infer<typeof insertQuranEntrySchema>;
export type QuranEntry = typeof quranEntries.$inferSelect;

export type InsertFajrEntry = z.infer<typeof insertFajrEntrySchema>;
export type FajrEntry = typeof fajrEntries.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

// Daily summary type (for frontend usage)
export type DailySummary = {
  date: Date;
  totalPages: number;
  fajrPrayed: boolean;
  entries: QuranEntry[];
};
