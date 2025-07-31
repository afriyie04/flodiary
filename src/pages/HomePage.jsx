import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import CycleCalendar from "../components/CycleCalendar";
import CalendarLegend from "../components/CalendarLegend";
import { CycleTrendChart, SymptomsChart } from "../components/CycleChart";
import { format } from "date-fns";
import { calculateCycleData } from "../utils/cycleCalculations";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";

function AddPeriodPopup({ isOpen, setIsOpen }) {
  const [periodData, setPeriodData] = useState({
    startDate: null,
    endDate: null,
    cycleLength: "",
  });

  const handleDateChange = (name, date) => {
    setPeriodData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPeriodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(periodData);
    setIsOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogTitle>
          Add Period
          <IconButton
            aria-label="close"
            onClick={() => setIsOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <DatePicker
              label="Start Date"
              value={periodData.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="End Date"
              value={periodData.endDate}
              onChange={(date) => handleDateChange("endDate", date)}
              slots={{ textField: TextField }}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TextField
              label="Cycle Length"
              name="cycleLength"
              value={periodData.cycleLength}
              onChange={handleInputChange}
              placeholder="Cycle Length"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#ec4899",
                "&:hover": { backgroundColor: "#db2777" },
              }}
            >
              Add Period
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}

function Dashboard({ setIsOpen }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  const {
    periodDays,
    fertileDays,
    ovulationDay,
    currentDayOfCycle,
    daysUntilNextPeriod,
  } = calculateCycleData(user);

  const cycleData =
    user.dailyEntries?.map((entry) => ({
      month: format(new Date(entry.date), "MMM"),
      cycleLength: user.cycleDetails.avgCycleLength,
      periodLength: user.cycleDetails.avgPeriodDuration,
    })) || [];

  const symptomsData =
    user.dailyEntries
      ?.flatMap((entry) => entry.symptoms)
      .reduce((acc, symptom) => {
        const existingSymptom = acc.find((s) => s.name === symptom);
        if (existingSymptom) {
          existingSymptom.value += 1;
        } else {
          acc.push({ name: symptom, value: 1, color: "#ef4444" });
        }
        return acc;
      }, []) || [];

  return (
    <DashboardLayout activePage="dashboard" title="Dashboard">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Dashboard"
          subtitle="Track your cycle and stay in tune with your body."
        />
        <div className="flex justify-start mb-4">
          <Button
            variant="contained"
            onClick={() => setIsOpen(true)}
            sx={{
              backgroundColor: "#3b82f6",
              "&:hover": { backgroundColor: "#2563eb" },
            }}
          >
            Add Period
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatsCard
            title="CURRENT DAY"
            value={currentDayOfCycle}
            unit="of cycle"
            bgColor="bg-yellow-100"
          />
          <StatsCard
            title="NEXT PERIOD"
            value={daysUntilNextPeriod}
            unit="days away"
            bgColor="bg-green-100"
          />
          <StatsCard
            title="CYCLE LENGTH"
            value={user.cycleDetails.avgCycleLength}
            unit="days average"
            bgColor="bg-pink-100"
          />
          <StatsCard
            title="PERIOD LENGTH"
            value={user.cycleDetails.avgPeriodDuration}
            unit="days average"
            bgColor="bg-blue-100"
          />
        </div>
        <div className="space-y-6 md:space-y-8 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="bg-white rounded-xl md:rounded-2xl p-2 md:p-8 shadow-sm">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
              Cycle Calendar
            </h3>
            <div className="mb-4 md:mb-6">
              <CycleCalendar
                periodDays={periodDays.map((d) => d.getDate())}
                fertileDays={fertileDays.map((d) => d.getDate())}
                ovulationDays={ovulationDay ? [ovulationDay.getDate()] : []}
                currentDay={new Date().getDate()}
                month={new Date().getMonth()}
                year={new Date().getFullYear()}
              />
            </div>
            <CalendarLegend />
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <CycleTrendChart data={cycleData} height={500} type="bar" />
          </div>
        </div>
        <div className="mt-6 md:mt-8">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">
            Analytics Overview
          </h3>
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm">
            <SymptomsChart data={symptomsData} height={300} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dashboard setIsOpen={setIsOpen} />
      <AddPeriodPopup isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default HomePage;
