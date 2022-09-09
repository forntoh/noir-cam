import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FaRegUserCircle } from "react-icons/fa";
import { supabase } from "../utils/supabaseClient";
import MyLink from "./link";

function Header() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="flex justify-between items-center container py-8 sticky top-0 bg-white bg-opacity-95 z-50">
      <MyLink>
        <h3 className="select-none">
          <span className="font-medium">NOIR</span>CAM
        </h3>
      </MyLink>
      <div className="flex items-center gap-4 font-bold">
        <span
          className={`cursor-pointer p-2 hover:border-gray-500 border-b-2 border-transparent ${
            user ? "visible" : "invisible"
          }`}
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          LOG OUT
        </span>
        <FaRegUserCircle className="w-7 h-7" />
      </div>
    </div>
  );
}

export default Header;
