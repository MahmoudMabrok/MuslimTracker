import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useFajrEntry, useCreateFajrEntry } from '@/hooks/useLocalStorage';
import { FajrEntry } from '@/types/schema';

export default function FajrTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fajrPrayed, setFajrPrayed] = useState(false);

  // Query for today's Fajr status
  const { data: fajrEntry, isLoading } = useFajrEntry();

  // Update state when data is fetched
  useEffect(() => {
    if (fajrEntry) {
      setFajrPrayed(fajrEntry.prayed);
    }
  }, [fajrEntry]);

  // Toggle Fajr prayer status
  const fajrMutation = useCreateFajrEntry();

  const handleToggle = (checked: boolean) => {
    setFajrPrayed(checked);
    fajrMutation.mutate({ prayed: checked });
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
