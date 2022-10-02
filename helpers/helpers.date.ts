import { endOfMonth, endOfWeek, startOfMonth } from "date-fns";

export const getStartOfMonth = (refDate: Date) => {
  const som = startOfMonth(refDate);
  return som.getDay() == 1
    ? som
    : endOfWeek(startOfMonth(refDate), { weekStartsOn: 1 });
};

export const getEndOfMonth = (refDate: Date) =>
  endOfWeek(endOfMonth(refDate), { weekStartsOn: 1 });
