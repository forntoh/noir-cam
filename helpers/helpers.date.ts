import {
  addSeconds,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export const getStartOfMonth = (refDate: Date) => {
  const som = startOfMonth(refDate);
  return som.getDay() == 1
    ? som
    : addSeconds(getEndOfWeek(startOfMonth(refDate)), 1);
};

export const getEndOfMonth = (refDate: Date) =>
  getEndOfWeek(endOfMonth(refDate));

export const getStartOfWeek = (refDate: Date) =>
  startOfWeek(refDate, { weekStartsOn: 1 });

export const getEndOfWeek = (refDate: Date) =>
  endOfWeek(refDate, { weekStartsOn: 1 });

export const toDateString = (refDate: Date) => format(refDate, "yyyy-MM-dd");
