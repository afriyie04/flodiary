"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import {
  Heart,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  Activity,
  Target,
  Users,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  Download,
  Filter,
  Search,
  Plus,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
  Zap,
  Droplets,
  Thermometer,
  Moon,
  Sun,
} from "lucide-react";
import { format, subMonths, addDays, subDays, parseISO } from "date-fns";
import PeriodEntryPopover from "@/components/PeriodEntryPopover";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function CycleHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("18months");
  const [selectedView, setSelectedView] = useState("overview");
  const [cycleHistory, setCycleHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchCycleData();
  }, [user, router]);

  const fetchCycleData = async () => {
    try {
      setLoading(true);

      // Fetch user's cycles
      const response = await apiService.getCycles();
      const cycles = response.cycles || [];

      // Transform cycles to match the UI format
      const transformedCycles = cycles.map((cycle, index) => ({
        id: cycle._id || index + 1,
        startDate: cycle.startDate ? parseISO(cycle.startDate) : null,
        endDate: cycle.endDate ? parseISO(cycle.endDate) : null,
        cycleLength: cycle.cycleLength,
        periodLength: cycle.periodLength,
        status: "complete",
        flowIntensity: cycle.flowIntensity || "medium",
        symptoms: cycle.symptoms || [],
        mood: cycle.mood || "neutral",
        energy: cycle.energy || 50,
        sleep: cycle.sleep || 7,
        stress: cycle.stress || 50,
        periodStartDate: cycle.startDate ? parseISO(cycle.startDate) : null,
        periodEndDate: cycle.endDate ? parseISO(cycle.endDate) : null,
      }));

      setCycleHistory(transformedCycles);

      // Fetch stats
      const statsResponse = await apiService.getCycleStats();
      setStats(statsResponse);
    } catch (error) {
      console.error("Error fetching cycle data:", error);
      toast.error("Failed to load cycle history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (cycleHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No cycle data yet
        </h3>
        <p className="text-gray-500 text-center mb-6">
          Start tracking your cycles to see your history and patterns
        </p>
        <PeriodEntryPopover
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Period
            </Button>
          }
          onSave={fetchCycleData}
        />
      </div>
    );
  }

  const avgCycleLength =
    stats?.averageCycleLength ||
    Math.round(
      cycleHistory.reduce((sum, cycle) => sum + cycle.cycleLength, 0) /
        cycleHistory.length
    );
  const avgPeriodLength =
    stats?.averagePeriodLength ||
    Math.round(
      cycleHistory.reduce((sum, cycle) => sum + cycle.periodLength, 0) /
        cycleHistory.length
    );
  const cycleVariation =
    cycleHistory.length > 0
      ? Math.max(...cycleHistory.map((d) => d.cycleLength)) -
        Math.min(...cycleHistory.map((d) => d.cycleLength))
      : 0;

  // Chart data for Recharts
  const cycleTrendData = cycleHistory;


  const flowIntensityData = cycleHistory
    .slice(0, 8)
    .reverse()
    .map((cycle) => ({
      month: format(cycle.startDate, "MMM"),
      light: cycle.flowIntensity === "light" ? 1 : 0,
      medium: cycle.flowIntensity === "medium" ? 1 : 0,
      heavy: cycle.flowIntensity === "heavy" ? 1 : 0,
    }));

  const moodData = cycleHistory
    .slice(0, 6)
    .reverse()
    .map((cycle) => ({
      month: format(cycle.startDate, "MMM"),
      mood: cycle.mood,
      energy: cycle.energy,
    }));

  const getFlowIntensityColor = (intensity) => {
    switch (intensity) {
      case "light":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "medium":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "heavy":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTrendIcon = (current, previous) => {
    if (current > previous)
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (current < previous)
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

  return (
    <>
      <Toaster />
      <div className="space-y-6 p-6 mx-auto w-full max-w-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cycle History</h1>
            <p className="text-gray-600 mt-1">
              View your cycle patterns and trends over time
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    AVG CYCLE LENGTH
                  </p>
                  <p className="text-3xl font-bold">{avgCycleLength}</p>
                  <p className="text-purple-100 text-sm">days</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">
                    AVG PERIOD LENGTH
                  </p>
                  <p className="text-3xl font-bold">{avgPeriodLength}</p>
                  <p className="text-pink-100 text-sm">days</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    CYCLE VARIATION
                  </p>
                  <p className="text-3xl font-bold">±{cycleVariation}</p>
                  <p className="text-blue-100 text-sm">days</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    TOTAL CYCLES
                  </p>
                  <p className="text-3xl font-bold">{cycleHistory.length}</p>
                  <p className="text-green-100 text-sm">tracked</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cycle Length Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Cycle Length Trends
              </CardTitle>
              <CardDescription>
                Your cycle length variations over the past 12 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cycleTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[20, 35]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="cycleLength"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Period Length Trends */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-pink-600" />
                Period Length Trends
              </CardTitle>
              <CardDescription>Your period duration over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cycleTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar
                    dataKey="periodLength"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Cycle History Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Recent Cycles
                </CardTitle>
                <CardDescription>
                  Detailed view of your cycle history
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Period Start
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Period End
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Cycle Length
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Period Length
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cycleHistory.map((cycle, index) => (
                    <tr
                      key={cycle.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-gray-900 font-medium">
                        {format(cycle.startDate, "MMM d, yyyy")}
                      </td>
                      <td className="py-4 px-4 text-gray-900">
                        {format(cycle.endDate, "MMM d, yyyy")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {cycle.cycleLength} days
                          </span>
                          {index > 0 &&
                            getTrendIcon(
                              cycle.cycleLength,
                              cycleHistory[index - 1].cycleLength
                            )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {cycle.periodLength} days
                          </span>
                          {index > 0 &&
                            getTrendIcon(
                              cycle.periodLength,
                              cycleHistory[index - 1].periodLength
                            )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {cycle.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Cycle Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Most common cycle length</span>
              </div>
              <span className="font-semibold text-green-600">{avgCycleLength} days</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Cycle regularity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-600">
                  {cycleVariation <= 2 ? 'Very Regular' : cycleVariation <= 5 ? 'Regular' : 'Irregular'}
                </span>
              </div>
            </div>
            {stats && (
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">Total cycles tracked</span>
                </div>
                <span className="font-semibold text-purple-600">{cycleHistory.length}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
