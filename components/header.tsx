import { FaRegUserCircle } from "react-icons/fa";
import MyLink from "./link";

function Header() {
  return (
    <div className="flex justify-between items-center container py-8">
      <MyLink>
        <h3>
          <span className="font-medium">NOIR</span>CAM
        </h3>
      </MyLink>
      <FaRegUserCircle className="w-6 h-6" />
    </div>
  );
}

export default Header;
