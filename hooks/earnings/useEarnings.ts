import { toDateString } from "../../helpers/helpers.date";
import { Earning } from "../../typings";
import { supabase } from "../../utils/supabaseClient";
import { runner } from "../../utils/supabaseRunner";

const table = "earnings";

export const useEarnings = () =>
  runner<Earning[]>((username?: string, start?: Date, end?: Date) => {
    let query = supabase.from(table).select();
    if (username) query = query.eq("username", username);
    if (start && end) {
      const a = toDateString(end);
      query = query
        .gte("periodStart", toDateString(start))
        .or(`periodStart.lte.${a},periodEnd.lte.${a}`);
    }
    return query.order("periodStart", { ascending: false });
  });

export const useEarningsForPeriod = () =>
  runner<number>(
    (start: Date, end: Date, c: boolean = false, username: string) => {
      return supabase.rpc("earnings_for_period", {
        a: toDateString(start),
        b: toDateString(end),
        uname: username,
        c: c,
      });
    }
  );

export const useEarningsMultiplier = () =>
  runner<{ rate: number; model_rate: number }>((date: string) => {
    return supabase
      .from("multiplier")
      .select("rate,model_rate")
      .eq("date", date)
      .single();
  });

export const useTopModelsForPeriod = () =>
  runner<TopModels[]>((start: Date, end: Date) => {
    return supabase.rpc("model_ranking_for_period", {
      a: toDateString(start),
      b: toDateString(end),
    });
  });

type TopModels = {
  uname: string;
  amount: number;
};
