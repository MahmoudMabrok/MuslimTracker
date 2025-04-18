import { log } from 'node:console';
import { 
  User, QuranEntry, FajrEntry, Achievement, 
  InsertQuranEntry, InsertFajrEntry, InsertAchievement, 
  ACHIEVEMENT_TYPES, HistoryEntry, AchievementsResponse 
} from '../types/schema';

const STORAGE_KEYS = {
  USER: 'muslim_tracker_user',
  QURAN_ENTRIES: 'muslim_tracker_quran_entries',
  FAJR_ENTRIES: 'muslim_tracker_fajr_entries',
  ACHIEVEMENTS: 'muslim_tracker_achievements',
};

// Default user since we don't have authentication
const DEFAULT_USER: User = {
  id: 1,
  username: 'user',
};

// Initialize storage with default data if empty
const initializeStorage = () => {
  // Initialize user
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
  }

  // Initialize empty arrays for other data
  if (!localStorage.getItem(STORAGE_KEYS.QURAN_ENTRIES)) {
    localStorage.setItem(STORAGE_KEYS.QURAN_ENTRIES, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.FAJR_ENTRIES)) {
    localStorage.setItem(STORAGE_KEYS.FAJR_ENTRIES, JSON.stringify([]));
  }

  // Initialize achievements if they don't exist
  if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
    const initialAchievements: Achievement[] = [
      // Quran reading streaks
      {
        id: 1,
        userId: DEFAULT_USER.id,
        type: ACHIEVEMENT_TYPES.QURAN_STREAK,
        value: 7,
        achieved: false,
        achievedDate: null,
        progress: 0,
      },
      {
        id: 2,
        userId: DEFAULT_USER.id,
        type: ACHIEVEMENT_TYPES.QURAN_STREAK,
        value: 30,
        achieved: false,
        achievedDate: null,
        progress: 0,
      },
      // Fajr prayer streaks
      {
        id: 3,
        userId: DEFAULT_USER.id,
        type: ACHIEVEMENT_TYPES.FAJR_STREAK,
        value: 5,
        achieved: false,
        achievedDate: null,
        progress: 0,
      },
      {
        id: 4,
        userId: DEFAULT_USER.id,
        type: ACHIEVEMENT_TYPES.FAJR_STREAK,
        value: 10,
        achieved: false,
        achievedDate: null,
        progress: 0,
      },
      // Pages milestones
      {
        id: 5,
        userId: DEFAULT_USER.id,
        type: ACHIEVEMENT_TYPES.PAGES_MILESTONE,
        value: 100,
        achieved: false,
        achievedDate: null,
        progress: 0,
      },
      {
        id: 6,
        userId: DEFAULT_USER.id,
        type: ACHIEVEMENT_TYPES.PAGES_MILESTONE,
        value: 300,
        achieved: false,
        achievedDate: null,
        progress: 0,
      },
      {
        id: 7,
        userId: DEFAULT_USER.id,
        type: ACHIEVEMENT_TYPES.PAGES_MILESTONE,
        value: 614,
        achieved: false,
        achievedDate: null,
        progress: 0,
      },
    ];
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(initialAchievements));
  }
};

// Format date to YYYY-MM-DD for consistent comparison
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};

// User methods
export const getUser = async (): Promise<User> => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
};

// Quran entries methods
export const createQuranEntry = async (entry: InsertQuranEntry): Promise<QuranEntry> => {
  initializeStorage();
  const entries: QuranEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.QURAN_ENTRIES) || '[]');

   // Use entry.date instead of today
   const entryDate = entry.date ? new Date(entry.date) : new Date();
   const existingEntryIndex = entries.findIndex(e => {
     const existingDate = new Date(e.date);
     console.log("Checking entry date:", existingDate, "against entry date:", entryDate);
     
     return isSameDay(existingDate, entryDate) && e.userId === entry.userId;
   });
   
   let newEntry: QuranEntry;
   
   if (existingEntryIndex >= 0) {
     // Update existing entry
     newEntry = {
       ...entries[existingEntryIndex],
       startPage: entry.startPage,
       endPage: entry.endPage,
     };
     entries[existingEntryIndex] = newEntry;
   } else {
     // Create new entry
     newEntry = {
       ...entry,
       id: entryDate.getTime(), // Use timestamp as unique ID
       date: entry.date, // Use provided date instead of current date
     };
     entries.push(newEntry);
   }

  localStorage.setItem(STORAGE_KEYS.QURAN_ENTRIES, JSON.stringify(entries));
  
  // Update achievements after adding entry
  await updateAchievements();
  
  return newEntry;
};

export const getQuranEntries = async (): Promise<QuranEntry[]> => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.QURAN_ENTRIES) || '[]');
};

export const getQuranEntriesByDate = async (date: Date): Promise<QuranEntry[]> => {
  const entries = await getQuranEntries();
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, date);
  });
};

export const getQuranEntriesByDateRange = async (startDate: Date, endDate: Date): Promise<QuranEntry[]> => {
  const entries = await getQuranEntries();
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });
};

export const deleteQuranEntry = async (id: number): Promise<boolean> => {
  initializeStorage();
  const entries: QuranEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.QURAN_ENTRIES) || '[]');
  const filteredEntries = entries.filter(entry => entry.id !== id);
  
  if (filteredEntries.length < entries.length) {
    localStorage.setItem(STORAGE_KEYS.QURAN_ENTRIES, JSON.stringify(filteredEntries));
    
    // Update achievements after deletion
    await updateAchievements();
    
    return true;
  }
  
  return false;
};

// Fajr prayer methods
export const createFajrEntry = async (entry: InsertFajrEntry): Promise<FajrEntry> => {
  initializeStorage();
  const entries: FajrEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAJR_ENTRIES) || '[]');
  
  // Use entry.date instead of today
  const entryDate = new Date(entry.date);
  const existingEntryIndex = entries.findIndex(e => {
    const existingDate = new Date(e.date);
    console.log("Checking entry date:", existingDate, "against entry date:", entryDate);
    
    return isSameDay(existingDate, entryDate) && e.userId === entry.userId;
  });
  
  let newEntry: FajrEntry;
  
  if (existingEntryIndex >= 0) {
    // Update existing entry
    newEntry = {
      ...entries[existingEntryIndex],
      prayed: entry.prayed,
    };
    entries[existingEntryIndex] = newEntry;
  } else {
    // Create new entry
    newEntry = {
      ...entry,
      id: entryDate.getTime(), // Use timestamp as unique ID
      date: entry.date, // Use provided date instead of current date
    };
    entries.push(newEntry);
  }
  
  localStorage.setItem(STORAGE_KEYS.FAJR_ENTRIES, JSON.stringify(entries));
  
  // Update achievements after adding/updating entry
  await updateAchievements();
  
  return newEntry;
};

export const getFajrEntries = async (): Promise<FajrEntry[]> => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAJR_ENTRIES) || '[]');
};

export const getFajrEntryByDate = async (date: Date): Promise<FajrEntry | null> => {
  const entries = await getFajrEntries();

  console.log("Fajr entries:", entries);
  console.log("Date to check:", date);
  

  return entries.find(entry => {
    const entryDate = new Date(entry.date);
    return isSameDay(entryDate, date);
  }) || null ;
};

export const getFajrEntriesByDateRange = async (startDate: Date, endDate: Date): Promise<FajrEntry[]> => {
  const entries = await getFajrEntries();
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });
};

// Achievement methods
export const getAchievements = async (): Promise<Achievement[]> => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS) || '[]');
};

export const updateAchievement = async (id: number, achievementData: Partial<InsertAchievement>): Promise<Achievement | undefined> => {
  const achievements = await getAchievements();
  const index = achievements.findIndex(a => a.id === id);
  
  if (index >= 0) {
    const updatedAchievement = { ...achievements[index], ...achievementData };
    achievements[index] = updatedAchievement;
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    return updatedAchievement;
  }
  
  return undefined;
};

// Summary methods
export const getDailySummary = async (date: Date) => {
  const quranEntries = await getQuranEntriesByDate(date);
  const fajrEntry = await getFajrEntryByDate(date);
  
  const totalPages = quranEntries.reduce((total, entry) => {
    return total + (entry.endPage - entry.startPage + 1);
  }, 0);
  
  return {
    date,
    totalPages,
    fajrPrayed: fajrEntry?.prayed || false,
    entries: quranEntries,
  };
};

export const getWeeklySummary = async (date: Date) => {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - day); // Start from Sunday
  
  const results = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const summary = await getDailySummary(currentDate);
    results.push(summary);
  }
  
  return results;
};

export const getMonthlySummary = async (month: number, year: number) => {
  // Create date objects for the first and last day of the month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of the month
  
  // Get all entries for the month
  const quranEntries = await getQuranEntriesByDateRange(startDate, endDate);
  const fajrEntries = await getFajrEntriesByDateRange(startDate, endDate);
  
  // Calculate total pages read in the month
  const totalPages = quranEntries.reduce((total, entry) => {
    return total + (entry.endPage - entry.startPage + 1);
  }, 0);
  
  // Count days with Fajr prayer completed
  const fajrPrayedCount = fajrEntries.filter(entry => entry.prayed).length;
  
  return {
    totalPages,
    fajrPrayedCount,
    totalDays: endDate.getDate(), // Number of days in the month
  };
};

// Streak methods
export const getCurrentStreaks = async () => {
  const quranStreak = await calculateQuranStreak();
  const fajrStreak = await calculateFajrStreak();
  
  return {
    quranStreak,
    fajrStreak,
  };
};

const calculateQuranStreak = async (): Promise<number> => {
  const entries = await getQuranEntries();
  if (entries.length === 0) return 0;
  
  // Sort entries by date (newest first)
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group entries by day
  const days = new Map<string, QuranEntry[]>();
  
  entries.forEach(entry => {
    const day = formatDate(new Date(entry.date));
    if (!days.has(day)) {
      days.set(day, []);
    }
    days.get(day)?.push(entry);
  });

  // Convert to array of days and sort by date (newest first)
  const sortedDays = Array.from(days.keys()).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  if (sortedDays.length === 0) return 0;
  
  // Check if there's an entry for today
  const today = formatDate(new Date());
  const hasEntryToday = sortedDays[0] === today;
  
  if (!hasEntryToday) return 0; // Streak breaks if no entry today
  
  // Count consecutive days
  let streak = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = new Date(sortedDays[i]);
    const previousDay = new Date(sortedDays[i - 1]);
    
    // Check if days are consecutive (accounting for 1 day difference)
    const diffTime = previousDay.getTime() - currentDay.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const calculateFajrStreak = async (): Promise<number> => {
  const allEntries = await getFajrEntries();
  const entries = allEntries.filter(entry => entry.prayed);
  
  if (entries.length === 0) return 0;
  
  // Sort entries by date (newest first)
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Group entries by day (should have only one per day, but just in case)
  const days = new Map<string, FajrEntry>();
  
  entries.forEach(entry => {
    const day = formatDate(new Date(entry.date));
    days.set(day, entry);
  });

  // Convert to array of days and sort by date (newest first)
  const sortedDays = Array.from(days.keys()).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  if (sortedDays.length === 0) return 0;
  
  // Check if there's an entry for today
  const today = formatDate(new Date());
  const hasEntryToday = sortedDays[0] === today;
  
  if (!hasEntryToday) return 0; // Streak breaks if no entry today
  
  // Count consecutive days
  let streak = 1;
  
  for (let i = 1; i < sortedDays.length; i++) {
    const currentDay = new Date(sortedDays[i]);
    const previousDay = new Date(sortedDays[i - 1]);
    
    // Check if days are consecutive (accounting for 1 day difference)
    const diffTime = previousDay.getTime() - currentDay.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// History methods
export const getHistory = async (): Promise<HistoryEntry[]> => {
  const quranEntries = await getQuranEntries();
  const fajrEntries = await getFajrEntries();
  
  // Group quran entries by day
  const entriesByDay = new Map<string, {
    date: string;
    totalPages: number;
    entries: QuranEntry[];
    fajrPrayed: boolean;
  }>();
  
  // Process quran entries
  quranEntries.forEach(entry => {
    const day = formatDate(new Date(entry.date));
    
    if (!entriesByDay.has(day)) {
      entriesByDay.set(day, {
        date: entry.date,
        totalPages: 0,
        entries: [],
        fajrPrayed: false,
      });
    }
    
    const dayData = entriesByDay.get(day)!;
    dayData.entries.push(entry);
    dayData.totalPages += (entry.endPage - entry.startPage + 1);
  });
  
  // Process fajr entries
  fajrEntries.forEach(entry => {
    const day = formatDate(new Date(entry.date));
    
    if (!entriesByDay.has(day)) {
      entriesByDay.set(day, {
        date: entry.date,
        totalPages: 0,
        entries: [],
        fajrPrayed: entry.prayed,
      });
    } else {
      const dayData = entriesByDay.get(day)!;
      dayData.fajrPrayed = entry.prayed;
    }
  });
  
  // Convert to array and sort by date (newest first)
  return Array.from(entriesByDay.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Achievements data
export const getAchievementsData = async (): Promise<AchievementsResponse> => {
  const achievements = await getAchievements();
  
  return {
    earned: achievements.filter(a => a.achieved),
    inProgress: achievements.filter(a => !a.achieved),
  };
};

// Update all achievements based on current data
const updateAchievements = async () => {
  try {
    const achievements = await getAchievements();
    const quranEntries = await getQuranEntries();
    const streaks = await getCurrentStreaks();
    const { quranStreak, fajrStreak } = streaks;
    
    // Calculate total pages read
    const totalPages = quranEntries.reduce((total, entry) => {
      return total + (entry.endPage - entry.startPage + 1);
    }, 0);
    
    // Update streak achievements
    achievements.forEach(achievement => {
      if (achievement.type === ACHIEVEMENT_TYPES.QURAN_STREAK) {
        achievement.progress = quranStreak;
        achievement.achieved = quranStreak >= achievement.value;
        
        if (achievement.achieved && !achievement.achievedDate) {
          achievement.achievedDate = new Date().toISOString();
        }
      }
      
      if (achievement.type === ACHIEVEMENT_TYPES.FAJR_STREAK) {
        achievement.progress = fajrStreak;
        achievement.achieved = fajrStreak >= achievement.value;
        
        if (achievement.achieved && !achievement.achievedDate) {
          achievement.achievedDate = new Date().toISOString();
        }
      }
      
      if (achievement.type === ACHIEVEMENT_TYPES.PAGES_MILESTONE) {
        achievement.progress = Math.min(totalPages, achievement.value);
        achievement.achieved = totalPages >= achievement.value;
        
        if (achievement.achieved && !achievement.achievedDate) {
          achievement.achievedDate = new Date().toISOString();
        }
      }
    });
    
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error updating achievements:', error);
  }
};

// Initialize storage on module load
initializeStorage();