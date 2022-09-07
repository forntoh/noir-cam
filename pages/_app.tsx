import { UserProvider } from "@supabase/auth-helpers-react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import "../styles/globals.css";
import { supabase } from "../utils/supabaseClient";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <UserProvider supabaseClient={supabase}>
        <Component {...pageProps} />
      </UserProvider>
    </RecoilRoot>
  );
}

export default MyApp;
