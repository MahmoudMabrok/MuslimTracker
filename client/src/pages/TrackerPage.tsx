import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import DateDisplay from '@/components/DateDisplay';
import QuranTracker from '@/components/QuranTracker';
import FajrTracker from '@/components/FajrTracker';
import StreakSummary from '@/components/StreakSummary';
import WeekOverview from '@/components/WeekOverview';

export default function TrackerPage() {

  console.log("TrackerPage rendered");
  // This is a placeholder for any data fetching or state management you might want to do
  // For example, you could use React Query or any other state management library

  // to fetch user data, Quran progress, etc.
  // const { data: userData } = useQuery('userData', fetchUserData);
  // const { data: quranProgress } = useQuery('quranProgress', fetchQuranProgress);

  // const { data: fajrProgress } = useQuery('fajrProgress', fetchFajrProgress);
  // const { data: streakData } = useQuery('streakData', fetchStreakData);
  
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
