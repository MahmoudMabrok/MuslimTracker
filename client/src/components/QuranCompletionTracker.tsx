import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAchievements } from '@/hooks/useLocalStorage';
import { Achievement } from '@/types/schema';

export default function QuranCompletionTracker() {
  const TOTAL_QURAN_PAGES = 614;
  
  const { data: achievements, isLoading } = useAchievements();
  const [pagesRead, setPagesRead] = useState(0);
  const [percentage, setPercentage] = useState('0');
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState<string | null>(null);

  // Calculate completion progress and estimated completion date when achievements data changes
  useEffect(() => {
    if (!achievements) {
      setPagesRead(0);
      setPercentage('0');
      setEstimatedCompletionDate(null);
      return;
    }
    
    // Find the page milestone achievements to track overall progress
    const pagesMilestones = [
      ...achievements.earned.filter(a => a.type === 'pages_milestone'),
      ...achievements.inProgress.filter(a => a.type === 'pages_milestone')
    ];
    
    // Sort by value to get the highest progress
    pagesMilestones.sort((a, b) => b.value - a.value);
    
    // Get the first one (highest progress)
    const highestMilestone = pagesMilestones[0];
    
    if (!highestMilestone) {
      setPagesRead(0);
      setPercentage('0');
      setEstimatedCompletionDate(null);
      return;
    }
    
    const pages = highestMilestone.progress;
    const percentValue = ((pages / TOTAL_QURAN_PAGES) * 100).toFixed(1);
    
    setPagesRead(pages);
    setPercentage(percentValue);
    
    // Calculate estimated completion date
    // Find the oldest achievement date to calculate reading pace
    let oldestDate: Date | null = null;
    
    if (achievements.earned && achievements.earned.length > 0) {
      for (const achievement of achievements.earned) {
        if (achievement.achievedDate) {
          const date = new Date(achievement.achievedDate);
          if (!oldestDate || date < oldestDate) {
            oldestDate = date;
          }
        }
      }
    }
    
    if (!oldestDate || pages <= 0) {
      setEstimatedCompletionDate(null);
      return;
    }
    
    const today = new Date();
    const timeDiff = today.getTime() - oldestDate.getTime();
    const daysSinceStart = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)));
    const pagesPerDay = pages / daysSinceStart;
    
    if (pagesPerDay <= 0) {
      setEstimatedCompletionDate(null);
      return;
    }
    
    const remainingPages = TOTAL_QURAN_PAGES - pages;
    const daysToComplete = Math.ceil(remainingPages / pagesPerDay);
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + daysToComplete);
    
    setEstimatedCompletionDate(completionDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }));
  }, [achievements]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">auto_stories</span>
        Quran Completion Tracker
      </h2>
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="font-medium">Overall Progress</div>
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <div className="text-sm text-gray-500">{pagesRead}/{TOTAL_QURAN_PAGES} pages</div>
          )}
        </div>
        
        {isLoading ? (
          <Skeleton className="h-2.5 w-full mb-1" />
        ) : (
          <>
            <Progress value={Number(percentage)} className="h-2.5" />
            <div className="text-xs text-gray-500 mt-1 text-right">{percentage}% Complete</div>
          </>
        )}
      </div>
      
      <div className="border-t pt-3">
        <div className="text-sm font-medium mb-2">Estimated Completion</div>
        {isLoading ? (
          <Skeleton className="h-7 w-36 mb-1" />
        ) : estimatedCompletionDate ? (
          <>
            <div className="text-xl font-bold text-primary">{estimatedCompletionDate}</div>
            <div className="text-xs text-gray-500">Based on your current reading pace</div>
          </>
        ) : (
          <div className="text-sm text-gray-500">
            Start reading consistently to see an estimate
          </div>
        )}
      </div>
    </div>
  );
}
