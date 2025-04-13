import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

type MonthlyStats = {
  totalPages: number;
  fajrPrayedCount: number;
  totalDays: number;
};

export default function MonthlyStats() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
  const currentYear = today.getFullYear();

  const { data: stats, isLoading } = useQuery<MonthlyStats>({
    queryKey: [`/api/monthly-summary/${currentYear}/${currentMonth}`],
  });

  // Calculate reading consistency percentage
  const getConsistencyPercentage = () => {
    if (!stats) return 0;
    
    const daysInMonth = stats.totalDays;
    const currentDay = Math.min(today.getDate(), daysInMonth);
    const daysWithReadingPercentage = stats.totalPages > 0 
      ? (stats.totalPages / (currentDay * 10)) * 100 // Assuming an average of 10 pages per day is 100% consistency
      : 0;
    
    // Cap at 100%
    return Math.min(Math.round(daysWithReadingPercentage), 100);
  };

  const consistencyPercentage = getConsistencyPercentage();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">insights</span>
        Monthly Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border rounded-lg p-3">
          <div className="text-sm text-gray-500 mb-1">Total Pages</div>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{stats?.totalPages || 0}</div>
          )}
        </div>
        
        <div className="border rounded-lg p-3">
          <div className="text-sm text-gray-500 mb-1">Fajr Prayers</div>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {stats ? `${stats.fajrPrayedCount}/${today.getDate()}` : '0/0'}
            </div>
          )}
        </div>
      </div>
      
      <div className="border rounded-lg p-3">
        <div className="text-sm font-medium mb-2">Reading Consistency</div>
        {isLoading ? (
          <Skeleton className="h-2.5 w-full mb-1" />
        ) : (
          <>
            <Progress value={consistencyPercentage} className="h-2.5" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>{consistencyPercentage}%</span>
              <span>100%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
