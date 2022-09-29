import { atom } from "recoil";
import { Duplex } from "stream";
import { CurrencyType } from "../typings";

export const currencyAtom = atom<CurrencyType>({
  key: "activeMenu",
  default: "tk",
});

export const converter = (
  value: number | undefined,
  currency: CurrencyType,
  rate: number | undefined
) => {
  let amt = 0;
  switch (currency) {
    case "Ksh":
      amt = (value ?? 0) * (rate ?? 2);
      break;
    default:
      amt = value ?? 0;
      break;
  }
  return Math.ceil(amt);
};

export const rounder = (value: number, factor: number = 100) => {
  if (value < factor) return Math.ceil(value);
  return Math.ceil(value / factor) * factor;
};

export function bufferToStream(buffer: Buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
