import { format, parse } from "date-fns";

const today = new Date();

export const formatStringDate = (
  date?: string,
  to: string = "MMM dd",
  from: string = "yyyy-MM-dd"
) => (date ? format(parse(date, from, today), to) : "N/A");
