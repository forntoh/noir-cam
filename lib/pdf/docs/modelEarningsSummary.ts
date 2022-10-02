import { endOfMonth, format, nextWednesday } from "date-fns";
import { converter } from "../../../helpers/helpers";
import { getEndOfMonth, getStartOfMonth } from "../../../helpers/helpers.date";
import { formatStringDate } from "../../../utils/constants";
import { getEarnings, getEarningsMultiplier } from "../../api";
import { NCDocument } from "../NCDocument";

export const modelEarningsSummary = async (
  title: string,
  username: string,
  month: Date = new Date()
): Promise<Buffer | undefined> => {
  const earnings = await getEarnings(
    username,
    getStartOfMonth(month),
    getEndOfMonth(month)
  );

  if ((earnings?.length ?? 0) <= 0) {
    return new Promise((resolve) => {
      resolve(undefined);
    });
  }

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
            v.periodEnd
          )}`,
          `${v.tokens.toLocaleString()} tk`,
          `x${multiplier?.model_rate.toFixed(1)}`,
          `${converter(
            v.tokens,
            "Ksh",
            multiplier?.model_rate
          ).toLocaleString()} Ksh`,
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
          `${converter(
            earnings?.reduce((a, e) => a + e.tokens, 0),
            "Ksh",
            multiplier?.model_rate
          ).toLocaleString()} Ksh`,
          { align: "right" }
        );
    })
    .drawHr(30);
  return doc.end();
};
