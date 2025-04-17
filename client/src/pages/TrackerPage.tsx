import { useEffect, useState } from 'react';
import { DailySummary } from '@/types/schema';
import QuranTracker from '@/components/QuranTracker';
import FajrTracker from '@/components/FajrTracker';
import WeekOverview from '@/components/WeekOverview';

export const ID_COUNTER = "1327420/t/0";

export default function TrackerPage() {
  const [selectedDay, setSelectedDay] = useState<DailySummary | null>(null);

  useEffect(() => {
    try {
      fetch(`https://www.freevisitorcounters.com/en/home/counter/${ID_COUNTER}`, {
        method: 'GET',
        mode: 'no-cors', 
        cache: 'no-cache',
      }).catch(error => {
        console.log('Visitor counter error:', error);
      });
    } catch (error) {
      console.log('Failed to load visitor counter:', error);
    }

  }, []);

  console.log("TrackerPage rendered");

  useEffect(() => {
    // Set today as selected day on initial load
    const today = new Date();
    setSelectedDay({
      date: today,
      totalPages: 0,
      fajrPrayed: false,
      entries: []
    });
  }, []);

  return (
    <main>
      <WeekOverview selectedDay={selectedDay} onDaySelect={setSelectedDay} />
      <QuranTracker selectedDate={selectedDay?.date} />
      <FajrTracker />
    </main>
  );
}