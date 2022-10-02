import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";

export const getStartOfMonth = (refDate: Date) => {
  const som = startOfMonth(refDate);
  return som.getDay() == 1 ? som : getEndOfWeek(startOfMonth(refDate));
};

export const getEndOfMonth = (refDate: Date) =>
  getEndOfWeek(endOfMonth(refDate));

export const getStartOfWeek = (refDate: Date) =>
  startOfWeek(refDate, { weekStartsOn: 1 });

export const getEndOfWeek = (refDate: Date) =>
  endOfWeek(refDate, { weekStartsOn: 1 });
