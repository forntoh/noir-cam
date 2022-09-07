import { FaRegUserCircle } from "react-icons/fa";
import MyLink from "./link";

function Header() {
  return (
    <div className="flex justify-between items-center container py-8">
      <MyLink>
        <h3 className="select-none">
          <span className="font-medium">NOIR</span>CAM
        </h3>
      </MyLink>
      <FaRegUserCircle className="w-7 h-7" />
    </div>
  );
}

export default Header;
