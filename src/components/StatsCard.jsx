import React from "react";

function StatsCard({ title, value, unit, bgColor = "bg-gray-100" }) {
  return (
    <div
      className={`${bgColor} rounded-xl md:rounded-2xl p-4 md:p-6 text-center`}
    >
      <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1 md:mb-2">
        {title}
      </h3>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <p className="text-xs md:text-sm text-gray-600">{unit}</p>
    </div>
  );
}

export default StatsCard;
