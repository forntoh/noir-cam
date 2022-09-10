import { Menu } from "@headlessui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { FaRegUserCircle } from "react-icons/fa";
import { PopUpMenu } from ".";
import { supabase } from "../../utils/supabaseClient";
import MyLink from "../link";

function HelpMenu() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <PopUpMenu renderButton={(open) => <FaRegUserCircle className="w-7 h-7" />}>
      <div className="p-2 min-w-max">
        <Menu.Item as={MyLink} href="/about">
          <div className="p-2">Ballance sheet</div>
        </Menu.Item>
        <Menu.Item
          as="div"
          className={`cursor-pointer p-2 border-transparent text-red-500 ${
            user ? "visible" : "invisible"
          }`}
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          Sign out
        </Menu.Item>
      </div>
    </PopUpMenu>
  );
}

export default HelpMenu;
