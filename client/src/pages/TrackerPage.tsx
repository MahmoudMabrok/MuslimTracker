import { useEffect } from 'react';

import QuranTracker from '@/components/QuranTracker';
import FajrTracker from '@/components/FajrTracker';

export const ID_COUNTER = "1327420/t/0";

export default function TrackerPage() {

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
      <QuranTracker />
      <FajrTracker />
    </main>
  );
}