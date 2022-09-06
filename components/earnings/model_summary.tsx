import { Earning } from "../../typings";
import { formatStringDate } from "../../utils/constants";
import Card from "../card";

type Props = {
  earnings?: Earning[];
};

const ModelSummary = ({ earnings }: Props) => {
  const total =
    earnings?.reduce((partialSum, a) => partialSum + a.tokens, 0) ?? 0;
  return (
    <Card>
      <b className="flex justify-between border-b-2 p-3">
        {earnings?.[0].username}
        <span>{total.toLocaleString()} tk</span>
      </b>
      <ul className="p-3 space-y-4">
        {earnings?.map((it, i) => (
          <li className="flex justify-between" key={i}>
            <div>
              {formatStringDate(it.periodStart, "yyyy-MM-dd")} —{" "}
              {formatStringDate(it.periodEnd, "yyyy-MM-dd")}
            </div>
            <div>{it.tokens.toLocaleString()} tk</div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default ModelSummary;
