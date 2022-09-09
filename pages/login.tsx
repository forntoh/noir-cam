import { getUser } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Input } from "../components/input";
import { PageWrapper } from "../components/PageWrapper";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/");
  }, [user]);

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="grow"></div>
      <div className="container flex flex-col justify-end pb-12 gap-8">
        <p className="leading-6">
          Sign in via magic link with your email below
        </p>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <Button
          onClick={async (e) => {
            e.preventDefault();
            handleLogin(email);
          }}
          className="bg-black text-white"
          disabled={loading}
        >
          <span>{loading ? "Loading" : "Send magic link"}</span>
        </Button>
      </div>
    </PageWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getUser(ctx);

  if (user) {
    ctx.res?.writeHead(302, { Location: "/" });
    ctx.res?.end();
  }

  return { props: {} };
};
