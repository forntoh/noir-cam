import { Model } from "../../typings";
import { supabase } from "../../utils/supabaseClient";
import { runner } from "../../utils/supabaseRunner";

export default () =>
  runner<Model>((username?: string) => {
    return supabase
      .from("models")
      .select()
      .eq(
        username ? "username" : "user_id",
        username ?? supabase.auth.user()?.id
      )
      .single();
  });

export const useModels = () =>
  runner<Model[]>(() => {
    return supabase.from("models").select("*");
  });
