import { Earning } from "../../typings";
import { supabase } from "../../utils/supabaseClient";
import { runner } from "../../utils/supabaseRunner";

const table = "earnings";

export const useEarnings = (username?: string) =>
  runner<Earning[]>(() => {
    return supabase.from(table).select().eq("username", username);
  });

export default () =>
  runner<Earning[]>(() => {
    return supabase.from(table).select("*");
  });
