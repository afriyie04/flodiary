import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendar-styles.css";

function CalendarGrid({
  periodDays = [],
  fertileDays = [],
  ovulationDays = [],
  currentDay = null,
  onDayClick = null,
  size = "default",
  selectedDate = new Date(),
  onDateChange = null,
  showNavigation = true,
  view = "month",
}) {
  // Helper function to check if a date matches any of the cycle days
  const getDayType = (date) => {
    if (!date) return "normal";

    const dayNumber = date.getDate();

    if (periodDays.includes(dayNumber)) return "period";
    if (fertileDays.includes(dayNumber)) return "fertile";
    if (ovulationDays.includes(dayNumber)) return "ovulation";
    if (dayNumber === currentDay) return "current";
    return "normal";
  };

  // Custom tile content to show cycle indicators
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dayType = getDayType(date);
      if (dayType !== "normal") {
        return (
          <div className="flex justify-center mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                dayType === "period"
                  ? "bg-red-500"
                  : dayType === "fertile"
                  ? "bg-green-500"
                  : dayType === "ovulation"
                  ? "bg-yellow-500"
                  : "bg-purple-500"
              }`}
            />
          </div>
        );
      }
    }
    return null;
  };

  // Custom tile class names for styling
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dayType = getDayType(date);
      const baseClasses = "relative hover:bg-purple-50 transition-colors";

      switch (dayType) {
        case "period":
          return `${baseClasses} period-day`;
        case "fertile":
          return `${baseClasses} fertile-day`;
        case "ovulation":
          return `${baseClasses} ovulation-day`;
        case "current":
          return `${baseClasses} current-day bg-purple-100`;
        default:
          return baseClasses;
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    if (onDateChange) {
      onDateChange(date);
    }
    if (onDayClick) {
      onDayClick(date.getDate());
    }
  };

  return (
    <div
      className={`calendar-container ${
        size === "large" ? "calendar-large" : ""
      }`}
    >
      <Calendar
        onChange={handleDateClick}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={tileClassName}
        showNavigation={showNavigation}
        view={view}
        className="w-full"
        formatShortWeekday={(locale, date) =>
          new Intl.DateTimeFormat(locale, { weekday: "short" })
            .format(date)
            .slice(0, 1)
        }
      />
    </div>
  );
}

export default CalendarGrid;
