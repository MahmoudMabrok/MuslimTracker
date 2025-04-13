import { 
  User, InsertUser, 
  QuranEntry, InsertQuranEntry, 
  FajrEntry, InsertFajrEntry,
  Achievement, InsertAchievement,
  ACHIEVEMENT_TYPES,
  DailySummary
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Quran entries methods
  createQuranEntry(entry: InsertQuranEntry): Promise<QuranEntry>;
  getQuranEntriesByUserId(userId: number): Promise<QuranEntry[]>;
  getQuranEntriesByDate(userId: number, date: Date): Promise<QuranEntry[]>;
  getQuranEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<QuranEntry[]>;
  deleteQuranEntry(id: number): Promise<boolean>;
  
  // Fajr prayer methods
  createFajrEntry(entry: InsertFajrEntry): Promise<FajrEntry>;
  getFajrEntryByDate(userId: number, date: Date): Promise<FajrEntry | undefined>;
  getFajrEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<FajrEntry[]>;
  updateFajrEntry(id: number, prayed: boolean): Promise<FajrEntry | undefined>;
  
  // Achievement and streak methods
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievementsByUserId(userId: number): Promise<Achievement[]>;
  updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement | undefined>;
  
  // Summary methods
  getDailySummary(userId: number, date: Date): Promise<DailySummary | undefined>;
  getWeeklySummary(userId: number, date: Date): Promise<DailySummary[]>;
  getMonthlySummary(userId: number, month: number, year: number): Promise<{
    totalPages: number,
    fajrPrayedCount: number,
    totalDays: number
  }>;
  
  // Streak methods
  getCurrentStreaks(userId: number): Promise<{
    quranStreak: number,
    fajrStreak: number
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quranEntries: Map<number, QuranEntry>;
  private fajrEntries: Map<number, FajrEntry>;
  private achievements: Map<number, Achievement>;
  
  private currentUserId: number;
  private currentQuranEntryId: number;
  private currentFajrEntryId: number;
  private currentAchievementId: number;

  constructor() {
    this.users = new Map();
    this.quranEntries = new Map();
    this.fajrEntries = new Map();
    this.achievements = new Map();
    
    this.currentUserId = 1;
    this.currentQuranEntryId = 1;
    this.currentFajrEntryId = 1;
    this.currentAchievementId = 1;
    
    // Create a default user for testing
    this.createUser({
      username: "demo",
      password: "demo123"
    });
  }

  // Helper method to format date to YYYY-MM-DD
  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  // Helper method to check if two dates are the same day
  private isSameDay(date1: Date, date2: Date): boolean {
    return this.formatDate(date1) === this.formatDate(date2);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Initialize achievements for the new user
    this.initializeAchievements(id);
    
    return user;
  }

  // Initialize achievements for a new user
  private async initializeAchievements(userId: number) {
    // Create reading streak achievements
    await this.createAchievement({
      userId,
      type: ACHIEVEMENT_TYPES.QURAN_STREAK,
      value: 7,
      achieved: false,
      progress: 0
    });
    
    await this.createAchievement({
      userId,
      type: ACHIEVEMENT_TYPES.QURAN_STREAK,
      value: 30,
      achieved: false,
      progress: 0
    });
    
    // Create Fajr streak achievements
    await this.createAchievement({
      userId,
      type: ACHIEVEMENT_TYPES.FAJR_STREAK,
      value: 5,
      achieved: false,
      progress: 0
    });
    
    await this.createAchievement({
      userId,
      type: ACHIEVEMENT_TYPES.FAJR_STREAK,
      value: 10,
      achieved: false,
      progress: 0
    });
    
    // Create pages milestones
    await this.createAchievement({
      userId,
      type: ACHIEVEMENT_TYPES.PAGES_MILESTONE,
      value: 100,
      achieved: false,
      progress: 0
    });
    
    await this.createAchievement({
      userId,
      type: ACHIEVEMENT_TYPES.PAGES_MILESTONE,
      value: 300,
      achieved: false,
      progress: 0
    });
    
    await this.createAchievement({
      userId,
      type: ACHIEVEMENT_TYPES.PAGES_MILESTONE,
      value: 614,
      achieved: false,
      progress: 0
    });
  }

  // Quran entries methods
  async createQuranEntry(entry: InsertQuranEntry): Promise<QuranEntry> {
    const id = this.currentQuranEntryId++;
    const quranEntry: QuranEntry = { ...entry, id };
    this.quranEntries.set(id, quranEntry);
    
    // Update achievements after adding new entry
    await this.updateAchievementsForUser(quranEntry.userId!);
    
    return quranEntry;
  }

  async getQuranEntriesByUserId(userId: number): Promise<QuranEntry[]> {
    return Array.from(this.quranEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getQuranEntriesByDate(userId: number, date: Date): Promise<QuranEntry[]> {
    return Array.from(this.quranEntries.values())
      .filter(entry => 
        entry.userId === userId && 
        this.isSameDay(new Date(entry.date), date)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getQuranEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<QuranEntry[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.quranEntries.values())
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return (
          entry.userId === userId &&
          entryDate >= start &&
          entryDate <= end
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async deleteQuranEntry(id: number): Promise<boolean> {
    const entry = this.quranEntries.get(id);
    if (!entry) return false;
    
    const userId = entry.userId;
    this.quranEntries.delete(id);
    
    // Update achievements after deleting entry
    if (userId) {
      await this.updateAchievementsForUser(userId);
    }
    
    return true;
  }

  // Fajr prayer methods
  async createFajrEntry(entry: InsertFajrEntry): Promise<FajrEntry> {
    // Check if there's already an entry for this day
    const existingEntry = await this.getFajrEntryByDate(entry.userId!, new Date(entry.date));
    
    if (existingEntry) {
      // Update existing entry instead of creating a new one
      return this.updateFajrEntry(existingEntry.id, entry.prayed) as Promise<FajrEntry>;
    }
    
    const id = this.currentFajrEntryId++;
    const fajrEntry: FajrEntry = { ...entry, id };
    this.fajrEntries.set(id, fajrEntry);
    
    // Update achievements after adding new entry
    await this.updateAchievementsForUser(fajrEntry.userId!);
    
    return fajrEntry;
  }

  async getFajrEntryByDate(userId: number, date: Date): Promise<FajrEntry | undefined> {
    return Array.from(this.fajrEntries.values()).find(
      entry => entry.userId === userId && this.isSameDay(new Date(entry.date), date)
    );
  }

  async getFajrEntriesByDateRange(userId: number, startDate: Date, endDate: Date): Promise<FajrEntry[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.fajrEntries.values())
      .filter(entry => {
        const entryDate = new Date(entry.date);
        return (
          entry.userId === userId &&
          entryDate >= start &&
          entryDate <= end
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async updateFajrEntry(id: number, prayed: boolean): Promise<FajrEntry | undefined> {
    const entry = this.fajrEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry: FajrEntry = { ...entry, prayed };
    this.fajrEntries.set(id, updatedEntry);
    
    // Update achievements after updating entry
    await this.updateAchievementsForUser(updatedEntry.userId!);
    
    return updatedEntry;
  }

  // Achievement methods
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const newAchievement: Achievement = { ...achievement, id };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.userId === userId);
  }

  async updateAchievement(id: number, achievementData: Partial<InsertAchievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;
    
    const updatedAchievement: Achievement = { ...achievement, ...achievementData };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  // Summary methods
  async getDailySummary(userId: number, date: Date): Promise<DailySummary | undefined> {
    const entries = await this.getQuranEntriesByDate(userId, date);
    const fajrEntry = await this.getFajrEntryByDate(userId, date);
    
    if (entries.length === 0 && !fajrEntry) return undefined;
    
    const totalPages = entries.reduce((sum, entry) => 
      sum + (entry.endPage - entry.startPage + 1), 0
    );
    
    return {
      date: new Date(date),
      totalPages,
      fajrPrayed: fajrEntry ? fajrEntry.prayed : false,
      entries
    };
  }

  async getWeeklySummary(userId: number, date: Date): Promise<DailySummary[]> {
    const result: DailySummary[] = [];
    const currentDate = new Date(date);
    
    // Get the start of the week (Sunday)
    const dayOfWeek = currentDate.getDay();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - dayOfWeek);
    
    // Create summary for each day of the week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      
      const dailySummary = await this.getDailySummary(userId, day);
      
      if (dailySummary) {
        result.push(dailySummary);
      } else {
        // Add empty summary for days without data
        result.push({
          date: new Date(day),
          totalPages: 0,
          fajrPrayed: false,
          entries: []
        });
      }
    }
    
    return result;
  }

  async getMonthlySummary(userId: number, month: number, year: number): Promise<{
    totalPages: number,
    fajrPrayedCount: number,
    totalDays: number
  }> {
    // Create start and end dates for the specified month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // Last day of month
    
    const quranEntries = await this.getQuranEntriesByDateRange(
      userId, startDate, endDate
    );
    
    const fajrEntries = await this.getFajrEntriesByDateRange(
      userId, startDate, endDate
    );
    
    const totalPages = quranEntries.reduce(
      (sum, entry) => sum + (entry.endPage - entry.startPage + 1), 0
    );
    
    const fajrPrayedCount = fajrEntries.filter(entry => entry.prayed).length;
    
    return {
      totalPages,
      fajrPrayedCount,
      totalDays: endDate.getDate() // Number of days in the month
    };
  }

  // Streak methods
  async getCurrentStreaks(userId: number): Promise<{
    quranStreak: number,
    fajrStreak: number
  }> {
    // Calculate Quran reading streak
    const quranStreak = await this.calculateQuranStreak(userId);
    
    // Calculate Fajr prayer streak
    const fajrStreak = await this.calculateFajrStreak(userId);
    
    return {
      quranStreak,
      fajrStreak
    };
  }

  private async calculateQuranStreak(userId: number): Promise<number> {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; ; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const entries = await this.getQuranEntriesByDate(userId, date);
      
      if (entries.length > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  private async calculateFajrStreak(userId: number): Promise<number> {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; ; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const fajrEntry = await this.getFajrEntryByDate(userId, date);
      
      if (fajrEntry && fajrEntry.prayed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Update achievements for a user
  private async updateAchievementsForUser(userId: number) {
    const streaks = await this.getCurrentStreaks(userId);
    const achievements = await this.getAchievementsByUserId(userId);
    
    // Update Quran streak achievements
    const quranStreakAchievements = achievements.filter(
      a => a.type === ACHIEVEMENT_TYPES.QURAN_STREAK
    );
    
    for (const achievement of quranStreakAchievements) {
      const achieved = streaks.quranStreak >= achievement.value;
      const progress = Math.min(streaks.quranStreak, achievement.value);
      
      await this.updateAchievement(achievement.id, {
        achieved,
        progress,
        ...(achieved && !achievement.achieved ? { achievedDate: new Date() } : {})
      });
    }
    
    // Update Fajr streak achievements
    const fajrStreakAchievements = achievements.filter(
      a => a.type === ACHIEVEMENT_TYPES.FAJR_STREAK
    );
    
    for (const achievement of fajrStreakAchievements) {
      const achieved = streaks.fajrStreak >= achievement.value;
      const progress = Math.min(streaks.fajrStreak, achievement.value);
      
      await this.updateAchievement(achievement.id, {
        achieved,
        progress,
        ...(achieved && !achievement.achieved ? { achievedDate: new Date() } : {})
      });
    }
    
    // Update pages milestone achievements
    const pageMilestoneAchievements = achievements.filter(
      a => a.type === ACHIEVEMENT_TYPES.PAGES_MILESTONE
    );
    
    // Calculate total pages read
    const allEntries = await this.getQuranEntriesByUserId(userId);
    const totalPagesRead = allEntries.reduce(
      (sum, entry) => sum + (entry.endPage - entry.startPage + 1), 0
    );
    
    for (const achievement of pageMilestoneAchievements) {
      const achieved = totalPagesRead >= achievement.value;
      const progress = Math.min(totalPagesRead, achievement.value);
      
      await this.updateAchievement(achievement.id, {
        achieved,
        progress,
        ...(achieved && !achievement.achieved ? { achievedDate: new Date() } : {})
      });
    }
  }
}

export const storage = new MemStorage();
