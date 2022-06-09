import { Profile } from "../typings";
import { supabase } from "../utils/supabaseClient";
import { runner } from "../utils/supabaseRunner";

export default () =>
  runner<Profile>(() => {
    const user = supabase.auth.user();
    return supabase
      .from("profiles")
      .select(`first_name, last_name, address, city, date_of_birth`)
      .eq("id", user?.id)
      .single();
  });
