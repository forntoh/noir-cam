import { Debt } from "../../typings";
import { supabase } from "../../utils/supabaseClient";
import { runner } from "../../utils/supabaseRunner";

const table = "debt";

export const useDebt = () =>
  runner<Debt[]>((start?: Date, end?: Date) => {
    let query = supabase.from(table).select();
    if (start && end) {
      query = query
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());
    }
    return query.order("created_at", { ascending: false });
  });

export const useDebtForPeriod = () =>
  runner<number | null | undefined>((start: Date, end: Date) => {
    return supabase.rpc("debt_for_period", {
      a: start,
      b: end,
    });
  });
