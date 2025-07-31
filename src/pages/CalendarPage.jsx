import React, { useState, useContext } from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import CycleCalendar from "../components/CycleCalendar";
import CalendarLegend from "../components/CalendarLegend";
import { AuthContext } from "../context/AuthContext";
import { calculateCycleData } from "../utils/cycleCalculations";

function CalendarPage() {
  const { user, loading } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (loading) {
    return (
      <DashboardLayout activePage="calendar" title="Calendar">
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout activePage="calendar" title="Calendar">
        <div>No user data available.</div>
      </DashboardLayout>
    );
  }

  const { periodDays, fertileDays, ovulationDay } = calculateCycleData(user);

  return (
    <DashboardLayout activePage="calendar" title="Calendar">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Calendar"
          subtitle="Track your cycle and important dates"
        />

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm mb-8">
          <div className="mb-8">
            <CycleCalendar
              periodDays={periodDays.map((d) => d.getDate())}
              fertileDays={fertileDays.map((d) => d.getDate())}
              ovulationDays={ovulationDay ? [ovulationDay.getDate()] : []}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              size="large"
              month={selectedDate.getMonth()}
              year={selectedDate.getFullYear()}
            />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <CalendarLegend size="large" />
          </div>
        </div>

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
