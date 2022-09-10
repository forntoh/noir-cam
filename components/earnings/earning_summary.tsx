import { useRecoilState } from "recoil";
import { converter, currencyAtom } from "../../helpers/helpers";
import { CurrencyType } from "../../typings";
import EarningWrapper from "./earning_wrapper";

type Props = {
  label: string;
  value?: number;
  mCurrency?: CurrencyType;
  color?: string;
};

function EarningSummary({ label, value, mCurrency, color }: Props) {
  const [currency] = useRecoilState(currencyAtom);
  const amount = mCurrency ? Math.ceil(value ?? 0) : converter(value, currency);

  return (
    <EarningWrapper label={label}>
      <h3 className={`${amount < 0 ? "text-rose-500" : color}`}>
        {amount.toLocaleString() ?? 0}
        <span className="text-sm"> {mCurrency ?? currency}</span>
      </h3>
    </EarningWrapper>
  );
}

export default EarningSummary;
