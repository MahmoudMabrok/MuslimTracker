import StreakSummary from '@/components/StreakSummary';
import BadgesOverview from '@/components/BadgesOverview';
import NextMilestones from '@/components/NextMilestones';

export default function AchievementsPage() {
  return (
    <main>
      <StreakSummary />
      <BadgesOverview />
      <NextMilestones />
    </main>
  );
}