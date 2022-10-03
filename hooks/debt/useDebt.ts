import { toDateString } from "../../helpers/helpers.date";
import { Debt } from "../../typings";
import { supabase } from "../../utils/supabaseClient";
import { runner } from "../../utils/supabaseRunner";

const table = "debt";

export const useDebt = () =>
  runner<Debt[]>((start?: Date, end?: Date) => {
    let query = supabase.from(table).select();
    if (start && end) {
      query = query
        .gte("created_at", toDateString(start))
        .lte("created_at", toDateString(end));
    }
    return query.order("created_at", { ascending: false });
  });

export const useDebtForPeriod = () =>
  runner<number | null | undefined>((start: Date, end: Date) => {
    return supabase.rpc("debt_for_period", {
      a: toDateString(start),
      b: toDateString(end),
    });
  });

export const useEarlyPaymentForPeriod = () =>
  runner<number | null | undefined>((start: Date, end: Date) => {
    return supabase.rpc("early_payment_for_period", {
      a: toDateString(start),
      b: toDateString(end),
    });
  });
