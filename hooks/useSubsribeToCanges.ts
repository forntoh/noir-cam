import { SupabaseRealtimePayload } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const useSubscribeToCanges = <T>(
  table: string
): SupabaseRealtimePayload<T> | undefined => {
  const [payload, setPayload] = useState<SupabaseRealtimePayload<T>>();

  useEffect(() => {
    const sub = supabase.from(table).on("*", setPayload).subscribe();
    return () => {
      supabase.removeSubscription(sub);
    };
  }, []);

  return payload;
};

export default useSubscribeToCanges;
