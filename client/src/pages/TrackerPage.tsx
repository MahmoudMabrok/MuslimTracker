import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import DateDisplay from '@/components/DateDisplay';
import QuranTracker from '@/components/QuranTracker';
import FajrTracker from '@/components/FajrTracker';
import StreakSummary from '@/components/StreakSummary';

export default function TrackerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Navigation />
        
        <DateDisplay />
        <QuranTracker />
        <FajrTracker />
        <StreakSummary />
      </main>
      
      <Footer />
    </div>
  );
}
