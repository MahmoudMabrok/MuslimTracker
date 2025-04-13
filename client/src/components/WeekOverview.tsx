import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

type DailySummary = {
  date: string;
  totalPages: number;
  fajrPrayed: boolean;
  entries: any[];
};

export default function WeekOverview() {
  const { data: weekData = [], isLoading } = useQuery<DailySummary[]>({
    queryKey: ['/api/weekly-summary'],
  });

  // Format day name and date
  const formatDayInfo = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    
    return { dayName, dayNumber };
  };

  // Check if date is today
  const isToday = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is in the future
  const isFutureDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">date_range</span>
        Weekly Overview
      </h2>
      
      <div className="overflow-x-auto">
        <div className="inline-flex space-x-2 min-w-full pb-2">
          {isLoading ? (
            // Skeleton loading state
            Array(7).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center min-w-[60px] p-2 border rounded">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-4 w-8 mb-2" />
                <Skeleton className="w-8 h-8 rounded-full mb-1" />
                <Skeleton className="h-3 w-10 mb-1" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ))
          ) : (
            weekData.map((day, index) => {
              const { dayName, dayNumber } = formatDayInfo(day.date as string);
              const future = isFutureDate(day.date as string);
              const current = isToday(day.date as string);
              
              return (
                <div 
                  key={index}
                  className={`flex flex-col items-center min-w-[60px] p-2 border rounded
                    ${current ? 'bg-neutral-light font-bold' : ''}
                    ${future ? 'opacity-50' : ''}
                  `}
                >
                  <div className="text-xs text-gray-500">{dayName}</div>
                  <div className="text-sm font-bold">{dayNumber.toString().padStart(2, '0')}</div>
                  
                  <div className="mt-2 flex flex-col items-center">
                    {future ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs mb-1">-</div>
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-white text-xs mb-1">
                        {day.totalPages}
                      </div>
                    )}
                    <div className="text-xs">pages</div>
                  </div>
                  
                  <div className="mt-1">
                    {future ? (
                      <span className="material-icons text-gray-300 text-sm">radio_button_unchecked</span>
                    ) : day.fajrPrayed ? (
                      <span className="material-icons text-status-success text-sm">check_circle</span>
                    ) : (
                      <span className="material-icons text-status-error text-sm">cancel</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
