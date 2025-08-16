"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Heart,
  Calendar,
  Plus,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
} from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import PeriodEntryPopover from "@/components/PeriodEntryPopover";

// Remove mock data and generation function

export default function Periods() {
  const [periodHistory, setPeriodHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    setPeriodHistory([]); // Empty by default
    setLoading(false);
  }, []);

  const currentPeriod = periodHistory.find((p) => p.status === "current");
  const completedPeriods = periodHistory.filter((p) => p.status === "complete");

  const getStatusColor = (status) => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-700";
      case "complete":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handlePeriodSuccess = () => {
    // TODO: Refresh data after adding new period (API call)
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Periods</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your menstrual cycle history
          </p>
        </div>
        <div className="flex gap-2">
          <PeriodEntryPopover
            trigger={
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Period
              </Button>
            }
            onSuccess={handlePeriodSuccess}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4 w-full">
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Periods
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {periodHistory.length}
                </p>
              </div>
              <CalendarDays className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Duration
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {periodHistory.length > 0
                    ? Math.round(
                        periodHistory.reduce(
                          (acc, p) => acc + p.periodLength,
                          0
                        ) / periodHistory.length
                      )
                    : 0}{" "}
                  days
                </p>
              </div>
              <CalendarRange className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedPeriods.length}
                </p>
              </div>
              <CalendarCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentPeriod ? 1 : 0}
                </p>
              </div>
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Period Status */}
      {currentPeriod && (
        <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Current Period
            </CardTitle>
            <CardDescription>
              Started on{" "}
              {format(parseISO(currentPeriod.startDate), "MMMM d, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Day</p>
                <p className="text-2xl font-bold text-pink-600">
                  {differenceInDays(
                    new Date(),
                    parseISO(currentPeriod.startDate)
                  ) + 1}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-pink-600">
                  {currentPeriod.periodLength} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Period History List */}
      <div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Period History</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="space-y-4">
        {periodHistory.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No period history found.
          </div>
        ) : (
          periodHistory.map((period) => (
            <Card
              key={period.id}
              className="hover:shadow-md transition-shadow w-full"
            >
              <CardContent className="px-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <span className="font-semibold">
                          {format(parseISO(period.startDate), "MMMM d, yyyy")}
                        </span>
                      </div>

                      <Badge className={getStatusColor(period.status)}>
                        {period.status}
                      </Badge>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Duration:{" "}
                        <span className="font-medium">
                          {period.periodLength} days
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
