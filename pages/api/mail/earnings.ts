// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { format, parse } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendMail } from "../../../lib/mail";
import { buildFileName } from "../../../lib/pdf/docs/helpers.docs";
import { modelEarningsSummary } from "../../../lib/pdf/docs/modelEarningsSummary";
import { modelsPayoutSummary } from "../../../lib/pdf/docs/modelsPayoutSummary";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body: { date, username, to, cc },
    method,
  } = req;

  try {
    const month = date
      ? parse(date as string, "yyyy-MM-dd", new Date())
      : new Date();
    const title = username ? "Earnings Summary" : "Model Payout Summary";
    const subject = `${title} ${format(month, "MM-yyyy")}`;
    const fileName = buildFileName(
      username
        ? `${title} ${format(month, "MM-yyyy")}`
        : `[${username}] - ${title} ${format(month, "MM-yyyy")}`
    );

    let buffer;

    if (username) {
      buffer = await modelEarningsSummary(title, username as string, month);
    } else {
      buffer = await modelsPayoutSummary(title, month);
    }

    const info = await sendMail({
      to: to as string,
      cc: cc as string | undefined,
      subject,
      attachments: [
        {
          filename: fileName,
          content: buffer,
        },
      ],
    });

    // res.setHeader("Content-type", "application/pdf");
    res.status(200).json(info);
  } catch (error) {
    res.status(500).send(error);
  }
};
