import { useRecoilState } from "recoil";
import { currencyAtom } from "../helpers/helpers";
import { CurrencyType } from "../typings";

const currencies: CurrencyType[] = ["tk", "Ksh"];

function WelcomeBar() {
  const [currency, setCurrency] = useRecoilState(currencyAtom);

  return (
    <div className="flex justify-between items-center">
      <div className="select-none">
        Hello <b>sweetbooty_one</b>
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
