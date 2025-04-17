import WeekOverview from '@/components/WeekOverview';
import ReadingHistory from '@/components/ReadingHistory';
import MonthlyStats from '@/components/MonthlyStats';

export default function StatisticsPage() {
  return (
    <main>
      <WeekOverview />
      <ReadingHistory />
      <MonthlyStats />
    </main>
  );
}