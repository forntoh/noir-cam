import { format } from "date-fns";
import { Dictionary, Object } from "lodash";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import { Earning } from "../typings";
import Card from "./card";
import { ModelSummary } from "./earnings";
import IconButton from "./IconButton";

type Props = {
  refDate: Date;
  earnings?: Object<Dictionary<Earning[]>>;
  onNext?: () => void;
  onPrevious?: () => void;
  showMonth?: boolean;
  title: string;
};

export const PerMonthEarnings = ({
  refDate,
  onNext,
  onPrevious,
  earnings,
  showMonth = false,
  title,
}: Props) => {
  return (
    <div className="space-y-5">
      <h6 className="flex justify-between items-center select-none">
        {title}
        <div className="flex items-center space-x-1">
          <IconButton icon={AiOutlineCaretLeft} onClick={onPrevious} />
          <span>{format(refDate, "MMM yyyy")}</span>
          {refDate.getMonth() == new Date().getMonth() ? undefined : (
            <IconButton icon={AiOutlineCaretRight} onClick={onNext} />
          )}
        </div>
      </h6>
      <div
        className={`flex flex-col xl:grid ${
          (earnings?.size() ?? 0) <= 1
            ? "xl:grid-cols-1"
            : (earnings?.size() ?? 0) % 2 == 0
            ? "xl:grid-cols-2"
            : "xl:grid-cols-3"
        } gap-5`}
      >
        {earnings
          ?.map((value, key) => (
            <ModelSummary
              key={key}
              earnings={value}
              month={showMonth ? key : undefined}
            />
          ))
          .value()}
        {(earnings?.size() ?? 0) <= 0 ? (
          <Card className="text-center py-14 text-gray-400">
            No earnings for {format(refDate, "MMM yyyy")}
          </Card>
        ) : undefined}
      </div>
    </div>
  );
};
