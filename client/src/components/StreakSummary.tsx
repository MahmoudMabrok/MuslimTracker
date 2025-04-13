import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

type StreaksData = {
  quranStreak: number;
  fajrStreak: number;
};

export default function StreakSummary() {
  const { data: streaks, isLoading } = useQuery<StreaksData>({
    queryKey: ['/api/streaks'],
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <span className="material-icons mr-2 text-primary">local_fire_department</span>
        Your Streaks
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-3 flex flex-col items-center">
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <div className="text-3xl font-bold text-primary">
              {streaks?.quranStreak || 0}
            </div>
          )}
          <div className="text-sm text-gray-600">Days reading Quran</div>
        </div>
        
        <div className="border rounded-lg p-3 flex flex-col items-center">
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <div className="text-3xl font-bold text-primary">
              {streaks?.fajrStreak || 0}
            </div>
          )}
          <div className="text-sm text-gray-600">Days praying Fajr</div>
        </div>
      </div>
    </div>
  );
}
