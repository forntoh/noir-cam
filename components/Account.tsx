import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type Props = {
  session: Session;
};

interface Profile {
  username?: string;
  chaturbate_token?: string;
  avatar_url?: string;
}

export default function Account({ session }: Props) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>();
  const [chaturbate_token, setChaturbateToken] = useState<string>();
  const [avatar_url, setAvatarUrl] = useState<string>();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, chaturbate_token, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setChaturbateToken(data.chaturbate_token);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    chaturbate_token,
    avatar_url,
  }: Profile) {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user?.id,
        username,
        chaturbate_token,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user?.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="chaturbate_token">Chaturbate Token</label>
        <input
          id="chaturbate_token"
          type="chaturbate_token"
          value={chaturbate_token || ""}
          onChange={(e) => setChaturbateToken(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button block primary"
          onClick={() =>
            updateProfile({ username, chaturbate_token, avatar_url })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
