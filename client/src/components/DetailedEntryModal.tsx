import { useToast } from '@/hooks/use-toast';
import { useDeleteQuranEntry } from '@/hooks/useLocalStorage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type QuranEntry = {
  id: number;
  startPage: number;
  endPage: number;
  date: string;
};

type EntryDetails = {
  date: string;
  totalPages: number;
  entries: QuranEntry[];
  fajrPrayed: boolean;
};

interface DetailedEntryModalProps {
  entry: EntryDetails;
  isOpen: boolean;
  onClose: () => void;
}

export default function DetailedEntryModal({ 
  entry, 
  isOpen,
  onClose 
}: DetailedEntryModalProps) {
  const { toast } = useToast();

  // Format date for display
  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Delete entry mutation
  const deleteEntryMutation = useDeleteQuranEntry();

  if (!entry) return null;

  const handleDeleteEntry = (entryId: number) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntryMutation.mutate(entryId, {
        onSuccess: () => {
          toast({
            title: "Entry Deleted",
            description: "The reading entry has been removed.",
          });
          onClose();
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Entry Details</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
            <p className="text-lg">{formatDateTime(entry.date)}</p>
          </div>
          
          {entry.entries.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-500">Pages Read</h4>
              {entry.entries.map((reading, idx) => {
                const pagesRead = reading.endPage - reading.startPage + 1;
                return (
                  <div key={idx} className="flex justify-between items-center py-2 border-b">
                    <p>Pages {reading.startPage}-{reading.endPage} ({pagesRead} pages)</p>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">{formatTime(reading.date)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-status-error h-6 w-6 p-0"
                        onClick={() => handleDeleteEntry(reading.id)}
                        disabled={deleteEntryMutation.isPending}
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
              <p className="mt-2 text-right font-medium">Total: {entry.totalPages} pages</p>
            </div>
          )}
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500">Fajr Prayer</h4>
            <p className="text-lg flex items-center">
              {entry.fajrPrayed ? (
                <>
                  <span className="material-icons text-status-success mr-1">check_circle</span>
                  Completed
                </>
              ) : (
                <>
                  <span className="material-icons text-status-error mr-1">cancel</span>
                  Not completed
                </>
              )}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
