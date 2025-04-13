import { useMemo } from 'react';

interface DateDisplayProps {
  date?: Date;
}

export default function DateDisplay({ date = new Date() }: DateDisplayProps) {
  const formattedDate = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  }, [date]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{formattedDate}</h2>
        <span className="material-icons text-primary">calendar_today</span>
      </div>
    </div>
  );
}
