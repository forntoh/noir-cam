import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function runner<T>(fn: () => PromiseLike<PostgrestSingleResponse<any>>) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T>();

  const loadData = async () => {
    try {
      setLoading(true);
      let { data, error, status } = await fn();

      if (error && status !== 406) throw error;
      if (data) setData(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, loadData };
}

export function upsert<T>(table: string, minimal: boolean = true) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>();

  const upsert = async (updates: T) => {
    try {
      setLoading(true);

      let { data, error } = await supabase.from(table).upsert(updates, {
        returning: minimal ? "minimal" : "representation",
      });

      if (error) throw error;
      if (data && !minimal) setData(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, upsert };
}
