import React from "react";

function CalendarLegend({ size = "default" }) {
  const legendItems = [
    { color: "bg-red-300", label: "Period" },
    { color: "bg-green-300", label: "Fertile" },
    { color: "bg-yellow-400", label: "Ovulation" },
  ];

  const iconSize = size === "large" ? "w-3 h-3" : "w-2 h-2 md:w-3 md:h-3";
  const spacing =
    size === "large" ? "space-x-6 md:space-x-8" : "space-x-3 md:space-x-6";
  const textSize = size === "large" ? "text-sm" : "text-xs md:text-sm";
  const marginClass = size === "large" ? "mr-2" : "mr-1 md:mr-2";

  return (
    <div className={`flex justify-center ${spacing} ${textSize}`}>
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center">
          <div
            className={`${iconSize} ${item.color} rounded-full ${marginClass}`}
          ></div>
          <span className="text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default CalendarLegend;
