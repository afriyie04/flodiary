import { addDays, differenceInDays, startOfDay, subDays } from "date-fns";

export const calculateCycleData = (user) => {
  if (!user || !user.cycleDetails) {
    return {
      periodDays: [],
      fertileDays: [],
      ovulationDay: null,
      currentDayOfCycle: 0,
      daysUntilNextPeriod: 0,
    };
  }

  const { lastPeriodDate, avgCycleLength, avgPeriodDuration } =
    user.cycleDetails;
  const today = startOfDay(new Date());
  const lastPeriod = startOfDay(new Date(lastPeriodDate));

  let cycleStartDate = lastPeriod;
  while (cycleStartDate < today) {
    cycleStartDate = addDays(cycleStartDate, avgCycleLength);
  }
  if (cycleStartDate > today) {
    cycleStartDate = subDays(cycleStartDate, avgCycleLength);
  }

  const currentDayOfCycle = differenceInDays(today, cycleStartDate) + 1;

  const nextPeriodStartDate = addDays(cycleStartDate, avgCycleLength);
  const daysUntilNextPeriod = differenceInDays(nextPeriodStartDate, today);

  const periodDays = Array.from({ length: avgPeriodDuration }, (_, i) =>
    addDays(cycleStartDate, i)
  );

  const ovulationDay = subDays(nextPeriodStartDate, 14);

  const fertileWindowStart = subDays(ovulationDay, 5);
  const fertileDays = Array.from({ length: 7 }, (_, i) =>
    addDays(fertileWindowStart, i)
  );

  return {
    periodDays,
    fertileDays,
    ovulationDay,
    currentDayOfCycle,
    daysUntilNextPeriod,
    cycleStartDate,
    nextPeriodStartDate,
  };
};
