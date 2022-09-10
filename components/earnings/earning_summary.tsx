import { useRecoilState } from "recoil";
import { converter, currencyAtom } from "../../helpers/helpers";
import { CurrencyType } from "../../typings";
import EarningWrapper from "./earning_wrapper";

type Props = {
  label: string;
  value?: number;
  mCurrency?: CurrencyType;
};

function EarningSummary({ label, value, mCurrency }: Props) {
  const [currency] = useRecoilState(currencyAtom);
  const amount = mCurrency ? value ?? 0 : converter(value, currency);

  return (
    <EarningWrapper label={label}>
      <h3>
        {amount.toLocaleString() ?? 0}
        <span className="text-sm"> {mCurrency ?? currency}</span>
      </h3>
    </EarningWrapper>
  );
}

export default EarningSummary;
