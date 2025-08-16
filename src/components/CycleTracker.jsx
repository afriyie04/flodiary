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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useCycle } from "@/contexts/CycleContext";
import { format, parseISO, differenceInDays } from "date-fns";

export default function CycleTracker() {
  const { cycles, addCycle, updateCycle, deleteCycle, loading } = useCycle();
  const [isAddingCycle, setIsAddingCycle] = useState(false);
  const [editingCycle, setEditingCycle] = useState(null);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    notes: "",
    symptoms: [],
    flow: "medium",
  });

  const flowOptions = [
    { value: "light", label: "Light", color: "bg-blue-100 text-blue-700" },
    {
      value: "medium",
      label: "Medium",
      color: "bg-orange-100 text-orange-700",
    },
    { value: "heavy", label: "Heavy", color: "bg-red-100 text-red-700" },
  ];

  const commonSymptoms = [
    "Cramps",
    "Fatigue",
    "Bloating",
    "Mood swings",
    "Headache",
    "Breast tenderness",
    "Acne",
    "Back pain",
    "Food cravings",
    "Insomnia",
  ];

  useEffect(() => {
    if (editingCycle) {
      setFormData({
        startDate: editingCycle.startDate
          ? format(parseISO(editingCycle.startDate), "yyyy-MM-dd")
          : "",
        endDate: editingCycle.endDate
          ? format(parseISO(editingCycle.endDate), "yyyy-MM-dd")
          : "",
        notes: editingCycle.notes || "",
        symptoms: editingCycle.symptoms || [],
        flow: editingCycle.flow || "medium",
      });
    }
  }, [editingCycle]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSymptomToggle = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.startDate) {
        toast.error("Start date is required");
        return;
      }

      // Map frontend symptoms to backend format
      const symptomMapping = {
        Cramps: "cramps",
        Fatigue: "fatigue",
        Bloating: "bloating",
        "Mood swings": "mood_swings",
        Headache: "headache",
        "Breast tenderness": "breast_tenderness",
        Acne: "acne",
        "Back pain": "back_pain",
        "Food cravings": "food_cravings",
        Insomnia: "insomnia",
      };

      const mappedSymptoms = formData.symptoms.map(
        (symptom) =>
          symptomMapping[symptom] || symptom.toLowerCase().replace(/\s+/g, "_")
      );

      const cycleData = {
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : null,
        notes: formData.notes,
        symptoms: mappedSymptoms,
      };

      if (editingCycle) {
        await updateCycle(editingCycle.id, cycleData);
        toast.success("Cycle updated successfully!");
        setEditingCycle(null);
      } else {
        await addCycle(cycleData);
        toast.success("Cycle added successfully!");
      }

      resetForm();
    } catch (error) {
      toast.error(error.message || "Failed to save cycle");
    }
  };

  const handleDelete = async (cycleId) => {
    try {
      await deleteCycle(cycleId);
      toast.success("Cycle deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete cycle");
    }
  };

  const resetForm = () => {
    setFormData({
      startDate: "",
      endDate: "",
      notes: "",
      symptoms: [],
      flow: "medium",
    });
    setIsAddingCycle(false);
    setEditingCycle(null);
  };

  const calculateCycleLength = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    try {
      return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
    } catch (error) {
      console.warn("Invalid dates for cycle length calculation:", {
        startDate,
        endDate,
      });
      return null;
    }
  };

  const getFlowColor = (flow) => {
    const option = flowOptions.find((f) => f.value === flow);
    return option ? option.color : "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cycle Tracker</h1>
          <p className="text-gray-600">
            Track your menstrual cycles and symptoms
          </p>
        </div>
        <Button
          onClick={() => setIsAddingCycle(true)}
          className="px-6"
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Cycle
        </Button>
      </div>

      {/* Add/Edit Cycle Form */}
      {(isAddingCycle || editingCycle) && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {editingCycle ? (
                <Edit3 className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              {editingCycle ? "Edit Cycle" : "Add New Cycle"}
            </CardTitle>
            <CardDescription>
              {editingCycle
                ? "Update your cycle information"
                : "Log a new menstrual cycle"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Flow Intensity</Label>
              <div className="flex gap-2">
                {flowOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      formData.flow === option.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleInputChange("flow", option.value)}
                    className={
                      formData.flow === option.value ? option.color : ""
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Symptoms</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonSymptoms.map((symptom) => (
                  <Button
                    key={symptom}
                    variant={
                      formData.symptoms.includes(symptom)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => handleSymptomToggle(symptom)}
                    className="justify-start"
                  >
                    {formData.symptoms.includes(symptom) && (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this cycle..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {editingCycle ? "Update Cycle" : "Add Cycle"}
              </Button>
              <Button variant="outline" onClick={resetForm} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cycles List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Cycle History
          </CardTitle>
          <CardDescription>View and manage your tracked cycles</CardDescription>
        </CardHeader>
        <CardContent>
          {cycles.length > 0 ? (
            <div className="space-y-4">
              {cycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {cycle.startDate
                          ? format(parseISO(cycle.startDate), "MMM dd, yyyy")
                          : "No start date"}
                        {cycle.endDate &&
                          ` - ${format(
                            parseISO(cycle.endDate),
                            "MMM dd, yyyy"
                          )}`}
                      </h4>
                      <Badge className={getFlowColor(cycle.flow)}>
                        {cycle.flow}
                      </Badge>
                      {cycle.cycleLength && (
                        <Badge variant="outline">
                          {cycle.cycleLength} days
                        </Badge>
                      )}
                    </div>

                    {cycle.symptoms && cycle.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {cycle.symptoms.map((symptom, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {cycle.notes && (
                      <p className="text-sm text-gray-600">{cycle.notes}</p>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      Added{" "}
                      {cycle.createdAt
                        ? format(parseISO(cycle.createdAt), "MMM dd, yyyy")
                        : "Unknown date"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCycle(cycle)}
                      disabled={loading}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cycle.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No cycles tracked yet.</p>
              <p className="text-sm">Start by adding your first cycle!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
