import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Account from "../components/Account";
import Auth from "../components/Auth";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [session, setSession] = useState<Session | null>();

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div className="container p-20">
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user?.id} session={session} />
      )}
    </div>
  );
}
