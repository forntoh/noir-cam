import { endOfMonth, format, nextWednesday, startOfMonth } from "date-fns";
import { formatStringDate } from "../../../utils/constants";
import { getEarnings, getEarningsMultiplier } from "../../api";
import { NCDocument } from "../NCDocument";

export const modelEarningsSummary = async (
  title: string,
  username: string,
  month: Date = new Date()
) => {
  const earnings = await getEarnings(
    username,
    startOfMonth(month),
    endOfMonth(month)
  );

  const multiplier = await getEarningsMultiplier(month);

  const doc = new NCDocument(title);

  doc
    .registerFonts()
    .appendPageHeader(format(month, "MMM yyyy").toLocaleUpperCase())
    .do((d) => {
      d.fontSize(12)
        .moveDown()
        .font("Regular")
        .text(`Model: `, { continued: true })
        .font("SemiBold")
        .text(username)
        .moveDown();
    })
    .drawTable(
      [
        { label: "WEEK", w: 150 },
        { label: "TOKENS", w: 100 },
        { label: "MULTIPLIER", w: 100 },
        { label: "AMOUNT", w: 100 },
      ],
      earnings!.map((v) => {
        return [
          `${formatStringDate(v.periodStart)} — ${formatStringDate(
            v.periodStart
          )}`,
          `${v.tokens.toLocaleString()} tk`,
          `x${multiplier?.model_rate.toFixed(1)}`,
          `${(v.tokens * multiplier!.model_rate).toLocaleString()} Ksh`,
        ];
      })
    )
    .do((d) => {
      d.moveDown(1.5)
        .fontSize(10)
        .fillColor("#c6c6c6")
        .font("SemiBold")
        .text("PAYOUT DATE", doc.MARGIN_H + 150)
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
          `${format(nextWednesday(endOfMonth(month)), "LLL do, yyyy")}`,
          doc.MARGIN_H + 150
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
