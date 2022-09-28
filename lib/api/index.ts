import { format } from "date-fns";
import { Earning } from "../../typings";
import supabaseAdmin from "../../utils/supabaseAdmin";
import { runnerAsync } from "../../utils/supabaseRunner";

export const getEarnings = async (
  username?: string,
  start?: Date,
  end?: Date
) =>
  runnerAsync<Earning[]>(async () => {
    let query = supabaseAdmin.from("earnings").select();
    if (username) query = query.eq("username", username);
    if (start && end) {
      const a = end.toISOString();
      query = query
        .gte("periodStart", start.toISOString())
        .or(`periodStart.lte.${a},periodEnd.lte.${a}`);
    }
    return query.order("periodStart", { ascending: false });
  });

export const getEarningsMultiplier = async (date: Date) =>
  runnerAsync<{ rate: number; model_rate: number }>(() => {
    return supabaseAdmin
      .from("multiplier")
      .select("rate,model_rate")
      .eq("date", format(date, "yyyy-MM-01"))
      .single();
  });
