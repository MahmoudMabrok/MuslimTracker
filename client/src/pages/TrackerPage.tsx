import { useEffect } from 'react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import DateDisplay from '@/components/DateDisplay';
import QuranTracker from '@/components/QuranTracker';
import FajrTracker from '@/components/FajrTracker';
import StreakSummary from '@/components/StreakSummary';
import WeekOverview from '@/components/WeekOverview';


export const ID_COUNTER = "1327420/t/0";


export default function TrackerPage() {

  useEffect(() => {
    try {
       fetch(`https://www.freevisitorcounters.com/en/home/counter/${ID_COUNTER}`, {
      method: 'GET',
      mode: 'no-cors', // Change to no-cors to avoid CORS issues
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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Navigation />
        
        <DateDisplay />
        <WeekOverview />
        <QuranTracker />
        <FajrTracker />
        <StreakSummary />
      </main>
      <Footer />
    
    </div>
  );
}
