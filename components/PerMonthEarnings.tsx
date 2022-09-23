import { format } from "date-fns";
import { Dictionary, Object } from "lodash";
import { Earning } from "../typings";
import Card from "./card";
import { ModelSummary } from "./earnings";
import { MonthStepper, MonthStepperProps } from "./MonthStepper";

type Props = {
  earnings?: Object<Dictionary<Earning[]>>;
  showMonth?: boolean;
  title: string;
  modelRate: number | undefined;
} & MonthStepperProps;

export const PerMonthEarnings = ({
  refDate,
  onNext,
  onPrevious,
  earnings,
  showMonth = false,
  title,
  modelRate = 2,
}: Props) => {
  return (
    <div className="space-y-5">
      <h6 className="flex justify-between items-center select-none">
        {title}
        <MonthStepper
          onNext={onNext}
          onPrevious={onPrevious}
          refDate={refDate}
        />
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
              modelRate={modelRate}
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
