import { useState } from "react";
import { Button, Input } from "../components/input";
import { supabase } from "../utils/supabaseClient";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

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
    <div className="space-y-6 flex flex-col max-w-xl border p-6 py-12 rounded-md">
      <h1 className="header">Noircam</h1>
      <p className="description">
        Sign in via magic link with your email below
      </p>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
  );
}
