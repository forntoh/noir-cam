import { format } from "date-fns";
import { useEffect } from "react";
import { getEndOfMonth, getStartOfMonth } from "../../helpers/helpers.date";
import { useTopModelsForPeriod } from "../../hooks/earnings";
import EarningWrapper from "./earning_wrapper";

function TopModels({ month }: { month: Date }) {
  const [, topModels, loadTopModels] = useTopModelsForPeriod();

  useEffect(() => {
    loadTopModels(getStartOfMonth(month), getEndOfMonth(month));
  }, [month]);

  return (
    <EarningWrapper label={`Rankings • ${format(month, "MMM yyyy")}`}>
      <ul className="font-extrabold text-sm">
        {topModels
          ?.sort((a, b) => b.amount - a.amount)
          ?.map((model, i) => (
            <li className="flex justify-between" key={i}>
              {model.uname.length > 11
                ? model.uname.substring(0, 10) + "..."
                : model.uname}
              <span>{Math.round((model.amount / 1000) * 10) / 10}K</span>
            </li>
          ))}
      </ul>
    </EarningWrapper>
  );
}

export default TopModels;
