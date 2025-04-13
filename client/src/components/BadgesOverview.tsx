import { Skeleton } from '@/components/ui/skeleton';
import { useAchievements } from '@/hooks/useLocalStorage';
import { Achievement, AchievementsResponse } from '@/types/schema';

export default function BadgesOverview() {
  const { data: achievements, isLoading } = useAchievements();

  // Get badge information based on achievement type and value
  const getBadgeInfo = (achievement: Achievement) => {
    // Map achievement types to readable titles and descriptions
    const badgeInfo: Record<string, Record<number, { title: string, description: string, icon: string }>> = {
      quran_streak: {
        7: {
          title: "7-Day Reader",
          description: "Read Quran for 7 consecutive days",
          icon: "local_fire_department"
        },
        30: {
          title: "Monthly Devotion",
          description: "Read Quran for 30 consecutive days",
          icon: "calendar_month"
        }
      },
      fajr_streak: {
        5: {
          title: "Fajr Warrior",
          description: "Prayed Fajr for 5 consecutive days",
          icon: "wb_twilight"
        },
        10: {
          title: "Fajr Champion",
          description: "Prayed Fajr for 10 consecutive days",
          icon: "star"
        }
      },
      pages_milestone: {
        100: {
          title: "100 Pages",
          description: "Read 100 pages of Quran",
          icon: "menu_book"
        },
        300: {
          title: "300 Pages",
          description: "Read 300 pages of Quran",
          icon: "auto_stories"
        },
        614: {
          title: "Quran Completion",
          description: "Completed reading the entire Quran",
          icon: "workspace_premium"
        }
      }
    };

    const defaultInfo = {
      title: `${achievement.type} (${achievement.value})`,
      description: `Achieved ${achievement.type} with value ${achievement.value}`,
      icon: "emoji_events"
    };

    return badgeInfo[achievement.type]?.[achievement.value] || defaultInfo;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">emoji_events</span>
        Your Achievements
      </h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-3 flex flex-col items-center">
              <Skeleton className="w-16 h-16 rounded-full mb-2" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      ) : achievements && achievements.earned.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {achievements.earned.map(badge => {
            const { title, description, icon } = getBadgeInfo(badge);
            return (
              <div key={badge.id} className="border rounded-lg p-3 flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/20 mb-2">
                  <span className="material-icons text-accent text-3xl">{icon}</span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{title}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </div>
            );
          })}
          
          {/* Add locked/inactive badges */}
          {achievements.inProgress.map(badge => {
            const { title, description, icon } = getBadgeInfo(badge);
            return (
              <div key={badge.id} className="border rounded-lg p-3 flex flex-col items-center opacity-40">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 mb-2">
                  <span className="material-icons text-gray-400 text-3xl">{icon}</span>
                </div>
                <div className="text-center">
                  <div className="font-bold text-sm">{title}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <span className="material-icons text-4xl mb-2">emoji_events</span>
          <p>You haven't earned any badges yet. Keep tracking your activities to earn achievements!</p>
        </div>
      )}
    </div>
  );
}
