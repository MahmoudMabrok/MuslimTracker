import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type FajrEntry = {
  id?: number;
  prayed: boolean;
  date: Date;
};

export default function FajrTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fajrPrayed, setFajrPrayed] = useState(false);

  // Query for today's Fajr status
  const { data: fajrEntry, isLoading } = useQuery<FajrEntry>({
    queryKey: ['/api/fajr-entries'],
  });

  // Update state when data is fetched
  useEffect(() => {
    if (fajrEntry) {
      setFajrPrayed(fajrEntry.prayed);
    }
  }, [fajrEntry]);

  // Toggle Fajr prayer status
  const fajrMutation = useMutation({
    mutationFn: (prayed: boolean) => 
      apiRequest('POST', '/api/fajr-entries', { prayed, date: new Date() })
        .then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fajr-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/streaks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      
      toast({
        title: "Success!",
        description: fajrPrayed 
          ? "Alhamdulillah! You've recorded your Fajr prayer." 
          : "Fajr prayer status updated.",
      });
    },
    onError: (error: Error) => {
      setFajrPrayed(!fajrPrayed); // Revert UI state on error
      toast({
        title: "Error",
        description: error.message || "Failed to update Fajr prayer status.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = (checked: boolean) => {
    setFajrPrayed(checked);
    fajrMutation.mutate(checked);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">wb_twilight</span>
        Fajr Prayer Tracking
      </h2>
      
      {isLoading ? (
        <div className="py-4 text-center text-gray-500">Loading Fajr status...</div>
      ) : (
        <div className="flex items-center space-x-3">
          <Switch
            id="fajr-prayer"
            checked={fajrPrayed}
            onCheckedChange={handleToggle}
            disabled={fajrMutation.isPending}
            className={fajrPrayed ? "bg-secondary" : ""}
          />
          <Label htmlFor="fajr-prayer" className="text-gray-700 font-medium">
            {fajrPrayed 
              ? "Alhamdulillah! You prayed Fajr today." 
              : "Did you pray Fajr today?"
            }
          </Label>
        </div>
      )}
    </div>
  );
}
