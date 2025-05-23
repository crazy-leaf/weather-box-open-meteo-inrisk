import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Utility function to combine class names
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Button variants utility
const buttonVariants = ({ variant = "default" } = {}) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  
  return `${base} ${variants[variant] || variants.default}`;
};

// Simplified DayPicker-like component for demonstration
const SimpleDayPicker = ({ 
  showOutsideDays = true, 
  className, 
  classNames = {}, 
  components = {},
  selected,
  onSelect,
  ...props 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Days of week
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Generate calendar days
  const days = [];
  
  // Previous month days (outside days)
  if (showOutsideDays) {
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isOutside: true,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i)
      });
    }
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push({
      day,
      isOutside: false,
      isCurrentMonth: true,
      isToday: date.toDateString() === today.toDateString(),
      isSelected: selected && date.toDateString() === selected.toDateString(),
      date
    });
  }
  
  // Next month days (outside days)
  if (showOutsideDays) {
    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextDay = 1;
    for (let i = days.length; i < totalCells; i++) {
      days.push({
        day: nextDay,
        isOutside: true,
        isCurrentMonth: false,
        date: new Date(year, month + 1, nextDay)
      });
      nextDay++;
    }
  }
  
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };
  
  const handleDayClick = (dayInfo) => {
    if (!dayInfo.isOutside && onSelect) {
      onSelect(dayInfo.date);
    }
  };
  
  const IconLeft = components.IconLeft || (() => <ChevronLeft className="h-4 w-4" />);
  const IconRight = components.IconRight || (() => <ChevronRight className="h-4 w-4" />);
  
  return (
    <div className={cn("p-3", className)}>
      <div className={classNames.months || "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0"}>
        <div className={classNames.month || "space-y-4"}>
          {/* Caption */}
          <div className={classNames.caption || "flex justify-center pt-1 relative items-center"}>
            <div className={classNames.nav || "space-x-1 flex items-center"}>
              <button
                onClick={() => navigateMonth(-1)}
                className={cn(
                  classNames.nav_button || buttonVariants({ variant: "outline" }) + " h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  classNames.nav_button_previous || "absolute left-1"
                )}
              >
                <IconLeft />
              </button>
              <div className={classNames.caption_label || "text-sm font-medium"}>
                {monthNames[month]} {year}
              </div>
              <button
                onClick={() => navigateMonth(1)}
                className={cn(
                  classNames.nav_button || buttonVariants({ variant: "outline" }) + " h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                  classNames.nav_button_next || "absolute right-1"
                )}
              >
                <IconRight />
              </button>
            </div>
          </div>
          
          {/* Calendar Table */}
          <table className={classNames.table || "w-full border-collapse space-y-1"}>
            <thead>
              <tr className={classNames.head_row || "flex"}>
                {daysOfWeek.map(day => (
                  <th 
                    key={day}
                    className={classNames.head_cell || "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]"}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(days.length / 7) }, (_, weekIndex) => (
                <tr key={weekIndex} className={classNames.row || "flex w-full mt-2"}>
                  {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayInfo, dayIndex) => (
                    <td 
                      key={`${weekIndex}-${dayIndex}`}
                      className={classNames.cell || "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20"}
                    >
                      <button
                        onClick={() => handleDayClick(dayInfo)}
                        className={cn(
                          classNames.day || buttonVariants({ variant: "ghost" }) + " h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                          dayInfo.isSelected && (classNames.day_selected || "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"),
                          dayInfo.isToday && (classNames.day_today || "bg-accent text-accent-foreground"),
                          dayInfo.isOutside && (classNames.day_outside || "text-muted-foreground opacity-50")
                        )}
                      >
                        {dayInfo.day}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Main Calendar component
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <SimpleDayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 focus:bg-slate-900 focus:text-slate-50",
        day_today: "bg-slate-100 text-slate-900",
        day_outside:
          "day-outside text-slate-500 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30",
        day_disabled: "text-slate-500 opacity-50",
        day_range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";
export {Calendar}
