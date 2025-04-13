import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [_, setLocation] = useLocation();

  // Automatically redirect to the tracker page
  useEffect(() => {
    // Small timeout to allow the page to render
    const timeout = setTimeout(() => {
      setLocation('/tracker');
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  );
}
