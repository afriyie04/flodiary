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
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import {
  Calendar as CalendarIcon,
  Heart,
  Droplets,
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
  Target,
  Zap,
  Moon,
  Sun,
  Activity,
  Bell,
  Settings,
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addDays,
  subDays,
  isToday,
  isSameMonth,
  getDay,
  startOfWeek,
  endOfWeek,
  parseISO,
  differenceInDays,
} from "date-fns";
import PeriodEntryPopover from "@/components/PeriodEntryPopover";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useSetupCheck } from "@/hooks/useSetupCheck";

export default function CalendarPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { checkForSetupRedirect } = useSetupCheck();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week, year
  const [loading, setLoading] = useState(true);
  const [cycles, setCycles] = useState([]);
  const [stats, setStats] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [cycleData, setCycleData] = useState({
    currentDay: 0,
    cycleLength: 28,
    periodLength: 5,
    lastPeriodStart: new Date(),
    nextPeriodStart: addDays(new Date(), 28),
    isOnPeriod: false,
    isOvulating: false,
  });

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
      const userCycles = cyclesResponse.cycles || [];

      // Check if user needs to complete setup
      if (checkForSetupRedirect(userCycles)) {
        return;
      }

      setCycles(userCycles);

      // Fetch cycle statistics
      const statsResponse = await apiService.getCycleStats();
      setStats(statsResponse);

      // Get predictions if we have enough cycles (changed from 3 to 1 based on model requirements)
      if (userCycles.length >= 1) {
        const predictionResponse = await apiService.predictCycle(userCycles);
        setPrediction(predictionResponse);
      }

      // Calculate current cycle data
      if (userCycles.length > 0) {
        const lastCycle = userCycles[userCycles.length - 1];
        if (lastCycle.startDate) {
          const lastPeriodStart = parseISO(lastCycle.startDate);
          const daysSinceLastPeriod = differenceInDays(
            new Date(),
            lastPeriodStart
          );
          const avgCycleLength = statsResponse?.averageCycleLength || 28;
          const avgPeriodLength = statsResponse?.averagePeriodLength || 5;
          const nextPeriodStart = predictionResponse?.nextPeriod?.start
            ? parseISO(predictionResponse.nextPeriod.start)
            : addDays(lastPeriodStart, avgCycleLength);

          const isOnPeriod = daysSinceLastPeriod < avgPeriodLength;
          const ovulationDay = Math.floor(avgCycleLength / 2);
          const isOvulating = Math.abs(daysSinceLastPeriod - ovulationDay) <= 2;

          setCycleData({
            currentDay: daysSinceLastPeriod,
            cycleLength: avgCycleLength,
            periodLength: avgPeriodLength,
            lastPeriodStart,
            nextPeriodStart,
            isOnPeriod,
            isOvulating,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load calendar data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate period days for the current month including historical and predicted
  const getPeriodDays = () => {
    const periodDays = [];

    // Add historical period days from cycles
    cycles.forEach((cycle) => {
      if (cycle.startDate && cycle.endDate) {
        try {
          const periodStart = parseISO(cycle.startDate);
          const periodEnd = parseISO(cycle.endDate);
          const daysInPeriod = eachDayOfInterval({
            start: periodStart,
            end: periodEnd,
          });
          periodDays.push(
            ...daysInPeriod.map((d) => ({ date: d, type: "historical" }))
          );
        } catch (error) {
          console.warn("Invalid period dates in cycle:", cycle);
        }
      }
    });

    // Add predicted period days (multiple future cycles)
    if (prediction?.nextPeriod?.start && prediction?.predictedCycleLength) {
      try {
        const predictedStart = parseISO(prediction.nextPeriod.start);
        const predictedCycleLength = prediction.predictedCycleLength;
        const predictedPeriodLength = prediction.predictedPeriodLength || cycleData.periodLength;
        
        // Add next 3 predicted cycles
        for (let cycle = 0; cycle < 3; cycle++) {
          const cycleStart = addDays(predictedStart, cycle * predictedCycleLength);
          
          // Add period days for this predicted cycle
          for (let i = 0; i < predictedPeriodLength; i++) {
            periodDays.push({
              date: addDays(cycleStart, i),
              type: "predicted",
              cycleNumber: cycle + 1,
              confidence: prediction.confidence || 0
            });
          }
        }
      } catch (error) {
        console.warn(
          "Invalid prediction start date:",
          prediction.nextPeriod.start
        );
      }
    }

    return periodDays;
  };

  const periodDays = getPeriodDays();
  const ovulationDay = addDays(
    cycleData.lastPeriodStart,
    Math.floor(cycleData.cycleLength / 2)
  );

  const getDayClass = (day) => {
    if (isSameDay(day, selectedDate)) {
      return "bg-purple-100 text-purple-900 border-2 border-purple-500";
    }

    const periodDay = periodDays.find((d) => isSameDay(d.date, day));
    if (periodDay) {
      if (periodDay.type === "predicted") {
        // Different styling based on cycle number and confidence
        const alpha = Math.max(0.3, periodDay.confidence || 0.5);
        if (periodDay.cycleNumber === 1) {
          return "bg-pink-200 text-pink-900 border-2 border-dashed border-pink-500";
        } else if (periodDay.cycleNumber === 2) {
          return "bg-pink-100 text-pink-800 border-2 border-dashed border-pink-400";
        } else {
          return "bg-pink-50 text-pink-700 border-2 border-dashed border-pink-300";
        }
      }
      return "bg-red-500 text-white hover:bg-red-600";
    }

    if (isSameDay(day, ovulationDay)) {
      return "bg-purple-500 text-white hover:bg-purple-600";
    }
    if (isToday(day)) {
      return "bg-blue-100 text-blue-900 border-2 border-blue-500";
    }
    return "hover:bg-gray-100";
  };

  const getDayContent = (day) => {
    if (periodDays.some((d) => isSameDay(d.date, day))) {
      return <Droplets className="h-4 w-4" />;
    }
    if (isSameDay(day, ovulationDay)) {
      return <Heart className="h-4 w-4" />;
    }
    return day.getDate();
  };

  const getDayTooltip = (day) => {
    const periodDay = periodDays.find((d) => isSameDay(d.date, day));
    if (periodDay) {
      if (periodDay.type === "predicted") {
        const confidence = Math.round((periodDay.confidence || 0) * 100);
        return `Predicted Period Day (Cycle ${periodDay.cycleNumber}, ${confidence}% confidence)`;
      }
      return "Period Day";
    }
    if (isSameDay(day, ovulationDay)) {
      return "Ovulation Day";
    }
    return format(day, "EEEE, MMMM d, yyyy");
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getCyclePhase = () => {
    if (cycleData.isOnPeriod) return "Menstrual Phase";
    if (cycleData.isOvulating) return "Ovulation";
    if (cycleData.currentDay <= 7) return "Follicular Phase";
    if (cycleData.currentDay <= 14) return "Ovulatory Phase";
    return "Luteal Phase";
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case "Menstrual Phase":
        return "bg-pink-100 text-pink-800";
      case "Ovulation":
        return "bg-purple-100 text-purple-800";
      case "Follicular Phase":
        return "bg-blue-100 text-blue-800";
      case "Luteal Phase":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Track your cycle and important dates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Cycle Calendar</CardTitle>
                  <CardDescription>
                    {format(currentDate, "MMMM yyyy")} • {getCyclePhase()}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevMonth}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold text-gray-900 min-w-[120px] text-center">
                    {format(currentDate, "MMMM yyyy")}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMonth}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-6">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50 rounded-lg"
                    >
                      {day}
                    </div>
                  )
                )}
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  return (
                    <PeriodEntryPopover
                      key={index}
                      trigger={
                        <button
                          onClick={() => setSelectedDate(day)}
                          className={`p-3 text-center rounded-lg transition-all duration-200 min-h-[60px] flex flex-col items-center justify-center ${getDayClass(
                            day
                          )} ${!isCurrentMonth ? "text-gray-400" : ""}`}
                          title={getDayTooltip(day)}
                        >
                          <div className="flex items-center justify-center w-full h-full">
                            {getDayContent(day)}
                          </div>
                          {/* Event indicators */}
                          <div className="flex gap-1 mt-1">
                            {periodDays.some((d) => isSameDay(d, day)) && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                            {isSameDay(day, ovulationDay) && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      }
                      selectedDate={day}
                      onSave={fetchUserData}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm text-gray-600">Period</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-pink-200 border-2 border-dashed border-pink-500 rounded"></div>
                  <span className="text-sm text-gray-600">Predicted Period</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-sm text-gray-600">Ovulation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                  <span className="text-sm text-gray-600">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-3.5">
          {/* Selected Date Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Selected Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center ">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {format(selectedDate, "EEEE, MMMM d")}
                </div>
                <div className="text-gray-600 mb-4">
                  {format(selectedDate, "yyyy")}
                </div>

                {/* Date Status */}
                <div className="space-y-3">
                  {periodDays.some((d) => isSameDay(d, selectedDate)) && (
                    <Badge className="bg-red-100 text-red-700 border-red-200 mx-1">
                      <Droplets className="h-3 w-3 mr-1" />
                      Period Day
                    </Badge>
                  )}
                  {isSameDay(selectedDate, ovulationDay) && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 mx-1">
                      <Zap className="h-3 w-3 mr-1" />
                      Ovulation Day
                    </Badge>
                  )}
                  {isToday(selectedDate) && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 mx-1">
                      <Sun className="h-3 w-3 mr-1" />
                      Today
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cycle Stats */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Cycle Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Cycle Length</span>
                <span className="font-semibold">
                  {cycleData.cycleLength} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Period Length</span>
                <span className="font-semibold">
                  {cycleData.periodLength} days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Next Period</span>
                <span className="font-semibold">
                  {Math.max(
                    0,
                    differenceInDays(cycleData.nextPeriodStart, new Date())
                  )}{" "}
                  days
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ovulation</span>
                <span className="font-semibold text-purple-600">
                  {isSameDay(new Date(), ovulationDay) ? "Today" : "Day 14"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardContent className="space-y-2">
              <PeriodEntryPopover
                trigger={
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                    <Droplets className="h-4 w-4 mr-2" />
                    Log Period
                  </Button>
                }
                selectedDate={selectedDate}
                onSave={fetchUserData}
              />
              <Button
                variant="outline"
                className="w-full border-pink-200 text-pink-700 hover:bg-pink-50"
              >
                <Activity className="h-4 w-4 mr-2" />
                Add Symptoms
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
