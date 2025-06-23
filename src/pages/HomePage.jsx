import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import CalendarGrid from "../components/CalendarGrid";
import CalendarLegend from "../components/CalendarLegend";
import { CycleTrendChart, SymptomsChart } from "../components/CycleChart";

function HomePage() {
  // Calendar data for June 2025
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const periodDays = [1, 2, 3, 4, 5];
  const fertileDays = [12, 13, 16, 17];
  const ovulationDays = [14];
  const currentDay = 15;

  // Cycle trends data
  const cycleData = [
    { month: "Jan", cycleLength: 28, periodLength: 5 },
    { month: "Feb", cycleLength: 30, periodLength: 4 },
    { month: "Mar", cycleLength: 27, periodLength: 6 },
    { month: "Apr", cycleLength: 29, periodLength: 5 },
    { month: "May", cycleLength: 28, periodLength: 4 },
    { month: "Jun", cycleLength: 28, periodLength: 5 },
  ];

  // Symptoms data for pie chart
  const symptomsData = [
    { name: "Cramps", value: 65, color: "#ef4444" },
    { name: "Mood Swings", value: 45, color: "#f59e0b" },
    { name: "Bloating", value: 55, color: "#8b5cf6" },
    { name: "Headache", value: 30, color: "#ec4899" },
    { name: "Fatigue", value: 70, color: "#06b6d4" },
  ];

  return (
    <DashboardLayout activePage="dashboard" title="Dashboard">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader
          title="Dashboard"
          subtitle={
            <>
              <span className="text-xl md:text-2xl font-semibold text-gray-800 block mb-2">
                Welcome back, Akua! 👋
              </span>
              Track your cycle and stay in tune with your body
            </>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatsCard
            title="CURRENT DAY"
            value="15"
            unit="of cycle"
            bgColor="bg-yellow-100"
          />
          <StatsCard
            title="NEXT PERIOD"
            value="12"
            unit="days away"
            bgColor="bg-green-100"
          />
          <StatsCard
            title="CYCLE LENGTH"
            value="28"
            unit="days average"
            bgColor="bg-pink-100"
          />
          <StatsCard
            title="PERIOD LENGTH"
            value="5"
            unit="days average"
            bgColor="bg-blue-100"
          />
        </div>

        <div className="space-y-6 md:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Cycle Calendar */}
          <div className="bg-white rounded-xl md:rounded-2xl p-2 md:p-8 shadow-sm">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
              Cycle Calendar
            </h3>

            <div className="mb-4 md:mb-6">
              <CalendarGrid
                days={calendarDays}
                periodDays={periodDays}
                fertileDays={fertileDays}
                ovulationDays={ovulationDays}
                currentDay={currentDay}
              />
            </div>

            <CalendarLegend />
          </div>

          {/* Cycle Trends */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <CycleTrendChart data={cycleData} height={500} type="bar" />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-6 md:mt-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
            Analytics Overview
          </h3>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <SymptomsChart data={symptomsData} height={300} />
          </div>
        </div>

        {/* This Month's Insights */}
        <div className="mt-6 md:mt-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
            This Month's Insights
          </h3>

          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
            <div className="bg-pink-100 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-200 rounded-full flex items-center justify-center text-lg md:text-xl">
                🌸
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  Cycle Regularity
                </h4>
                <p className="text-gray-700 text-xs md:text-sm">
                  Your cycles have been consistent this month
                </p>
              </div>
            </div>

            <div className="bg-pink-100 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-200 rounded-full flex items-center justify-center text-lg md:text-xl">
                🌀
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  Fertile Window
                </h4>
                <p className="text-gray-700 text-xs md:text-sm">
                  Peak fertility predicted in 3 days
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default HomePage;
