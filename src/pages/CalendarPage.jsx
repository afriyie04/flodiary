import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import CalendarGrid from "../components/CalendarGrid";
import CalendarLegend from "../components/CalendarLegend";

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Sample data for demonstration
  const periodDays = [1, 2, 3, 4, 5, 28, 29, 30, 31];
  const fertileDays = [12, 13, 16, 17];
  const ovulationDays = [14];
  const currentDay = 15;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log("Selected date:", date);
  };

  const handleDayClick = (day) => {
    console.log("Clicked day:", day);
  };

  return (
    <DashboardLayout activePage="calendar" title="Calendar">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Calendar"
          subtitle="Track your cycle and important dates"
        />

        {/* Enhanced Calendar */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-6">
          {/* Calendar Grid */}
          <div className="mb-6">
            <CalendarGrid
              periodDays={periodDays}
              fertileDays={fertileDays}
              ovulationDays={ovulationDays}
              currentDay={currentDay}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              onDayClick={handleDayClick}
              size="large"
              showNavigation={true}
            />
          </div>

          {/* Legend */}
          <div className="pt-6 border-t border-gray-200">
            <CalendarLegend size="large" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-red-100 hover:bg-red-200 rounded-xl p-4 text-left transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                🩸
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Log Period</h3>
                <p className="text-sm text-gray-600">Mark your period start</p>
              </div>
            </div>
          </button>

          <button className="bg-pink-100 hover:bg-pink-200 rounded-xl p-4 text-left transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center">
                💝
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Symptoms</h3>
                <p className="text-sm text-gray-600">Track how you feel</p>
              </div>
            </div>
          </button>

          <button className="bg-purple-100 hover:bg-purple-200 rounded-xl p-4 text-left transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                📝
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Note</h3>
                <p className="text-sm text-gray-600">Write a daily note</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CalendarPage;
