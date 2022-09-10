import { format } from "date-fns";
import { AiOutlineCaretLeft, AiOutlineCaretRight } from "react-icons/ai";
import IconButton from "./IconButton";

export type MonthStepperProps = {
  refDate: Date;
  onNext?: () => void;
  onPrevious?: () => void;
};

export const MonthStepper = ({
  refDate,
  onNext,
  onPrevious,
}: MonthStepperProps) => {
  return (
    <div className="flex items-center space-x-1">
      <IconButton icon={AiOutlineCaretLeft} onClick={onPrevious} />
      <span>{format(refDate, "MMM yyyy")}</span>
      {refDate.getMonth() == new Date().getMonth() ? undefined : (
        <IconButton icon={AiOutlineCaretRight} onClick={onNext} />
      )}
    </div>
  );
};
