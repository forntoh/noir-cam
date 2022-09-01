import { ApiError } from "@supabase/supabase-js";

export interface Model {
  user_id?: string;
  email?: string;
  username?: string;
  momo_number?: string;
  start_date?: Date;
  updated_at?: Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
