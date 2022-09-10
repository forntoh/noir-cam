import MyLink from "./link";
import { UserMenu } from "./menu";

function Header() {
  return (
    <div className="flex justify-between items-center container py-8 sticky top-0 bg-white bg-opacity-95 z-50">
      <MyLink>
        <h3 className="select-none">
          <span className="font-medium">NOIR</span>CAM
        </h3>
      </MyLink>
      <div className="font-bold">
        <UserMenu />
      </div>
    </div>
  );
}

export default Header;
