// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { format, parse } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { modelEarningsSummary } from "../../../lib/pdf/docs/modelEarningsSummary";
import { modelsPayoutSummary } from "../../../lib/pdf/docs/modelsPayoutSummary";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body,
    method,
    query: { date, username, to, cc },
  } = req;

  try {
    const month = date
      ? parse(date as string, "yyyy-MM-dd", new Date())
      : new Date();
    const title = username ? "Earnings Summary" : "Model Payout Summary";
    const subject = `${title} ${format(month, "MM-yyyy")}`;

    let buffer;

    if (username) {
      buffer = await modelEarningsSummary(title, username as string, month);
    } else {
      buffer = await modelsPayoutSummary(title, month);
    }

    // await sendMail({
    //   to: to as string,
    //   cc: cc as string | undefined,
    //   subject,
    //   attachments: [path],
    // });

    // fs.unlinkSync(filePath);

    // res.setHeader("Content-type", "application/pdf");
    res.status(200).json([req.headers["secret"], date]);
  } catch (error) {
    res.status(500).send(error);
  }
};
