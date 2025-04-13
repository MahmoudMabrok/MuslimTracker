import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedEntryModal from './DetailedEntryModal';
import { useHistory } from '@/hooks/useLocalStorage';
import { HistoryEntry } from '@/types/schema';

export default function ReadingHistory() {
  const [timeFrame, setTimeFrame] = useState('thisWeek');
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: historyData = [], isLoading } = useHistory();

  // Format date for display
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter history based on selected time frame
  const getFilteredHistory = () => {
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    
    switch (timeFrame) {
      case 'thisWeek': {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Go to Sunday
        return historyData.filter(entry => 
          new Date(entry.date) >= startOfWeek
        );
      }
      case 'lastWeek': {
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
        return historyData.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startOfLastWeek && entryDate <= endOfLastWeek;
        });
      }
      case 'thisMonth': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return historyData.filter(entry => 
          new Date(entry.date) >= startOfMonth
        );
      }
      case 'lastMonth': {
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        return historyData.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate >= startOfLastMonth && entryDate <= endOfLastMonth;
        });
      }
      default:
        return historyData;
    }
  };

  const filteredHistory = getFilteredHistory();

  const openEntryDetails = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <span className="material-icons mr-2 text-primary">history</span>
            Reading History
          </h2>
          <div>
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="This Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-neutral-medium/50">
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fajr</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                // Skeleton loading state
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="py-2 px-3"><Skeleton className="h-4 w-24" /></td>
                    <td className="py-2 px-3"><Skeleton className="h-4 w-16" /></td>
                    <td className="py-2 px-3"><Skeleton className="h-4 w-4 rounded-full" /></td>
                    <td className="py-2 px-3 text-right"><Skeleton className="h-4 w-4 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((entry, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-neutral-medium/20 cursor-pointer"
                    onClick={() => openEntryDetails(entry)}
                  >
                    <td className="py-2 px-3 text-sm">{formatDate(entry.date as string)}</td>
                    <td className="py-2 px-3 text-sm">{entry.totalPages} pages</td>
                    <td className="py-2 px-3 text-sm">
                      {entry.fajrPrayed ? (
                        <span className="material-icons text-status-success text-sm">check_circle</span>
                      ) : (
                        <span className="material-icons text-status-error text-sm">cancel</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-sm text-right">
                      <button className="text-primary hover:text-primary/80">
                        <span className="material-icons text-sm">expand_more</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No history found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedEntry && (
        <DetailedEntryModal
          entry={selectedEntry}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
