import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
});

export type User = z.infer<typeof userSchema>;

// Quran entry schema
export const quranEntrySchema = z.object({
  id: z.number(),
  userId: z.number().optional().nullable(),
  startPage: z.number().min(1).max(614),
  endPage: z.number().min(1).max(614),
  date: z.string(), // ISO string format
});

export type QuranEntry = z.infer<typeof quranEntrySchema>;
export type InsertQuranEntry = QuranEntry;

// Fajr entry schema
export const fajrEntrySchema = z.object({
  id: z.number(),
  userId: z.number().optional().nullable(),
  date: z.string(), // ISO string format
  prayed: z.boolean(),
});

export type FajrEntry = z.infer<typeof fajrEntrySchema>;
export type InsertFajrEntry = FajrEntry;

// Achievement schema
export const achievementSchema = z.object({
  id: z.number(),
  userId: z.number().optional().nullable(),
  type: z.string(), // e.g., "quran_streak", "fajr_streak", "pages_milestone"
  value: z.number(), // e.g., 7 for 7-day streak, 100 for 100 pages
  achieved: z.boolean(),
  achievedDate: z.string().optional().nullable(), // ISO string format
  progress: z.number(),
});

export type Achievement = z.infer<typeof achievementSchema>;
export type InsertAchievement = Omit<Achievement, 'id' | 'achievedDate'>;

// Achievement types
export const ACHIEVEMENT_TYPES = {
  QURAN_STREAK: "quran_streak",
  FAJR_STREAK: "fajr_streak",
  PAGES_MILESTONE: "pages_milestone",
};

// Daily summary type
export type DailySummary = {
  date: Date;
  totalPages: number;
  fajrPrayed: boolean;
  entries: QuranEntry[];
};

// History entry type
export type HistoryEntry = {
  date: string;
  totalPages: number;
  entries: QuranEntry[];
  fajrPrayed: boolean;
};

// Achievements response type
export type AchievementsResponse = {
  earned: Achievement[];
  inProgress: Achievement[];
};