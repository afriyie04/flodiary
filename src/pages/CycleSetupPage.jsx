import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Toaster, toast } from "sonner";
import FormInput from "../components/FormInput";

function CycleSetupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastPeriodStartDate: null,
    averageCycleLength: "",
    averagePeriodLength: "",
  });

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      lastPeriodStartDate: newValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.lastPeriodStartDate ||
      !formData.averageCycleLength ||
      !formData.averagePeriodLength
    ) {
      toast.error("Please fill out all fields.");
      return;
    }
    console.log("Cycle data submitted:", formData);
    toast.success("Your cycle data has been saved!");
    navigate("/");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Toaster />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              Tell us about your cycle
            </h1>
            <p className="text-gray-600">
              This will help us personalize your predictions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border rounded-lg">
              <p className="font-semibold mb-4 text-gray-700">
                When did your last period start?
              </p>
              <DatePicker
                label="Last Period Start Date"
                value={formData.lastPeriodStartDate}
                onChange={handleDateChange}
                sx={{ width: "100%" }}
              />
            </div>

            <div className="p-4 border rounded-lg">
              <p className="font-semibold mb-4 text-gray-700">
                Cycle Information
              </p>
              <div className="space-y-4">
                <FormInput
                  label="Average Cycle Length (in days)"
                  name="averageCycleLength"
                  type="number"
                  value={formData.averageCycleLength}
                  onChange={handleInputChange}
                  placeholder="e.g., 28"
                  required
                />
                <FormInput
                  label="Average Period Duration (in days)"
                  name="averagePeriodLength"
                  type="number"
                  value={formData.averagePeriodLength}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors transform hover:scale-105"
            >
              Get Started
            </button>
            <button
              type="button"
              className="w-full mt-2 text-gray-600 hover:text-purple-700 font-semibold py-2 px-4 rounded-lg"
              onClick={() => navigate("/")}
            >
              Skip for now
            </button>
          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default CycleSetupPage;
