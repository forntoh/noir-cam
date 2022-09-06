import { atom } from "recoil";
import { CurrencyType } from "../typings";

export const currencyAtom = atom<CurrencyType>({
  key: "activeMenu",
  default: "tk",
});

export const converter = (
  value: number | undefined,
  currency: CurrencyType
) => {
  switch (currency) {
    case "USD":
      return (value ?? 0) / 20;
    case "Ksh":
      return (value ?? 0) * 2;
    default:
      return value ?? 0;
  }
};
