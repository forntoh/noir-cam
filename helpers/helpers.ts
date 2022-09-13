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
  let amt = 0;
  switch (currency) {
    case "Ksh":
      amt = (value ?? 0) * 2;
      break;
    default:
      amt = value ?? 0;
      break;
  }
  return Math.ceil(amt);
};

export const rounder = (value: number, factor: number = 100) => {
  return Math.ceil(value / factor) * factor;
};
