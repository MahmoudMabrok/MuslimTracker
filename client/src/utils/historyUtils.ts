
import { HistoryEntry } from '@/types/schema';

export const formatHistoryData = (
  historyData: HistoryEntry[],
  timeFrame: 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth'
): HistoryEntry[] => {
  if (!historyData.length) return [];

  const today = new Date();
  let startDate: Date;
  let endDate: Date;

  // Determine date range based on timeFrame
  switch (timeFrame) {
    case 'thisWeek': {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay());
      endDate = today;
      break;
    }
    case 'lastWeek': {
      startDate = new Date(today);
      startDate.setDate(today.getDate() - today.getDay() - 7);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      break;
    }
    case 'thisMonth': {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = today;
      break;
    }
    case 'lastMonth': {
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    }
  }

  // Create map of existing entries
  const entriesByDate = new Map(
    historyData.map(entry => [
      new Date(entry.date).toISOString().split('T')[0],
      entry
    ])
  );

  // Fill in all dates in the range
  const filledHistory: HistoryEntry[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    if (entriesByDate.has(dateStr)) {
      filledHistory.push(entriesByDate.get(dateStr)!);
    } else {
      filledHistory.push({
        date: new Date(currentDate),
        totalPages: 0,
        fajrPrayed: false,
        entries: []
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return filledHistory.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
