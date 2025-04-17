
// function to compare dates to be same day or not 
// and to check if the date is in the future



export const isToday = (date: Date) => {
    const today = new Date();
    const compareDate = new Date(date);
    return (
      compareDate.getDate() === today.getDate() &&
      compareDate.getMonth() === today.getMonth() &&
      compareDate.getFullYear() === today.getFullYear()
    );
  };

export const isSameDay = (date1?: Date, date2?: Date) => {
    if (!date1 || !date2) return false;
    
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};  