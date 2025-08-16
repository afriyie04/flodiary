"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Calendar as CalendarIcon,
  Heart,
  Activity,
  TrendingUp,
  Clock,
  Plus,
  Droplets,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  differenceInDays,
  parseISO,
} from "date-fns";
import PeriodEntryPopover from "@/components/PeriodEntryPopover";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useSetupCheck } from "@/hooks/useSetupCheck";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { checkForSetupRedirect } = useSetupCheck();
  const [date, setDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [cycles, setCycles] = useState([]);
  const [stats, setStats] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchUserData();
  }, [user, router]);


  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user's cycles
      const cyclesResponse = await apiService.getCycles();
      const cyclesData = cyclesResponse.cycles || [];
      
      // Check if user needs to complete setup
      if (checkForSetupRedirect(cyclesData)) {
        return;
      }
      
      setCycles(cyclesData);

      // Fetch cycle statistics
      const statsResponse = await apiService.getCycleStats();
      setStats(statsResponse);

      // Get predictions if we have enough cycles
      if (cyclesData && cyclesData.length >= 3) {
        const predictionResponse = await apiService.predictCycle(cyclesData);
        setPrediction(predictionResponse);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load your cycle data");
    } finally {
      setLoading(false);
    }
  };

  const refreshPredictions = async () => {
    setRefreshing(true);
    try {
      if (cycles.length >= 3) {
        const predictionResponse = await apiService.predictCycle(cycles);
        setPrediction(predictionResponse);
        toast.success("Predictions updated!");
      }
    } catch (error) {
      toast.error("Failed to refresh predictions");
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate current cycle data
  const getCurrentCycleInfo = () => {
    if (!cycles || cycles.length === 0) {
      return {
        currentDay: 0,
        cycleLength: 28,
        periodLength: 5,
        daysUntilNextPeriod: 0,
        lastPeriodStart: null,
        nextPeriodStart: null,
        isOnPeriod: false,
        isOvulating: false,
      };
    }

    const lastCycle = cycles[cycles.length - 1];
    if (!lastCycle.startDate) {
      return {
        currentDay: 0,
        cycleLength: 28,
        periodLength: 5,
        daysUntilNextPeriod: 0,
        lastPeriodStart: null,
        nextPeriodStart: null,
        isOnPeriod: false,
        isOvulating: false,
      };
    }

    const lastPeriodStart = parseISO(lastCycle.startDate);
    const daysSinceLastPeriod = differenceInDays(new Date(), lastPeriodStart);

    // Use prediction if available, otherwise use average cycle length
    const avgCycleLength = stats?.avgCycleLength || 28;
    const nextPeriodStart = prediction?.nextPeriod?.start
      ? parseISO(prediction.nextPeriod.start)
      : addDays(lastPeriodStart, avgCycleLength);

    const daysUntilNextPeriod = differenceInDays(nextPeriodStart, new Date());
    const isOnPeriod = daysSinceLastPeriod < (stats?.avgPeriodLength || 5);
    const ovulationDay = Math.floor(avgCycleLength / 2);
    const isOvulating = Math.abs(daysSinceLastPeriod - ovulationDay) <= 2;

    return {
      currentDay: daysSinceLastPeriod,
      cycleLength: avgCycleLength,
      periodLength: stats?.avgPeriodLength || 5,
      daysUntilNextPeriod: Math.max(0, daysUntilNextPeriod),
      lastPeriodStart,
      nextPeriodStart,
      isOnPeriod,
      isOvulating,
    };
  };

  const cycleData = getCurrentCycleInfo();

  // Prepare chart data from cycles
  const chartData = cycles
    .slice(-6)
    .filter((cycle) => cycle.startDate) // Filter out cycles without start date
    .map((cycle, index) => ({
      month: format(parseISO(cycle.startDate), "MMM"),
      cycleLength: cycle.cycleLength,
      periodLength: cycle.periodLength,
    }));

  // Simplified flow data based on period length
  const flowData = cycles
    .slice(-5)
    .filter((cycle) => cycle.startDate)
    .map((cycle) => ({
      name: format(parseISO(cycle.startDate), "MMM"),
      periodLength: cycle.periodLength || 0,
    }));

  // Calendar functions
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayClass = (day) => {
    if (!isSameMonth(day, currentMonth)) return "text-gray-300";
    if (isToday(day)) return "bg-purple-100 text-purple-900 font-bold";

    // Mark period days
    for (const cycle of cycles) {
      if (cycle.startDate && cycle.endDate) {
        try {
          const periodStart = parseISO(cycle.startDate);
          const periodEnd = parseISO(cycle.endDate);
          const daysInPeriod = eachDayOfInterval({
            start: periodStart,
            end: periodEnd,
          });
          if (daysInPeriod.some((d) => isSameDay(d, day))) {
            return "bg-pink-100 text-pink-900";
          }
        } catch (error) {
          console.warn("Invalid date in cycle:", cycle);
          continue;
        }
      }
    }

    // Mark predicted period
    if (prediction?.nextPeriod?.start) {
      try {
        const predictedStart = parseISO(prediction.nextPeriod.start);
        const predictedEnd = addDays(
          predictedStart,
          cycleData.periodLength - 1
        );
        const predictedDays = eachDayOfInterval({
          start: predictedStart,
          end: predictedEnd,
        });
        if (predictedDays.some((d) => isSameDay(d, day))) {
          return "bg-purple-50 text-purple-700 border-2 border-dashed border-purple-300";
        }
      } catch (error) {
        console.warn("Invalid prediction date:", prediction.nextPeriod.start);
      }
    }

    return "hover:bg-gray-50";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.firstName}!
            </h2>
            <p className="text-muted-foreground">
              Here's your cycle overview and predictions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPredictions}
              disabled={refreshing || cycles.length < 3}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh Predictions
            </Button>
            <PeriodEntryPopover
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Period
                </Button>
              }
              onSave={fetchUserData}
            />
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cycle Day</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Day {cycleData.currentDay}
              </div>
              <p className="text-xs text-muted-foreground">
                of {cycleData.cycleLength} day cycle
              </p>
              <Progress
                value={(cycleData.currentDay / cycleData.cycleLength) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Period</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cycleData.daysUntilNextPeriod} days
              </div>
              <p className="text-xs text-muted-foreground">
                {cycleData.nextPeriodStart
                  ? format(cycleData.nextPeriodStart, "MMM dd, yyyy")
                  : "Calculating..."}
              </p>
              {prediction?.confidence && (
                <Badge className="mt-2 bg-purple-100 text-purple-800">
                  {Math.round(prediction.confidence * 100)}% confidence
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Status
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {cycleData.isOnPeriod ? (
                <>
                  <div className="text-2xl font-bold">On Period</div>
                  <Badge className="mt-2 bg-pink-100 text-pink-800">
                    <Droplets className="h-3 w-3 mr-1" />
                    Active Period
                  </Badge>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">Regular Cycle</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    <Activity className="h-3 w-3 mr-1" />
                    Tracking Phase
                  </Badge>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Cycle
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.avgCycleLength || 28} days
              </div>
              <p className="text-xs text-muted-foreground">
                ±{stats?.stdDeviation || 2} days variation
              </p>
              {prediction?.model && (
                <Badge className="mt-2 bg-purple-100 text-purple-800">
                  Linear Regression
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar and Charts */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Calendar */}
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Calendar</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {format(currentMonth, "MMMM yyyy")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-xs font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
                {days.map((day, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors ${getDayClass(
                      day
                    )}`}
                    onClick={() => setDate(day)}
                  >
                    {format(day, "d")}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 bg-pink-100 rounded mr-2" />
                  <span>Period Days</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 bg-purple-50 border-2 border-dashed border-purple-300 rounded mr-2" />
                  <span>Predicted Period</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 bg-purple-100 rounded mr-2" />
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cycle Length Chart */}
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Cycle History</CardTitle>
              <CardDescription>
                Your cycle and period lengths over the last {chartData.length}{" "}
                months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cycleLength"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      name="Cycle Length"
                    />
                    <Line
                      type="monotone"
                      dataKey="periodLength"
                      stroke="#EC4899"
                      strokeWidth={2}
                      name="Period Length"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No cycle data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* Period Length Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Period Length Trend</CardTitle>
              <CardDescription>Last 5 cycles</CardDescription>
            </CardHeader>
            <CardContent>
              {flowData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={flowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="periodLength" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-gray-500">
                  No period data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cycle Regularity */}
          <Card>
            <CardHeader>
              <CardTitle>Cycle Regularity</CardTitle>
              <CardDescription>Your cycle consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Length</span>
                  <span className="font-semibold">{stats?.avgCycleLength || 28} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Variation</span>
                  <span className="font-semibold">
                    {stats?.maxCycleLength && stats?.minCycleLength 
                      ? `±${stats.maxCycleLength - stats.minCycleLength} days`
                      : "±2 days"
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Regularity</span>
                  <Badge className="bg-green-100 text-green-800">
                    {stats?.totalCycles >= 3 ? "Regular" : "Building Pattern"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Details */}
        {prediction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                Linear Regression Predictions
              </CardTitle>
              <CardDescription>
                Based on your {cycles.length} logged cycles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="font-semibold mb-2">Next Period</h4>
                  <p className="text-sm text-gray-600">
                    Start:{" "}
                    {prediction.nextPeriod?.start
                      ? format(
                          parseISO(prediction.nextPeriod.start),
                          "MMM dd, yyyy"
                        )
                      : "Calculating..."}
                  </p>
                  <p className="text-sm text-gray-600">
                    End:{" "}
                    {prediction.nextPeriod?.end
                      ? format(
                          parseISO(prediction.nextPeriod.end),
                          "MMM dd, yyyy"
                        )
                      : "Calculating..."}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Model Accuracy</h4>
                  <p className="text-sm text-gray-600">
                    R² Score: {prediction.model?.r2Score?.toFixed(3) || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    MAE: {prediction.model?.mae?.toFixed(1) || "N/A"} days
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Prediction Quality</h4>
                  <p className="text-sm text-gray-600">
                    Confidence: {Math.round((prediction.confidence || 0) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Based on {cycles.length} cycles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
