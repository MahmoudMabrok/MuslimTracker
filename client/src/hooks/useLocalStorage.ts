import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as localStorageService from '../services/localStorageService';
import { 
  User, QuranEntry, FajrEntry, Achievement, 
  InsertQuranEntry, InsertFajrEntry, InsertAchievement,
  DailySummary, AchievementsResponse, HistoryEntry 
} from '../types/schema';

// User data hook
export function useUserData() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => localStorageService.getUser(),
  });
}

// Quran entries hooks
export function useQuranEntries(date?: Date) {
  return useQuery({
    queryKey: ['quranEntries', date ? date.toISOString() : 'all'],
    queryFn: () => date 
      ? localStorageService.getQuranEntriesByDate(date)
      : localStorageService.getQuranEntries(),
  });
}

export function useCreateQuranEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entry: InsertQuranEntry) => 
      localStorageService.createQuranEntry(entry),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['quranEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dailySummary'] });
      queryClient.invalidateQueries({ queryKey: ['weeklySummary'] });
      queryClient.invalidateQueries({ queryKey: ['monthlySummary'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

export function useDeleteQuranEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => 
      localStorageService.deleteQuranEntry(id),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['quranEntries'] });
      queryClient.invalidateQueries({ queryKey: ['dailySummary'] });
      queryClient.invalidateQueries({ queryKey: ['weeklySummary'] });
      queryClient.invalidateQueries({ queryKey: ['monthlySummary'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

// Fajr entries hooks
export function useFajrEntry(date?: Date) {
  return useQuery({
    queryKey: ['fajrEntry', date ? date.toISOString() : 'today'],
    queryFn: () => localStorageService.getFajrEntryByDate(date || new Date()),
  });
}

export function useCreateFajrEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (entry: InsertFajrEntry) => 
      localStorageService.createFajrEntry(entry),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['fajrEntry'] });
      queryClient.invalidateQueries({ queryKey: ['dailySummary'] });
      queryClient.invalidateQueries({ queryKey: ['weeklySummary'] });
      queryClient.invalidateQueries({ queryKey: ['monthlySummary'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['streaks'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });
}

// Summary hooks
export function useDailySummary(date?: Date) {
  return useQuery({
    queryKey: ['dailySummary', date ? date.toISOString() : 'today'],
    queryFn: () => localStorageService.getDailySummary(date || new Date()),
  });
}

export function useWeeklySummary(date?: Date) {
  return useQuery({
    queryKey: ['weeklySummary', date ? date.toISOString() : 'thisWeek'],
    queryFn: () => localStorageService.getWeeklySummary(date || new Date()),
  });
}

export function useMonthlySummary(month?: number, year?: number) {
  const today = new Date();
  const currentMonth = month || today.getMonth() + 1;
  const currentYear = year || today.getFullYear();
  
  return useQuery({
    queryKey: ['monthlySummary', currentYear, currentMonth],
    queryFn: () => localStorageService.getMonthlySummary(currentMonth, currentYear),
  });
}

// Streak hooks
export function useStreaks() {
  return useQuery({
    queryKey: ['streaks'],
    queryFn: () => localStorageService.getCurrentStreaks(),
  });
}

// History hooks
export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => localStorageService.getHistory(),
  });
}

// Achievement hooks
export function useAchievements() {
  return useQuery<AchievementsResponse>({
    queryKey: ['achievements'],
    queryFn: () => localStorageService.getAchievementsData(),
  });
}