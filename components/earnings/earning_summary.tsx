import { useRecoilState } from "recoil";
import { converter, currencyAtom } from "../../helpers/helpers";
import EarningWrapper from "./earning_wrapper";

type Props = {
  label: string;
  value?: number;
};

function EarningSummary({ label, value }: Props) {
  const [currency] = useRecoilState(currencyAtom);
  const amount = converter(value, currency);

  return (
    <EarningWrapper label={label}>
      <h3>
        {amount.toLocaleString() ?? 0}
        <span className="text-lg"> {currency}</span>
      </h3>
    </EarningWrapper>
  );
}

export default EarningSummary;
