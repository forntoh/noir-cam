import { useRecoilState } from "recoil";
import { converter, currencyAtom } from "../../helpers/helpers";
import { Earning } from "../../typings";
import { formatStringDate } from "../../utils/constants";
import Card from "../card";
import MyLink from "../link";

type Props = {
  month?: string;
  earnings?: Earning[];
  modelRate: number | undefined;
};

const ModelSummary = ({ earnings, month, modelRate = 2 }: Props) => {
  const [currency] = useRecoilState(currencyAtom);

  const total = converter(
    earnings?.reduce((partialSum, a) => partialSum + a.tokens, 0) ?? 0,
    currency,
    modelRate
  );

  return (
    <Card>
      <b className="flex justify-between border-b-2 p-3">
        {month ?? (
          <MyLink
            href={`/model/${earnings?.[0].username}`}
            className="cursor-pointer"
          >
            {earnings?.[0].username}
          </MyLink>
        )}
        <span>
          {total.toLocaleString()} {currency}
        </span>
      </b>
      <ul className="p-3 space-y-4">
        {earnings?.map((it, i) => (
          <li className="flex justify-between" key={i}>
            <div>
              {formatStringDate(it.periodStart)} —{" "}
              {formatStringDate(it.periodEnd)}
            </div>
            <div>
              {converter(it.tokens, currency, modelRate).toLocaleString()}{" "}
              {currency}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ModelSummary;
