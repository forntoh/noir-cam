import { ApiError } from "@supabase/supabase-js";

export interface Model {
  user_id?: string;
  email?: string;
  username?: string;
  momo_number?: string;
  start_date?: string;
  updated_at?: string;
}

export interface Earning {
  username?: string;
  tokens: number;
  periodStart: string;
  periodEnd: string;
  paidOut: boolean;
}

export interface Debt {
  id: number;
  amount: number;
  created_at: string;
  reason: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export type CurrencyType = "tk" | "Ksh";
