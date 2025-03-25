import { DashboardTimePeriod } from '~/server/enums/dashboard-filters';

export const TIME_PERIOD_OPTIONS = [
  { value: DashboardTimePeriod.ALL, label: "All Time" },
  { value: DashboardTimePeriod.LAST_MONTH, label: "Last Month" },
  { value: DashboardTimePeriod.LAST_3_MONTHS, label: "Last 3 Months" },
  { value: DashboardTimePeriod.LAST_6_MONTHS, label: "Last 6 Months" },
  { value: DashboardTimePeriod.LAST_YEAR, label: "Last Year" },
];
