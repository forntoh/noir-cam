import { Earning } from "../../typings";
import { supabase } from "../../utils/supabaseClient";
import { runner } from "../../utils/supabaseRunner";

const table = "earnings";

export const useEarnings = () =>
  runner<Earning[]>((username?: string, start?: Date, end?: Date) => {
    let query = supabase.from(table).select();
    if (username) query = query.eq("username", username);
    if (start && end) {
      const a = end.toISOString();
      query = query
        .gte("periodStart", start.toISOString())
        .or(`periodStart.lte.${a},periodEnd.lte.${a}`);
    }
    return query.order("periodStart", { ascending: false });
  });

export const useEarningsForPeriod = () =>
  runner<number>((start: Date, end: Date) => {
    return supabase.rpc("earnings_for_period", {
      a: start,
      b: end,
    });
  });

export const useTopModelsForPeriod = () =>
  runner<TopModels[]>((start: Date, end: Date) => {
    return supabase.rpc("model_ranking_for_period", {
      a: start,
      b: end,
    });
  });

type TopModels = {
  uname: string;
  amount: number;
};
