import { format } from "date-fns";
import EarningWrapper from "./earning_wrapper";

function TopModels({ month }: { month: Date }) {
  return (
    <EarningWrapper label={`Top models • ${format(month, "MMM yyyy")}`}>
      <ul className="font-extrabold text-sm">
        <li className="flex justify-between">
          sweetbooty...<span>2.1K</span>
        </li>
        <li className="flex justify-between">
          creamy_baby<span>1.1K</span>
        </li>
      </ul>
    </EarningWrapper>
  );
}

export default TopModels;
