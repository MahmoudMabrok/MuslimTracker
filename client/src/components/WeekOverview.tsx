
import { Skeleton } from '@/components/ui/skeleton';
import { useWeeklySummary, useCreateQuranEntry, useDeleteQuranEntry } from '@/hooks/useLocalStorage';
import { DailySummary, QuranEntry } from '@/types/schema';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isSameDay, isToday } from '@/utils/dates';

type WeekOverviewProps = {
  selectedDay: DailySummary | null;
  onDaySelect: (day: DailySummary | null) => void;
};

export default function WeekOverview({ selectedDay, onDaySelect }: WeekOverviewProps) {
  const { data: weekData = [], isLoading } = useWeeklySummary();

  const formatDayInfo = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = date.getDate();
    return { dayName, dayNumber };
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateCopy = new Date(date);
    dateCopy.setHours(0, 0, 0, 0);
    return dateCopy > today;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">date_range</span>
        Weekly Overview
      </h2>

      <div className="overflow-x-auto">
        <div className="inline-flex space-x-2 min-w-full pb-2">
          {isLoading ? (
            Array(7).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center min-w-[60px] p-2 border rounded">
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-4 w-8 mb-2" />
                <Skeleton className="w-8 h-8 rounded-full mb-1" />
                <Skeleton className="h-3 w-10 mb-1" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ))
          ) : (
            weekData.map((day, index) => {
              const dateObj = new Date(day.date);
              const { dayName, dayNumber } = formatDayInfo(dateObj);
              const future = isFutureDate(dateObj);
              const current = isToday(dateObj);
              const isSelected = isSameDay(selectedDay?.date, dateObj);
              return (
                <div 
                  key={index}
                  className={`flex flex-col items-center min-w-[60px] p-2 border rounded cursor-pointer
                    ${current ? 'bg-neutral-light font-bold' : ''}
                    ${future ? 'opacity-50' : ''}
                    ${isSelected ? 'ring-2 ring-primary' : ''}
                  `}
                  onClick={() => !future && onDaySelect(isSelected ? null : day)}
                >
                  <div className="text-xs text-gray-500">{dayName}</div>
                  <div className="text-sm font-bold">{dayNumber.toString().padStart(2, '0')}</div>

                  <div className="mt-2 flex flex-col items-center">
                    {future ? (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs mb-1">-</div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1 ${day.totalPages === 0 ? 'bg-red-500' : 'bg-secondary'}`}>
                        {day.totalPages}
                      </div>
                    )}
                    <div className="text-xs">pages</div>
                  </div>

                  <div className="mt-1">
                    {future ? (
                      <span className="material-icons text-gray-300 text-sm">radio_button_unchecked</span>
                    ) : day.fajrPrayed ? (
                      <span className="material-icons text-status-success text-sm">check_circle</span>
                    ) : (
                      <span className="material-icons text-status-error text-sm">cancel</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
