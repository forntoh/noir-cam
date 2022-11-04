import {
  addSeconds,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

export const getStartOfMonth = (refDate: Date) => {
  const som = startOfMonth(refDate);
  return som.getDay() == 1 // Is Mon
    ? som
    : som.getDay() == 2 // Is Tue
    ? subDays(som, 1)
    : addSeconds(getEndOfWeek(startOfMonth(refDate)), 1);
};

export const getEndOfMonth = (refDate: Date) => {
  const mEom = endOfMonth(refDate);
  return mEom.getDay() == 1 ? subDays(mEom, 1) : getEndOfWeek(mEom);
};

export const getStartOfWeek = (refDate: Date) =>
  startOfWeek(refDate, { weekStartsOn: 1 });

export const getEndOfWeek = (refDate: Date) =>
  endOfWeek(refDate, { weekStartsOn: 1 });

export const toDateString = (refDate: Date) => format(refDate, "yyyy-MM-dd");
