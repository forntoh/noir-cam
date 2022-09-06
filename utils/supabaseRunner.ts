import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export function runner<T>(
  fn: (...args: any) => PromiseLike<PostgrestSingleResponse<any>>
): [boolean, T | undefined, (...args: any) => PromiseLike<void>] {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T>();

  const loadData = async (...args: any) => {
    try {
      setLoading(true);
      let { data, error, status } = await fn(...args);
      if (error && status !== 406) throw error;
      setData(data);
    } catch (error: any) {
      alert(JSON.stringify(error.message));
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return [loading, data, loadData];
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
      alert(JSON.stringify(error.message));
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, upsert };
}
