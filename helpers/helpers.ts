import { atom } from "recoil";
import { CurrencyType } from "../typings";

export const currencyAtom = atom<CurrencyType>({
  key: "activeMenu",
  default: "tk",
});
