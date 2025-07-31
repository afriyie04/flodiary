import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Badge } from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";

const CycleCalendar = ({
  periodDays = [],
  fertileDays = [],
  ovulationDays = [],
  currentDay = null,
  size = "default",
  selectedDate,
  setSelectedDate,
}) => {
  const getDayType = (date) => {
    if (!date) return "normal";
    const dayNumber = date.getDate();
    if (periodDays.includes(dayNumber)) return "period";
    if (fertileDays.includes(dayNumber)) return "fertile";
    if (ovulationDays.includes(dayNumber)) return "ovulation";
    if (dayNumber === currentDay) return "current";
    return "normal";
  };

  const largeDayStyles =
    size === "large"
      ? {
          width: 48,
          height: 48,
          fontSize: "1rem",
        }
      : {};

  const largeBadgeStyles =
    size === "large"
      ? {
          "& .MuiBadge-badge": {
            fontSize: "1.8rem",
          },
        }
      : {};

  const Day = (props) => {
    const dayType = getDayType(props.day);

    const badgeContent =
      dayType !== "normal" && dayType !== "current" ? "•" : undefined;

    const dayStyles = {
      period: {
        color: "red",
        fontWeight: "bold",
      },
      fertile: {
        color: "green",
        fontWeight: "bold",
      },
      ovulation: {
        color: "orange",
        fontWeight: "bold",
      },
      current: {
        border: "1px solid #1976d2",
      },
    };

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={badgeContent}
        sx={{
          ...largeBadgeStyles,
          "& .MuiBadge-badge": {
            ...(largeBadgeStyles["& .MuiBadge-badge"] || {}),
            color: dayStyles[dayType]?.color,
            backgroundColor: "transparent",
            height: "auto",
            minWidth: "auto",
          },
        }}
      >
        <PickersDay
          {...props}
          sx={{ ...dayStyles[dayType], ...largeDayStyles }}
        />
      </Badge>
    );
  };

  const largeCalendarStyles =
    size === "large"
      ? {
          width: "100%",
          maxHeight: "none",
          height: "100%",
          "& .MuiPickersCalendarHeader-label": {
            fontSize: "1.25rem",
          },
          "& .MuiDayCalendar-weekDayLabel": {
            fontSize: "1rem",
            width: 48,
            height: 48,
          },
        }
      : {};

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateCalendar
        value={selectedDate}
        onChange={setSelectedDate}
        slots={{ day: Day }}
        sx={largeCalendarStyles}
      />
    </LocalizationProvider>
  );
};

export default CycleCalendar;
