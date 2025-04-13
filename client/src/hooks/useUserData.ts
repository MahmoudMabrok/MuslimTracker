import { useQuery } from '@tanstack/react-query';

type User = {
  id: number;
  username: string;
};

export function useUserData() {
  const { 
    data: user,
    isLoading,
    isError,
    error
  } = useQuery<User>({
    queryKey: ['/api/user'],
  });

  return {
    user,
    isLoading,
    isError,
    error
  };
}
