import { createClient } from "@supabase/supabase-js";

const supbaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default supbaseAdmin;
