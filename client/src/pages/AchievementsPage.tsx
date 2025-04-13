import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import BadgesOverview from '@/components/BadgesOverview';
import NextMilestones from '@/components/NextMilestones';
import QuranCompletionTracker from '@/components/QuranCompletionTracker';

export default function AchievementsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Navigation />
        
        <BadgesOverview />
        <NextMilestones />
        <QuranCompletionTracker />
      </main>
      
      <Footer />
    </div>
  );
}
