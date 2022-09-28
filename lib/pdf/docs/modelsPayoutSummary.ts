import {
  endOfMonth,
  endOfWeek,
  format,
  nextWednesday,
  startOfMonth,
} from "date-fns";
import _ from "lodash";
import { getEarnings, getEarningsMultiplier } from "../../api";
import { NCDocument } from "../NCDocument";

export const modelsPayoutSummary = async (
  title: string,
  month: Date = new Date()
): Promise<Buffer | undefined> => {
  const earnings = await getEarnings(
    undefined,
    startOfMonth(month),
    endOfMonth(month)
  );

  if ((earnings?.length ?? 0) <= 0) {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }

  const multiplier = await getEarningsMultiplier(month);

  const earningsPerModel = _(earnings).groupBy((x) => x.username);

  const doc = new NCDocument(title);

  doc
    .registerFonts()
    .appendPageHeader(format(month, "MMM yyyy").toLocaleUpperCase())
    .drawTable(
      [
        { label: "MODEL", w: 140 },
        { label: "TOKENS", w: 100 },
        { label: "MULTIPLIER", w: 100 },
        { label: "AMOUNT", w: 100 },
      ],
      earningsPerModel
        ?.map((value, key) => {
          const tokensSum = value.reduce((a, e) => a + e.tokens, 0);
          return [
            key,
            `${tokensSum.toLocaleString()} tk`,
            `x${multiplier?.model_rate.toFixed(1)}`,
            `${(
              tokensSum * (multiplier?.model_rate ?? 0)
            ).toLocaleString()} Ksh`,
          ];
        })
        .value()
    )
    .do((d) => {
      d.moveDown(1.5)
        .fontSize(10)
        .fillColor("#c6c6c6")
        .font("SemiBold")
        .text("PAYOUT DATE", doc.MARGIN_H + 140)
        .moveUp()
        .text("TOTAL", { align: "right" });
    })
    .drawHr()
    .do((d) => {
      d.moveDown(3)
        .fontSize(18)
        .font("Regular")
        .fillColor("black")
        .text(
          `${format(
            nextWednesday(endOfWeek(endOfMonth(month))),
            "LLL do, yyyy"
          )}`,
          doc.MARGIN_H + 140
        )
        .moveUp()
        .font("Bold")
        .text(
          `${(
            earnings!.reduce((a, e) => a + e.tokens, 0) *
            (multiplier?.model_rate ?? 0)
          ).toLocaleString()} Ksh`,
          { align: "right" }
        );
    })
    .drawHr(30);
  return doc.end();
};
