import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAchievements } from '@/hooks/useLocalStorage';
import { Achievement } from '@/types/schema';

export default function NextMilestones() {
  const { data: achievements, isLoading } = useAchievements();

  // Get milestone title based on achievement type and value
  const getMilestoneTitle = (achievement: Achievement) => {
    const titles: Record<string, Record<number, string>> = {
      quran_streak: {
        7: "7-Day Reading Streak",
        30: "30-Day Reading Streak"
      },
      fajr_streak: {
        5: "5-Day Fajr Streak",
        10: "10-Day Fajr Streak"
      },
      pages_milestone: {
        100: "100 Pages Read",
        300: "300 Pages Read",
        614: "Complete Quran"
      }
    };

    return titles[achievement.type]?.[achievement.value] || `${achievement.type} (${achievement.value})`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">flag</span>
        Next Milestones
      </h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2.5 w-full" />
            </div>
          ))}
        </div>
      ) : achievements && achievements.inProgress.length > 0 ? (
        <div className="space-y-4">
          {achievements.inProgress.map(milestone => (
            <div key={milestone.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="font-bold">{getMilestoneTitle(milestone)}</div>
                <div className="text-sm text-gray-500">{milestone.progress}/{milestone.value}</div>
              </div>
              <Progress 
                value={(milestone.progress / milestone.value) * 100} 
                className="h-2.5 bg-gray-200" 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <span className="material-icons text-4xl mb-2">flag</span>
          <p>You've completed all available milestones!</p>
        </div>
      )}
    </div>
  );
}
