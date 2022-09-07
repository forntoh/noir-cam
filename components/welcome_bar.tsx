import { useRecoilState } from "recoil";
import { useEffectOnce } from "usehooks-ts";
import { currencyAtom } from "../helpers/helpers";
import { useModel } from "../hooks/model";
import { CurrencyType } from "../typings";

const currencies: CurrencyType[] = ["tk", "Ksh"];

function WelcomeBar() {
  const [currency, setCurrency] = useRecoilState(currencyAtom);
  const [, model, loadModel] = useModel();

  useEffectOnce(() => {
    loadModel();
  });

  return (
    <div className="flex justify-between items-center">
      <div className="select-none">
        Hello <b>{model?.username ?? "User"}</b>
      </div>
      <ul className="flex gap-2 font-semibold">
        {currencies.map((c, i) => (
          <li
            className={`${
              currency != c ? "opacity-40" : ""
            } cursor-pointer select-none`}
            key={i}
            onClick={() => {
              setCurrency(c);
            }}
          >
            {c.toLocaleUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WelcomeBar;
