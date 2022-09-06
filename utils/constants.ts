import { format, parse } from "date-fns";

const today = new Date();

export const formatStringDate = (
  date: string,
  from: string,
  to: string = "MMM dd"
) => format(parse(date, from, today), to);
