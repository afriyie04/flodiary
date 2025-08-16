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
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Target,
  TrendingUp,
  Zap,
  Heart,
  Clock,
} from "lucide-react";
import {
  format,
  subMonths,
  differenceInDays,
  isValid,
  parseISO,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiService from "@/lib/api";
import { toast, Toaster } from "sonner";

// Simple day input component
function DayInput({ value, onChange, placeholder, id }) {
  const handleChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= 31) {
      onChange(val);
    } else if (e.target.value === "") {
      onChange(null);
    }
  };

  return (
    <input
      id={id}
      type="number"
      min="1"
      max="31"
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder}
      className="border rounded px-2 py-1 text-sm w-16 focus:ring-2 focus:ring-purple-200 transition text-center"
      required
    />
  );
}

// Cycle length input component
function CycleLengthInput({ value, onChange, id }) {
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === "") {
      onChange(null);
    } else {
      const numVal = parseInt(val);
      if (!isNaN(numVal) && numVal > 0) {
        onChange(numVal);
      }
    }
  };

  return (
    <input
      id={id}
      type="number"
      min="1"
      value={value || ""}
      onChange={handleChange}
      placeholder="28"
      className="border rounded px-2 py-1 text-sm w-20 focus:ring-2 focus:ring-purple-200 transition text-center"
      required
    />
  );
}

export default function CycleSetupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [monthsToTrack, setMonthsToTrack] = useState(6);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Each cycle: { cycleLength, periodStartDay, periodEndDay, month, year }
  const [cycles, setCycles] = useState(
    Array.from({ length: monthsToTrack }, (_, index) => {
      const date = subMonths(new Date(), monthsToTrack - 1 - index);
      return {
        cycleLength: null,
        periodStartDay: null,
        periodEndDay: null,
        month: date.getMonth(),
        year: date.getFullYear(),
      };
    })
  );

  // Update cycles array if monthsToTrack changes
  React.useEffect(() => {
    setCycles((prev) => {
      const arr = Array.from({ length: monthsToTrack }, (_, index) => {
        const date = subMonths(new Date(), monthsToTrack - 1 - index);
        return (
          prev[index] || {
            cycleLength: null,
            periodStartDay: null,
            periodEndDay: null,
            month: date.getMonth(),
            year: date.getFullYear(),
          }
        );
      });
      return arr;
    });
  }, [monthsToTrack]);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle day input changes
  const handleCycleFieldChange = (index, field, value) => {
    setCycles((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  // Convert day numbers to full dates
  const getDatesFromCycle = (cycle) => {
    if (!cycle.cycleLength || !cycle.periodStartDay || !cycle.periodEndDay) {
      return null;
    }

    const year = cycle.year;
    const month = cycle.month;

    const periodStartDate = new Date(year, month, cycle.periodStartDay);
    const periodEndDate =
      cycle.periodEndDay < cycle.periodStartDay
        ? new Date(year, month + 1, cycle.periodEndDay)
        : new Date(year, month, cycle.periodEndDay);

    return {
      cycleLength: cycle.cycleLength,
      periodStartDate,
      periodEndDate,
    };
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      // Format cycles for backend
      const formattedCycles = cycles
        .map((cycle) => {
          const dates = getDatesFromCycle(cycle);
          if (
            dates &&
            dates.cycleLength &&
            isValid(dates.periodStartDate) &&
            isValid(dates.periodEndDate)
          ) {
            const periodLength =
              differenceInDays(dates.periodEndDate, dates.periodStartDate) + 1;
            return {
              startDate: dates.periodStartDate.toISOString(),
              endDate: dates.periodEndDate.toISOString(),
              cycleLength: dates.cycleLength,
              periodLength,
            };
          }
          return null;
        })
        .filter(Boolean);

      // Save cycles to backend
      for (const cycle of formattedCycles) {
        await apiService.addCycle(cycle);
      }

      toast.success("Cycle setup complete! Redirecting to dashboard...");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving cycles:", error);
      toast.error("Failed to save cycle data. Please try again.");
      setIsSubmitting(false);
    }
  };

  const monthLabels = cycles.map((cycle) =>
    format(new Date(cycle.year, cycle.month), "MMM yyyy")
  );

  // Calculate stats from valid cycles
  const calculateStats = () => {
    const validCycles = cycles
      .map((cycle) => {
        const dates = getDatesFromCycle(cycle);
        if (
          dates &&
          dates.cycleLength &&
          isValid(dates.periodStartDate) &&
          isValid(dates.periodEndDate)
        ) {
          const periodLength =
            differenceInDays(dates.periodEndDate, dates.periodStartDate) + 1;
          return { cycleLength: dates.cycleLength, periodLength };
        }
        return null;
      })
      .filter(Boolean);

    if (validCycles.length === 0) return null;

    const cycleLengths = validCycles.map((c) => c.cycleLength);
    const periodLengths = validCycles.map((c) => c.periodLength);

    const avgCycleLength = Math.round(
      cycleLengths.reduce((sum, d) => sum + d, 0) / cycleLengths.length
    );
    const minCycleLength = Math.min(...cycleLengths);
    const maxCycleLength = Math.max(...cycleLengths);
    const variation = maxCycleLength - minCycleLength;

    const avgPeriodLength = Math.round(
      periodLengths.reduce((sum, d) => sum + d, 0) / periodLengths.length
    );
    const minPeriodLength = Math.min(...periodLengths);
    const maxPeriodLength = Math.max(...periodLengths);

    return {
      avgCycleLength,
      minCycleLength,
      maxCycleLength,
      variation,
      avgPeriodLength,
      minPeriodLength,
      maxPeriodLength,
      totalCycles: validCycles.length,
    };
  };

  const stats = calculateStats();

  const renderStep1 = () => (
    <Card className="mx-auto border-0 shadow-lg w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Welcome to Flodiary, {user?.firstName}!
        </CardTitle>
        <CardDescription className="text-lg">
          Let's set up your cycle tracking. We'll use linear regression to
          provide accurate predictions based on your cycle history.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={monthsToTrack === 3 ? "default" : "outline"}
              onClick={() => setMonthsToTrack(3)}
              className="flex-1"
            >
              3 Months
            </Button>
            <Button
              variant={monthsToTrack === 6 ? "default" : "outline"}
              onClick={() => setMonthsToTrack(6)}
              className="flex-1"
            >
              6 Months (Recommended)
            </Button>
            <Button
              variant={monthsToTrack === 12 ? "default" : "outline"}
              onClick={() => setMonthsToTrack(12)}
              className="flex-1"
            >
              12 Months
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            How many months of cycle data would you like to enter? More data
            improves our linear regression model's accuracy.
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900">
                Linear Regression Model
              </h4>
              <p className="text-sm text-purple-700 mt-1">
                Our algorithm will analyze patterns in your cycle data to
                predict future periods. The more historical data you provide,
                the more accurate the predictions become.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            className="px-8 bg-purple-600 hover:bg-purple-700"
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <div className="mx-auto space-y-6 w-full max-w-3xl">
      <Card className="border-0 shadow-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Enter Your Cycle & Period Data
          </CardTitle>
          <CardDescription>
            Enter your cycle length (typical range: 20-45 days) and period dates
            for each month.
            <br />
            <span className="text-xs text-gray-500">
              <span className="font-semibold">Cycle Length:</span> The number of
              days from the first day of one period to the first day of the next
              period.
              <br />
              <span className="font-semibold">Period:</span> Enter the day
              numbers when you had menstrual bleeding (e.g., "5" for the 5th
              day).
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead>
                <tr className="text-xs text-gray-600">
                  <th className="text-left px-2 py-1">Month</th>
                  <th className="text-center px-2 py-1">
                    <span className="flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      Cycle Length
                      <br />
                      <span className="text-xs font-normal">(Days)</span>
                    </span>
                  </th>
                  <th className="text-center px-2 py-1">
                    <span className="flex items-center justify-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-pink-400" />
                      Period Start
                      <br />
                      <span className="text-xs font-normal">(Day)</span>
                    </span>
                  </th>
                  <th className="text-center px-2 py-1">
                    <span className="flex items-center justify-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-pink-400" />
                      Period End
                      <br />
                      <span className="text-xs font-normal">(Day)</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthLabels.map((label, index) => {
                  const c = cycles[index];
                  return (
                    <tr
                      key={index}
                      className="bg-white hover:bg-purple-50 transition"
                      style={{ fontSize: "0.97rem" }}
                    >
                      <td className="px-2 py-1 font-medium text-gray-700 whitespace-nowrap">
                        {label}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <CycleLengthInput
                          id={`cycle-length-${index}`}
                          value={c.cycleLength}
                          onChange={(length) =>
                            handleCycleFieldChange(index, "cycleLength", length)
                          }
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <DayInput
                          id={`period-start-${index}`}
                          value={c.periodStartDay}
                          onChange={(day) =>
                            handleCycleFieldChange(index, "periodStartDay", day)
                          }
                          placeholder="1-31"
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <DayInput
                          id={`period-end-${index}`}
                          value={c.periodEndDay}
                          onChange={(day) =>
                            handleCycleFieldChange(index, "periodEndDay", day)
                          }
                          placeholder="1-31"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="px-8 bg-purple-600 hover:bg-purple-700"
              disabled={
                !cycles.every(
                  (c) => c.cycleLength && c.periodStartDay && c.periodEndDay
                )
              }
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="mx-auto space-y-6 w-full max-w-2xl">
      <Card className="border-0 shadow-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Review Your Cycle Analytics</CardTitle>
          <CardDescription>
            Based on your data, here are your cycle statistics. Our linear
            regression model will use these patterns for predictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 justify-center">
                <Badge className="bg-purple-100 text-purple-800 px-3 py-2">
                  <Target className="inline w-4 h-4 mr-1" />
                  Avg Cycle:{" "}
                  <span className="font-semibold ml-1">
                    {stats.avgCycleLength} days
                  </span>
                </Badge>
                <Badge className="bg-pink-100 text-pink-800 px-3 py-2">
                  <Heart className="inline w-4 h-4 mr-1" />
                  Avg Period:{" "}
                  <span className="font-semibold ml-1">
                    {stats.avgPeriodLength} days
                  </span>
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-2">
                  <TrendingUp className="inline w-4 h-4 mr-1" />
                  Cycles:{" "}
                  <span className="font-semibold ml-1">
                    {stats.totalCycles}
                  </span>
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 px-3 py-2">
                  <Zap className="inline w-4 h-4 mr-1" />
                  Variation:{" "}
                  <span className="font-semibold ml-1">
                    {stats.variation} days
                  </span>
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-4">
                <div>
                  <span className="font-medium">Shortest Cycle:</span>{" "}
                  {stats.minCycleLength} days
                </div>
                <div>
                  <span className="font-medium">Longest Cycle:</span>{" "}
                  {stats.maxCycleLength} days
                </div>
                <div>
                  <span className="font-medium">Shortest Period:</span>{" "}
                  {stats.minPeriodLength} days
                </div>
                <div>
                  <span className="font-medium">Longest Period:</span>{" "}
                  {stats.maxPeriodLength} days
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mt-4 flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900">
                    Linear Regression Ready
                  </h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Your cycle data will train a personalized linear regression
                    model to predict your next periods with{" "}
                    {stats.totalCycles >= 6 ? "high" : "moderate"} accuracy. The
                    model improves as you log more cycles.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-red-600 flex flex-col items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Please enter valid data for all cycles to see your stats.
            </div>
          )}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleComplete}
              className="px-8 bg-purple-600 hover:bg-purple-700"
              disabled={!stats || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Complete Setup"}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Main render
  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white py-10">
        <div className="mx-auto w-full max-w-3xl px-4">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-purple-900">
                Flodiary
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-gray-600 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </>
  );
}
