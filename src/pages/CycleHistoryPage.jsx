import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import { CycleTrendChart, FlowIntensityChart } from "../components/CycleChart";

function CycleHistoryPage() {
  const cycleHistory = [
    {
      id: 1,
      startDate: "May 1, 2025",
      endDate: "May 5, 2025",
      cycleLength: 28,
      periodLength: 5,
      status: "complete",
    },
    {
      id: 2,
      startDate: "Apr 3, 2025",
      endDate: "Apr 7, 2025",
      cycleLength: 30,
      periodLength: 4,
      status: "complete",
    },
    {
      id: 3,
      startDate: "Mar 6, 2025",
      endDate: "Mar 11, 2025",
      cycleLength: 27,
      periodLength: 6,
      status: "complete",
    },
    {
      id: 4,
      startDate: "Feb 8, 2025",
      endDate: "Feb 12, 2025",
      cycleLength: 29,
      periodLength: 5,
      status: "complete",
    },
    {
      id: 5,
      startDate: "Jan 10, 2025",
      endDate: "Jan 14, 2025",
      cycleLength: 28,
      periodLength: 4,
      status: "complete",
    },
  ];

  const avgCycleLength = Math.round(
    cycleHistory.reduce((sum, cycle) => sum + cycle.cycleLength, 0) /
      cycleHistory.length
  );
  const avgPeriodLength = Math.round(
    cycleHistory.reduce((sum, cycle) => sum + cycle.periodLength, 0) /
      cycleHistory.length
  );

  // Chart data from cycle history
  const chartData = cycleHistory.reverse().map((cycle, index) => ({
    month: `Cycle ${index + 1}`,
    cycleLength: cycle.cycleLength,
    periodLength: cycle.periodLength,
  }));

  const flowData = [
    { day: "Day 1", flow: 4 },
    { day: "Day 2", flow: 5 },
    { day: "Day 3", flow: 4 },
    { day: "Day 4", flow: 3 },
    { day: "Day 5", flow: 2 },
  ];

  return (
    <DashboardLayout activePage="cycle-history" title="Cycle History">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Cycle History"
          subtitle="View your cycle patterns and trends over time"
        />

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatsCard
            title="AVG CYCLE LENGTH"
            value={avgCycleLength}
            unit="days"
            bgColor="bg-purple-100"
          />
          <StatsCard
            title="AVG PERIOD LENGTH"
            value={avgPeriodLength}
            unit="days"
            bgColor="bg-pink-100"
          />
          <StatsCard
            title="CYCLE VARIATION"
            value="±2"
            unit="days"
            bgColor="bg-blue-100"
          />
          <StatsCard
            title="TOTAL CYCLES"
            value={cycleHistory.length}
            unit="tracked"
            bgColor="bg-green-100"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <CycleTrendChart data={chartData} height={250} type="bar" />
          </div>

          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <FlowIntensityChart data={flowData} height={250} type="bar" />
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Cycle History Table */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                Recent Cycles
              </h3>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-xs md:text-sm font-medium text-gray-500 pb-3">
                      Period Start
                    </th>
                    <th className="text-left text-xs md:text-sm font-medium text-gray-500 pb-3">
                      Period End
                    </th>
                    <th className="text-left text-xs md:text-sm font-medium text-gray-500 pb-3">
                      Cycle Length
                    </th>
                    <th className="text-left text-xs md:text-sm font-medium text-gray-500 pb-3">
                      Period Length
                    </th>
                    <th className="text-left text-xs md:text-sm font-medium text-gray-500 pb-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cycleHistory.map((cycle) => (
                    <tr
                      key={cycle.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 text-xs md:text-sm text-gray-900">
                        {cycle.startDate}
                      </td>
                      <td className="py-3 text-xs md:text-sm text-gray-900">
                        {cycle.endDate}
                      </td>
                      <td className="py-3 text-xs md:text-sm text-gray-900">
                        {cycle.cycleLength} days
                      </td>
                      <td className="py-3 text-xs md:text-sm text-gray-900">
                        {cycle.periodLength} days
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {cycle.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Export Data
          </button>
          <button className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CycleHistoryPage;
