import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  quranEntrySchema, 
  insertFajrEntrySchema,
  ACHIEVEMENT_TYPES
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Get current user's data (for demo purposes we'll use a fixed user)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Add a new Quran reading entry
  app.post("/api/quran-entries", async (req: Request, res: Response) => {
    try {
      const parsedBody = quranEntrySchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        const validationError = fromZodError(parsedBody.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const { startPage, endPage } = parsedBody.data;
      
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const entry = await storage.createQuranEntry({
        userId: user.id,
        startPage,
        endPage,
        date: new Date()
      });

      res.status(201).json(entry);
    } catch (error) {
      console.error("Error adding Quran entry:", error);
      res.status(500).json({ message: "Failed to add Quran entry" });
    }
  });

  // Get Quran reading entries for a specific date
  app.get("/api/quran-entries/:date?", async (req: Request, res: Response) => {
    try {
      const dateParam = req.params.date ? new Date(req.params.date) : new Date();
      
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const entries = await storage.getQuranEntriesByDate(user.id, dateParam);
      res.json(entries);
    } catch (error) {
      console.error("Error getting Quran entries:", error);
      res.status(500).json({ message: "Failed to get Quran entries" });
    }
  });

  // Delete a Quran reading entry
  app.delete("/api/quran-entries/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const deleted = await storage.deleteQuranEntry(id);
      if (!deleted) {
        return res.status(404).json({ message: "Entry not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting Quran entry:", error);
      res.status(500).json({ message: "Failed to delete Quran entry" });
    }
  });

  // Set Fajr prayer status for a specific day
  app.post("/api/fajr-entries", async (req: Request, res: Response) => {
    try {
      const parsedBody = insertFajrEntrySchema.safeParse(req.body);
      
      if (!parsedBody.success) {
        const validationError = fromZodError(parsedBody.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      const { prayed, date } = parsedBody.data;
      
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const entry = await storage.createFajrEntry({
        userId: user.id,
        prayed,
        date: date || new Date()
      });

      res.status(201).json(entry);
    } catch (error) {
      console.error("Error setting Fajr status:", error);
      res.status(500).json({ message: "Failed to set Fajr status" });
    }
  });

  // Get Fajr prayer status for a specific date
  app.get("/api/fajr-entries/:date?", async (req: Request, res: Response) => {
    try {
      const dateParam = req.params.date ? new Date(req.params.date) : new Date();
      
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const entry = await storage.getFajrEntryByDate(user.id, dateParam);
      res.json(entry || { prayed: false, date: dateParam });
    } catch (error) {
      console.error("Error getting Fajr status:", error);
      res.status(500).json({ message: "Failed to get Fajr status" });
    }
  });

  // Get daily summary
  app.get("/api/daily-summary/:date?", async (req: Request, res: Response) => {
    try {
      const dateParam = req.params.date ? new Date(req.params.date) : new Date();
      
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const summary = await storage.getDailySummary(user.id, dateParam);
      res.json(summary || { 
        date: dateParam, 
        totalPages: 0, 
        fajrPrayed: false,
        entries: []
      });
    } catch (error) {
      console.error("Error getting daily summary:", error);
      res.status(500).json({ message: "Failed to get daily summary" });
    }
  });

  // Get weekly summary
  app.get("/api/weekly-summary/:date?", async (req: Request, res: Response) => {
    try {
      const dateParam = req.params.date ? new Date(req.params.date) : new Date();
      
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const summary = await storage.getWeeklySummary(user.id, dateParam);
      res.json(summary);
    } catch (error) {
      console.error("Error getting weekly summary:", error);
      res.status(500).json({ message: "Failed to get weekly summary" });
    }
  });

  // Get monthly summary
  app.get("/api/monthly-summary/:year/:month", async (req: Request, res: Response) => {
    try {
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month) - 1; // JavaScript months are 0-based
      
      if (isNaN(year) || isNaN(month)) {
        return res.status(400).json({ message: "Invalid year or month" });
      }
      
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const summary = await storage.getMonthlySummary(user.id, month, year);
      res.json(summary);
    } catch (error) {
      console.error("Error getting monthly summary:", error);
      res.status(500).json({ message: "Failed to get monthly summary" });
    }
  });

  // Get current streaks
  app.get("/api/streaks", async (req: Request, res: Response) => {
    try {
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const streaks = await storage.getCurrentStreaks(user.id);
      res.json(streaks);
    } catch (error) {
      console.error("Error getting streaks:", error);
      res.status(500).json({ message: "Failed to get streaks" });
    }
  });

  // Get achievements
  app.get("/api/achievements", async (req: Request, res: Response) => {
    try {
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const achievements = await storage.getAchievementsByUserId(user.id);
      
      // Group achievements by type
      const earnedAchievements = achievements.filter(a => a.achieved);
      const inProgressAchievements = achievements.filter(a => !a.achieved);
      
      res.json({ earned: earnedAchievements, inProgress: inProgressAchievements });
    } catch (error) {
      console.error("Error getting achievements:", error);
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  // Get all daily records for history view
  app.get("/api/history", async (req: Request, res: Response) => {
    try {
      // For demo, we'll use a fixed user ID
      const user = await storage.getUserByUsername("demo");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get all entries
      const quranEntries = await storage.getQuranEntriesByUserId(user.id);
      
      // Group entries by date
      const entriesByDate = new Map<string, {
        date: Date;
        totalPages: number;
        entries: typeof quranEntries;
        fajrPrayed: boolean;
      }>();
      
      // Process Quran entries
      for (const entry of quranEntries) {
        const dateStr = new Date(entry.date).toISOString().split('T')[0];
        const pagesRead = entry.endPage - entry.startPage + 1;
        
        if (!entriesByDate.has(dateStr)) {
          entriesByDate.set(dateStr, {
            date: new Date(entry.date),
            totalPages: pagesRead,
            entries: [entry],
            fajrPrayed: false
          });
        } else {
          const current = entriesByDate.get(dateStr)!;
          current.totalPages += pagesRead;
          current.entries.push(entry);
          entriesByDate.set(dateStr, current);
        }
      }
      
      // Get all Fajr entries
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3); // Last 3 months
      
      const fajrEntries = await storage.getFajrEntriesByDateRange(
        user.id, startDate, new Date()
      );
      
      // Add Fajr status to the entries
      for (const fajrEntry of fajrEntries) {
        const dateStr = new Date(fajrEntry.date).toISOString().split('T')[0];
        
        if (entriesByDate.has(dateStr)) {
          const current = entriesByDate.get(dateStr)!;
          current.fajrPrayed = fajrEntry.prayed;
          entriesByDate.set(dateStr, current);
        } else if (fajrEntry.prayed) {
          // Add entry if only Fajr was prayed that day
          entriesByDate.set(dateStr, {
            date: new Date(fajrEntry.date),
            totalPages: 0,
            entries: [],
            fajrPrayed: true
          });
        }
      }
      
      // Convert map to array and sort by date (newest first)
      const result = Array.from(entriesByDate.values())
        .sort((a, b) => b.date.getTime() - a.date.getTime());
      
      res.json(result);
    } catch (error) {
      console.error("Error getting history:", error);
      res.status(500).json({ message: "Failed to get history" });
    }
  });

  return httpServer;
}
