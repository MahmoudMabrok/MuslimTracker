import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  console.log("HomePage rendered");

  // Automatically redirect to the tracker page
  useEffect(() => {

    // Small timeout to allow the page to render
    const timeout = setTimeout(() => {
      navigate('/tracker');
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  );
}
