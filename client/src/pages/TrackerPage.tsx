import { useEffect, useState } from 'react';
import { DailySummary } from '@/types/schema';
import QuranTracker from '@/components/QuranTracker';
import FajrTracker from '@/components/FajrTracker';
import WeekOverview from '@/components/WeekOverview';

export const ID_COUNTER = "1327420/t/0";

const intialDate = {
  date: new Date(),
  totalPages: 0,
  fajrPrayed: false,
  entries: []
};

export default function TrackerPage() {
  const [selectedDay, setSelectedDay] = useState<DailySummary | null>(intialDate);

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

  return (
    <main>
      <WeekOverview selectedDay={selectedDay} onDaySelect={setSelectedDay} />
      <QuranTracker selectedDate={selectedDay?.date} />
      <FajrTracker  selectedDate={selectedDay?.date}/>
    </main>
  );
}