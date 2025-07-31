import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import { CycleTrendChart, FlowIntensityChart } from "../components/CycleChart";
import { format, subMonths, addDays } from "date-fns";

// Function to generate mock cycle history
const generateMockCycleHistory = (user) => {
  if (!user || !user.cycleDetails) {
    return [];
  }

  const { avgCycleLength, avgPeriodDuration } = user.cycleDetails;
  const history = [];

  for (let i = 0; i < 5; i++) {
    const startDate = subMonths(new Date(), i);
    const endDate = addDays(startDate, avgPeriodDuration - 1);
    history.push({
      id: i + 1,
      startDate: format(startDate, "MMM d, yyyy"),
      endDate: format(endDate, "MMM d, yyyy"),
      cycleLength: avgCycleLength + Math.floor(Math.random() * 3) - 1, // Add some variation
      periodLength: avgPeriodDuration + Math.floor(Math.random() * 2) - 1,
      status: "complete",
    });
  }

  return history;
};

function CycleHistoryPage() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  const cycleHistory = generateMockCycleHistory(user);

  const avgCycleLength = Math.round(
    cycleHistory.reduce((sum, cycle) => sum + cycle.cycleLength, 0) /
      cycleHistory.length
  );
  const avgPeriodLength = Math.round(
    cycleHistory.reduce((sum, cycle) => sum + cycle.periodLength, 0) /
      cycleHistory.length
  );

  const chartData = cycleHistory.reverse().map((cycle) => ({
    month: format(new Date(cycle.startDate), "MMM"),
    cycleLength: cycle.cycleLength,
    periodLength: cycle.periodLength,
  }));

  const flowData =
    user.dailyEntries?.map((entry) => ({
      day: format(new Date(entry.date), "d"),
      flow:
        entry.flowLevel === "light"
          ? 2
          : entry.flowLevel === "medium"
          ? 4
          : entry.flowLevel === "heavy"
          ? 6
          : 0,
    })) || [];

  return (
    <DashboardLayout activePage="cycle-history" title="Cycle History">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Cycle History"
          subtitle="View your cycle patterns and trends over time"
        />
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
            value={`±${
              Math.max(...chartData.map((d) => d.cycleLength)) -
              Math.min(...chartData.map((d) => d.cycleLength))
            }`}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <CycleTrendChart data={chartData} height={250} type="bar" />
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <FlowIntensityChart data={flowData} height={250} type="bar" />
          </div>
        </div>
        <div className="space-y-6 md:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                Recent Cycles
              </h3>
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
      </div>
    </DashboardLayout>
  );
}

export default CycleHistoryPage;
