import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import WeekOverview from '@/components/WeekOverview';
import ReadingHistory from '@/components/ReadingHistory';
import MonthlyStats from '@/components/MonthlyStats';

export default function StatisticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Navigation />
        
        <WeekOverview />
        <ReadingHistory />
        <MonthlyStats />
      </main>
      
      <Footer />
    </div>
  );
}
