import { useQuery } from '@tanstack/react-query';

type Achievement = {
  id: number;
  type: string;
  value: number;
  achieved: boolean;
  achievedDate?: string;
  progress: number;
};

type AchievementsResponse = {
  earned: Achievement[];
  inProgress: Achievement[];
};

export function useAchievements() {
  const { 
    data,
    isLoading,
    isError,
    error
  } = useQuery<AchievementsResponse>({
    queryKey: ['/api/achievements'],
  });

  return {
    earnedAchievements: data?.earned || [],
    inProgressAchievements: data?.inProgress || [],
    isLoading,
    isError,
    error
  };
}
