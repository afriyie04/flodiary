"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Droplets,
  X,
  Save,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import apiService from "@/lib/api";

export default function PeriodEntryPopover({
  trigger,
  selectedDate = new Date(),
  onSave,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    startDate: format(selectedDate, "yyyy-MM-dd"),
    endDate: "",
  });


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async () => {
    try {
      if (!formData.startDate) {
        toast.error("Start date is required");
        return;
      }

      if (!formData.endDate) {
        toast.error("End date is required");
        return;
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        toast.error("End date must be after start date");
        return;
      }

      // Calculate period length (duration of menstruation)
      const periodLength = differenceInDays(endDate, startDate) + 1;
      
      // For new periods, we'll let the backend calculate cycle length based on previous periods
      // For first period, use a default cycle length of 28 days
      const cycleData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        periodLength,
      };

      await apiService.addCycle(cycleData);
      toast.success("Period logged successfully!");
      setIsOpen(false);

      // Reset form
      setFormData({
        startDate: format(selectedDate, "yyyy-MM-dd"),
        endDate: "",
      });

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Failed to save period:", error);
      toast.error(error.message || "Failed to log period");
    }
  };


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-red-500" />
              Log Period
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Log your current or previous period
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium">
                End Date *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <Clock className="w-3 h-3 inline mr-1" />
            Enter your period start and end dates to track cycle length for predictions.
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} className="flex-1" disabled={false}>
              <Save className="w-4 h-4 mr-2" />
              Log Period
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
