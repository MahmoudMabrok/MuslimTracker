import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { QuranEntry } from '@shared/schema';
import { useQuranEntries, useCreateQuranEntry, useDeleteQuranEntry } from '@/hooks/useLocalStorage';

const quranFormSchema = z.object({
  startPage: z.coerce.number().min(1).max(614),
  endPage: z.coerce.number().min(1).max(614)
}).refine(data => data.endPage >= data.startPage, {
  message: "End page must be greater than or equal to start page",
  path: ["endPage"],
});

type QuranFormValues = z.infer<typeof quranFormSchema>;

type QuranTrackerProps = {
  selectedDate?: Date;
};

export default function QuranTracker({ selectedDate }: QuranTrackerProps) {
  const { toast } = useToast();
  const [totalPages, setTotalPages] = useState(0);

  // Get entries for selected date from local storage
  const { data: entries = [], isLoading } = useQuranEntries(selectedDate || new Date());

  // Calculate total pages whenever entries change
  useEffect(() => {
    if (entries) {
      const total = entries.reduce((sum, entry) => 
        sum + (entry.endPage - entry.startPage + 1), 0
      );
      setTotalPages(total);
    }
  }, [entries]);

  // Form setup
  const form = useForm<QuranFormValues>({
    resolver: zodResolver(quranFormSchema),
    defaultValues: {
      startPage: 1,
      endPage: 1,
    },
  });

  // Add Quran entry mutation
  const addEntryMutation = useCreateQuranEntry();

  // Delete Quran entry mutation
  const deleteEntryMutation = useDeleteQuranEntry();

  // Form submission handler
  const onSubmit = (values: QuranFormValues) => {
    // Check for page overlap with existing entries
    const hasOverlap = entries?.some(entry => {
      return (
        (values.startPage >= entry.startPage && values.startPage <= entry.endPage) ||
        (values.endPage >= entry.startPage && values.endPage <= entry.endPage) ||
        (values.startPage <= entry.startPage && values.endPage >= entry.endPage)
      );
    });

    if (hasOverlap) {
      toast({
        variant: "destructive",
        title: "Invalid page range",
        description: "These pages overlap with an existing entry for today"
      });
      return;
    }

    addEntryMutation.mutate({
      ...values,
      date: selectedDate || new Date()
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">menu_book</span>
        Track Quran Reading
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <p className="block text-sm font-medium mb-1">Page Range (1-614)</p>
            <div className="flex space-x-2 items-center">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="startPage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs text-gray-500 mb-1">From</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={614} 
                          placeholder="1" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="endPage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs text-gray-500 mb-1">To</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={614} 
                          placeholder="3" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="bg-primary text-white p-2 rounded-md mt-5"
                disabled={addEntryMutation.isPending}
              >
                <span className="material-icons">add</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Today's Reading</h3>
          <span className="bg-secondary text-white px-2 py-1 rounded-md text-sm">
            {totalPages} pages
          </span>
        </div>

        {isLoading ? (
          <div className="py-4 text-center text-gray-500">Loading entries...</div>
        ) : entries && entries.length > 0 ? (
          <ul className="space-y-2 max-h-[200px] overflow-y-auto">
            {entries.map((entry) => {
              const pagesRead = entry.endPage - entry.startPage + 1;
              return (
                <li 
                  key={entry.id} 
                  className="flex justify-between items-center py-1 px-2 bg-neutral-medium/50 rounded"
                >
                  <span>Pages {entry.startPage}-{entry.endPage}</span>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {pagesRead} pages • {formatTime(entry.date.toString())}
                    </span>
                    <button 
                      className="text-status-error"
                      onClick={() => deleteEntryMutation.mutate(entry.id)}
                      disabled={deleteEntryMutation.isPending}
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-4 text-center text-gray-500">No entries recorded for today.</div>
        )}
      </div>
    </div>
  );
}