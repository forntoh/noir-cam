import { Model } from "../../typings";
import { supabase } from "../../utils/supabaseClient";
import { runner } from "../../utils/supabaseRunner";

export default (username?: string) =>
  runner<Model>(() => {
    return supabase.from("models").select().eq("username", username).single();
  });

export const useModels = () =>
  runner<Model[]>(() => {
    return supabase.from("models").select("*");
  });
